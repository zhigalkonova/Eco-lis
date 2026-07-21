"use strict";

const QUESTION_COUNT = 10;
const PASS_SCORE = 8;
const VIDEO_ID = "i5FKDXPGk_Y";
const STORAGE_KEYS = {
  language: "ecoQrLanguage",
  videoWatched: "ecoQrVideoWatched",
  coupon: "ecoQrCouponClaimed",
};

const COPY = {
  ru: {
    code: "RU",
    brand: "Eco QR: Лисаковск",
    changeLanguage: "Сменить язык",
    info: {
      eyebrow: "Экология города",
      title: "Лисаковск: что важно знать о загрязнении среды",
      lead:
        "Короткий образовательный маршрут о воздухе, воде, отходах, здоровье и решениях для индустриального города на Тоболе.",
      continue: "Продолжить",
      sourcesLabel: "Источники",
      sourcesTitle: "Факты в блоке основаны на открытых материалах",
      facts: [
        {
          value: "1971",
          label:
            "год образования Лисаковска на базе Лисаковского горно-обогатительного комбината",
        },
        {
          value: "26,1 га",
          label:
            "площадь городского полигона ТБО, расположенного примерно в 4,5 км от города",
        },
        {
          value: "2024-2028",
          label:
            "период городской программы управления коммунальными отходами",
        },
        {
          value: "27%",
          label:
            "целевой уровень переработки ТБО к 2028 году в городской программе",
        },
      ],
      cards: [
        {
          icon: "🏭",
          title: "Промышленность и пыль",
          text:
            "Город вырос рядом с добывающими производствами. Поэтому для Лисаковска особенно важны контроль пыли, выбросов и аккуратная перевозка сырья.",
        },
        {
          icon: "🌬️",
          title: "Воздух",
          text:
            "В Костанайской области основные источники загрязнения связывают с горнодобывающими и теплоэнергетическими объектами, промышленностью и автотранспортом.",
        },
        {
          icon: "💧",
          title: "Вода и очистные сооружения",
          text:
            "В официальном реестре экологических проблем указана неэффективная работа существующих канализационных очистных сооружений Лисаковска и ряда городов области.",
        },
        {
          icon: "♻️",
          title: "Отходы",
          text:
            "Городская программа делает упор на раздельный сбор, сортировку, переработку и безопасное захоронение отходов вместо стихийного складирования.",
        },
        {
          icon: "🫁",
          title: "Здоровье",
          text:
            "Пыль, дым и выхлопы раздражают дыхательные пути, усиливают нагрузку на сердце и особенно опасны для детей, пожилых людей и людей с хроническими заболеваниями.",
        },
        {
          icon: "🌱",
          title: "Что помогает",
          text:
            "Системные решения: модернизация очистных сооружений, экологический мониторинг, озеленение, раздельный сбор, переработка и ответственное поведение жителей.",
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
      eyebrow: "Қала экологиясы",
      title: "Лисаковск: қоршаған ортаның ластануы туралы білу керек",
      lead:
        "Тобыл бойындағы индустриялық қала үшін ауа, су, қалдықтар, денсаулық және шешімдер туралы қысқа оқу маршруты.",
      continue: "Жалғастыру",
      sourcesLabel: "Дереккөздер",
      sourcesTitle: "Ақпарат ашық материалдарға негізделген",
      facts: [
        {
          value: "1971",
          label:
            "Лисаковск қаласының Лисаков кен-байыту комбинаты негізінде құрылған жылы",
        },
        {
          value: "26,1 га",
          label:
            "қаладан шамамен 4,5 км жерде орналасқан қатты тұрмыстық қалдықтар полигонының ауданы",
        },
        {
          value: "2024-2028",
          label:
            "коммуналдық қалдықтарды басқару жөніндегі қалалық бағдарламаның мерзімі",
        },
        {
          value: "27%",
          label:
            "2028 жылға қарай ТҚҚ қайта өңдеу бойынша қалалық бағдарламадағы мақсатты көрсеткіш",
        },
      ],
      cards: [
        {
          icon: "🏭",
          title: "Өнеркәсіп және шаң",
          text:
            "Қала кен өндіру өндірістерімен бірге дамыды. Сондықтан Лисаковск үшін шаңды, шығарындыларды және шикізатты тасымалдауды бақылау маңызды.",
        },
        {
          icon: "🌬️",
          title: "Ауа",
          text:
            "Қостанай облысында ластанудың негізгі көздері ретінде тау-кен, жылу-энергетика нысандары, өнеркәсіп және автокөлік аталады.",
        },
        {
          icon: "💧",
          title: "Су және тазарту құрылыстары",
          text:
            "Экологиялық проблемалардың ресми тізілімінде Лисаковск және облыстың бірқатар қалаларындағы кәріздік тазарту құрылыстарының тиімсіз жұмысы көрсетілген.",
        },
        {
          icon: "♻️",
          title: "Қалдықтар",
          text:
            "Қалалық бағдарлама қалдықтарды бөлек жинауға, сұрыптауға, қайта өңдеуге және қауіпсіз көмуге басымдық береді.",
        },
        {
          icon: "🫁",
          title: "Денсаулық",
          text:
            "Шаң, түтін және көлік газдары тыныс алу жолдарын тітіркендіреді, жүрекке салмақ түсіреді және балалар мен егде адамдар үшін қауіпті.",
        },
        {
          icon: "🌱",
          title: "Не көмектеседі",
          text:
            "Жүйелі шешімдер: тазарту құрылыстарын жаңғырту, экологиялық мониторинг, көгалдандыру, қалдықтарды бөлек жинау, қайта өңдеу және тұрғындардың жауапты әрекеті.",
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
    "videoNote",
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
  dom.videoNote.textContent = video.note;
  updateVideoGate();
  showScreen("video");
  loadYouTubePlayer();
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

function loadYouTubePlayer() {
  if (window.YT?.Player) {
    createYouTubePlayer();
    return;
  }

  window.onYouTubeIframeAPIReady = createYouTubePlayer;

  if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  clearTimeout(state.playerLoadTimer);
  state.playerLoadTimer = window.setTimeout(() => {
    if (!window.YT?.Player && state.currentScreen === "video") {
      const { video } = getCopy();
      dom.videoStatus.textContent = video.apiFailed;
      dom.videoStatus.className = "status-box warning";
    }
  }, 9000);
}

function createYouTubePlayer() {
  clearTimeout(state.playerLoadTimer);

  if (state.player) {
    const { video } = getCopy();
    if (!state.videoWatched) {
      dom.videoStatus.textContent = video.waiting;
      dom.videoStatus.className = "status-box";
    }
    return;
  }

  state.player = new window.YT.Player("youtube-player", {
    videoId: VIDEO_ID,
    playerVars: {
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        if (!state.videoWatched) {
          const { video } = getCopy();
          dom.videoStatus.textContent = video.waiting;
          dom.videoStatus.className = "status-box";
        }
      },
      onStateChange: (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
          state.videoPlayStartTime = Date.now();
        } else if (
          event.data === window.YT.PlayerState.PAUSED ||
          event.data === window.YT.PlayerState.ENDED
        ) {
          if (state.videoPlayStartTime) {
            const elapsed = Math.round((Date.now() - state.videoPlayStartTime) / 1000);
            state.videoWatchDurationTotal = (state.videoWatchDurationTotal || 0) + elapsed;
            state.videoPlayStartTime = null;
            window.EcoAnalytics.updateAnalytics({ videoWatchTime: state.videoWatchDurationTotal });
          }
          if (event.data === window.YT.PlayerState.ENDED) {
            markVideoWatched();
          }
        }
      },
    },
  });
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

  if (level === "medium" && passed) {
    dom.couponContainer.classList.remove("hidden");
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
