"use strict";

const QUESTION_COUNT = 10;
const PASS_SCORE = 8;
const VIDEO_ID = "QR2bG2Ahpr4"; // Единое видео для обоих языков
const STORAGE_KEYS = {
  language: "ecoQrLanguage",
  videoWatched: "ecoQrVideoWatched",
  coupon: "ecoQrCouponClaimed",
  couponData: "ecoQrCouponData",
};

const PARTNERS = [
  {
    id: "coffee",
    icon: "☕",
    name: { ru: "Кофейня «Тобол»", kk: "«Тобыл» кофеханасы" },
    discount: "20%",
    desc: { ru: "Скидка 20% на кофе, чай и десерты", kk: "Кофе, шай және десерттерге 20% жеңілдік" }
  },
  {
    id: "fok",
    icon: "🏋️",
    name: { ru: "ФОК Лисаковск", kk: "Лисаковск ДСК" },
    discount: "20%",
    desc: { ru: "Скидка 20% на бассейн и тренажерный зал", kk: "Бассейнге немесе спортзалға 20% жеңілдік" }
  },
  {
    id: "ecomarket",
    icon: "🍏",
    name: { ru: "Эко-Маркет «Жасыл»", kk: "«Жасыл» Эко-Маркеті" },
    discount: "15%",
    desc: { ru: "Скидка 15% на всю эко-продукцию", kk: "Барлық эко-өнімдерге 15% жеңілдік" }
  },
  {
    id: "culture",
    icon: "🎭",
    name: { ru: "Дворец культуры", kk: "Мәдениет сарайы" },
    discount: "20%",
    desc: { ru: "Скидка 20% на билеты мероприятий", kk: "Мәдени іс-шаралар билеттеріне 20% жеңілдік" }
  }
];

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
    brand: "EcoQadam",
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
    rudny: {
      eyebrow: "Индустриальная гордость",
      title: "Лисаковск: созидание и промышленность",
      lead: "Узнайте больше о промышленном сердце нашего города, его градообразующем предприятии и культурных объектах.",
      facts: [
        { value: "ЛГОК", label: "Лисаковский горно-обогатительный комбинат — основа промышленности и экономики нашего города" },
        { value: "1969 год", label: "начало строительства комбината, давшего мощный толчок развитию всего региона" },
        { value: "10 000+", label: "экспонатов хранится в Лисаковском музее истории и культуры Верхнего Притоболья" },
        { value: "Арена", label: "городские стадионы и спортивные центры объединяют сотни любителей здорового образа жизни" }
      ],
      cards: [
        { icon: "🏭", title: "Лисаковский ГОК", text: "ЛГОК перерабатывает оолитовые бурые железняки, обеспечивая сырьем крупнейшие металлургические заводы Казахстана." },
        { icon: "🏛️", title: "Краеведческий музей", text: "Хранит уникальные артефакты андроновской культуры и рассказывает о славном пути первостроителей Лисаковска." },
        { icon: "🎭", title: "Дворец культуры", text: "Центр культурной жизни города, где проходят праздники, выставки и работают творческие студии для детей и взрослых." },
        { icon: "⛲", title: "Благоустройство", text: "Лисаковск по праву считается одним из самых благоустроенных, чистых и зеленых городов Костанайской области." },
        { icon: "💧", title: "Чистая вода", text: "Лисаковское водохранилище и современные фильтровальные станции надежно обеспечивают город чистой питьевой водой." },
        { icon: "👟", title: "Спорт для всех", text: "Современный спортивный комплекс и спортивные площадки во дворах помогают развивать молодежный спорт и здоровье жителей." }
      ]
    },
    tazaKz: {
      eyebrow: "Общенациональная эко-кампания",
      title: "Таза Қазақстан: забота о природе и будущем",
      lead: "Экологическая культура начинается с каждого из нас. Узнайте, почему важно сохранять природу нашей родины.",
      facts: [
        { value: "5 недель", label: "тематических этапов чистоты объединили людей по всей стране" },
        { value: "3 млн+", label: "саженцев высажено по всему Казахстану в рамках зеленых недель" },
        { value: "27%", label: "целевой уровень переработки твердых бытовых отходов по всей республике" },
        { value: "Чистый воздух", label: "сохранение лесов помогает снизить уровень углекислого газа и улучшить экологию" }
      ],
      cards: [
        { icon: "🗑️", title: "Сортировка", text: "Борьба с пластиком начинается с сортировки. Бумага, пластик и металл должны отправляться на переработку." },
        { icon: "💧", title: "Чистая вода", text: "Охрана водоемов и родников бережет питьевую воду для людей и сохраняет жизнь речным обитателям." },
        { icon: "🌳", title: "Лесопосадки", text: "Деревья — легкие планеты. Каждое посаженное дерево борется с пылью и делает воздух чище." },
        { icon: "🧹", title: "Чистая территория", text: "Уборка мусора в парках и на улицах сохраняет чистоту почвы и оберегает животных от травм." },
        { icon: "🌱", title: "Эко-культура", text: "Бережное отношение к воде, свету и природе в повседневной жизни формирует культуру ответственного гражданина." },
        { icon: "✨", title: "Будущее поколение", text: "Сохраняя природу сегодня, мы оставляем чистую, зеленую и здоровую планету для наших детей." }
      ]
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
        "Отличный результат: вы прекрасно знаете историю, природу и эко-культуру Лисаковска!",
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
    brand: "EcoQadam",
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
    rudny: {
      eyebrow: "Индустриалды мақтаныш",
      title: "Лисаковск: жасампаздық пен өнеркәсіп",
      lead: "Қаламыздың өнеркәсіптік жүрегі, оның қала құраушы кәсіпорны және мәдени нысандары туралы көбірек біліңіз.",
      facts: [
        { value: "ЛКБК", label: "Лисаков кен-байыту комбинаты — қаламыздың өнеркәсібі мен экономикасының негізі" },
        { value: "1969 жыл", label: "бүкіл аймақтың дамуына қуатты серпін берген комбинат құрылысының басталуы" },
        { value: "10 000+", label: "Жоғарғы Тобыл тарихы мен мәдениеті мұражайында сақталған жәдігерлер саны" },
        { value: "Арена", label: "қалалық стадиондар мен спорт орталықтары салауатты өмір салтын ұстанатындарды біріктіреді" }
      ],
      cards: [
        { icon: "🏭", title: "Лисаков КБК", text: "ЛКБК Қазақстанның ірі металлургиялық зауыттарын шикізатпен қамтамасыз ете отырып, оолитті қоңыр темір кенін өңдейді." },
        { icon: "🏛️", title: "Өлкетану мұражайы", text: "Андронов мәдениетінің бірегей жәдігерлерін сақтайды және Лисаковскінің алғашқы құрылысшылары туралы сыр шертеді." },
        { icon: "🎭", title: "Мәдениет сарайы", text: "Мерекелер, көрмелер өтетін және балалар мен ересектерге арналған шығармашылық студиялар жұмыс істейтін қаланың мәдени орталығы." },
        { icon: "⛲", title: "Абаттандыру", text: "Лисаковск Қостанай облысындағы ең абаттандырылған, таза және жасыл қалалардың бірі болып саналады." },
        { icon: "💧", title: "Таза су", text: "Лисаков су қоймасы және заманауи сүзгі станциялары қаланы таза ауыз сумен сенімді түрде қамтамасыз етеді." },
        { icon: "👟", title: "Спорт баршаға", text: "Заманауи спорт кешені және аулалардағы спорт алаңдары жастар спорты мен тұрғындардың денсаулығын дамытуға көмектеседі." }
      ]
    },
    tazaKz: {
      eyebrow: "Жалпыұлттық эко-науқан",
      title: "Таза Қазақстан: табиғат пен болашаққа қамқорлық",
      lead: "Экологиялық мәдениет әрқайсымыздан басталады. Отанымыздың табиғатын сақтау неге маңызды екенін біліңіз.",
      facts: [
        { value: "5 апта", label: "тазалықтың тақырыптық кезеңдері бүкіл ел бойынша адамдардың басын біріктірді" },
        { value: "3 млн+", label: "жасыл апталықтар аясында Қазақстан бойынша отырғызылған көшеттер саны" },
        { value: "27%", label: "республика бойынша қатты тұрмыстық қалдықтарды қайта өңдеудің мақсатты деңгейі" },
        { value: "Таза ауа", label: "ормандарды сақтау көмірқышқыл газының деңгейін азайтып, экологияны жақсартуға көмектеседі" }
      ],
      cards: [
        { icon: "🗑️", title: "Сұрыптау", text: "Пластикпен күрес сұрыптаудан басталады. Қағаз, пластик және металл қайта өңдеуге жіберілуі керек." },
        { icon: "💧", title: "Таза су", text: "Су қоймалары мен бұлақтарды қорғау ауыз суды сақтайды және өзен жәндіктерінің тіршілігін қорғайды." },
        { icon: "🌳", title: "Жасыл желек", text: "Ағаштар — планетаның өкпесі. Әрбір отырғызылған ағаш шаңмен күресіп, ауаны тазартады." },
        { icon: "🧹", title: "Таза аумақ", text: "Саябақтар мен көшелерді тазалау топырақтың ластануын бәсеңдетіп, жануарларды жарақаттан қорғайды." },
        { icon: "🌱", title: "Эко-мәдениет", text: "Күнделікті өмірде суды, жарықты және табиғатты үнемдеу жауапты азаматтың мәдениетін қалыптастырады." },
        { icon: "✨", title: "Болашақ ұрпақ", text: "Бүгін табиғатты сақтай отырып, біз балаларымызға таза, жасыл және сау планетаны қалдырамыз." }
      ]
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
        "Тамаша нәтиже: сіз Лисаковскінің тарихын, табиғатын және эко-мәдениетін өте жақсы білесіз!",
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
    "partnerSelectorBox",
    "partnerSelectTitle",
    "partnerGrid",
    "claimCouponButton",
    "couponCodeBox",
    "couponLabel",
    "couponCode",
    "copyCouponButton",
    "couponStatusBadgeWrapper",
    "couponExpiry",
    "rudnyScreen",
    "rudnyEyebrow",
    "rudnyTitle",
    "rudnyLead",
    "rudnyFactsGrid",
    "rudnyCards",
    "rudnyBackButton",
    "rudnyContinueButton",
    "tazaKzScreen",
    "tazaKzEyebrow",
    "tazaKzTitle",
    "tazaKzLead",
    "tazaKzFactsGrid",
    "tazaKzCards",
    "tazaKzBackButton",
    "tazaKzContinueButton",
    "scoreRingFill",
    "scoreTextVal",
    "scoreTextSub",
    "reviewContainer",
    "reviewList",
    "reviewTitle",
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

  const backLabel = state.lang === "kk" ? "Артқа" : "Назад";
  const continueLabel = state.lang === "kk" ? "Жалғастыру" : "Продолжить";
  dom.rudnyBackButton.textContent = backLabel;
  dom.tazaKzBackButton.textContent = backLabel;
  dom.rudnyContinueButton.textContent = continueLabel;
  dom.tazaKzContinueButton.textContent = continueLabel;

  dom.continueButton.addEventListener("click", renderRudny);
  dom.rudnyBackButton.addEventListener("click", renderInfo);
  dom.rudnyContinueButton.addEventListener("click", renderTazaKz);
  dom.tazaKzBackButton.addEventListener("click", renderRudny);
  dom.tazaKzContinueButton.addEventListener("click", renderVideo);
  dom.videoBackButton.addEventListener("click", renderTazaKz);
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
  if (!state.selectedPartner) return;

  dom.claimCouponButton.disabled = true;
  dom.claimCouponButton.textContent = "Сохранение...";

  const partnerName = getLocalizedText(state.selectedPartner.name);
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const code = `EQ-${randomDigits}`;

  const couponData = {
    code,
    partnerId: state.selectedPartner.id,
    partnerName,
    discount: state.selectedPartner.discount,
    used: false
  };

  localStorage.setItem(STORAGE_KEYS.coupon, "true");
  localStorage.setItem(STORAGE_KEYS.couponData, JSON.stringify(couponData));

  await window.EcoAnalytics.createCoupon(couponData);
  await window.EcoAnalytics.updateAnalytics({
    coupon: true,
    couponTime: new Date().toISOString()
  });

  await renderCouponSection();
}

async function renderCouponSection() {
  const copy = getCopy();
  dom.couponBadge.textContent = copy.coupon.badge;
  dom.couponTitle.textContent = copy.coupon.title;
  dom.couponText.textContent = copy.coupon.text;
  dom.couponLabel.textContent = copy.coupon.codeLabel;
  dom.copyCouponButton.textContent = copy.coupon.copyBtn;
  dom.couponExpiry.textContent = copy.coupon.expiry;

  let savedCouponData = null;
  try {
    savedCouponData = JSON.parse(localStorage.getItem(STORAGE_KEYS.couponData) || "null");
  } catch (e) {}

  if (savedCouponData && savedCouponData.code) {
    dom.partnerSelectorBox.classList.add("hidden");
    dom.claimCouponButton.classList.add("hidden");
    dom.couponCodeBox.classList.remove("hidden");
    dom.couponCode.textContent = savedCouponData.code;

    const liveCoupon = await window.EcoAnalytics.getCoupon(savedCouponData.code);
    const isUsed = liveCoupon ? liveCoupon.used : savedCouponData.used;
    const partnerName = (liveCoupon && liveCoupon.partnerName) || savedCouponData.partnerName;
    const usedBy = (liveCoupon && liveCoupon.usedByPartner) || partnerName;
    const usedAtDate = liveCoupon && liveCoupon.usedAt ? new Date(liveCoupon.usedAt).toLocaleString('ru-RU') : '';

    if (isUsed) {
      dom.couponStatusBadgeWrapper.innerHTML = `
        <div class="coupon-status-badge used">
          🔴 ПОГАШЕН (${escapeHtml(usedBy)}${usedAtDate ? ' ' + usedAtDate : ''})
        </div>
      `;
    } else {
      dom.couponStatusBadgeWrapper.innerHTML = `
        <div class="coupon-status-badge active">
          🟢 АКТИВЕН — ${escapeHtml(partnerName)} (Единоразовое списание)
        </div>
      `;
    }
  } else {
    dom.couponCodeBox.classList.add("hidden");
    dom.partnerSelectorBox.classList.remove("hidden");
    dom.claimCouponButton.classList.remove("hidden");
    dom.claimCouponButton.disabled = true;
    dom.claimCouponButton.textContent = state.lang === "kk" ? "Жоғарыдан мекемені таңдаңыз" : "Выберите заведение выше";
    state.selectedPartner = null;

    renderPartnerGrid();
  }
}

function renderPartnerGrid() {
  const selectTitle = state.lang === "kk" 
    ? "Жеңілдікті қолдану үшін 4 серіктестің 1 мекемесін таңдаңыз:" 
    : "Выберите 1 заведение из 4 партнеров для применения скидки:";
  dom.partnerSelectTitle.textContent = selectTitle;

  dom.partnerGrid.innerHTML = PARTNERS.map(partner => {
    const isSelected = state.selectedPartner?.id === partner.id;
    const partnerName = getLocalizedText(partner.name);
    const desc = getLocalizedText(partner.desc);
    return `
      <div class="partner-card ${isSelected ? 'selected' : ''}" data-partner-id="${partner.id}">
        <div>
          <div class="partner-card-icon">${partner.icon}</div>
          <div class="partner-card-title">${escapeHtml(partnerName)}</div>
          <span class="partner-card-discount">Скидка ${partner.discount}</span>
        </div>
        <div class="partner-card-desc">${escapeHtml(desc)}</div>
      </div>
    `;
  }).join("");

  dom.partnerGrid.querySelectorAll(".partner-card").forEach(card => {
    card.addEventListener("click", () => {
      const pId = card.dataset.partnerId;
      state.selectedPartner = PARTNERS.find(p => p.id === pId);
      renderPartnerGrid();
      if (state.selectedPartner) {
        const partnerName = getLocalizedText(state.selectedPartner.name);
        dom.claimCouponButton.disabled = false;
        const btnText = state.lang === "kk"
          ? `${partnerName} үшін жеңілдік алу`
          : `Получить скидку ${state.selectedPartner.discount} в ${partnerName}`;
        dom.claimCouponButton.textContent = btnText;
      }
    });
  });
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
    rudny: dom.rudnyScreen,
    tazaKz: dom.tazaKzScreen,
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

function renderRudny() {
  const copy = getCopy();
  applyLanguage();
  
  dom.rudnyEyebrow.textContent = copy.rudny.eyebrow;
  dom.rudnyTitle.textContent = copy.rudny.title;
  dom.rudnyLead.textContent = copy.rudny.lead;
  
  dom.rudnyFactsGrid.innerHTML = copy.rudny.facts.map(fact => `
    <article class="fact-card">
      <p class="fact-value">${escapeHtml(fact.value)}</p>
      <p class="fact-label">${escapeHtml(fact.label)}</p>
    </article>
  `).join("");
  
  dom.rudnyCards.innerHTML = copy.rudny.cards.map(card => `
    <article class="info-card">
      <div class="card-icon" aria-hidden="true">${card.icon}</div>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
  
  showScreen("rudny");
}

function renderTazaKz() {
  const copy = getCopy();
  applyLanguage();
  
  dom.tazaKzEyebrow.textContent = copy.tazaKz.eyebrow;
  dom.tazaKzTitle.textContent = copy.tazaKz.title;
  dom.tazaKzLead.textContent = copy.tazaKz.lead;
  
  dom.tazaKzFactsGrid.innerHTML = copy.tazaKz.facts.map(fact => `
    <article class="fact-card">
      <p class="fact-value">${escapeHtml(fact.value)}</p>
      <p class="fact-label">${escapeHtml(fact.label)}</p>
    </article>
  `).join("");
  
  dom.tazaKzCards.innerHTML = copy.tazaKz.cards.map(card => `
    <article class="info-card">
      <div class="card-icon" aria-hidden="true">${card.icon}</div>
      <h2>${escapeHtml(card.title)}</h2>
      <p>${escapeHtml(card.text)}</p>
    </article>
  `).join("");
  
  showScreen("tazaKz");
}

function renderVideo() {
  const { video } = getCopy();
  applyLanguage();
  dom.videoEyebrow.textContent = video.eyebrow;
  dom.videoTitle.textContent = video.title;
  dom.videoLead.textContent = video.lead;
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

  const videoId = VIDEO_ID;

  if (state.player) {
    const { video } = getCopy();
    if (!state.videoWatched) {
      dom.videoStatus.textContent = video.waiting;
      dom.videoStatus.className = "status-box";
    }
    try {
      const currentUrl = state.player.getVideoUrl?.();
      if (currentUrl && !currentUrl.includes(videoId)) {
        state.player.cueVideoById(videoId);
      }
    } catch (e) {
      console.warn("Could not cue new video, replacing player instance:", e);
      try { state.player.destroy(); } catch (err) {}
      state.player = null;
      setTimeout(createYouTubePlayer, 100);
    }
    return;
  }

  state.player = new window.YT.Player("youtube-player", {
    videoId: videoId,
    playerVars: {
      controls: 1, // Показывает элементы управления
      fs: 1,       // Разрешает полноэкранный режим
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
    state.askedQuestions = state.askedQuestions || {};
    state.askedQuestions[level] = state.askedQuestions[level] || new Set();

    let pool = bank.filter(q => !state.askedQuestions[level].has(q.question.ru || q.question));
    if (pool.length < QUESTION_COUNT) {
      state.askedQuestions[level].clear();
      pool = [...bank];
    }

    const selectedRaw = shuffle(pool).slice(0, QUESTION_COUNT);
    selectedRaw.forEach(q => state.askedQuestions[level].add(q.question.ru || q.question));

    const selected = selectedRaw.map(prepareQuestion);
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
  if (!Array.isArray(bank) || bank.length < 10) {
    throw new Error(`${level}.json must contain at least 10 questions`);
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
    isCorrect: isCorrect,
    shuffledAnswers: currentQuestion.answers.map(a => a.text),
    selectedShuffledIndex: answerIndex,
    correctShuffledIndex: currentQuestion.correctIndex
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

  if (duration < 5) {
    console.warn("Quiz completion speed anomaly detected. Potential bot activity.");
    state.isBotSuspicion = true;
  } else {
    state.isBotSuspicion = false;
  }

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
  if (level === "medium" && totalScore >= 16 && !state.isBotSuspicion) {
    dom.couponContainer.classList.remove("hidden");
    const couponCard = dom.couponContainer.querySelector(".coupon-card");
    if (couponCard) {
      couponCard.classList.add("pulse-active");
    }
    
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
    renderCouponSection();
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

  // Animate circular progress ring
  const ringFill = dom.scoreRingFill;
  const valSpan = dom.scoreTextVal;
  const subSpan = dom.scoreTextSub;
  if (ringFill && valSpan && subSpan) {
    subSpan.textContent = state.lang === "kk" ? "Дұрыс" : "Правильно";
    const circumference = 2 * Math.PI * 50; // 314.159
    ringFill.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (percent / 100) * circumference;
    
    setTimeout(() => {
      ringFill.style.strokeDashoffset = `${offset}`;
    }, 100);

    let currentVal = 0;
    const duration = 1500;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = percent / steps;
    const timer = setInterval(() => {
      currentVal += increment;
      if (currentVal >= percent) {
        currentVal = percent;
        clearInterval(timer);
      }
      valSpan.textContent = `${Math.round(currentVal)}%`;
    }, stepTime);
  }

  // Populate Quiz Review
  dom.reviewContainer.classList.add("hidden");
  if (level === "medium" && state.quiz?.answersLog) {
    dom.reviewContainer.classList.remove("hidden");
    dom.reviewTitle.textContent = state.lang === "kk" ? "Жауаптарды талдау" : "Разбор ваших ответов";
    
    dom.reviewList.innerHTML = state.quiz.answersLog.map((log, index) => {
      const qNum = index + 1;
      const choicesHtml = log.shuffledAnswers.map((ansText, aIdx) => {
        let statusClass = "normal";
        let badgeHtml = "";
        
        if (aIdx === log.correctShuffledIndex) {
          statusClass = "correct";
          badgeHtml = `<span class="review-badge correct">${state.lang === "kk" ? "Дұрыс" : "Верно"}</span>`;
        } else if (aIdx === log.selectedShuffledIndex && !log.isCorrect) {
          statusClass = "wrong";
          badgeHtml = `<span class="review-badge wrong">${state.lang === "kk" ? "Қате" : "Ваш ответ"}</span>`;
        }
        
        const letter = String.fromCharCode(65 + aIdx);
        return `
          <div class="review-ans-row ${statusClass}">
            <span class="answer-letter" style="width:1.6rem;height:1.6rem;font-size:0.75rem;">${letter}</span>
            <span style="flex-grow:1">${escapeHtml(ansText)}</span>
            ${badgeHtml}
          </div>
        `;
      }).join("");
      
      return `
        <div class="review-item">
          <p class="review-q-text">${qNum}. ${escapeHtml(log.questionText)}</p>
          <div class="review-answers">${choicesHtml}</div>
        </div>
      `;
    }).join("");
  }

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
