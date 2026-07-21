// admin.js
// Controller logic for the Eco QR Analytics Dashboard.

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initTabs();
  initDevTools();
  
  // Attach event handlers for general actions
  document.getElementById("btnRefresh").addEventListener("click", loadData);
  document.getElementById("btnExportCSV").addEventListener("click", exportCSV);
});

// PASSCODE GATE SECURITY
const PASSCODE = "admin123";
let visitsData = [];

function initAuth() {
  const authForm = document.getElementById("authForm");
  const authGate = document.getElementById("authGate");
  const dashboardShell = document.getElementById("dashboardShell");
  const authError = document.getElementById("authError");
  const logoutBtn = document.getElementById("logoutBtn");

  const checkAccess = () => {
    if (sessionStorage.getItem("adminAuth") === "true") {
      authGate.classList.add("hidden");
      dashboardShell.classList.remove("hidden");
      loadData();
    } else {
      authGate.classList.remove("hidden");
      dashboardShell.classList.add("hidden");
    }
  };

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("passcodeInput").value;
    if (input === PASSCODE) {
      sessionStorage.setItem("adminAuth", "true");
      authError.classList.add("hidden");
      document.getElementById("passcodeInput").value = "";
      checkAccess();
    } else {
      authError.classList.remove("hidden");
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("adminAuth");
    checkAccess();
  });

  checkAccess();
}

// TAB NAVIGATION
function initTabs() {
  const navItems = document.querySelectorAll(".nav-item");
  const panes = document.querySelectorAll(".tab-pane");
  const tabTitle = document.getElementById("tabTitle");
  const tabSubtitle = document.getElementById("tabSubtitle");

  const tabLabels = {
    summary: {
      title: "Статистика QR-кода",
      sub: "Анализ активности и прохождения экологического тестирования"
    },
    questions: {
      title: "Аналитика вопросов теста",
      sub: "Определение тем, вызывающих наибольшие трудности у жителей"
    },
    logs: {
      title: "Журнал посещений",
      sub: "Полная база зафиксированных действий пользователей"
    }
  };

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.tab;
      
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      
      panes.forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === `pane-${target}`) {
          pane.classList.add("active");
        }
      });

      // Update titles
      tabTitle.textContent = tabLabels[target].title;
      tabSubtitle.textContent = tabLabels[target].sub;
      
      // Reset scroll
      document.querySelector(".main-content").scrollTop = 0;
    });
  });
}

// MOCK DEVELOPER PANEL
function initDevTools() {
  const banner = document.getElementById("devBanner");
  const genBtn = document.getElementById("btnGenMock");
  const clearBtn = document.getElementById("btnClearMock");

  // Show dev banner only when operating in Mock mode
  const isMock = window.EcoAnalytics.isMockMode();
  if (isMock) {
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }

  genBtn.addEventListener("click", () => {
    window.EcoAnalytics.generateMockVisits(50);
    loadData();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Вы действительно хотите удалить все записи из Mock-базы данных?")) {
      window.EcoAnalytics.clearMockDatabase();
      loadData();
    }
  });
}

// DATA AGGREGATION & GRAPH DRAWS
let chartInstances = {};

async function loadData() {
  const statusBadge = document.getElementById("dbStatusBadge");
  const statusText = document.getElementById("dbStatusText");

  // Connection badge styling
  if (window.EcoAnalytics.isMockMode()) {
    statusBadge.className = "db-status-badge offline";
    statusText.textContent = "Локальная БД (Mock)";
  } else {
    statusBadge.className = "db-status-badge online";
    statusText.textContent = "Firebase Подключен";
  }

  // Fetch visit logs
  visitsData = await window.EcoAnalytics.fetchVisits();
  
  // Sort visits by creation timestamp descending for logs view
  visitsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Trigger views builders
  renderKPIs();
  renderFunnelAndDurations();
  renderCharts();
  renderQuestionsAnalytics();
  initLogsTable();
}

