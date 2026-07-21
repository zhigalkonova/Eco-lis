"use strict";

const QUESTION_COUNT = 10;
const PASS_SCORE = 8;
const VIDEO_IDS = {
  ru: "UZzhOxBURII", // ID видео на русском
  kk: "UEfmIArk1_s", // ID видео на казахском (Қазақша)
};
const STORAGE_KEYS = {
  language: "ecoQrLanguage",
  videoWatched: "ecoQrVideoWatched",
  coupon: "ecoQrCouponClaimed",
};

// Web Audio API Synthesizer for Quiz Game Tones
const AudioSynth = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playCorrect() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = "sine";
    osc2.type = "sine";
    
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now + 0.08);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  },
  playWrong() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.linearRampToValueAtTime(147, now + 0.22); // D3
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }
};

const COPY = {
  ru: {
    code: "RU",
    brand: "Eco QR: Лисаковск",
    changeLanguage: "Сменить язык",
    info: {
      eyebrow: "Интересные факты о городе",
      title: "Лисаковск: уютный город энергии и экологии",
      lead:
        "Узнайте больше об истории, достижениях, уникальных находках и зеленых инициативах нашего любимого города на Тоболе.",
      continue: "Продолжить",
      sourcesLabel: "Источники",
      sourcesTitle: "Факты основаны на краеведческих и официальных материалах",
      facts: [
        {
          value: "1971 год",
          label:
            "официальный год основания Лисаковска, выросшего на берегах живописной реки Тобол",
        },
        {
          value: "300+ га",
          label:
            "площадь зеленых насаждений, уютных парков и скверов, украшающих наш ухоженный город",
        },
        {
          value: "100%",
          label:
            "активное вовлечение жителей Лисаковска в общенациональную эко-кампанию «Таза Қазақстан»",
        },
        {
          value: "27%",
          label:
            "целевой уровень переработки отходов, к которому стремится город благодаря сортировке",
        },
      ],
      cards: [
        {
          icon: "🏛️",
          title: "Древнее наследие",
          text:
            "Лисаковск знаменит уникальными археологическими памятниками эпохи бронзы, которые привлекают исследователей и туристов со всего мира.",
        },
        {
          icon: "🌳",
          title: "Зеленый пояс",
          text:
            "В городе ежегодно высаживаются тысячи деревьев и цветов. Лисаковск славится своими тенистыми аллеями и ухоженными чистыми улицами.",
        },
        {
          icon: "⛵",
          title: "Река Тобол",
          text:
            "Живописные берега реки Тобол и Лисаковское водохранилище — любимые места жителей для водного спорта, отдыха и прогулок на свежем воздухе.",
        },
        {
          icon: "♻️",
          title: "Раздельный сбор",
          text:
            "В Лисаковске активно внедряется культура раздельного сбора мусора. Жители поддерживают чистоту дворов и сортируют бытовые отходы.",
        },
        {
          icon: "🌱",
          title: "Таза Қазақстан",
          text:
            "Лисаковцы дружно участвуют в экологических инициативах, благоустраивают общественные пространства и оберегают природные родники.",
        },
        {
          icon: "✨",
          title: "Дальнейшее развитие",
          text:
            "Модернизация инфраструктуры, внедрение энергоэффективных технологий и забота о природе создают комфортное будущее для новых поколений.",
        },
      ],
      sources: [
        {
          label: "Акимат Лисаковска: общая информация о городе",
          url: "https://www.gov.kz/memleket/entities/kostanai-lisakovsk-kalasy-akimat/activities/4890",
        },
        {
          label: "Реестр экологических проблем Костанайской области",
          url: "https://www.gov.kz/memleket/entities/kostanai-tabigi-resurstar/documents/details/786988?lang=ru",
        },
        {
          label: "Программа управления коммунальными отходами Лисаковска на 2024-2028 годы",
          url: "https://zakon.uchet.kz/rus/docs/G24ND00083M",
        },
        {
          label: "Kazinform: экологическая обстановка в Костанайской области",
          url: "https://www.inform.kz/ru/kakova-ekologicheskaya-obstanovka-v-kostanayskoy-oblasti-92062a",
        },
      ],
    },
    video: {
      eyebrow: "Видео перед тестом",
      title: "Посмотрите ролик до конца",
      lead:
        "Тестирование откроется только после завершения видеоролика. Кнопка перехода появится автоматически.",
      note:
        "Если видео не загружается, проверьте интернет или замените VIDEO_ID в script.js на нужный YouTube-ролик.",
      waiting: "Видео еще не завершено. После окончания появится доступ к тестированию.",
      loading: "Загружается видеоплеер...",
      ready: "Видео просмотрено. Можно переходить к тестированию.",
      blocked:
        "Тест пока закрыт: сначала нужно посмотреть видео до конца.",
      apiFailed:
        "Не удалось загрузить YouTube-плеер. Проверьте подключение к интернету или используйте локальный mp4.",
      goQuiz: "Перейти к тестированию",
    },
    quiz: {
      easy: "Уровень 1: легкий",
      medium: "Уровень 2: средний",
      counter: "{current} из {total}",
      loading: "Загружаем вопросы...",
      loadError:
        "Не удалось загрузить вопросы. Запустите сайт через локальный сервер или разместите его на хостинге.",
    },
    result: {
      eyebrow: "Результат",
      easyPassedTitle: "Первый уровень пройден",
      easyFailedTitle: "Нужно повторить материал",
      mediumTitle: "Итоговый результат",
      easyPassed:
        "Вы набрали проходной балл. Теперь открыт второй уровень.",
      easyFailed:
        "Для перехода ко второму уровню необходимо набрать минимум 8 баллов.",
      mediumHigh:
        "Отличный результат: вы хорошо понимаете причины загрязнения и способы решения.",
      mediumLow:
        "Рекомендуется еще раз прочитать материал и пройти тест заново.",
      correct: "Правильные ответы",
      percent: "Процент",
      points: "Баллы",
      total: "Всего",
      retry: "Пройти снова",
      restart: "Пройти заново",
      toMedium: "Перейти ко второму уровню",
      toInfo: "Повторить материал",
    },
    coupon: {
      badge: "КУПОН",
      title: "Вы выиграли купон!",
      text: "Вы успешно завершили эко-тестирование! Заберите заслуженную награду от наших партнеров.",
      claimBtn: "Получить купон",
      claimed: "Купон активирован!",
      codeLabel: "Ваш промокод:",
      copyBtn: "Копировать",
      copied: "Скопировано!",
      expiry: "Действителен до 31.12.2026",
    },
  },
  kk: {
    code: "KZ",
    brand: "Eco QR: Лисаковск",
    changeLanguage: "Тілді ауыстыру",
    info: {
      eyebrow: "Қала туралы қызықты деректер",
      title: "Лисаковск: жайлылық пен жасыл бастамалар қаласы",
      lead:
        "Тобыл бойындағы сүйікті қаламыздың тарихы, жетістіктері, бірегей олжалары мен жасыл бастамалары туралы көбірек біліңіз.",
      continue: "Жалғастыру",
      sourcesLabel: "Дереккөздер",
      sourcesTitle: "Ақпарат өлкетану және ресми материалдарға негізделген",
      facts: [
        {
          value: "1971 жыл",
          label:
            "көрікті Тобыл өзенінің бойында бой көтерген Лисаковск қаласының ресми құрылған жылы",
        },
        {
          value: "300+ га",
          label:
            "таза әрі күтілген қаламызды безендіретін жасыл желектер, саябақтар мен скверлердің ауданы",
        },
        {
          value: "100%",
          label:
            "Лисаковск тұрғындарының «Таза Қазақстан» жалпыұлттық экологиялық науқанына белсенді қатысуы",
        },
        {
          value: "27%",
          label:
            "сұрыптаудың арқасында қаламыз жетуге ұмтылатын қалдықтарды қайта өңдеудің мақсатты көрсеткіші",
        },
      ],
      cards: [
        {
          icon: "🏛️",
          title: "Көне мұра",
          text:
            "Лисаковск бүкіл әлем зерттеушілері мен туристерін қызықтыратын қола дәуірінің бірегей археологиялық ескерткіштерімен әйгілі.",
        },
        {
          icon: "🌳",
          title: "Жасыл белдеу",
          text:
            "Қалада жыл сайын мыңдаған ағаштар мен гүлдер отырғызылады. Лисаковск өзінің көлеңкелі аллеяларымен және таза көшелерімен танымал.",
        },
        {
          icon: "⛵",
          title: "Тобыл өзені",
          text:
            "Тобылдың көркем жағалауы мен Лисаков су қоймасы — демалыс, су спорты және таза ауада серуендеудің сүйікті орындары.",
        },
        {
          icon: "♻️",
          title: "Бөлек жинау",
          text:
            "Лисаковскіде қоқысты бөлек жинау мәдениеті енгізілуде. Тұрғындар аула тазалығын сақтап, қалдықтарды белсенді сұрыптайды.",
        },
        {
          icon: "🌱",
          title: "Таза Қазақстан",
          text:
            "Лисаковтықтар экологиялық бастамаларға бірге қатысып, қоғамдық орындарды абаттандырады және табиғи бұлақтарды қорғайды.",
        },
        {
          icon: "✨",
          title: "Қаланың дамуы",
          text:
            "Инфрақұрылымды жаңғырту, энергия тиімді технологияларды енгізу және табиғатқа қамқорлық жаңа ұрпақ үшін жайлы болашақ құрады.",
        },
      ],
      sources: [
        {
          label: "Лисаковск әкімдігі: қала туралы жалпы ақпарат",
          url: "https://www.gov.kz/memleket/entities/kostanai-lisakovsk-kalasy-akimat/activities/4890",
        },
        {
          label: "Қостанай облысының экологиялық проблемалар тізілімі",
          url: "https://www.gov.kz/memleket/entities/kostanai-tabigi-resurstar/documents/details/786988?lang=ru",
        },
        {
          label: "Лисаковск қаласының 2024-2028 жылдарға арналған коммуналдық қалдықтарды басқару бағдарламасы",
          url: "https://zakon.uchet.kz/rus/docs/G24ND00083M",
        },
        {
          label: "Kazinform: Қостанай облысындағы экологиялық жағдай",
          url: "https://www.inform.kz/ru/kakova-ekologicheskaya-obstanovka-v-kostanayskoy-oblasti-92062a",
        },
      ],
    },
    video: {
      eyebrow: "Тест алдындағы видео",
      title: "Бейнероликті соңына дейін көріңіз",
      lead:
        "Тестілеу бейне аяқталғаннан кейін ғана ашылады. Өту батырмасы автоматты түрде пайда болады.",
      note:
        "Егер видео жүктелмесе, интернетті тексеріңіз немесе script.js ішіндегі VIDEO_ID мәнін қажетті YouTube ролигіне ауыстырыңыз.",
      waiting: "Видео әлі аяқталған жоқ. Аяқталғаннан кейін тестілеуге рұқсат ашылады.",
      loading: "Бейнеплеер жүктеліп жатыр...",
      ready: "Видео қаралды. Тестілеуге өтуге болады.",
      blocked: "Тест әзірге жабық: алдымен видеоны соңына дейін көріңіз.",
      apiFailed:
        "YouTube-плеер жүктелмеді. Интернетті тексеріңіз немесе жергілікті mp4 қолданыңыз.",
      goQuiz: "Тестілеуге өту",
    },
    quiz: {
      easy: "1-деңгей: жеңіл",
      medium: "2-деңгей: орташа",
      counter: "{current} / {total}",
      loading: "Сұрақтар жүктеліп жатыр...",
      loadError:
        "Сұрақтарды жүктеу мүмкін болмады. Сайтты жергілікті сервер арқылы іске қосыңыз немесе хостингке орналастырыңыз.",
    },
    result: {
      eyebrow: "Нәтиже",
      easyPassedTitle: "Бірінші деңгей өтті",
      easyFailedTitle: "Материалды қайталау керек",
      mediumTitle: "Қорытынды нәтиже",
      easyPassed:
        "Сіз өту балын жинадыңыз. Екінші деңгей ашылды.",
      easyFailed:
        "Екінші деңгейге өту үшін кемінде 8 балл жинау қажет.",
      mediumHigh:
        "Жақсы нәтиже: сіз ластану себептері мен шешу жолдарын түсінесіз.",
      mediumLow:
        "Материалды қайта оқып, тестті тағы бір рет өткен дұрыс.",
      correct: "Дұрыс жауаптар",
      percent: "Пайыз",
      points: "Балл",
      total: "Барлығы",
      retry: "Қайта өту",
      restart: "Басынан өту",
      toMedium: "Екінші деңгейге өту",
      toInfo: "Материалды қайталау",
    },
    coupon: {
      badge: "КУПОН",
      title: "Сіз купон ұтып алдыңыз!",
      text: "Сіз эко-тестілеуді сәтті аяқтадыңыз! Серіктестеріміздің лайықты марапатын алыңыз.",
      claimBtn: "Купонды алу",
      claimed: "Купоныңыз белсендірілді!",
      codeLabel: "Сіздің промокодыңыз:",
      copyBtn: "Көшіру",
      copied: "Көшірілді!",
      expiry: "31.12.2026 дейін жарамды",
    },
  },
};

