// firebase.js
// Core analytics logic for Eco QR Lisakovsk.
// Integrates with Firebase Firestore if credentials are provided in firebase-config.js.
// Otherwise, falls back gracefully to LocalStorage Mock mode.

(function () {
  const isFirebaseConfigured = window.firebaseConfig &&
    window.firebaseConfig.apiKey &&
    window.firebaseConfig.apiKey !== "YOUR_API_KEY";

  let db = null;
  let currentVisitId = null;

  // Attempt to initialize Firebase if configured
  if (isFirebaseConfigured && window.firebase) {
    try {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(window.firebaseConfig);
      }
      db = window.firebase.firestore();
      console.log("Firebase initialized successfully. Operating in cloud mode.");
    } catch (error) {
      console.error("Failed to initialize Firebase SDK:", error);
    }
  } else {
    console.log("Firebase is not configured or SDK script is missing. Operating in Mock LocalStorage Mode.");
  }

  // Helper functions for device classification
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "Tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return "Mobile";
    }
    return "Desktop";
  }

  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Browser";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Trident")) return "Internet Explorer";
    if (ua.includes("Edge") || ua.includes("Edg")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown";
  }

  function getOS() {
    const ua = navigator.userAgent;
    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh")) return "macOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Linux")) return "Linux";
    return "Unknown";
  }

  // Initialize analytics: generate UUID, set up initial document
  async function initAnalytics() {
    let uuid = localStorage.getItem("ecoQrUuid");
    if (!uuid) {
      uuid = "visit_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("ecoQrUuid", uuid);
    }
    currentVisitId = uuid;

    const device = getDeviceType();
    const browser = getBrowser();
    const os = getOS();

    const initialData = {
      id: uuid,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      language: null,
      videoWatched: false,
      videoWatchTime: 0,
      testStarted: false,
      completed: false,
      coupon: false,
      couponTime: null,
      easyScore: null,
      mediumScore: null,
      percent: null,
      attemptsCount: 0,
      attempts: [],
      device: device,
      browser: browser,
      os: os,
      userAgent: navigator.userAgent
    };

    if (db) {
      try {
        const docRef = db.collection("visits").doc(uuid);
        const doc = await docRef.get();
        if (!doc.exists) {
          await docRef.set(initialData);
        } else {
          await docRef.update({
            lastActiveAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Firestore error on init, running in mock fallback:", err);
        initMockVisit(uuid, initialData);
      }
    } else {
      initMockVisit(uuid, initialData);
    }
  }

  function initMockVisit(uuid, initialData) {
    let visits = JSON.parse(localStorage.getItem("ecoQrMockDb_visits") || "[]");
    let visit = visits.find(v => v.id === uuid);
    if (!visit) {
      visits.push(initialData);
    } else {
      visit.lastActiveAt = new Date().toISOString();
    }
    localStorage.setItem("ecoQrMockDb_visits", JSON.stringify(visits));
  }

  // Update specific fields in analytics
  async function updateAnalytics(fields) {
    if (!currentVisitId) return;

    const updateData = {
      ...fields,
      lastActiveAt: new Date().toISOString()
    };

    if (db) {
      try {
        await db.collection("visits").doc(currentVisitId).update(updateData);
      } catch (err) {
        console.warn("Firestore error on update, updating mock:", err);
        updateMockVisit(currentVisitId, updateData);
      }
    } else {
      updateMockVisit(currentVisitId, updateData);
    }
  }

  function updateMockVisit(uuid, fields) {
    let visits = JSON.parse(localStorage.getItem("ecoQrMockDb_visits") || "[]");
    let visit = visits.find(v => v.id === uuid);
    if (visit) {
      Object.assign(visit, fields);
      localStorage.setItem("ecoQrMockDb_visits", JSON.stringify(visits));
    }
  }

  // Append a quiz attempt log (contains question detail array, scores, completion durations)
  async function addQuizAttempt(level, score, duration, answers) {
    if (!currentVisitId) return;

    const attempt = {
      level,
      score,
      maxScore: 10,
      duration,
      completedAt: new Date().toISOString(),
      answers
    };

    if (db) {
      try {
        const docRef = db.collection("visits").doc(currentVisitId);
        const doc = await docRef.get();
        if (doc.exists) {
          const data = doc.data();
          const currentAttempts = data.attempts || [];
          const newAttempts = [...currentAttempts, attempt];
          const newAttemptsCount = (data.attemptsCount || 0) + 1;

          const updates = {
            attempts: newAttempts,
            attemptsCount: newAttemptsCount,
            lastActiveAt: new Date().toISOString()
          };

          if (level === "easy") {
            updates.easyScore = score;
          } else if (level === "medium") {
            updates.mediumScore = score;
            updates.completed = true;
            const easy = data.easyScore !== null ? data.easyScore : score;
            updates.percent = Math.round(((easy + score) / 20) * 100);
          }

          await docRef.update(updates);
        }
      } catch (err) {
        console.warn("Firestore error on logging quiz attempt, logging in mock:", err);
        addMockQuizAttempt(currentVisitId, attempt);
      }
    } else {
      addMockQuizAttempt(currentVisitId, attempt);
    }
  }

  function addMockQuizAttempt(uuid, attempt) {
    let visits = JSON.parse(localStorage.getItem("ecoQrMockDb_visits") || "[]");
    let visit = visits.find(v => v.id === uuid);
    if (visit) {
      visit.attempts = visit.attempts || [];
      visit.attempts.push(attempt);
      visit.attemptsCount = (visit.attemptsCount || 0) + 1;
      visit.lastActiveAt = new Date().toISOString();

      if (attempt.level === "easy") {
        visit.easyScore = attempt.score;
      } else if (attempt.level === "medium") {
        visit.mediumScore = attempt.score;
        visit.completed = true;
        const easy = visit.easyScore !== null ? visit.easyScore : attempt.score;
        visit.percent = Math.round(((easy + attempt.score) / 20) * 100);
      }
      localStorage.setItem("ecoQrMockDb_visits", JSON.stringify(visits));
    }
  }

  // Fetch all logs (used by admin dashboard)
  async function fetchVisits() {
    let cloudVisits = [];
    if (db) {
      try {
        const snapshot = await db.collection("visits").get();
        snapshot.forEach(doc => cloudVisits.push(doc.data()));
      } catch (err) {
        console.warn("Firestore fetchVisits error:", err);
      }
    }
    let mockVisits = JSON.parse(localStorage.getItem("ecoQrMockDb_visits") || "[]");
    
    const map = new Map();
    mockVisits.forEach(v => map.set(v.id, v));
    cloudVisits.forEach(v => map.set(v.id, v));
    return Array.from(map.values());
  }

  // Clear mock databases
  function clearMockDatabase() {
    localStorage.removeItem("ecoQrMockDb_visits");
  }

  // Populate mock data with rich user activities for testing/verification
  function generateMockVisits(count = 50) {
    const devices = ["Mobile", "Mobile", "Desktop", "Tablet"];
    const browsers = ["Chrome", "Chrome", "Safari", "Firefox", "Edge"];
    const OSes = {
      "Mobile": ["Android", "iOS"],
      "Tablet": ["Android", "iOS"],
      "Desktop": ["Windows", "macOS", "Linux"]
    };
    const languages = ["ru", "ru", "ru", "kk"];
    const mockQuestionsEasy = [
      "Что может ухудшить ситуацию по теме «загрязнение воздуха»?",
      "Какое действие помогает улучшить ситуацию по теме «загрязнение воздуха»?",
      "Какой вред связан с темой «загрязнение воздуха», если проблему не решать?",
      "Почему тема «загрязнение воздуха» важна для Лисаковска?",
      "Что может ухудшить ситуацию по теме «пыль на дорогах»?",
      "Какое действие помогает улучшить ситуацию по теме «пыль на дорогах»?",
      "Какой вред связан с темой «пыль на дорогах», если проблему не решать?",
      "Почему тема «пыль на дорогах» важна для Лисаковска?",
      "Что может ухудшить ситуацию по теме «сортировка отходов»?",
      "Какое действие помогает улучшить ситуацию по теме «сортировка отходов»?"
    ];
    const mockQuestionsMedium = [
      "Какое вещество наиболее критично при анализе промышленных выбросов?",
      "Как износ канализационных очистных сооружений влияет на Тобол?",
      "Каковы основные методы снижения запыленности отвалов?",
      "Какой класс опасности имеют свинецсодержащие аккумуляторы?",
      "Что предусматривает программа ТБО Лисаковска к 2028 году?",
      "Какое влияние оказывает диоксид серы на хвойные леса?",
      "Почему пластик распадается на микропластик в водоемах?",
      "Какой вклад вносят теплоэнергетические объекты в смог?",
      "Как правильно утилизировать ртутьсодержащие лампы?",
      "Что такое эвтрофикация водоема из-за сточных вод?"
    ];

    let mockVisits = JSON.parse(localStorage.getItem("ecoQrMockDb_visits") || "[]");

    const now = new Date();

    for (let i = 0; i < count; i++) {
      const uuid = "mock_" + Math.random().toString(36).substring(2, 10);
      const randDays = Math.floor(Math.random() * 8); // 0 to 7 days ago
      const createdAt = new Date(now.getTime() - randDays * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 12 * 60 * 60 * 1000));
      const lastActiveAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 30 * 60 * 1000));

      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      const osList = OSes[device];
      const os = osList[Math.floor(Math.random() * osList.length)];

      const visit = {
        id: uuid,
        createdAt: createdAt.toISOString(),
        lastActiveAt: lastActiveAt.toISOString(),
        language: null,
        videoWatched: false,
        videoWatchTime: 0,
        testStarted: false,
        completed: false,
        coupon: false,
        couponTime: null,
        easyScore: null,
        mediumScore: null,
        percent: null,
        attemptsCount: 0,
        attempts: [],
        device: device,
        browser: browser,
        os: os,
        userAgent: `MockBrowser/5.0 (${device}; ${os})`
      };

      // 90% choose language
      if (Math.random() > 0.1) {
        visit.language = languages[Math.floor(Math.random() * languages.length)];

        // 80% watch video
        if (Math.random() > 0.2) {
          visit.videoWatched = true;
          // Random watch time between 15 and 90 seconds (full is around 60)
          visit.videoWatchTime = Math.floor(15 + Math.random() * 75);

          // 75% start test
          if (Math.random() > 0.25) {
            visit.testStarted = true;
            visit.attemptsCount = 1;

            const easyScore = Math.floor(5 + Math.random() * 6); // 5 to 10
            const easyDuration = Math.floor(20 + Math.random() * 50);
            const easyAnswers = mockQuestionsEasy.map((qId, idx) => {
              const correct = Math.random() > (0.1 + idx * 0.03); // higher indices slightly harder
              const chosen = correct ? 0 : Math.floor(1 + Math.random() * 3); // 0 is correct in mapping generally, or random wrong index
              return {
                questionId: qId,
                questionText: qId,
                selectedAnswerIndex: chosen,
                correctAnswerIndex: 0,
                isCorrect: correct
              };
            });

            visit.attempts.push({
              level: "easy",
              score: easyScore,
              maxScore: 10,
              duration: easyDuration,
              completedAt: new Date(createdAt.getTime() + 10 * 60 * 1000).toISOString(),
              answers: easyAnswers
            });
            visit.easyScore = easyScore;

            // 80% of those who pass (easyScore >= 8) continue to medium
            if (easyScore >= 8 && Math.random() > 0.2) {
              const mediumScore = Math.floor(4 + Math.random() * 7); // 4 to 10
              const mediumDuration = Math.floor(30 + Math.random() * 60);
              const mediumAnswers = mockQuestionsMedium.map((qId, idx) => {
                // medium questions are slightly harder
                const correct = Math.random() > (0.2 + idx * 0.04);
                const chosen = correct ? 1 : (Math.random() > 0.5 ? 0 : 2); // random index
                const correctIndex = 1;
                return {
                  questionId: qId,
                  questionText: qId,
                  selectedAnswerIndex: chosen,
                  correctAnswerIndex: correctIndex,
                  isCorrect: correct
                };
              });

              visit.attempts.push({
                level: "medium",
                score: mediumScore,
                maxScore: 10,
                duration: mediumDuration,
                completedAt: new Date(createdAt.getTime() + 15 * 60 * 1000).toISOString(),
                answers: mediumAnswers
              });
              visit.attemptsCount = 2;
              visit.mediumScore = mediumScore;
              visit.completed = true;
              visit.percent = Math.round(((easyScore + mediumScore) / 20) * 100);

              // 75% of those who complete medium and score >= 16 overall get coupon
              if (easyScore + mediumScore >= 16 && Math.random() > 0.25) {
                visit.coupon = true;
                visit.couponTime = new Date(createdAt.getTime() + 16 * 60 * 1000).toISOString();
              }
            }
          }
        }
      }

      mockVisits.push(visit);
    }

    localStorage.setItem("ecoQrMockDb_visits", JSON.stringify(mockVisits));
    console.log(`Generated ${count} simulated visit logs in local database.`);
  }

  // COUPON MANAGEMENT METHODS
  async function createCoupon(couponData) {
    const coupon = {
      code: couponData.code.toUpperCase(),
      partnerId: couponData.partnerId,
      partnerName: couponData.partnerName,
      discount: couponData.discount,
      createdAt: new Date().toISOString(),
      visitId: currentVisitId,
      used: false,
      usedAt: null,
      usedByPartner: null
    };

    if (db) {
      try {
        await db.collection("coupons").doc(coupon.code).set(coupon);
      } catch (err) {
        console.warn("Firestore error on createCoupon, storing mock:", err);
      }
    }

    let mockCoupons = JSON.parse(localStorage.getItem("ecoQrMockDb_coupons") || "[]");
    mockCoupons = mockCoupons.filter(c => c.code !== coupon.code);
    mockCoupons.push(coupon);
    localStorage.setItem("ecoQrMockDb_coupons", JSON.stringify(mockCoupons));
    return coupon;
  }

  async function getCoupon(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();

    if (db) {
      try {
        const doc = await db.collection("coupons").doc(cleanCode).get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (err) {
        console.warn("Firestore error on getCoupon, checking mock:", err);
      }
    }

    let mockCoupons = JSON.parse(localStorage.getItem("ecoQrMockDb_coupons") || "[]");
    return mockCoupons.find(c => c.code === cleanCode) || null;
  }

  async function redeemCoupon(code, redeemingPartner) {
    if (!code) return { success: false, error: "Код не указан" };
    const cleanCode = code.trim().toUpperCase();
    const existing = await getCoupon(cleanCode);

    if (!existing) {
      return { success: false, error: "Купон с таким кодом не найден!" };
    }

    if (existing.used) {
      const formattedDate = existing.usedAt ? new Date(existing.usedAt).toLocaleString('ru-RU') : '';
      return { 
        success: false, 
        error: `Купон уже был погашен ${formattedDate} в ${existing.usedByPartner || 'заведении'}` 
      };
    }

    const updateFields = {
      used: true,
      usedAt: new Date().toISOString(),
      usedByPartner: redeemingPartner || existing.partnerName
    };

    if (db) {
      try {
        await db.collection("coupons").doc(cleanCode).update(updateFields);
      } catch (err) {
        console.warn("Firestore error on redeemCoupon:", err);
      }
    }

    let mockCoupons = JSON.parse(localStorage.getItem("ecoQrMockDb_coupons") || "[]");
    const mock = mockCoupons.find(c => c.code === cleanCode);
    if (mock) {
      Object.assign(mock, updateFields);
      localStorage.setItem("ecoQrMockDb_coupons", JSON.stringify(mockCoupons));
    }

    return { 
      success: true, 
      coupon: { ...existing, ...updateFields } 
    };
  }

  async function fetchAllCoupons() {
    let cloudCoupons = [];
    if (db) {
      try {
        const snapshot = await db.collection("coupons").get();
        snapshot.forEach(doc => cloudCoupons.push(doc.data()));
      } catch (err) {
        console.warn("Firestore error on fetchAllCoupons:", err);
      }
    }
    let mockCoupons = JSON.parse(localStorage.getItem("ecoQrMockDb_coupons") || "[]");

    const map = new Map();
    mockCoupons.forEach(c => map.set(c.code, c));
    cloudCoupons.forEach(c => map.set(c.code, c));
    return Array.from(map.values());
  }

  // Export functions to window object
  window.EcoAnalytics = {
    initAnalytics,
    updateAnalytics,
    addQuizAttempt,
    fetchVisits,
    generateMockVisits,
    clearMockDatabase,
    createCoupon,
    getCoupon,
    redeemCoupon,
    fetchAllCoupons,
    isMockMode: () => !isFirebaseConfigured,
    getCurrentVisitId: () => currentVisitId
  };
})();