function renderKPIs() {
  const count = visitsData.length;
  const video = visitsData.filter(v => v.videoWatched).length;
  const started = visitsData.filter(v => v.testStarted).length;
  const completed = visitsData.filter(v => v.completed).length;
  const coupons = visitsData.filter(v => v.coupon).length;

  document.getElementById("valVisits").textContent = count;
  document.getElementById("valVideo").textContent = video;
  document.getElementById("valQuizStarts").textContent = started;
  document.getElementById("valQuizCompletes").textContent = completed;
  document.getElementById("valCoupons").textContent = coupons;

  // Rate subtitles
  document.getElementById("subVideoRate").textContent = count > 0 ? `${Math.round((video / count) * 100)}% от переходов` : "0% от переходов";
  document.getElementById("subQuizStartRate").textContent = count > 0 ? `${Math.round((started / count) * 100)}% от переходов` : "0% от переходов";
  document.getElementById("subQuizCompleteRate").textContent = count > 0 ? `${Math.round((completed / count) * 100)}% от переходов` : "0% от переходов";
  document.getElementById("subCouponRate").textContent = count > 0 ? `${Math.round((coupons / count) * 100)}% от переходов` : "0% от переходов";

  // Score average
  const scoredVisits = visitsData.filter(v => v.percent !== null);
  if (scoredVisits.length > 0) {
    const totalPercentSum = scoredVisits.reduce((acc, curr) => acc + curr.percent, 0);
    document.getElementById("valAvgScore").textContent = `${Math.round(totalPercentSum / scoredVisits.length)}%`;
  } else {
    document.getElementById("valAvgScore").textContent = "0%";
  }
}

function renderFunnelAndDurations() {
  const count = visitsData.length;
  const video = visitsData.filter(v => v.videoWatched).length;
  const started = visitsData.filter(v => v.testStarted).length;
  const completed = visitsData.filter(v => v.completed).length;
  const coupons = visitsData.filter(v => v.coupon).length;

  // Bar sizes
  const pVideo = count > 0 ? Math.round((video / count) * 100) : 0;
  const pStarted = count > 0 ? Math.round((started / count) * 100) : 0;
  const pCompleted = count > 0 ? Math.round((completed / count) * 100) : 0;
  const pCoupons = count > 0 ? Math.round((coupons / count) * 100) : 0;

  document.getElementById("funnel-v1").textContent = count;
  
  document.getElementById("funnel-b2").style.width = `${pVideo}%`;
  document.getElementById("funnel-v2").innerHTML = `${video} <span>(${pVideo}%)</span>`;
  
  document.getElementById("funnel-b3").style.width = `${pStarted}%`;
  document.getElementById("funnel-v3").innerHTML = `${started} <span>(${pStarted}%)</span>`;
  
  document.getElementById("funnel-b4").style.width = `${pCompleted}%`;
  document.getElementById("funnel-v4").innerHTML = `${completed} <span>(${pCompleted}%)</span>`;
  
  document.getElementById("funnel-b5").style.width = `${pCoupons}%`;
  document.getElementById("funnel-v5").innerHTML = `${coupons} <span>(${pCoupons}%)</span>`;

  // Durations average calculations
  const videoWatchedLogs = visitsData.filter(v => v.videoWatched && v.videoWatchTime > 0);
  const avgVideoTime = videoWatchedLogs.length > 0
    ? Math.round(videoWatchedLogs.reduce((acc, curr) => acc + curr.videoWatchTime, 0) / videoWatchedLogs.length)
    : 0;
  document.getElementById("valAvgVideoTime").textContent = `${avgVideoTime} сек`;

  // Flatten attempts logs
  let easyDurations = [];
  let mediumDurations = [];
  let startedUsers = 0;
  let totalAttempts = 0;

  visitsData.forEach(v => {
    if (v.attempts && v.attempts.length > 0) {
      startedUsers++;
      totalAttempts += v.attempts.length;
      v.attempts.forEach(att => {
        if (att.level === "easy" && att.duration) easyDurations.push(att.duration);
        if (att.level === "medium" && att.duration) mediumDurations.push(att.duration);
      });
    }
  });

  const avgEasy = easyDurations.length > 0 ? Math.round(easyDurations.reduce((a, b) => a + b, 0) / easyDurations.length) : 0;
  const avgMedium = mediumDurations.length > 0 ? Math.round(mediumDurations.reduce((a, b) => a + b, 0) / mediumDurations.length) : 0;
  const avgAttempts = startedUsers > 0 ? (totalAttempts / startedUsers).toFixed(1) : "0.0";

  document.getElementById("valAvgEasyTime").textContent = `${avgEasy} сек`;
  document.getElementById("valAvgMediumTime").textContent = `${avgMedium} сек`;
  document.getElementById("valAvgAttempts").textContent = avgAttempts;
}