const state = {
  lang: sessionStorage.getItem(STORAGE_KEYS.language),
  videoWatched: sessionStorage.getItem(STORAGE_KEYS.videoWatched) === "true",
  currentScreen: "language",
  player: null,
  playerLoadTimer: null,
  banks: {},
  quiz: null,
  lastEasyScore: null,
};

const dom = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();

  // Initialize analytics
  window.EcoAnalytics.initAnalytics();

  if (state.lang && COPY[state.lang]) {
    applyLanguage();
    renderInfo();
  } else {
    showScreen("language");
  }
});

function cacheDom() {
  [
    "topbar",
    "languageScreen",
    "infoScreen",
    "videoScreen",
    "quizScreen",
    "resultScreen",
    "brandTitle",
    "homeButton",
    "languageChip",
    "changeLanguageButton",
    "infoEyebrow",
    "infoTitle",
    "infoLead",
    "continueButton",
    "factsGrid",
    "infoCards",
    "sourcesLabel",
    "sourcesTitle",
    "sourcesList",
    "videoEyebrow",
    "videoTitle",
    "videoLead",
    "videoStatus",
    "quizGateButton",
    "videoBackButton",
    "quizBackButton",
    "localVideoPlayer",
    "levelBadge",
    "questionCounter",
    "progressFill",
    "questionText",
    "answersGrid",
    "resultEyebrow",
    "resultTitle",
    "resultMessage",
    "resultGrid",
    "resultActions",
    "couponContainer",
    "couponBadge",
    "couponTitle",
    "couponText",
    "claimCouponButton",
    "couponCodeBox",
    "couponLabel",
    "couponCode",
    "copyCouponButton",
    "couponExpiry",
  ].forEach((id) => {
    dom[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => selectLanguage(button.dataset.lang));
  });

  dom.changeLanguageButton.addEventListener("click", () => {
    sessionStorage.removeItem(STORAGE_KEYS.language);
    sessionStorage.removeItem(STORAGE_KEYS.videoWatched);
    state.lang = null;
    state.videoWatched = false;
    state.quiz = null;
    showScreen("language");
  });

  dom.homeButton.addEventListener("click", () => {
    if (state.lang) {
      renderInfo();
    }
  });

  dom.continueButton.addEventListener("click", renderVideo);
  dom.videoBackButton.addEventListener("click", renderInfo);
  dom.quizBackButton.addEventListener("click", renderVideo);
  dom.quizGateButton.addEventListener("click", () => startQuiz("easy"));
  dom.claimCouponButton.addEventListener("click", claimCoupon);
  dom.copyCouponButton.addEventListener("click", copyCouponCode);
}

function selectLanguage(lang) {
  if (!COPY[lang]) return;
  state.lang = lang;
  state.videoWatched = false;
  sessionStorage.setItem(STORAGE_KEYS.language, lang);
  sessionStorage.removeItem(STORAGE_KEYS.videoWatched);
  applyLanguage();
  renderInfo();
  window.EcoAnalytics.updateAnalytics({ language: lang });
}

async function claimCoupon() {
  dom.claimCouponButton.disabled = true;
  dom.claimCouponButton.textContent = getCopy().coupon.claimed;

  await window.EcoAnalytics.updateAnalytics({
    coupon: true,
    couponTime: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.coupon, "true");

  dom.couponCodeBox.classList.remove("hidden");
  dom.claimCouponButton.classList.add("hidden");
}

function copyCouponCode() {
  const code = dom.couponCode.textContent;
  navigator.clipboard.writeText(code).then(() => {
    const copyBtn = dom.copyCouponButton;
    const origText = copyBtn.textContent;
    copyBtn.textContent = getCopy().coupon.copied;
    copyBtn.disabled = true;
    setTimeout(() => {
      copyBtn.textContent = origText;
      copyBtn.disabled = false;
    }, 1500);
  }).catch(err => {
    console.error("Failed to copy promo code:", err);
  });
}

function applyLanguage() {
  const copy = getCopy();
  document.documentElement.lang = state.lang === "kk" ? "kk" : "ru";
  document.title = copy.brand;
  dom.brandTitle.textContent = copy.brand;
  dom.languageChip.textContent = copy.code;
  dom.changeLanguageButton.textContent = copy.changeLanguage;

  const backLabel = state.lang === "kk" ? "Артқа" : "Назад";
  dom.videoBackButton.textContent = backLabel;
  dom.quizBackButton.textContent = backLabel;
}

function getCopy() {
  return COPY[state.lang || "ru"];
}

function showScreen(screenName) {
  state.currentScreen = screenName;
  const screens = {
    language: dom.languageScreen,
    info: dom.infoScreen,
    video: dom.videoScreen,
    quiz: dom.quizScreen,
    result: dom.resultScreen,
  };

  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
  dom.topbar.classList.toggle("hidden", screenName === "language");
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Auto-pause video when moving away from the video screen
  if (screenName !== "video") {
    try {
      if (dom.localVideoPlayer && !dom.localVideoPlayer.paused) {
        dom.localVideoPlayer.pause();
      }
    } catch (e) {}
  }
}

function renderInfo() {
  const { info } = getCopy();
  applyLanguage();
  dom.infoEyebrow.textContent = info.eyebrow;
  dom.infoTitle.textContent = info.title;
  dom.infoLead.textContent = info.lead;
  dom.continueButton.textContent = info.continue;
  dom.sourcesLabel.textContent = info.sourcesLabel;
  dom.sourcesTitle.textContent = info.sourcesTitle;

  dom.factsGrid.innerHTML = info.facts
    .map(
      (fact) => `
        <article class="fact-card">
          <p class="fact-value">${escapeHtml(fact.value)}</p>
          <p class="fact-label">${escapeHtml(fact.label)}</p>
        </article>
      `,
    )
    .join("");

  dom.infoCards.innerHTML = info.cards
    .map(
      (card) => `
        <article class="info-card">
          <div class="card-icon" aria-hidden="true">${card.icon}</div>
          <h2>${escapeHtml(card.title)}</h2>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `,
    )
    .join("");

  dom.sourcesList.innerHTML = info.sources
    .map(
      (source) =>
        `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(
          source.label,
        )}</a></li>`,
    )
    .join("");

  showScreen("info");
}

function renderVideo() {
  const { video } = getCopy();
  applyLanguage();
  dom.videoEyebrow.textContent = video.eyebrow;
  dom.videoTitle.textContent = video.title;
  dom.videoLead.textContent = video.lead;
  updateVideoGate();
  showScreen("video");
  setupLocalVideoPlayer();
}

function updateVideoGate() {
  const { video } = getCopy();
  dom.quizGateButton.textContent = video.goQuiz;

  if (state.videoWatched) {
    dom.videoStatus.textContent = video.ready;
    dom.videoStatus.className = "status-box ready";
    dom.quizGateButton.disabled = false;
    dom.quizGateButton.classList.remove("hidden");
  } else {
    dom.videoStatus.textContent = video.loading;
    dom.videoStatus.className = "status-box";
    dom.quizGateButton.disabled = true;
    dom.quizGateButton.classList.add("hidden");
  }
}

function markVideoWatched() {
  state.videoWatched = true;
  sessionStorage.setItem(STORAGE_KEYS.videoWatched, "true");
  updateVideoGate();
}


const LOCAL_VIDEOS = {
  ru: "assets/video/Video Ru.mp4",
  kk: "assets/video/Video kk.mp4"
};

function setupLocalVideoPlayer() {
  const player = dom.localVideoPlayer;
  if (!player) return;

  const videoSrc = LOCAL_VIDEOS[state.lang] || LOCAL_VIDEOS.ru;
  
  // Set source and reload only if changed
  const currentSrc = player.getAttribute("src");
  if (currentSrc !== videoSrc) {
    player.src = videoSrc;
    player.load();
    state.videoWatched = false;
    updateVideoGate();
  }

  // Bind video events for tracking and completion
  player.onplaying = () => {
    state.videoPlayStartTime = Date.now();
  };

  const flushWatchTime = () => {
    if (state.videoPlayStartTime) {
      const elapsed = Math.round((Date.now() - state.videoPlayStartTime) / 1000);
      state.videoWatchDurationTotal = (state.videoWatchDurationTotal || 0) + elapsed;
      state.videoPlayStartTime = null;
      window.EcoAnalytics.updateAnalytics({ videoWatchTime: state.videoWatchDurationTotal });
    }
  };

  player.onpause = () => {
    flushWatchTime();
  };

  player.onended = () => {
    flushWatchTime();
    markVideoWatched();
  };
}

async function startQuiz(level) {
  if (state.videoPlayStartTime) {
    const elapsed = Math.round((Date.now() - state.videoPlayStartTime) / 1000);
    state.videoWatchDurationTotal = (state.videoWatchDurationTotal || 0) + elapsed;
    state.videoPlayStartTime = null;
    window.EcoAnalytics.updateAnalytics({ videoWatchTime: state.videoWatchDurationTotal });
  }

  if (!state.videoWatched) {
    renderVideo();
    dom.videoStatus.textContent = getCopy().video.blocked;
    dom.videoStatus.className = "status-box warning";
    return;
  }

  if (level === "easy" && !state.testStartedFlag) {
    state.testStartedFlag = true;
    window.EcoAnalytics.updateAnalytics({ testStarted: true });
  }
  state.quizStartTime = Date.now();

  showScreen("quiz");
  dom.levelBadge.textContent = getCopy().quiz[level];
  dom.questionCounter.textContent = "";
  dom.progressFill.style.width = "0%";
  dom.questionText.textContent = getCopy().quiz.loading;
  dom.answersGrid.innerHTML = "";

  try {
    const bank = await loadQuestionBank(level);
    const selected = shuffle(bank).slice(0, QUESTION_COUNT).map(prepareQuestion);
    state.quiz = {
      level,
      questions: selected,
      current: 0,
      score: 0,
      locked: false,
    };
    renderQuestion();
  } catch (error) {
    console.error(error);
    dom.questionText.textContent = getCopy().quiz.loadError;
  }
}

async function loadQuestionBank(level) {
  if (state.banks[level]) {
    return state.banks[level];
  }

  const response = await fetch(`${level}.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${level}.json`);
  }

  const bank = await response.json();
  validateQuestionBank(bank, level);
  state.banks[level] = bank;
  return bank;
}