function renderCharts() {
  // Clear existing instances to prevent overlays
  Object.keys(chartInstances).forEach(key => {
    chartInstances[key].destroy();
  });

  // 1. Chart: Visits By Day
  const dailyCounts = {};
  visitsData.forEach(v => {
    if (!v.createdAt) return;
    const dateStr = new Date(v.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    dailyCounts[dateStr] = (dailyCounts[dateStr] || 0) + 1;
  });
  // Sort date keys chronologically (visitsData holds ISO, but dailyCounts has formatted keys. 
  // Let's gather sorting order by actual dates first)
  const sortedDates = Object.keys(dailyCounts).reverse(); // simple chronological sort since visitsData is sorted descending

  const ctxVisits = document.getElementById("chartVisitsByDay").getContext("2d");
  chartInstances.visits = new Chart(ctxVisits, {
    type: "line",
    data: {
      labels: sortedDates,
      datasets: [{
        label: "Переходы по QR",
        data: sortedDates.map(d => dailyCounts[d]),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: "#223254" },
          ticks: { color: "#94a3b8", precision: 0 }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8" }
        }
      }
    }
  });

  // 2. Chart: Score Distribution
  const brackets = { "90-100%": 0, "80-89%": 0, "70-79%": 0, "<70%": 0 };
  visitsData.forEach(v => {
    if (v.percent === null) return;
    const pct = v.percent;
    if (pct >= 90) brackets["90-100%"]++;
    else if (pct >= 80) brackets["80-89%"]++;
    else if (pct >= 70) brackets["70-79%"]++;
    else brackets["<70%"]++;
  });

  const ctxScore = document.getElementById("chartScoreDistribution").getContext("2d");
  chartInstances.score = new Chart(ctxScore, {
    type: "bar",
    data: {
      labels: Object.keys(brackets),
      datasets: [{
        label: "Пользователи",
        data: Object.values(brackets),
        backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#f43f5e"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          grid: { color: "#223254" },
          ticks: { color: "#94a3b8", precision: 0 }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8" }
        }
      }
    }
  });

  // 3. Chart: Languages
  const langs = { RU: 0, KK: 0, "Не выбран": 0 };
  visitsData.forEach(v => {
    if (!v.language) langs["Не выбран"]++;
    else if (v.language === "ru") langs["RU"]++;
    else if (v.language === "kk") langs["KK"]++;
  });

  const ctxLang = document.getElementById("chartLanguages").getContext("2d");
  chartInstances.languages = new Chart(ctxLang, {
    type: "doughnut",
    data: {
      labels: Object.keys(langs),
      datasets: [{
        data: Object.values(langs),
        backgroundColor: ["#3b82f6", "#f59e0b", "#475569"],
        borderWidth: 1,
        borderColor: "#111a2e"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#94a3b8", padding: 10 }
        }
      }
    }
  });

  // 4. Chart: Devices
  const devices = { Mobile: 0, Desktop: 0, Tablet: 0 };
  visitsData.forEach(v => {
    if (v.device) devices[v.device] = (devices[v.device] || 0) + 1;
  });

  const ctxDev = document.getElementById("chartDevices").getContext("2d");
  chartInstances.devices = new Chart(ctxDev, {
    type: "bar",
    data: {
      labels: Object.keys(devices),
      datasets: [{
        label: "Устройства",
        data: Object.values(devices),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: "#223254" },
          ticks: { color: "#94a3b8", precision: 0 }
        },
        y: {
          grid: { display: false },
          ticks: { color: "#94a3b8" }
        }
      }
    }
  });
}

function renderQuestionsAnalytics() {
  const hardestTable = document.getElementById("tableHardestQuestions").getElementsByTagName("tbody")[0];
  const commonErrorsTable = document.getElementById("tableCommonErrors").getElementsByTagName("tbody")[0];

  // Aggregate questions data from attempts
  const questionsData = {};

  visitsData.forEach(v => {
    if (v.attempts && v.attempts.length > 0) {
      v.attempts.forEach(attempt => {
        if (attempt.answers && attempt.answers.length > 0) {
          attempt.answers.forEach(ans => {
            const qId = ans.questionId;
            if (!questionsData[qId]) {
              questionsData[qId] = {
                id: qId,
                text: ans.questionText,
                level: attempt.level,
                total: 0,
                correct: 0,
                wrongChoices: {} // tracks freq of wrong choice indices
              };
            }
            const qData = questionsData[qId];
            qData.total++;
            if (ans.isCorrect) {
              qData.correct++;
            } else {
              // Track wrong choice text or index
              // We'll log selected index to know which choice index is chosen.
              // In case choices text is saved, we can use that, or just use selectedAnswerIndex.
              // Let's use selectedAnswerIndex as a key for statistics.
              const chosenIdx = ans.selectedAnswerIndex;
              if (chosenIdx !== undefined && chosenIdx !== null) {
                qData.wrongChoices[chosenIdx] = (qData.wrongChoices[chosenIdx] || 0) + 1;
              }
            }
          });
        }
      });
    }
  });

  const questionsList = Object.values(questionsData);

  if (questionsList.length === 0) {
    hardestTable.innerHTML = `<tr><td colspan="5" class="empty-state">Нет данных о прохождении тестов. Пройдите тест, чтобы увидеть аналитику вопросов.</td></tr>`;
    commonErrorsTable.innerHTML = `<tr><td colspan="4" class="empty-state">Нет данных об ошибках.</td></tr>`;
    return;
  }

  // Calculate success rates
  questionsList.forEach(q => {
    q.successRate = q.total > 0 ? (q.correct / q.total) * 100 : 0;
  });

  // 1. Hardest questions: sort ascending by successRate
  const sortedHardest = [...questionsList]
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 10); // top 10 hardest

  hardestTable.innerHTML = sortedHardest.map(q => {
    const rateColor = q.successRate < 60 ? "text-danger" : q.successRate < 80 ? "text-warning" : "text-success";
    const levelLabel = q.level === "easy" ? "Легкий" : "Средний";
    return `
      <tr>
        <td><strong>${escapeHtml(q.text)}</strong></td>
        <td><span class="tag-badge ${q.level}">${levelLabel}</span></td>
        <td class="num">${q.total}</td>
        <td class="num">${q.correct}</td>
        <td class="num font-bold ${rateColor}">${Math.round(q.successRate)}%</td>
      </tr>
    `;
  }).join("");

  // 2. Common mistakes: find the most popular wrong answers
  // We need to map incorrect indexes (0-3) back to actual text if possible. Since we only have index,
  // we can indicate "Вариант B" or similar, but wait! We can find the actual text if we load easy.json / medium.json?
  // Actually, we can translate index into letters (A, B, C, D) which is very standard, or let the dashboard show the option text.
  // Wait! Let's display: Option index (e.g. Option A, B, C, or D). To make it friendly, we map 0, 1, 2, 3 to A, B, C, D:
  const letterMap = ["A", "B", "C", "D"];
  
  const commonErrorsList = [];
  questionsList.forEach(q => {
    const wrongKeys = Object.keys(q.wrongChoices);
    if (wrongKeys.length > 0) {
      let maxWrongKey = wrongKeys[0];
      let maxWrongCount = q.wrongChoices[maxWrongKey];
      
      wrongKeys.forEach(k => {
        if (q.wrongChoices[k] > maxWrongCount) {
          maxWrongKey = k;
          maxWrongCount = q.wrongChoices[k];
        }
      });

      const totalWrong = q.total - q.correct;
      commonErrorsList.push({
        text: q.text,
        level: q.level,
        wrongOption: `Вариант ${letterMap[maxWrongKey] || "Неизвестно"}`,
        count: maxWrongCount,
        percentOfWrong: totalWrong > 0 ? Math.round((maxWrongCount / totalWrong) * 100) : 0
      });
    }
  });

  // Sort common errors by count of occurrence descending
  commonErrorsList.sort((a, b) => b.count - a.count);
  const topErrors = commonErrorsList.slice(0, 10);

  if (topErrors.length === 0) {
    commonErrorsTable.innerHTML = `<tr><td colspan="4" class="empty-state">Ошибок не зафиксировано. Все ответы правильные!</td></tr>`;
  } else {
    commonErrorsTable.innerHTML = topErrors.map(err => `
      <tr>
        <td><strong>${escapeHtml(err.text)}</strong></td>
        <td class="text-warning">${escapeHtml(err.wrongOption)}</td>
        <td class="num">${err.count}</td>
        <td class="num">${err.percentOfWrong}%</td>
      </tr>
    `).join("");
  }
}