function validateQuestionBank(bank, level) {
  if (!Array.isArray(bank) || bank.length < 100) {
    throw new Error(`${level}.json must contain at least 100 questions`);
  }

  bank.forEach((item, index) => {
    const answers = getLocalizedAnswers(item);
    if (!item.question || !Array.isArray(answers) || answers.length !== 4) {
      throw new Error(`${level}.json question ${index + 1} has invalid shape`);
    }
    if (!Number.isInteger(item.correct) || item.correct < 0 || item.correct > 3) {
      throw new Error(`${level}.json question ${index + 1} has invalid correct index`);
    }
  });
}

function prepareQuestion(rawQuestion) {
  const answers = getLocalizedAnswers(rawQuestion).map((text, originalIndex) => ({
    text,
    originalIndex,
  }));
  const shuffledAnswers = shuffle(answers);
  return {
    id: rawQuestion.question.ru || rawQuestion.question,
    text: getLocalizedText(rawQuestion.question),
    answers: shuffledAnswers,
    correctIndex: shuffledAnswers.findIndex(
      (answer) => answer.originalIndex === rawQuestion.correct,
    ),
    rawQuestion: rawQuestion
  };
}

function renderQuestion() {
  const quiz = state.quiz;
  const currentQuestion = quiz.questions[quiz.current];
  const { quiz: quizCopy } = getCopy();
  const currentNumber = quiz.current + 1;

  quiz.locked = false;
  dom.levelBadge.textContent = quizCopy[quiz.level];
  dom.questionCounter.textContent = quizCopy.counter
    .replace("{current}", currentNumber)
    .replace("{total}", QUESTION_COUNT);
  dom.progressFill.style.width = `${(quiz.current / QUESTION_COUNT) * 100}%`;
  dom.questionText.textContent = currentQuestion.text;

  dom.answersGrid.innerHTML = currentQuestion.answers
    .map(
      (answer, index) => `
        <button class="answer-button" type="button" data-answer-index="${index}">
          <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
          <span>${escapeHtml(answer.text)}</span>
        </button>
      `,
    )
    .join("");

  dom.answersGrid.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.answerIndex)));
  });
}