// VISITOR LOGS TABLE PAGEABLE
let logsPage = 1;
const logsLimit = 15;
let filteredLogs = [];

function initLogsTable() {
  const searchInput = document.getElementById("logSearch");
  const filterLang = document.getElementById("logFilterLang");
  const filterDevice = document.getElementById("logFilterDevice");

  const prevBtn = document.getElementById("btnPagePrev");
  const nextBtn = document.getElementById("btnPageNext");

  // Attach search/filter inputs listeners once
  if (!searchInput.dataset.hasListener) {
    searchInput.dataset.hasListener = "true";
    searchInput.addEventListener("input", () => { logsPage = 1; applyFilters(); });
    filterLang.addEventListener("change", () => { logsPage = 1; applyFilters(); });
    filterDevice.addEventListener("change", () => { logsPage = 1; applyFilters(); });
    
    prevBtn.addEventListener("click", () => {
      if (logsPage > 1) {
        logsPage--;
        renderLogsTable();
      }
    });

    nextBtn.addEventListener("click", () => {
      const maxPages = Math.ceil(filteredLogs.length / logsLimit);
      if (logsPage < maxPages) {
        logsPage++;
        renderLogsTable();
      }
    });
  }

  applyFilters();
}

function applyFilters() {
  const query = document.getElementById("logSearch").value.toLowerCase();
  const lang = document.getElementById("logFilterLang").value;
  const dev = document.getElementById("logFilterDevice").value;

  filteredLogs = visitsData.filter(v => {
    // 1. Search Query
    const uuidMatch = v.id && v.id.toLowerCase().includes(query);
    const osMatch = v.os && v.os.toLowerCase().includes(query);
    const browserMatch = v.browser && v.browser.toLowerCase().includes(query);
    const queryMatch = !query || uuidMatch || osMatch || browserMatch;

    // 2. Language Filter
    let langMatch = true;
    if (lang === "ru") langMatch = v.language === "ru";
    else if (lang === "kk") langMatch = v.language === "kk";
    else if (lang === "none") langMatch = !v.language;

    // 3. Device Filter
    let devMatch = true;
    if (dev !== "all") devMatch = v.device === dev;

    return queryMatch && langMatch && devMatch;
  });

  renderLogsTable();
}

function renderLogsTable() {
  const tableBody = document.getElementById("tableVisitsLog").getElementsByTagName("tbody")[0];
  const infoSpan = document.getElementById("paginationInfo");
  const prevBtn = document.getElementById("btnPagePrev");
  const nextBtn = document.getElementById("btnPageNext");

  const total = filteredLogs.length;

  if (total === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" class="empty-state">Нет визитов, удовлетворяющих условиям поиска.</td></tr>`;
    infoSpan.textContent = "Показано 0-0 из 0";
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const maxPages = Math.ceil(total / logsLimit);
  if (logsPage > maxPages) logsPage = maxPages || 1;

  const start = (logsPage - 1) * logsLimit;
  const end = Math.min(start + logsLimit, total);

  const paginatedItems = filteredLogs.slice(start, end);

  tableBody.innerHTML = paginatedItems.map(v => {
    const timeStr = v.createdAt ? new Date(v.createdAt).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "-";

    const langBadge = v.language ? `<span class="tag-badge ${v.language}">${v.language.toUpperCase()}</span>` : `<span class="tag-badge none">-</span>`;
    const deviceBadge = v.device ? `<span class="tag-badge ${v.device.toLowerCase()}">${v.device}</span>` : "-";
    const osBrowser = `${v.os || "Unknown"} / ${v.browser || "Unknown"}`;
    const videoTime = v.videoWatched ? `${v.videoWatchTime || 0}c` : `<span style="color:#64748b">Не смотрел</span>`;
    const easyVal = v.easyScore !== null ? `${v.easyScore}/10` : `<span style="color:#64748b">-</span>`;
    const medVal = v.mediumScore !== null ? `${v.mediumScore}/10` : `<span style="color:#64748b">-</span>`;
    const couponBadge = v.coupon ? `<span class="tag-badge coupon-yes">Да</span>` : `<span class="tag-badge coupon-no">Нет</span>`;

    return `
      <tr>
        <td style="white-space:nowrap">${timeStr}</td>
        <td title="${v.id}">${v.id.substring(0, 12)}...</td>
        <td style="white-space:nowrap">${deviceBadge} <span style="font-size:0.78rem;color:#94a3b8">(${osBrowser})</span></td>
        <td>${langBadge}</td>
        <td class="num">${videoTime}</td>
        <td class="num">${easyVal}</td>
        <td class="num">${medVal}</td>
        <td>${couponBadge}</td>
      </tr>
    `;
  }).join("");

  infoSpan.textContent = `Показано ${start + 1}-${end} из ${total}`;
  prevBtn.disabled = logsPage === 1;
  nextBtn.disabled = logsPage === maxPages;
}

// EXPORT TO CSV
function exportCSV() {
  if (visitsData.length === 0) {
    alert("Нет данных для экспорта.");
    return;
  }

  const headers = [
    "ID визита (UUID)",
    "Дата создания",
    "Последняя активность",
    "Язык",
    "Просмотр видео",
    "Время видео (сек)",
    "Тест начат",
    "Тест завершен",
    "Балл Easy",
    "Балл Medium",
    "Итоговый процент",
    "Выдан купон",
    "Время купона",
    "Попыток теста",
    "Устройство",
    "ОС",
    "Браузер"
  ];

  const rows = visitsData.map(v => [
    v.id || "",
    v.createdAt || "",
    v.lastActiveAt || "",
    v.language || "",
    v.videoWatched ? "Да" : "Нет",
    v.videoWatchTime || 0,
    v.testStarted ? "Да" : "Нет",
    v.completed ? "Да" : "Нет",
    v.easyScore !== null ? v.easyScore : "",
    v.mediumScore !== null ? v.mediumScore : "",
    v.percent !== null ? v.percent : "",
    v.coupon ? "Да" : "Нет",
    v.couponTime || "",
    v.attemptsCount || 0,
    v.device || "",
    v.os || "",
    v.browser || ""
  ]);

  // Convert to CSV format (UTF-8 BOM to display Russian chars correctly in Excel)
  const csvContent = "\uFEFF" + [
    headers.join(";"),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `eco_qr_analytics_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// HTML escape helper
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