function selectAnswer(answerIndex) {
  const quiz = state.quiz;
  if (!quiz || quiz.locked) return;

  quiz.locked = true;
  const currentQuestion = quiz.questions[quiz.current];
  const isCorrect = answerIndex === currentQuestion.correctIndex;

  quiz.answersLog = quiz.answersLog || [];
  quiz.answersLog.push({
    questionId: currentQuestion.id,
    questionText: currentQuestion.text,
    selectedAnswerIndex: currentQuestion.answers[answerIndex].originalIndex,
    correctAnswerIndex: currentQuestion.rawQuestion.correct,
    isCorrect: isCorrect
  });

  if (isCorrect) {
    quiz.score += 1;
    try { AudioSynth.playCorrect(); } catch (e) {}
    try { navigator.vibrate?.(40); } catch (e) {}
  } else {
    try { AudioSynth.playWrong(); } catch (e) {}
    try { navigator.vibrate?.([80, 50, 80]); } catch (e) {}
  }

  dom.answersGrid.querySelectorAll(".answer-button").forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.correctIndex) {
      button.classList.add("correct");
    } else if (index === answerIndex) {
      button.classList.add("wrong");
    }
  });

  window.setTimeout(() => {
    quiz.current += 1;
    dom.progressFill.style.width = `${(quiz.current / QUESTION_COUNT) * 100}%`;

    if (quiz.current >= QUESTION_COUNT) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }, 850);
}

function finishQuiz() {
  const quiz = state.quiz;
  const duration = Math.round((Date.now() - state.quizStartTime) / 1000);

  if (quiz.level === "easy") {
    state.lastEasyScore = quiz.score;
  }

  window.EcoAnalytics.addQuizAttempt(quiz.level, quiz.score, duration, quiz.answersLog || []);
  renderResult(quiz.level, quiz.score);
}

function renderResult(level, score) {
  const copy = getCopy();
  const percent = Math.round((score / QUESTION_COUNT) * 100);
  const passed = score >= PASS_SCORE;

  dom.couponContainer.classList.add("hidden");

  const totalScore = (state.lastEasyScore || 0) + score;
  if (level === "medium" && totalScore >= 16) {
    dom.couponContainer.classList.remove("hidden");
    
    // Confetti blast and success vibration pattern
    try {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.65 },
          colors: ["#10b981", "#059669", "#3b82f6", "#f59e0b"]
        });
      }
      navigator.vibrate?.([100, 50, 100, 50, 200]);
    } catch (e) {}
    dom.couponBadge.textContent = copy.coupon.badge;
    dom.couponTitle.textContent = copy.coupon.title;
    dom.couponText.textContent = copy.coupon.text;
    dom.claimCouponButton.textContent = copy.coupon.claimBtn;
    dom.couponLabel.textContent = copy.coupon.codeLabel;
    dom.copyCouponButton.textContent = copy.coupon.copyBtn;
    dom.couponExpiry.textContent = copy.coupon.expiry;

    const alreadyClaimed = localStorage.getItem(STORAGE_KEYS.coupon) === "true";
    if (alreadyClaimed) {
      dom.couponCodeBox.classList.remove("hidden");
      dom.claimCouponButton.classList.add("hidden");
    } else {
      dom.couponCodeBox.classList.add("hidden");
      dom.claimCouponButton.classList.remove("hidden");
    }
  }

  dom.resultEyebrow.textContent = copy.result.eyebrow;
  dom.resultTitle.textContent =
    level === "easy"
      ? passed
        ? copy.result.easyPassedTitle
        : copy.result.easyFailedTitle
      : copy.result.mediumTitle;

  dom.resultMessage.textContent =
    level === "easy"
      ? passed
        ? copy.result.easyPassed
        : copy.result.easyFailed
      : passed
        ? copy.result.mediumHigh
        : copy.result.mediumLow;

  const resultCards = [
    {
      value: `${score}/${QUESTION_COUNT}`,
      label: copy.result.correct,
    },
    {
      value: `${percent}%`,
      label: copy.result.percent,
    },
    {
      value: String(score),
      label: copy.result.points,
    },
  ];

  if (level === "medium" && state.lastEasyScore !== null) {
    resultCards.push({
      value: `${state.lastEasyScore + score}/20`,
      label: copy.result.total,
    });
  }

  dom.resultGrid.innerHTML = resultCards
    .map(
      (item) => `
        <div class="result-card">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `,
    )
    .join("");

  dom.resultActions.innerHTML = "";
  if (level === "easy" && !passed) {
    addResultButton(copy.result.retry, "primary", () => startQuiz("easy"));
    addResultButton(copy.result.toInfo, "secondary", renderInfo);
  } else if (level === "easy" && passed) {
    addResultButton(copy.result.toMedium, "primary", () => startQuiz("medium"));
    addResultButton(copy.result.retry, "secondary", () => startQuiz("easy"));
  } else {
    addResultButton(copy.result.restart, "primary", () => startQuiz("easy"));
    addResultButton(copy.result.toInfo, "secondary", renderInfo);
  }

  showScreen("result");
}

function addResultButton(label, type, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = type === "primary" ? "primary-button" : "secondary-button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  dom.resultActions.appendChild(button);
}

function getLocalizedText(value) {
  if (typeof value === "string") return value;
  return value[state.lang] || value.ru || value.kk || "";
}

function getLocalizedAnswers(item) {
  if (Array.isArray(item.answers)) return item.answers;
  return item.answers?.[state.lang] || item.answers?.ru || item.answers?.kk || [];
}

function shuffle(items) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
  }
  return output;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
