// Geo Music Player Pro — iOS Edition (Clean Start + Full Features + Dual iOS Audio Engine)
(function () {
  'use strict';

  let scClientId = localStorage.getItem('geo_ios_sc_cid') || '39AVoiZVrdvJEMFLH8T0c5WGshQaAPRJ';
  let currentLang = localStorage.getItem('geo_ios_lang') || 'ar';
  let currentTheme = localStorage.getItem('geo_ios_theme') || 'neon';

  const IS_IOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const SVG_PLAY = `<path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"/>`;
  const SVG_PAUSE = `<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>`;
  const SVG_HEART_FILL = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  const SVG_HEART_OUTLINE = `<svg viewBox="0 0 24 24"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`;
  const SVG_CHECK = `<svg viewBox="0 0 16 16"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z"/></svg>`;
  const SVG_DOWNLOAD = `<svg viewBox="0 0 16 16"><path d="M8.75 1.75a.75.75 0 0 0-1.5 0v6.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V1.75z"/><path d="M3.5 11.75a.75.75 0 0 0-1.5 0v1.5A1.75 1.75 0 0 0 3.75 15h8.5A1.75 1.75 0 0 0 14 13.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25v-1.5z"/></svg>`;
  const SVG_CLOCK = `<svg viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg>`;

  const DEFAULT_COVER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#7c5cff"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="50%" y="54%" font-size="170" font-family="-apple-system, Segoe UI" font-weight="900" text-anchor="middle" dominant-baseline="middle" fill="#fff">G</text></svg>`
    );

  const I18N = {
    ar: {
      brandSub: 'iOS PRO STUDIO • CLEAN',
      artistsSection: 'نجوم المنصة',
      addArtistBtn: 'إضافة مغني',
      artistInputPlaceholder: 'اكتب أول حرف من اسم المغني...',
      confirmAddArtist: 'إضافة',
      navHome: 'الرئيسية',
      offlineNav: 'المحفوظة',
      favsNav: 'المفضلة',
      localNav: 'ملفاتي',
      navStudio: 'الاستوديو',
      optionsBtn: 'الإعدادات',
      optionsSheetTitle: 'الإعدادات والمكتبة',
      optTheme: 'ثيم البرنامج (Theme)',
      optLang: 'اللغة (Language)',
      addMusicBtn: 'Add Music (إضافة أغاني)',
      uploadTitle: '+ اختر ملفات صوتية من الآيفون',
      uploadSub: 'MP3 / WAV / M4A',
      importFromIphone: '+ استيراد ملفات صوتية من تطبيق Files بالآيفون',
      clearOfflineCache: 'مسح جميع الأغاني المحفوظة بدون نت',
      searchPlaceholder: 'ابحث عن أي أغنية أو مطرب لتحميلها أونلاين/أوفلاين...',
      searchHistoryTitle: 'سجل البحث الأخير',
      clearHistory: 'مسح الكل',
      autoSaveBanner: 'الحفظ التلقائي على جهازك: مفعّل',
      playingOfflineBanner: 'أوفلاين من جهازك',
      streamingBanner: 'بث مباشر أونلاين',
      savingBanner: 'جاري الحفظ للآيفون',
      savedBanner: 'محفوظة على جهازك',
      playAll: 'تشغيل الكل',
      karaokeOff: 'وضع الكاريوكي',
      karaokeOn: 'الكاريوكي مفعّل',
      readyToPlay: 'جاهز للتشغيل',
      tabEq: 'الإيكولايزر',
      tabQueue: 'الانتظار',
      tabDsp: 'مؤثرات 8D',
      presetFlat: 'Flat Studio',
      presetMahraganat: 'مهرجانات',
      presetTarab: 'طرب وإحساس',
      presetBass: 'Bass Boost',
      presetPop: 'Pop Master',
      presetRock: 'Rock Arena',
      presetElectronic: 'Electronic',
      presetCinema: 'Dolby Cinema',
      vizBars: 'Spectrum Bars',
      vizWave: 'Neon Wave',
      vizRing: 'Sonic Ring',
      bassBoost: 'تعزيز الباص العميق (Sub-Bass)',
      reverbLabelTitle: 'صدى قاعة الحفلات (Concert Reverb)',
      spatial3D: 'وسع المسرح الصوتي (3D Widener)',
      speedPitch: 'سرعة التشغيل (Playback Speed)',
      orbit8DOff: 'صوت 8D محيطي: متوقف',
      orbit8DOn: 'صوت 8D محيطي: مفعّل',
      compressorOff: 'مكبر الصوت الذكي: متوقف',
      compressorOn: 'مكبر الصوت الذكي: مفعّل',
      saveOfflineBtn: 'حفظ بدون نت',
      offlineBadge: 'محفوظة',
      unsaveBtn: 'حذف',
      savingBadge: 'جاري الحفظ',
      emptyList: 'القائمة فارغة — ابحث عن أغانيك المفضلة أو شغّل أي أغنية وسيتم حفظها لك هنا بدون نت!',
      loadingCatalog: 'جاري تحميل أحدث الأغاني...',
      offlineHeroTag: 'مكتبتك الخاصة على الآيفون (100% بدون نت)',
      offlineHeroTitle: 'الأغاني المحفوظة على جهازك',
      offlineHeroDesc: 'هذه المساحة تبدأ فارغة تماماً لتحفظ فيها الأغاني التي تحبها أنت فقط وتستمع لها بدون نت',
      favsHeroTag: 'مكتبتك المفضلة',
      favsHeroTitle: 'الأغاني المفضلة',
      favsHeroDesc: 'أغانيك المفضلة للوصول السريع',
      localHeroTag: 'تطبيق الملفات (Files)',
      localHeroTitle: 'ملفات الصوت المحلية',
      localHeroDesc: 'استمع لملفات الصوت الموجودة على الآيفون مع كامل مؤثرات 8D والإيكولايزر'
    },
    en: {
      brandSub: 'iOS PRO STUDIO • CLEAN',
      artistsSection: 'Featured Artists',
      addArtistBtn: 'Add Artist',
      artistInputPlaceholder: 'Type first letter of artist name...',
      confirmAddArtist: 'Add',
      navHome: 'Discover',
      offlineNav: 'Offline',
      favsNav: 'Favorites',
      localNav: 'Files',
      navStudio: 'Studio FX',
      optionsBtn: 'Options',
      optionsSheetTitle: 'Settings & Library',
      optTheme: 'App Theme',
      optLang: 'Language',
      addMusicBtn: 'Add Music',
      uploadTitle: '+ Pick Audio Files from iPhone',
      uploadSub: 'MP3 / WAV / M4A',
      importFromIphone: '+ Import Audio from iPhone Files App',
      clearOfflineCache: 'Clear All Offline Saved Tracks',
      searchPlaceholder: 'Search any song or artist to play & save offline...',
      searchHistoryTitle: 'Recent Searches',
      clearHistory: 'Clear All',
      autoSaveBanner: 'iPhone Auto-Save Offline: Active',
      playingOfflineBanner: 'Saved Offline',
      streamingBanner: 'Streaming',
      savingBanner: 'Saving Offline',
      savedBanner: 'Saved on iPhone',
      playAll: 'Play All',
      karaokeOff: 'Karaoke Mode',
      karaokeOn: 'Karaoke ON',
      readyToPlay: 'Ready to play',
      tabEq: 'Equalizer',
      tabQueue: 'Queue',
      tabDsp: '8D & Studio FX',
      presetFlat: 'Flat Studio',
      presetMahraganat: 'Festival Bass',
      presetTarab: 'Vocal / Tarab',
      presetBass: 'Bass Boost',
      presetPop: 'Pop Master',
      presetRock: 'Rock Arena',
      presetElectronic: 'Electronic',
      presetCinema: 'Dolby Cinema',
      vizBars: 'Spectrum Bars',
      vizWave: 'Neon Wave',
      vizRing: 'Sonic Ring',
      bassBoost: 'Sub-Bass Boost',
      reverbLabelTitle: 'Concert Hall Reverb',
      spatial3D: '3D Stereo Widener',
      speedPitch: 'Playback Speed',
      orbit8DOff: '8D Audio Orbit: OFF',
      orbit8DOn: '8D Audio Orbit: ON',
      compressorOff: 'Mastering Boost: OFF',
      compressorOn: 'Mastering Boost: ON',
      saveOfflineBtn: 'Save Offline',
      offlineBadge: 'Offline',
      unsaveBtn: 'Remove',
      savingBadge: 'Saving',
      emptyList: 'No tracks saved yet — search or play any song you love to save it cleanly for offline playback!',
      loadingCatalog: 'Loading fresh high-quality tracks...',
      offlineHeroTag: 'Your Personal iPhone Library (100% Clean)',
      offlineHeroTitle: 'Your Saved Offline Tracks',
      offlineHeroDesc: 'Starts completely clean so you only store and keep the songs you choose on your iPhone',
      favsHeroTag: 'Your Favorites',
      favsHeroTitle: 'Liked Songs',
      favsHeroDesc: 'Your favorite songs in one place',
      localHeroTag: 'iPhone Files App',
      localHeroTitle: 'Local Audio Files',
      localHeroDesc: 'Play local MP3/M4A/WAV files with full 10-Band EQ, 8D Orbit & Karaoke'
    }
  };

  const tStr = (key) => (I18N[currentLang] && I18N[currentLang][key]) || I18N.ar[key] || key;

  const BASE_ARTISTS = [
    {
      id: 'all',
      nameAr: 'مكس النجوم (الكل)',
      nameEn: 'All Stars Mix',
      subAr: 'أغاني كاملة',
      subEn: 'Full Tracks',
      tagAr: 'مكتبة نظيفة جاهزة لاختياراتك',
      tagEn: 'Clean Library Ready for Your Taste',
      descAr: 'ابحث أو شغّل أي أغنية لتحفظها على جهازك iPhone وتستمع إليها بدون إنترنت',
      descEn: 'Search or play any song to save it cleanly on your iPhone for offline playback',
      queries: []
    },
    {
      id: 'hamo',
      nameAr: 'حمو المرشدي',
      nameEn: 'Hamo El Morshedy',
      subAr: 'مهرجانات',
      subEn: 'Mahraganat',
      tagAr: 'أغاني حمو المرشدي الكاملة',
      tagEn: 'Hamo El Morshedy Full Tracks',
      descAr: 'أشهر مهرجانات وأغاني حمو المرشدي الكاملة',
      descEn: 'Hamo El Morshedy full tracks',
      queries: ['حمو المرشدي', 'Hamo El Morshedy']
    },
    {
      id: 'sherine',
      nameAr: 'شيرين عبد الوهاب',
      nameEn: 'Sherine Abdel Wahab',
      subAr: 'طرب وإحساس',
      subEn: 'Tarab',
      tagAr: 'أغاني شيرين عبد الوهاب الكاملة',
      tagEn: 'Sherine Full Tracks',
      descAr: 'على بالي • كلام عينيه • صبري قليل • مشاعر',
      descEn: '3ala Bali • Kalam Eneih • Sabry Aalil • Mashaer',
      queries: ['شيرين عبد الوهاب', 'شيرين على بالي كلام عينيه صبري قليل']
    },
    {
      id: 'tamer',
      nameAr: 'تامر عاشور',
      nameEn: 'Tamer Ashour',
      subAr: 'دراما ورومانسية',
      subEn: 'Romance',
      tagAr: 'أغاني تامر عاشور الكاملة',
      tagEn: 'Tamer Ashour Full Tracks',
      descAr: 'هيجيلي موجوع • قولوله سماح • مكرهتوش',
      descEn: 'Haygely Mawgoua • Qoloulo Samah • Makrehtosh',
      queries: ['تامر عاشور', 'تامر عاشور هيجيلي موجوع قولوله سماح']
    },
    {
      id: 'cairokee',
      nameAr: 'كايروكي',
      nameEn: 'Cairokee',
      subAr: 'روك وإندي',
      subEn: 'Rock & Indie',
      tagAr: 'أغاني كايروكي الكاملة',
      tagEn: 'Cairokee Official Tracks',
      descAr: 'بسرح وأتوه • أنا نجم • ليلى • روما',
      descEn: 'Basrah w Atooh • Ana Negm • Layla • Roma',
      queries: ['كايروكي', 'Cairokee']
    },
    {
      id: 'tul8te',
      nameAr: 'توليت (TUL8TE)',
      nameEn: 'TUL8TE',
      subAr: 'إندي بوب',
      subEn: 'Indie Pop',
      tagAr: 'أغاني توليت الكاملة',
      tagEn: 'TUL8TE Full Tracks',
      descAr: 'حبيبي ليه • ماتيجي أعدي عليكي • حسيني',
      descEn: 'Habeeby Leh • Mateegy A3ady Aleiky',
      queries: ['توليت', 'TUL8TE']
    }
  ];

  let customArtists = JSON.parse(localStorage.getItem('geo_ios_custom_artists_v1') || '[]');
  let removedBaseArtists = JSON.parse(localStorage.getItem('geo_ios_removed_base_artists_v1') || '[]');
  let ARTISTS = [];

  function rebuildArtistsArray() {
    ARTISTS = [
      ...BASE_ARTISTS.filter((a) => a.id === 'all' || !removedBaseArtists.includes(a.id)),
      ...customArtists
    ];
  }
  rebuildArtistsArray();

  const $ = (id) => document.getElementById(id);
  const audioDsp = $('audioPlayer');
  const audioNative = $('audioNative');
  let activeDeck = 'dsp'; // 'dsp' | 'native'
  let activeAudio = audioDsp;

  const engine = new window.StudioAudioEngine(audioDsp, audioNative, $('bgReactiveCanvas'));

  let catalogByArtist = JSON.parse(localStorage.getItem('geo_ios_catalog_v1') || '{}');
  let favorites = JSON.parse(localStorage.getItem('geo_ios_favs_v1') || '{}');
  let offlineTracksMap = JSON.parse(localStorage.getItem('geo_ios_offline_tracks_v1') || '{}');
  let searchHistory = JSON.parse(localStorage.getItem('geo_ios_search_history_v1') || '[]');
  let savedOfflineIds = new Set();
  const savingProgressMap = {};
  let localTracks = [];

  let activeCategory = 'all';
  let activeTab = 'home';
  let displayedTracks = [];
  let queue = [];
  let currentIndex = -1;
  let currentTrack = null;
  let hlsInstance = null;
  let activeBlobUrl = null;
  let shuffleOn = false;
  let repeatMode = 'off';
  let sleepTimerId = null;
  let loopPointA = null;
  let loopPointB = null;

  function setStatusChipText(txt) {
    if ($('sheetStatusChip')) $('sheetStatusChip').textContent = txt;
    if ($('offlineStatusText')) $('offlineStatusText').textContent = txt;
  }

  function applyTheme(theme) {
    currentTheme = theme || 'neon';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('geo_ios_theme', currentTheme);
    if ($('themeSelect')) $('themeSelect').value = currentTheme;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', currentTheme === 'light' ? '#eef2f9' : '#060711');
    }
    engine.setThemePalette(currentTheme);
  }

  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'ar';
    localStorage.setItem('geo_ios_lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    if ($('langSelect')) $('langSelect').value = currentLang;

    const map = {
      brandSubText: 'brandSub',
      lblArtistsSection: 'artistsSection',
      lblAddArtistBtn: 'addArtistBtn',
      confirmAddArtistBtn: 'confirmAddArtist',
      lblNavHome: 'navHome',
      lblOfflineNav: 'offlineNav',
      lblFavsNav: 'favsNav',
      lblLocalNav: 'localNav',
      lblNavStudio: 'navStudio',
      lblOptionsBtn: 'optionsBtn',
      lblOptionsSheetTitle: 'optionsSheetTitle',
      lblOptTheme: 'optTheme',
      lblOptLang: 'optLang',
      lblAddMusicBtn: 'addMusicBtn',
      lblUploadTitle: 'uploadTitle',
      lblUploadSub: 'uploadSub',
      lblImportFromIphone: 'importFromIphone',
      lblClearOfflineCache: 'clearOfflineCache',
      lblSearchHistoryTitle: 'searchHistoryTitle',
      clearSearchHistoryBtn: 'clearHistory',
      offlineStatusText: 'autoSaveBanner',
      playAllBtn: 'playAll',
      tabBtnEq: 'tabEq',
      tabBtnQueue: 'tabQueue',
      tabBtnDsp: 'tabDsp',
      presetFlat: 'presetFlat',
      presetMahraganat: 'presetMahraganat',
      presetTarab: 'presetTarab',
      presetBass: 'presetBass',
      presetPop: 'presetPop',
      presetRock: 'presetRock',
      presetElectronic: 'presetElectronic',
      presetCinema: 'presetCinema',
      vizBarsBtn: 'vizBars',
      vizWaveBtn: 'vizWave',
      vizRingBtn: 'vizRing',
      lblBassBoost: 'bassBoost',
      lblReverb: 'reverbLabelTitle',
      lblSpatial3D: 'spatial3D',
      lblSpeed: 'speedPitch'
    };

    for (const [elId, key] of Object.entries(map)) {
      const el = $(elId);
      if (el) el.textContent = tStr(key);
    }

    if ($('searchInput')) $('searchInput').placeholder = tStr('searchPlaceholder');
    if ($('newArtistInput')) $('newArtistInput').placeholder = tStr('artistInputPlaceholder');
    if ($('karaokeToggleBtn')) {
      $('karaokeToggleBtn').textContent = engine.karaokeEnabled ? tStr('karaokeOn') : tStr('karaokeOff');
    }
    if ($('toggle8DBtn')) {
      $('toggle8DBtn').textContent = engine.orbit8DEnabled ? tStr('orbit8DOn') : tStr('orbit8DOff');
    }
    if ($('toggleCompressorBtn')) {
      $('toggleCompressorBtn').textContent = engine.compressorEnabled ? tStr('compressorOn') : tStr('compressorOff');
    }
    if (!currentTrack && $('barTitle')) {
      $('barTitle').textContent = tStr('readyToPlay');
      if ($('sheetTitle')) $('sheetTitle').textContent = tStr('readyToPlay');
    }

    renderArtistPills();
    selectCategory(activeCategory);
  }

  const getArtistName = (a) => (currentLang === 'en' ? a.nameEn : a.nameAr);
  const getArtistSub = (a) => (currentLang === 'en' ? a.subEn : a.subAr);
  const getArtistTag = (a) => (currentLang === 'en' ? a.tagEn : a.tagAr);
  const getArtistDesc = (a) => (currentLang === 'en' ? a.descEn : a.descAr);

  // ---------------- سجل البحث الذكي ----------------
  function saveSearchTerm(term) {
    const clean = (term || '').trim();
    if (clean.length < 2) return;
    searchHistory = [clean, ...searchHistory.filter((x) => x.toLowerCase() !== clean.toLowerCase())].slice(0, 18);
    try {
      localStorage.setItem('geo_ios_search_history_v1', JSON.stringify(searchHistory));
    } catch (_) {}
  }

  function removeSearchTerm(term) {
    searchHistory = searchHistory.filter((x) => x !== term);
    try {
      localStorage.setItem('geo_ios_search_history_v1', JSON.stringify(searchHistory));
    } catch (_) {}
    renderSearchHistoryDropdown();
  }

  function renderSearchHistoryDropdown() {
    const dropdown = $('searchHistoryDropdown');
    const listBox = $('searchHistoryList');
    if (!dropdown || !listBox) return;
    if (!searchHistory.length) {
      dropdown.hidden = true;
      return;
    }

    listBox.innerHTML = searchHistory
      .map(
        (term, idx) => `
      <div class="sh-item" data-sh-idx="${idx}">
        <span class="sh-term">${SVG_CLOCK} ${term}</span>
        <button class="sh-del" data-sh-del="${idx}">✕</button>
      </div>`
      )
      .join('');

    listBox.querySelectorAll('.sh-item').forEach((row) => {
      row.onclick = (e) => {
        const delBtn = e.target.closest('[data-sh-del]');
        if (delBtn) {
          e.stopPropagation();
          removeSearchTerm(searchHistory[Number(delBtn.dataset.shDel)]);
          return;
        }
        const term = searchHistory[Number(row.dataset.shIdx)];
        if (term) {
          $('searchInput').value = term;
          if ($('searchClearInputBtn')) $('searchClearInputBtn').hidden = false;
          dropdown.hidden = true;
          switchBottomTab('home');
          executeSearchQuery(term);
        }
      };
    });

    dropdown.hidden = false;
  }

  // ---------------- التخزين الداخلي النظيف للأوفلاين على جهاز iPhone (IndexedDB فقط — بدون ملفات مسبقة) ----------------
  function openOfflineDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('GeoInternalAudioDB_iOS_v1', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audioBuffers')) {
          db.createObjectStore('audioBuffers');
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGetAudio(trackId) {
    try {
      const db = await openOfflineDB();
      const data = await new Promise((resolve) => {
        const tx = db.transaction('audioBuffers', 'readonly');
        const req = tx.objectStore('audioBuffers').get(String(trackId));
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (!data) return null;
      if (data instanceof Blob) return data;
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        return new Blob([data], { type: 'audio/mp4' });
      }
      if (data.buffer) {
        return new Blob([data.buffer], { type: data.mime || 'audio/mp4' });
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  async function idbSaveAudioBuffer(trackId, arrayBuffer, mimeType = 'audio/mp4') {
    try {
      const db = await openOfflineDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction('audioBuffers', 'readwrite');
        tx.objectStore('audioBuffers').put({ buffer: arrayBuffer, mime: mimeType }, String(trackId));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      savedOfflineIds.add(String(trackId));
      if ($('offlineCountBadge')) $('offlineCountBadge').textContent = savedOfflineIds.size;
    } catch (_) {}
  }

  async function syncSavedOfflineIds() {
    try {
      const db = await openOfflineDB();
      const keys = await new Promise((resolve) => {
        const tx = db.transaction('audioBuffers', 'readonly');
        const req = tx.objectStore('audioBuffers').getAllKeys();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      const merged = new Set(keys.map(String));
      // الاحتفاظ فقط بالأغاني التي يمتلك المستخدم ملفها الفعلي في IndexedDB على الآيفون
      for (const k of Object.keys(offlineTracksMap || {})) {
        if (!merged.has(String(k))) {
          delete offlineTracksMap[k];
        }
      }
      savedOfflineIds = merged;
      if ($('offlineCountBadge')) $('offlineCountBadge').textContent = savedOfflineIds.size;
    } catch (_) {}
  }

  function isTrackSavedOffline(trackId) {
    return savedOfflineIds.has(String(trackId));
  }

  function fmtTime(sec) {
    if (!sec || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  async function imageToDataUrl(url) {
    if (!url || url.startsWith('data:')) return url || DEFAULT_COVER;
    try {
      const r = await fetch(url);
      const b = await r.blob();
      return await new Promise((res) => {
        const reader = new FileReader();
        reader.onloadend = () => res(reader.result || DEFAULT_COVER);
        reader.readAsDataURL(b);
      });
    } catch (_) {
      return DEFAULT_COVER;
    }
  }

  const IS_CAPACITOR_NATIVE = !!(
    window.Capacitor &&
    typeof window.Capacitor.isNativePlatform === 'function' &&
    window.Capacitor.isNativePlatform()
  );

  async function smartScFetch(fullUrl) {
    if (IS_CAPACITOR_NATIVE) {
      return fetch(fullUrl);
    }
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      try {
        const proxied = await fetch('/api/sc?url=' + encodeURIComponent(fullUrl));
        if (proxied.ok || proxied.status === 401 || proxied.status === 403) return proxied;
      } catch (_) {}
    }
    return fetch(fullUrl);
  }

  async function refreshScClientId() {
    try {
      const html = await smartScFetch('https://soundcloud.com').then((r) => r.text());
      const scripts = [...html.matchAll(/src="(https:\/\/a-v2\.sndcdn\.com\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
      for (let i = scripts.length - 1; i >= Math.max(0, scripts.length - 6); i--) {
        const js = await smartScFetch(scripts[i]).then((r) => r.text());
        const m = js.match(/client_id\s*:\s*"([a-zA-Z0-9]{32})"/);
        if (m && m[1]) {
          scClientId = m[1];
          localStorage.setItem('geo_ios_sc_cid', scClientId);
          return scClientId;
        }
      }
    } catch (_) {}
    return scClientId;
  }

  async function scFetchJson(url) {
    const sep = url.includes('?') ? '&' : '?';
    let res = await smartScFetch(`${url}${sep}client_id=${scClientId}`);
    if (res.status === 401 || res.status === 403) {
      await refreshScClientId();
      res = await smartScFetch(`${url}${sep}client_id=${scClientId}`);
    }
    if (!res.ok) throw new Error('SC HTTP ' + res.status);
    return res.json();
  }

  function updateRowSavingBadge(idStr) {
    const btn = document.querySelector(`[data-dl-id="${idStr}"]`);
    if (!btn) return;
    if (isTrackSavedOffline(idStr)) {
      btn.className = 'track-badge saved';
      btn.style.color = '';
      btn.innerHTML = `${SVG_CHECK} ${tStr('offlineBadge')}`;
    } else if (savingProgressMap[idStr] !== undefined) {
      btn.className = 'track-badge';
      btn.style.color = '#fbbf24';
      btn.innerHTML = `${tStr('savingBadge')} ${savingProgressMap[idStr]}%`;
    }
    updateSheetSaveUI();
  }

  async function fetchArrayBufferWithRetry(url, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const r = await fetch(url);
        if (r.ok) return await r.arrayBuffer();
      } catch (_) {}
      await new Promise((res) => setTimeout(res, 250 * (attempt + 1)));
    }
    throw new Error('Segment fetch failed');
  }

  async function saveTrackOfflineInBackground(track, knownStreamUrl) {
    if (!track || track.isLocal) return;
    const idStr = String(track.id);
    if (isTrackSavedOffline(idStr) || savingProgressMap[idStr] !== undefined) return;

    try {
      savingProgressMap[idStr] = 2;
      setStatusChipText(`${tStr('savingBanner')}: ${savingProgressMap[idStr]}%`);
      updateRowSavingBadge(idStr);

      let streamUrl = knownStreamUrl;
      if (!streamUrl && track.transcodingUrl) {
        try {
          const data = await scFetchJson(track.transcodingUrl);
          streamUrl = data.url;
        } catch (_) {
          const fresh = await fetchFullTracks([track.title]);
          if (fresh.length && fresh[0].transcodingUrl) {
            track.transcodingUrl = fresh[0].transcodingUrl;
            const data2 = await scFetchJson(track.transcodingUrl);
            streamUrl = data2.url;
          }
        }
      }
      if (!streamUrl) throw new Error('No stream');

      let mergedBuffer = null;
      let mimeType = 'audio/mp4';

      if (streamUrl.includes('.m3u8')) {
        const m3u8Text = await fetch(streamUrl).then((r) => r.text());
        const lines = m3u8Text.split('\n').map((l) => l.trim());
        let initMapUrl = null;
        const segUrls = [];
        for (const line of lines) {
          if (line.startsWith('#EXT-X-MAP:URI="')) {
            const m = line.match(/URI="([^"]+)"/);
            if (m) initMapUrl = m[1];
          } else if (line && !line.startsWith('#')) {
            segUrls.push(line);
          }
        }
        const allUrls = initMapUrl ? [initMapUrl, ...segUrls] : segUrls;
        const chunks = new Array(allUrls.length);
        let completed = 0;

        for (let i = 0; i < allUrls.length; i += 2) {
          const batch = allUrls.slice(i, i + 2);
          await Promise.all(
            batch.map(async (u, idx) => {
              chunks[i + idx] = await fetchArrayBufferWithRetry(u, 3);
              completed++;
              savingProgressMap[idStr] = Math.min(99, Math.round((completed / allUrls.length) * 100));
            })
          );
          setStatusChipText(`${tStr('savingBanner')} ${savingProgressMap[idStr]}%`);
          updateRowSavingBadge(idStr);
          await new Promise((res) => setTimeout(res, 75));
        }

        const totalLength = chunks.reduce((sum, b) => sum + (b ? b.byteLength : 0), 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const buf of chunks) {
          if (buf) {
            combined.set(new Uint8Array(buf), offset);
            offset += buf.byteLength;
          }
        }
        mergedBuffer = combined.buffer;
        mimeType = 'audio/mp4';
      } else {
        mergedBuffer = await fetchArrayBufferWithRetry(streamUrl, 3);
        mimeType = 'audio/mpeg';
      }

      await idbSaveAudioBuffer(idStr, mergedBuffer, mimeType);

      const coverDataUrl = await imageToDataUrl(track.cover);
      offlineTracksMap[idStr] = { ...track, cover: coverDataUrl };
      savedOfflineIds.add(idStr);
      if ($('offlineCountBadge')) $('offlineCountBadge').textContent = savedOfflineIds.size;

      try {
        localStorage.setItem('geo_ios_offline_tracks_v1', JSON.stringify(offlineTracksMap));
      } catch (_) {}

      delete savingProgressMap[idStr];
      setStatusChipText(tStr('savedBanner'));
      updateRowSavingBadge(idStr);
      if (activeCategory === 'offline') {
        selectCategory('offline');
      }
    } catch (_) {
      delete savingProgressMap[idStr];
      setStatusChipText(tStr('autoSaveBanner'));
      updateRowSavingBadge(idStr);
    }
  }

  async function unsaveTrackOffline(track) {
    if (!track) return;
    const idStr = String(track.id);

    if (track.isLocal) {
      localTracks = localTracks.filter((x) => String(x.id) !== idStr);
      if ($('localCountBadge')) $('localCountBadge').textContent = localTracks.length;
    }

    try {
      const db = await openOfflineDB();
      await new Promise((resolve) => {
        const tx = db.transaction('audioBuffers', 'readwrite');
        tx.objectStore('audioBuffers').delete(idStr);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (_) {}

    delete offlineTracksMap[idStr];
    delete savingProgressMap[idStr];
    savedOfflineIds.delete(idStr);
    if ($('offlineCountBadge')) $('offlineCountBadge').textContent = savedOfflineIds.size;

    try {
      localStorage.setItem('geo_ios_offline_tracks_v1', JSON.stringify(offlineTracksMap));
    } catch (_) {}

    if (activeCategory === 'favs' && favorites[idStr]) {
      delete favorites[idStr];
      localStorage.setItem('geo_ios_favs_v1', JSON.stringify(favorites));
      if ($('favCountBadge')) $('favCountBadge').textContent = Object.keys(favorites).length;
      updateLikeButtonUI();
    }

    updateSheetSaveUI();
    if (activeCategory === 'offline' || activeCategory === 'favs' || activeCategory === 'local') {
      selectCategory(activeCategory);
    } else {
      renderTracks(displayedTracks);
    }
  }

  async function clearAllOfflineTracks() {
    try {
      const db = await openOfflineDB();
      await new Promise((resolve) => {
        const tx = db.transaction('audioBuffers', 'readwrite');
        tx.objectStore('audioBuffers').clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (_) {}
    offlineTracksMap = {};
    savedOfflineIds.clear();
    try {
      localStorage.removeItem('geo_ios_offline_tracks_v1');
    } catch (_) {}
    if ($('offlineCountBadge')) $('offlineCountBadge').textContent = '0';
    updateSheetSaveUI();
    if (activeCategory === 'offline') selectCategory('offline');
    else renderTracks(displayedTracks);
  }

  // ---------------- كتالوج الفنانين المقترحين بأول حرف ----------------
  const FAMOUS_ARTISTS_CATALOG = [
    { nameAr: 'أحمد سعد', nameEn: 'Ahmed Saad', genre: 'Pop & Tarab' },
    { nameAr: 'أصالة نصري', nameEn: 'Assala Nasri', genre: 'Tarab' },
    { nameAr: 'أنغام', nameEn: 'Angham', genre: 'Tarab & Romance' },
    { nameAr: 'إليسا', nameEn: 'Elissa', genre: 'Romance & Pop' },
    { nameAr: 'أم كلثوم', nameEn: 'Umm Kulthum', genre: 'Classic Tarab' },
    { nameAr: 'أحمد كامل', nameEn: 'Ahmed Kamel', genre: 'Egyptian Pop' },
    { nameAr: 'أحمد شيبة', nameEn: 'Ahmed Shiba', genre: 'Shaabi' },
    { nameAr: 'بهاء سلطان', nameEn: 'Bahaa Sultan', genre: 'Tarab & Shaabi' },
    { nameAr: 'بلقيس', nameEn: 'Balqees', genre: 'Khaleeji Pop' },
    { nameAr: 'تامر عاشور', nameEn: 'Tamer Ashour', genre: 'Drama & Romance' },
    { nameAr: 'تامر حسني', nameEn: 'Tamer Hosny', genre: 'Pop Star' },
    { nameAr: 'توليت', nameEn: 'TUL8TE', genre: 'Indie Pop' },
    { nameAr: 'جورج وسوف', nameEn: 'George Wassouf', genre: 'Sultan of Tarab' },
    { nameAr: 'حمو المرشدي', nameEn: 'Hamo El Morshedy', genre: 'Mahraganat' },
    { nameAr: 'حسين الجسمي', nameEn: 'Hussain Al Jassmi', genre: 'Arabian Pop' },
    { nameAr: 'حمزة نمرة', nameEn: 'Hamza Namira', genre: 'Alternative' },
    { nameAr: 'حكيم', nameEn: 'Hakim', genre: 'Shaabi' },
    { nameAr: 'حسن شاكوش', nameEn: 'Hassan Shakosh', genre: 'Mahraganat' },
    { nameAr: 'حمو بيكا', nameEn: 'Hamo Bika', genre: 'Mahraganat' },
    { nameAr: 'رامي صبري', nameEn: 'Ramy Sabry', genre: 'Pop & Romance' },
    { nameAr: 'رامي جمال', nameEn: 'Ramy Gamal', genre: 'Romance' },
    { nameAr: 'راغب علامة', nameEn: 'Ragheb Alama', genre: 'Pop' },
    { nameAr: 'رضا البحراوي', nameEn: 'Reda El Bahrawy', genre: 'Shaabi' },
    { nameAr: 'راشد الماجد', nameEn: 'Rashed Al Majed', genre: 'Khaleeji' },
    { nameAr: 'سعد لمجرد', nameEn: 'Saad Lamjarred', genre: 'Pop' },
    { nameAr: 'سميرة سعيد', nameEn: 'Samira Said', genre: 'Pop Diva' },
    { nameAr: 'شيرين عبد الوهاب', nameEn: 'Sherine Abdel Wahab', genre: 'Queen of Tarab' },
    { nameAr: 'شارموفرز', nameEn: 'Sharmoofers', genre: 'Indie Band' },
    { nameAr: 'صابر الرباعي', nameEn: 'Saber Rebai', genre: 'Tarab' },
    { nameAr: 'عمرو دياب', nameEn: 'Amr Diab', genre: 'El Hadaba' },
    { nameAr: 'عصام صاصا', nameEn: 'Essam Sasa', genre: 'Mahraganat' },
    { nameAr: 'عفروتو', nameEn: 'Afroto', genre: 'Rap & Trap' },
    { nameAr: 'عبد الحليم حافظ', nameEn: 'Abdel Halim Hafez', genre: 'Classic Tarab' },
    { nameAr: 'فيروز', nameEn: 'Fairuz', genre: 'Classic Legend' },
    { nameAr: 'فضل شاكر', nameEn: 'Fadel Chaker', genre: 'Romance' },
    { nameAr: 'كايروكي', nameEn: 'Cairokee', genre: 'Rock & Indie' },
    { nameAr: 'كاظم الساهر', nameEn: 'Kadim Al Sahir', genre: 'Caesar of Tarab' },
    { nameAr: 'محمد حماقي', nameEn: 'Mohamed Hamaki', genre: 'Pop Star' },
    { nameAr: 'محمد منير', nameEn: 'Mohamed Mounir', genre: 'The King' },
    { nameAr: 'مسلم', nameEn: 'Muslim', genre: 'Tarab & Shaabi' },
    { nameAr: 'مروان بابلو', nameEn: 'Marwan Pablo', genre: 'Rap' },
    { nameAr: 'مروان موسى', nameEn: 'Marwan Moussa', genre: 'Rap' },
    { nameAr: 'محمود العسيلي', nameEn: 'Mahmoud El Esseily', genre: 'Pop' },
    { nameAr: 'ماجد المهندس', nameEn: 'Majid Al Mohandis', genre: 'Romance' },
    { nameAr: 'محمد رمضان', nameEn: 'Mohamed Ramadan', genre: 'Pop & Rap' },
    { nameAr: 'نانسي عجرم', nameEn: 'Nancy Ajram', genre: 'Pop' },
    { nameAr: 'ناصيف زيتون', nameEn: 'Nassif Zeytoun', genre: 'Levantine Pop' },
    { nameAr: 'ويجز', nameEn: 'Wegz', genre: 'Rap & Trap' },
    { nameAr: 'وائل جسار', nameEn: 'Wael Jassar', genre: 'Romance & Tarab' },
    { nameAr: 'Adele', nameEn: 'Adele', genre: 'Global Pop' },
    { nameAr: 'Billie Eilish', nameEn: 'Billie Eilish', genre: 'Alternative Pop' },
    { nameAr: 'Coldplay', nameEn: 'Coldplay', genre: 'Rock Band' },
    { nameAr: 'Drake', nameEn: 'Drake', genre: 'Hip-Hop' },
    { nameAr: 'Ed Sheeran', nameEn: 'Ed Sheeran', genre: 'Pop' },
    { nameAr: 'Eminem', nameEn: 'Eminem', genre: 'Rap Legend' },
    { nameAr: 'Imagine Dragons', nameEn: 'Imagine Dragons', genre: 'Rock' },
    { nameAr: 'Lana Del Rey', nameEn: 'Lana Del Rey', genre: 'Indie Pop' },
    { nameAr: 'Taylor Swift', nameEn: 'Taylor Swift', genre: 'Pop' },
    { nameAr: 'The Weeknd', nameEn: 'The Weeknd', genre: 'Synth Pop' },
    { nameAr: 'Travis Scott', nameEn: 'Travis Scott', genre: 'Trap' }
  ];

  function normalizeArStr(str) {
    return (str || '')
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي');
  }

  let artistSuggestTimer = null;

  async function updateArtistSuggestions(rawQuery) {
    const dropdown = $('artistSuggestDropdown');
    if (!dropdown) return;
    const q = (rawQuery || '').trim();
    if (!q) {
      dropdown.hidden = true;
      dropdown.innerHTML = '';
      return;
    }

    const normQ = normalizeArStr(q);
    const localMatches = FAMOUS_ARTISTS_CATALOG.filter((item) => {
      const arNorm = normalizeArStr(item.nameAr);
      const enNorm = normalizeArStr(item.nameEn);
      return arNorm.startsWith(normQ) || enNorm.startsWith(normQ);
    }).map((item) => ({
      name: currentLang === 'en' ? item.nameEn : item.nameAr,
      sub: item.genre,
      avatar: DEFAULT_COVER
    }));

    const renderList = (items) => {
      if (!items.length) {
        dropdown.hidden = true;
        return;
      }
      dropdown.innerHTML = items
        .slice(0, 10)
        .map(
          (a, idx) => `
          <div class="artist-suggest-item" data-as-idx="${idx}">
            <img src="${a.avatar || DEFAULT_COVER}" alt="" onerror="this.src='${DEFAULT_COVER}'">
            <span class="as-name">${a.name}</span>
            <span class="as-sub">${a.sub || ''}</span>
          </div>`
        )
        .join('');

      dropdown.querySelectorAll('.artist-suggest-item').forEach((el) => {
        el.onclick = (e) => {
          e.stopPropagation();
          const chosen = items[Number(el.dataset.asIdx)];
          if (chosen) {
            $('newArtistInput').value = '';
            dropdown.hidden = true;
            if ($('addArtistBox')) $('addArtistBox').hidden = true;
            if ($('addArtistToggleBtn')) $('addArtistToggleBtn').classList.remove('active');
            addNewArtist(chosen.name, chosen.avatar);
          }
        };
      });
      dropdown.hidden = false;
    };

    renderList(localMatches);

    clearTimeout(artistSuggestTimer);
    artistSuggestTimer = setTimeout(async () => {
      try {
        const data = await scFetchJson(
          `https://api-v2.soundcloud.com/search/users?q=${encodeURIComponent(q)}&limit=15`
        );
        const onlineArtists = [];
        for (const u of data.collection || []) {
          const uname = (u.username || '').trim();
          if (!uname) continue;
          const normU = normalizeArStr(uname);
          const avatarHi = u.avatar_url ? u.avatar_url.replace('-large', '-t500x500') : DEFAULT_COVER;
          const matchLocal = localMatches.find(
            (loc) => normU.includes(normalizeArStr(loc.name)) || normalizeArStr(loc.name).includes(normU)
          );
          if (matchLocal && matchLocal.avatar === DEFAULT_COVER) {
            matchLocal.avatar = avatarHi;
          } else if (normU.startsWith(normQ)) {
            onlineArtists.push({ name: uname, sub: 'Artist', avatar: avatarHi });
          }
        }
        const combined = [...localMatches];
        const seen = new Set(combined.map((x) => normalizeArStr(x.name)));
        for (const oa of onlineArtists) {
          if (!seen.has(normalizeArStr(oa.name))) {
            seen.add(normalizeArStr(oa.name));
            combined.push(oa);
          }
        }
        if ($('newArtistInput') && $('newArtistInput').value.trim() === q) {
          renderList(combined);
        }
      } catch (_) {}
    }, 180);
  }

  async function addNewArtist(rawName, initialAvatar = '') {
    const cleanName = (rawName || '').trim();
    if (cleanName.length < 1) return;

    const removedBaseMatch = BASE_ARTISTS.find(
      (a) =>
        a.id !== 'all' &&
        removedBaseArtists.includes(a.id) &&
        (a.nameAr.toLowerCase() === cleanName.toLowerCase() || a.nameEn.toLowerCase() === cleanName.toLowerCase())
    );
    if (removedBaseMatch) {
      removedBaseArtists = removedBaseArtists.filter((id) => id !== removedBaseMatch.id);
      try {
        localStorage.setItem('geo_ios_removed_base_artists_v1', JSON.stringify(removedBaseArtists));
      } catch (_) {}
      rebuildArtistsArray();
      renderArtistPills();
      selectCategory(removedBaseMatch.id);
      if (!catalogByArtist[removedBaseMatch.id] || !catalogByArtist[removedBaseMatch.id].length) {
        const tracks = await fetchFullTracks(removedBaseMatch.queries, removedBaseMatch.nameAr);
        catalogByArtist[removedBaseMatch.id] = tracks;
        renderArtistPills();
        selectCategory(removedBaseMatch.id);
      }
      return;
    }

    const existing = ARTISTS.find(
      (a) => a.nameAr.toLowerCase() === cleanName.toLowerCase() || a.nameEn.toLowerCase() === cleanName.toLowerCase()
    );
    if (existing) {
      selectCategory(existing.id);
      return;
    }

    const newId = 'custom_' + Date.now();
    const newArtistObj = {
      id: newId,
      nameAr: cleanName,
      nameEn: cleanName,
      subAr: 'نجم مضاف',
      subEn: 'Custom Artist',
      tagAr: `أغاني ${cleanName} الكاملة`,
      tagEn: `${cleanName} Full Tracks`,
      descAr: `أغاني ${cleanName} المتاحة للتشغيل والحفظ بدون نت`,
      descEn: `Tracks by ${cleanName} ready to stream & save offline`,
      queries: [cleanName],
      avatar: initialAvatar || '',
      isCustom: true
    };

    customArtists.push(newArtistObj);
    rebuildArtistsArray();
    try {
      localStorage.setItem('geo_ios_custom_artists_v1', JSON.stringify(customArtists));
    } catch (_) {}

    renderArtistPills();
    selectCategory(newId);

    $('tracksList').innerHTML = `<div style="padding:36px;text-align:center;color:var(--text-muted)">${tStr('loadingCatalog')}</div>`;
    const tracks = await fetchFullTracks([cleanName], cleanName);
    catalogByArtist[newId] = tracks;
    if (tracks.length) {
      if (!newArtistObj.avatar || newArtistObj.avatar === DEFAULT_COVER) {
        newArtistObj.avatar = tracks[0].cover;
        try {
          localStorage.setItem('geo_ios_custom_artists_v1', JSON.stringify(customArtists));
        } catch (_) {}
      }
      const existingAll = catalogByArtist.all || [];
      const seen = new Set(existingAll.map((x) => x.id));
      for (const t of tracks.slice(0, 8)) {
        if (!seen.has(t.id)) existingAll.unshift(t);
      }
      catalogByArtist.all = existingAll;
    }
    try {
      localStorage.setItem('geo_ios_catalog_v1', JSON.stringify(catalogByArtist));
    } catch (_) {}

    renderArtistPills();
    if (activeCategory === newId) selectCategory(newId);
  }

  function removeArtist(artistId) {
    if (!artistId || artistId === 'all') return;
    if (BASE_ARTISTS.some((a) => a.id === artistId)) {
      if (!removedBaseArtists.includes(artistId)) removedBaseArtists.push(artistId);
      try {
        localStorage.setItem('geo_ios_removed_base_artists_v1', JSON.stringify(removedBaseArtists));
      } catch (_) {}
    } else {
      customArtists = customArtists.filter((a) => a.id !== artistId);
      try {
        localStorage.setItem('geo_ios_custom_artists_v1', JSON.stringify(customArtists));
      } catch (_) {}
    }

    rebuildArtistsArray();
    delete catalogByArtist[artistId];

    const allMix = [];
    const seen = new Set();
    const remainingArtists = ARTISTS.filter((a) => a.id !== 'all');
    for (let i = 0; i < 40; i++) {
      for (const a of remainingArtists) {
        const list = catalogByArtist[a.id] || [];
        if (list[i] && !seen.has(list[i].id)) {
          seen.add(list[i].id);
          allMix.push(list[i]);
        }
      }
    }
    catalogByArtist.all = allMix;
    try {
      localStorage.setItem('geo_ios_catalog_v1', JSON.stringify(catalogByArtist));
    } catch (_) {}

    renderArtistPills();
    if (activeCategory === artistId || activeCategory === 'all') {
      selectCategory('all');
    }
  }

  async function fetchFullTracks(queries, defaultArtistName = '') {
    const map = new Map();
    await Promise.all(
      queries.map(async (q) => {
        try {
          const data = await scFetchJson(
            `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(q)}&limit=25`
          );
          for (const item of data.collection || []) {
            if (!item.media || !Array.isArray(item.media.transcodings)) continue;
            const tr =
              item.media.transcodings.find((x) => !x.snipped && x.preset === 'aac_160k') ||
              item.media.transcodings.find((x) => !x.snipped && x.format && x.format.protocol === 'progressive') ||
              item.media.transcodings.find((x) => !x.snipped && x.format && x.format.protocol === 'hls');

            if (!tr || item.policy === 'SNIP' || item.duration < 60000 || item.duration > 960000) continue;

            const rawCover = item.artwork_url || (item.user && item.user.avatar_url) || '';
            const hiCover = rawCover ? rawCover.replace('-large', '-t500x500') : DEFAULT_COVER;
            const durSec = Math.round(item.duration / 1000);
            const idStr = String(item.id);
            map.set(idStr, {
              id: idStr,
              title: item.title,
              artist: defaultArtistName || (item.user && item.user.username) || 'Geo Music',
              album: fmtTime(durSec),
              cover: offlineTracksMap[idStr]?.cover || hiCover,
              transcodingUrl: tr.url,
              durationMs: item.duration,
              durationFormatted: fmtTime(durSec),
              isLocal: false
            });
          }
        } catch (_) {}
      })
    );
    return [...map.values()];
  }

  async function loadInitialCatalog() {
    applyTheme(currentTheme);
    applyLanguage(currentLang);
    await syncSavedOfflineIds();

    if ($('favCountBadge')) $('favCountBadge').textContent = Object.keys(favorites).length;
    if ($('localCountBadge')) $('localCountBadge').textContent = localTracks.length;
    if ($('offlineCountBadge')) $('offlineCountBadge').textContent = savedOfflineIds.size;

    const hasCachedCatalog = catalogByArtist.all && catalogByArtist.all.length > 0;
    if (hasCachedCatalog) {
      renderArtistPills();
      selectCategory('all');
      if (catalogByArtist.all[0]) loadTrack(catalogByArtist.all[0], false);
    } else {
      $('tracksList').innerHTML = `<div style="padding:36px;text-align:center;color:var(--text-muted)">${tStr('loadingCatalog')}</div>`;
    }

    const fetchTargets = ARTISTS.filter((a) => a.id !== 'all');
    const fetchedAny = await Promise.all(
      fetchTargets.map(async (a) => {
        const res = await fetchFullTracks(a.queries, a.nameAr);
        if (res.length > 0) {
          catalogByArtist[a.id] = res;
          return true;
        }
        return false;
      })
    );

    if (fetchedAny.some(Boolean)) {
      const allMix = [];
      const seen = new Set();
      const coreArtists = ARTISTS.filter((a) => a.id !== 'all');
      for (let i = 0; i < 30; i++) {
        for (const a of coreArtists) {
          const list = catalogByArtist[a.id] || [];
          if (list[i] && !seen.has(list[i].id)) {
            seen.add(list[i].id);
            allMix.push(list[i]);
          }
        }
      }
      catalogByArtist.all = allMix;
      try {
        localStorage.setItem('geo_ios_catalog_v1', JSON.stringify(catalogByArtist));
      } catch (_) {}

      renderArtistPills();
      if (!currentTrack && allMix.length) {
        selectCategory('all');
        loadTrack(allMix[0], false);
      } else {
        selectCategory(activeCategory);
      }
    } else if (!hasCachedCatalog) {
      selectCategory('offline');
    }
  }

  function renderArtistPills() {
    const box = $('artistPills');
    if (!box) return;
    box.innerHTML = ARTISTS.map((a) => {
      const list = catalogByArtist[a.id] || [];
      const thumb = a.avatar || list[0]?.cover || DEFAULT_COVER;
      const delHtml =
        a.id !== 'all'
          ? `<span class="del-artist-btn" data-del-artist="${a.id}" title="Remove">✕</span>`
          : '';
      return `
        <div class="artist-card ${activeCategory === a.id ? 'active' : ''}" data-cat="${a.id}">
          <img src="${thumb}" alt="" onerror="this.src='${DEFAULT_COVER}'">
          <div class="a-name">${getArtistName(a)}</div>
          ${delHtml}
        </div>`;
    }).join('');
    box.querySelectorAll('.artist-card').forEach((c) => {
      c.onclick = (e) => {
        const delBtn = e.target.closest('[data-del-artist]');
        if (delBtn) {
          e.stopPropagation();
          removeArtist(delBtn.dataset.delArtist);
          return;
        }
        selectCategory(c.dataset.cat);
      };
    });
  }

  function getOfflineTrackList() {
    const result = [];
    for (const id of savedOfflineIds) {
      if (offlineTracksMap[id]) {
        result.push(offlineTracksMap[id]);
      } else {
        const fromCat = (catalogByArtist.all || []).find((t) => String(t.id) === String(id));
        if (fromCat) result.push(fromCat);
      }
    }
    return result;
  }

  function selectCategory(catId) {
    activeCategory = catId;
    document.querySelectorAll('[data-cat]').forEach((el) => {
      el.classList.toggle('active', el.dataset.cat === catId);
    });

    if ($('artistsSectionWrap')) {
      $('artistsSectionWrap').hidden = catId === 'offline' || catId === 'favs' || catId === 'local';
    }
    if ($('localImportCard')) {
      $('localImportCard').hidden = catId !== 'local';
    }

    if (catId === 'offline') {
      $('heroTag').textContent = tStr('offlineHeroTag');
      $('heroTitle').textContent = tStr('offlineHeroTitle');
      $('heroDesc').textContent = tStr('offlineHeroDesc');
      displayedTracks = getOfflineTrackList();
    } else if (catId === 'favs') {
      $('heroTag').textContent = tStr('favsHeroTag');
      $('heroTitle').textContent = tStr('favsHeroTitle');
      $('heroDesc').textContent = tStr('favsHeroDesc');
      displayedTracks = Object.values(favorites);
    } else if (catId === 'local') {
      $('heroTag').textContent = tStr('localHeroTag');
      $('heroTitle').textContent = tStr('localHeroTitle');
      $('heroDesc').textContent = tStr('localHeroDesc');
      displayedTracks = localTracks;
    } else {
      const info = ARTISTS.find((a) => a.id === catId) || ARTISTS[0];
      $('heroTag').textContent = getArtistTag(info);
      $('heroTitle').textContent = getArtistName(info);
      $('heroDesc').textContent = getArtistDesc(info);
      displayedTracks = catalogByArtist[catId] || [];
    }

    if ($('pureArtistImg') && (!$('pureArtistImg').getAttribute('src') || $('pureArtistImg').getAttribute('src') === '')) {
      $('pureArtistImg').src = displayedTracks[0]?.cover || DEFAULT_COVER;
    }
    renderTracks(displayedTracks);
  }

  function renderTracks(list) {
    const container = $('tracksList');
    if (!container) return;
    if (!list.length) {
      container.innerHTML = `<div style="padding:36px 18px;text-align:center;color:var(--text-muted);line-height:1.6">${tStr('emptyList')}</div>`;
      return;
    }

    container.innerHTML = list
      .map((t, idx) => {
        const isPlaying = currentTrack && currentTrack.id === t.id;
        const isLiked = !!favorites[t.id];
        const saved = isTrackSavedOffline(t.id) || t.isLocal;
        const savingPct = savingProgressMap[t.id];

        let badgeHtml = `<button class="track-badge" data-dl="${idx}" data-dl-id="${t.id}">${SVG_DOWNLOAD} ${tStr('saveOfflineBtn')}</button>`;
        if (saved) {
          badgeHtml = `
            <div class="track-actions-wrap">
              <button class="track-badge saved" data-dl="${idx}" data-dl-id="${t.id}">${SVG_CHECK} ${tStr('offlineBadge')}</button>
              <button class="unsave-btn" data-unsave="${idx}">✕ ${tStr('unsaveBtn')}</button>
            </div>`;
        } else if (savingPct !== undefined) {
          badgeHtml = `<button class="track-badge" data-dl="${idx}" data-dl-id="${t.id}" style="color:#fbbf24">${tStr('savingBadge')} ${savingPct}%</button>`;
        } else if (activeCategory === 'favs') {
          badgeHtml = `
            <div class="track-actions-wrap">
              ${badgeHtml}
              <button class="unsave-btn" data-unsave="${idx}">✕ ${tStr('unsaveBtn')}</button>
            </div>`;
        }

        const spectrumCanvasHtml = isPlaying ? `<canvas class="row-spectrum-canvas" id="activeTrackCanvas"></canvas>` : '';

        return `
        <div class="track-row ${isPlaying ? 'playing' : ''}" data-idx="${idx}">
          ${spectrumCanvasHtml}
          <img class="track-cover" src="${t.cover || DEFAULT_COVER}" alt="" loading="lazy" onerror="this.src='${DEFAULT_COVER}'">
          <div class="track-meta">
            <div class="track-title">${t.title}</div>
            <div class="track-sub-row">
              <span class="track-artist">${t.artist}</span>
              ${t.durationFormatted ? `<span>• ${t.durationFormatted}</span>` : ''}
            </div>
          </div>
          ${badgeHtml}
          <button class="like-btn ${isLiked ? 'liked' : ''}" data-like="${idx}">${isLiked ? SVG_HEART_FILL : SVG_HEART_OUTLINE}</button>
        </div>`;
      })
      .join('');

    container.querySelectorAll('.track-row').forEach((row) => {
      row.onclick = (e) => {
        const likeBtn = e.target.closest('[data-like]');
        const unsaveBtn = e.target.closest('[data-unsave]');
        const dlBtn = e.target.closest('[data-dl]');
        const idx = Number(row.dataset.idx);
        if (likeBtn) {
          e.stopPropagation();
          toggleFavorite(list[idx]);
          return;
        }
        if (unsaveBtn) {
          e.stopPropagation();
          unsaveTrackOffline(list[idx]);
          return;
        }
        if (dlBtn) {
          e.stopPropagation();
          if (!isTrackSavedOffline(list[idx].id)) {
            saveTrackOfflineInBackground(list[idx], null);
          }
          return;
        }
        const activeSearch = $('searchInput').value.trim();
        if (activeSearch.length >= 2) saveSearchTerm(activeSearch);
        if ($('searchHistoryDropdown')) $('searchHistoryDropdown').hidden = true;

        queue = [...list];
        currentIndex = idx;
        loadTrack(list[idx], true);
      };
    });
    renderQueuePane();
  }

  function renderQueuePane() {
    const qBox = $('queueList');
    if (!qBox) return;
    const src = queue.length ? queue : displayedTracks;
    qBox.innerHTML = src
      .slice(0, 40)
      .map(
        (t, i) => `
      <div class="track-row ${currentTrack && currentTrack.id === t.id ? 'playing' : ''}" style="grid-template-columns:42px 1fr;" data-q="${i}">
        <img class="track-cover" style="width:42px;height:42px" src="${t.cover || DEFAULT_COVER}" alt="" onerror="this.src='${DEFAULT_COVER}'">
        <div class="track-meta">
          <div class="track-title">${t.title}</div>
          <div class="track-sub-row"><span>${t.artist}</span></div>
        </div>
      </div>`
      )
      .join('');
    qBox.querySelectorAll('[data-q]').forEach((el) => {
      el.onclick = () => {
        const i = Number(el.dataset.q);
        if (!queue.length) queue = [...displayedTracks];
        currentIndex = i;
        loadTrack(queue[i], true);
      };
    });
  }

  function toggleFavorite(track) {
    if (!track) return;
    if (favorites[track.id]) delete favorites[track.id];
    else favorites[track.id] = track;
    localStorage.setItem('geo_ios_favs_v1', JSON.stringify(favorites));
    if ($('favCountBadge')) $('favCountBadge').textContent = Object.keys(favorites).length;
    updateLikeButtonUI();
    if (activeCategory === 'favs') selectCategory('favs');
    else renderTracks(displayedTracks);
  }

  function updateLikeButtonUI() {
    const liked = !!(currentTrack && favorites[currentTrack.id]);
    if ($('nowLikeBtn')) {
      $('nowLikeBtn').classList.toggle('liked', liked);
      $('nowLikeBtn').innerHTML = liked ? SVG_HEART_FILL : SVG_HEART_OUTLINE;
    }
    if ($('miniLikeBtn')) {
      $('miniLikeBtn').classList.toggle('liked', liked);
      $('miniLikeBtn').innerHTML = liked ? SVG_HEART_FILL : SVG_HEART_OUTLINE;
    }
  }

  function updateSheetSaveUI() {
    const btn = $('sheetSaveBtn');
    const txt = $('sheetSaveText');
    if (!btn || !txt || !currentTrack) return;
    const saved = isTrackSavedOffline(currentTrack.id) || currentTrack.isLocal;
    btn.classList.toggle('saved', saved);
    if (saved) {
      txt.textContent = tStr('offlineBadge');
    } else if (savingProgressMap[currentTrack.id] !== undefined) {
      txt.textContent = `${savingProgressMap[currentTrack.id]}%`;
    } else {
      txt.textContent = tStr('saveOfflineBtn');
    }
  }

  function stopBothDecks() {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    audioDsp.pause();
    audioNative.pause();
    if (activeBlobUrl) {
      URL.revokeObjectURL(activeBlobUrl);
      activeBlobUrl = null;
    }
  }

  function useDeck(deckName) {
    activeDeck = deckName === 'native' ? 'native' : 'dsp';
    activeAudio = activeDeck === 'native' ? audioNative : audioDsp;
    engine.setActiveSourceType(activeDeck);
  }

  async function startStreamAndAutoSave(track, autoPlay) {
    stopBothDecks();

    const speedVal = Number($('speedRange')?.value || 1);

    if (track.isLocal || track.directAudioUrl) {
      useDeck('dsp');
      if (autoPlay) engine.init();
      audioDsp.src = track.directAudioUrl || track.audioUrl;
      audioDsp.playbackRate = speedVal;
      if (autoPlay) audioDsp.play().catch(() => {});
      return;
    }

    // 1) التشغيل من الذاكرة المحلية للآيفون (IndexedDB Blob) — يعمل بكامل محرك الـ DSP والأوفلاين
    const savedBlob = await idbGetAudio(track.id);
    if (savedBlob) {
      useDeck('dsp');
      if (autoPlay) engine.init();
      setStatusChipText(tStr('playingOfflineBanner'));
      activeBlobUrl = URL.createObjectURL(savedBlob);
      audioDsp.src = activeBlobUrl;
      audioDsp.playbackRate = speedVal;
      if (autoPlay) audioDsp.play().catch(() => {});
      return;
    }

    // 2) البث المباشر عبر الإنترنت
    let resolved = null;
    try {
      resolved = await scFetchJson(track.transcodingUrl);
    } catch (_) {
      const fresh = await fetchFullTracks([track.title]);
      if (fresh.length && fresh[0].transcodingUrl) {
        track.transcodingUrl = fresh[0].transcodingUrl;
        resolved = await scFetchJson(track.transcodingUrl);
      }
    }
    if (!resolved || !resolved.url) return;

    const streamUrl = resolved.url;
    setStatusChipText(tStr('streamingBanner'));

    if (IS_IOS && streamUrl.includes('.m3u8')) {
      // على iPhone نستخدم مشغل iOS الأصلي للبث الحي حتى لا ينقطع الصوت بسبب قيود WebKit HLS+WebAudio
      useDeck('native');
      audioNative.src = streamUrl;
      audioNative.playbackRate = speedVal;
      if (autoPlay) audioNative.play().catch(() => {});
    } else if (streamUrl.includes('.m3u8') && window.Hls && window.Hls.isSupported()) {
      useDeck('dsp');
      if (autoPlay) engine.init();
      hlsInstance = new window.Hls({ enableWorker: false, xhrSetup: (xhr) => { xhr.withCredentials = false; } });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(audioDsp);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
        audioDsp.playbackRate = speedVal;
        if (autoPlay) audioDsp.play().catch(() => {});
      });
    } else {
      useDeck(IS_IOS ? 'native' : 'dsp');
      if (!IS_IOS && autoPlay) engine.init();
      activeAudio.src = streamUrl;
      activeAudio.playbackRate = speedVal;
      if (autoPlay) activeAudio.play().catch(() => {});
    }

    if (autoPlay) {
      const targetTrackId = track.id;
      setTimeout(() => {
        if (currentTrack && currentTrack.id === targetTrackId) {
          saveTrackOfflineInBackground(track, streamUrl);
        }
      }, 2200);
    }
  }

  async function loadTrack(track, autoPlay = true) {
    if (!track) return;
    if (autoPlay) engine.init();

    loopPointA = null;
    loopPointB = null;
    if ($('abLoopBtn')) {
      $('abLoopBtn').classList.remove('active');
      $('abLoopBtn').textContent = 'A-B Loop';
    }

    currentTrack = track;
    const idStr = String(track.id);
    const coverSrc = offlineTracksMap[idStr]?.cover || track.cover || DEFAULT_COVER;

    if ($('barTitle')) $('barTitle').textContent = track.title;
    if ($('barArtist')) $('barArtist').textContent = track.artist;
    if ($('barCover')) $('barCover').src = coverSrc;
    if ($('sheetTitle')) $('sheetTitle').textContent = track.title;
    if ($('sheetArtist')) $('sheetArtist').textContent = track.artist;
    if ($('pureArtistImg')) $('pureArtistImg').src = coverSrc;
    if ($('totTime')) $('totTime').textContent = track.durationFormatted || '0:00';
    updateLikeButtonUI();
    updateSheetSaveUI();

    engine.extractArtworkColor();
    renderTracks(displayedTracks);

    await startStreamAndAutoSave(track, autoPlay);

    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: 'Geo Music iOS',
          artwork: [{ src: coverSrc, sizes: '500x500', type: 'image/jpeg' }]
        });
      } catch (_) {}
    }
  }

  function nextTrack() {
    const list = queue.length ? queue : displayedTracks;
    if (!list.length) return;
    if (shuffleOn) {
      currentIndex = Math.floor(Math.random() * list.length);
    } else {
      currentIndex = (currentIndex + 1) % list.length;
    }
    loadTrack(list[currentIndex], true);
  }

  function prevTrack() {
    if (activeAudio.currentTime > 4) {
      activeAudio.currentTime = 0;
      return;
    }
    const list = queue.length ? queue : displayedTracks;
    if (!list.length) return;
    currentIndex = (currentIndex - 1 + list.length) % list.length;
    loadTrack(list[currentIndex], true);
  }

  // ربط أحداث الصوت لكلا المشغلين (DSP و Native) + شاشة قفل الآيفون
  [audioDsp, audioNative].forEach((el) => {
    el.addEventListener('play', () => {
      if (el !== activeAudio) return;
      if (el === audioDsp) engine.init();
      if ($('playPauseSvg')) $('playPauseSvg').innerHTML = SVG_PAUSE;
      if ($('miniPlayPauseSvg')) $('miniPlayPauseSvg').innerHTML = SVG_PAUSE;
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
      if (currentTrack && !currentTrack.isLocal && !isTrackSavedOffline(currentTrack.id)) {
        const playedTrack = currentTrack;
        setTimeout(() => {
          if (currentTrack && currentTrack.id === playedTrack.id && !el.paused) {
            saveTrackOfflineInBackground(playedTrack, null);
          }
        }, 2500);
      }
    });

    el.addEventListener('pause', () => {
      if (el !== activeAudio) return;
      if ($('playPauseSvg')) $('playPauseSvg').innerHTML = SVG_PLAY;
      if ($('miniPlayPauseSvg')) $('miniPlayPauseSvg').innerHTML = SVG_PLAY;
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    });

    el.addEventListener('timeupdate', () => {
      if (el !== activeAudio) return;
      const cur = el.currentTime;
      const dur = el.duration || (currentTrack ? currentTrack.durationMs / 1000 : 0);

      if (loopPointA !== null && loopPointB !== null && cur >= loopPointB) {
        el.currentTime = loopPointA;
        return;
      }

      if ($('curTime')) $('curTime').textContent = fmtTime(cur);
      if (dur > 0) {
        const pct = (cur / dur) * 100;
        if ($('totTime')) $('totTime').textContent = fmtTime(dur);
        if ($('seekBar')) $('seekBar').value = pct;
        if ($('miniProgressFill')) $('miniProgressFill').style.width = `${Math.min(100, pct)}%`;
      }
    });

    el.addEventListener('ended', () => {
      if (el !== activeAudio) return;
      if (repeatMode === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else if (repeatMode === 'all' || currentIndex < (queue.length || displayedTracks.length) - 1) {
        nextTrack();
      }
    });
  });

  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', () => activeAudio.play().catch(() => {}));
      navigator.mediaSession.setActionHandler('pause', () => activeAudio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details && typeof details.seekTime === 'number') activeAudio.currentTime = details.seekTime;
      });
    } catch (_) {}
  }

  // ---------------- بناء الإيكولايزر اللمسي الاحترافي للآيفون ----------------
  function initEqualizerUI() {
    const box = $('eqSliders');
    if (!box) return;
    box.innerHTML = window.EQ_FREQS.map((f, i) => {
      const label = f >= 1000 ? f / 1000 + 'K' : f + 'Hz';
      return `
        <div class="eq-mobile-row">
          <span class="eq-freq-pill">${label}</span>
          <input type="range" min="-12" max="12" step="1" value="0" data-band="${i}">
          <span class="eq-db-val" data-band-val="${i}">0 dB</span>
        </div>`;
    }).join('');

    box.querySelectorAll('input').forEach((inp) => {
      inp.oninput = (e) => {
        const b = Number(e.target.dataset.band);
        const v = Number(e.target.value);
        engine.init();
        engine.setBand(b, v);
        const lbl = box.querySelector(`[data-band-val="${b}"]`);
        if (lbl) lbl.textContent = `${v > 0 ? '+' : ''}${v} dB`;
      };
    });

    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('[data-preset]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        engine.init();
        const vals = engine.applyPreset(btn.dataset.preset);
        const sliders = box.querySelectorAll('input');
        vals.forEach((v, idx) => {
          if (sliders[idx]) sliders[idx].value = v;
          const lbl = box.querySelector(`[data-band-val="${idx}"]`);
          if (lbl) lbl.textContent = `${v > 0 ? '+' : ''}${v} dB`;
        });
      };
    });
  }

  // ---------------- التنقل بين صفحات iOS ----------------
  function switchBottomTab(navId) {
    activeTab = navId;
    document.querySelectorAll('.ios-tab-item').forEach((b) => {
      b.classList.toggle('active', b.dataset.nav === navId);
    });
    if (navId === 'studio') {
      $('pageLibrary').classList.remove('active');
      $('pageStudio').classList.add('active');
    } else {
      $('pageStudio').classList.remove('active');
      $('pageLibrary').classList.add('active');
      if (navId === 'home') {
        selectCategory(BASE_ARTISTS.some((x) => x.id === activeCategory) || activeCategory.startsWith('custom_') ? activeCategory : 'all');
      } else {
        selectCategory(navId);
      }
    }
  }

  document.querySelectorAll('.ios-tab-item').forEach((btn) => {
    btn.onclick = () => switchBottomTab(btn.dataset.nav);
  });

  // ---------------- شاشة التشغيل الكاملة (Now Playing Sheet) ----------------
  function openNowPlayingSheet() {
    $('nowPlayingSheet').classList.add('open');
    $('nowPlayingSheet').setAttribute('aria-hidden', 'false');
  }
  function closeNowPlayingSheet() {
    $('nowPlayingSheet').classList.remove('open');
    $('nowPlayingSheet').setAttribute('aria-hidden', 'true');
  }

  if ($('miniPlayerBar')) {
    $('miniPlayerBar').onclick = (e) => {
      if (e.target.closest('button')) return;
      openNowPlayingSheet();
    };
  }
  if ($('closeNowPlayingBtn')) $('closeNowPlayingBtn').onclick = closeNowPlayingSheet;

  // ---------------- قائمة الإعدادات المنزلقة (Options Bottom Sheet) ----------------
  if ($('openOptionsSheetBtn') && $('optionsModalOverlay')) {
    $('openOptionsSheetBtn').onclick = () => {
      $('optionsModalOverlay').hidden = false;
    };
  }
  if ($('closeOptionsSheetBtn') && $('optionsModalOverlay')) {
    $('closeOptionsSheetBtn').onclick = () => {
      $('optionsModalOverlay').hidden = true;
    };
  }
  if ($('optionsModalOverlay')) {
    $('optionsModalOverlay').onclick = (e) => {
      if (e.target === $('optionsModalOverlay')) $('optionsModalOverlay').hidden = true;
    };
  }
  if ($('toggleAddMusicBtn') && $('uploadBox')) {
    $('toggleAddMusicBtn').onclick = () => {
      $('uploadBox').hidden = !$('uploadBox').hidden;
    };
  }
  if ($('clearAllOfflineBtn')) {
    $('clearAllOfflineBtn').onclick = async () => {
      const msg =
        currentLang === 'en'
          ? 'Remove all offline saved songs from your iPhone?'
          : 'هل تريد مسح جميع الأغاني المحفوظة بدون نت من جهازك؟';
      if (confirm(msg)) {
        await clearAllOfflineTracks();
        $('optionsModalOverlay').hidden = true;
      }
    };
  }

  // ---------------- إضافة مغني جديد مع الاقتراح الفوري بأول حرف ----------------
  if ($('addArtistToggleBtn') && $('addArtistBox')) {
    $('addArtistToggleBtn').onclick = (e) => {
      e.stopPropagation();
      const box = $('addArtistBox');
      box.hidden = !box.hidden;
      if (box.hidden && $('artistSuggestDropdown')) {
        $('artistSuggestDropdown').hidden = true;
      } else if (!box.hidden && $('newArtistInput')) {
        $('newArtistInput').focus();
      }
    };
  }

  if ($('confirmAddArtistBtn') && $('newArtistInput')) {
    $('confirmAddArtistBtn').onclick = () => {
      const val = $('newArtistInput').value.trim();
      if (val.length >= 1) {
        $('newArtistInput').value = '';
        if ($('artistSuggestDropdown')) $('artistSuggestDropdown').hidden = true;
        if ($('addArtistBox')) $('addArtistBox').hidden = true;
        addNewArtist(val);
      }
    };
    $('newArtistInput').oninput = (e) => updateArtistSuggestions(e.target.value);
    $('newArtistInput').onfocus = (e) => {
      if (e.target.value.trim()) updateArtistSuggestions(e.target.value);
    };
    $('newArtistInput').onkeydown = (e) => {
      if (e.key === 'Enter') $('confirmAddArtistBtn').click();
    };
  }

  // ---------------- أزرار التحكم بالتشغيل والمؤثرات ----------------
  const togglePlayPause = () => {
    if (!currentTrack && displayedTracks.length) {
      queue = [...displayedTracks];
      currentIndex = 0;
      loadTrack(queue[0], true);
      return;
    }
    if (activeAudio.paused) activeAudio.play().catch(() => {});
    else activeAudio.pause();
  };

  if ($('playPauseBtn')) $('playPauseBtn').onclick = togglePlayPause;
  if ($('miniPlayPauseBtn')) $('miniPlayPauseBtn').onclick = (e) => { e.stopPropagation(); togglePlayPause(); };
  if ($('nextBtn')) $('nextBtn').onclick = nextTrack;
  if ($('miniNextBtn')) $('miniNextBtn').onclick = (e) => { e.stopPropagation(); nextTrack(); };
  if ($('prevBtn')) $('prevBtn').onclick = prevTrack;
  if ($('playAllBtn')) {
    $('playAllBtn').onclick = () => {
      if (!displayedTracks.length) return;
      queue = [...displayedTracks];
      currentIndex = 0;
      loadTrack(queue[0], true);
    };
  }
  if ($('shuffleBtn')) {
    $('shuffleBtn').onclick = () => {
      shuffleOn = !shuffleOn;
      $('shuffleBtn').classList.toggle('active', shuffleOn);
    };
  }
  if ($('repeatBtn')) {
    $('repeatBtn').onclick = () => {
      repeatMode = repeatMode === 'off' ? 'one' : 'off';
      $('repeatBtn').classList.toggle('active', repeatMode !== 'off');
    };
  }

  if ($('abLoopBtn')) {
    $('abLoopBtn').onclick = () => {
      if (loopPointA === null) {
        loopPointA = activeAudio.currentTime || 0;
        $('abLoopBtn').classList.add('active');
        $('abLoopBtn').textContent = `A: ${fmtTime(loopPointA)} → B?`;
      } else if (loopPointB === null) {
        if (activeAudio.currentTime > loopPointA + 1) {
          loopPointB = activeAudio.currentTime;
          $('abLoopBtn').textContent = `${fmtTime(loopPointA)} ⇄ ${fmtTime(loopPointB)}`;
        } else {
          loopPointA = null;
          $('abLoopBtn').classList.remove('active');
          $('abLoopBtn').textContent = 'A-B Loop';
        }
      } else {
        loopPointA = null;
        loopPointB = null;
        $('abLoopBtn').classList.remove('active');
        $('abLoopBtn').textContent = 'A-B Loop';
      }
    };
  }

  const toggleKaraoke = () => {
    const nextState = !engine.karaokeEnabled;
    engine.setKaraoke(nextState);
    if ($('karaokeToggleBtn')) {
      $('karaokeToggleBtn').classList.toggle('active-toggle', nextState);
      $('karaokeToggleBtn').textContent = nextState ? tStr('karaokeOn') : tStr('karaokeOff');
    }
    if ($('sheetKaraokeBtn')) $('sheetKaraokeBtn').classList.toggle('active', nextState);
  };
  if ($('karaokeToggleBtn')) $('karaokeToggleBtn').onclick = toggleKaraoke;
  if ($('sheetKaraokeBtn')) $('sheetKaraokeBtn').onclick = toggleKaraoke;

  const toggle8D = () => {
    const next = !engine.orbit8DEnabled;
    engine.set8DAudio(next);
    if ($('toggle8DBtn')) {
      $('toggle8DBtn').classList.toggle('active', next);
      $('toggle8DBtn').textContent = next ? tStr('orbit8DOn') : tStr('orbit8DOff');
    }
    if ($('sheet8DBtn')) $('sheet8DBtn').classList.toggle('active', next);
  };
  if ($('toggle8DBtn')) $('toggle8DBtn').onclick = toggle8D;
  if ($('sheet8DBtn')) $('sheet8DBtn').onclick = toggle8D;

  if ($('sheetGoEqBtn')) {
    $('sheetGoEqBtn').onclick = () => {
      closeNowPlayingSheet();
      switchBottomTab('studio');
    };
  }

  if ($('sheetSaveBtn')) {
    $('sheetSaveBtn').onclick = () => {
      if (!currentTrack) return;
      if (isTrackSavedOffline(currentTrack.id)) {
        unsaveTrackOffline(currentTrack);
      } else {
        saveTrackOfflineInBackground(currentTrack, null);
      }
    };
  }

  if ($('seekBar')) {
    $('seekBar').oninput = (e) => {
      const dur = activeAudio.duration || (currentTrack ? currentTrack.durationMs / 1000 : 0);
      if (dur) activeAudio.currentTime = (Number(e.target.value) / 100) * dur;
    };
  }
  if ($('bassRange')) {
    $('bassRange').oninput = (e) => {
      engine.init();
      engine.setBassBoost(e.target.value);
      $('bassLabel').textContent = `+${e.target.value} dB`;
    };
  }
  if ($('reverbRange')) {
    $('reverbRange').oninput = (e) => {
      engine.setReverb(e.target.value);
      $('reverbLabel').textContent = `${e.target.value}%`;
    };
  }
  if ($('spatialRange')) {
    $('spatialRange').oninput = (e) => {
      engine.init();
      engine.setSpatial3D(e.target.value);
      $('spatialLabel').textContent = `${e.target.value}%`;
    };
  }
  if ($('speedRange')) {
    $('speedRange').oninput = (e) => {
      activeAudio.playbackRate = Number(e.target.value);
      $('speedLabel').textContent = `${e.target.value}x`;
    };
  }
  if ($('toggleCompressorBtn')) {
    $('toggleCompressorBtn').onclick = () => {
      const next = !engine.compressorEnabled;
      engine.setCompressor(next);
      $('toggleCompressorBtn').classList.toggle('active', next);
      $('toggleCompressorBtn').textContent = next ? tStr('compressorOn') : tStr('compressorOff');
    };
  }

  if ($('nowLikeBtn')) $('nowLikeBtn').onclick = () => toggleFavorite(currentTrack);
  if ($('miniLikeBtn')) $('miniLikeBtn').onclick = (e) => { e.stopPropagation(); toggleFavorite(currentTrack); };
  if ($('themeSelect')) $('themeSelect').onchange = (e) => applyTheme(e.target.value);
  if ($('langSelect')) $('langSelect').onchange = (e) => applyLanguage(e.target.value);

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(btn.dataset.tab).classList.add('active');
    };
  });
  document.querySelectorAll('[data-viz]').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('[data-viz]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      engine.vizMode = btn.dataset.viz;
    };
  });

  // ---------------- البحث الفوري ----------------
  let searchTimer = null;

  async function executeSearchQuery(q) {
    const clean = (q || '').trim();
    if (!clean) {
      selectCategory(activeCategory);
      return;
    }
    $('heroTag').textContent = currentLang === 'en' ? 'Online + Offline Search' : 'بحث فوري (أونلاين + أوفلاين)';
    $('heroTitle').textContent = `"${clean}"`;

    const offlineMatches = getOfflineTrackList().filter(
      (t) => t.title.toLowerCase().includes(clean.toLowerCase()) || t.artist.toLowerCase().includes(clean.toLowerCase())
    );
    if (offlineMatches.length) {
      displayedTracks = offlineMatches;
      renderTracks(displayedTracks);
    }

    const onlineResults = await fetchFullTracks([clean]);
    if (onlineResults.length) {
      const merged = [...offlineMatches];
      const seen = new Set(merged.map((x) => x.id));
      for (const r of onlineResults) {
        if (!seen.has(r.id)) merged.push(r);
      }
      displayedTracks = merged;
      renderTracks(displayedTracks);
    }
  }

  $('searchInput').onfocus = () => renderSearchHistoryDropdown();
  $('searchInput').onkeydown = (e) => {
    if (e.key === 'Enter') {
      const q = $('searchInput').value.trim();
      if (q.length >= 2) {
        saveSearchTerm(q);
        $('searchHistoryDropdown').hidden = true;
        switchBottomTab('home');
        executeSearchQuery(q);
        $('searchInput').blur();
      }
    }
  };
  $('searchInput').oninput = (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    if ($('searchClearInputBtn')) $('searchClearInputBtn').hidden = !q;
    if (!q) {
      renderSearchHistoryDropdown();
      selectCategory(activeCategory);
      return;
    }
    searchTimer = setTimeout(() => {
      switchBottomTab('home');
      executeSearchQuery(q);
    }, 380);
  };
  if ($('searchClearInputBtn')) {
    $('searchClearInputBtn').onclick = () => {
      $('searchInput').value = '';
      $('searchClearInputBtn').hidden = true;
      $('searchHistoryDropdown').hidden = true;
      selectCategory(activeCategory);
    };
  }
  if ($('clearSearchHistoryBtn')) {
    $('clearSearchHistoryBtn').onclick = (e) => {
      e.stopPropagation();
      searchHistory = [];
      try {
        localStorage.removeItem('geo_ios_search_history_v1');
      } catch (_) {}
      $('searchHistoryDropdown').hidden = true;
    };
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchWrapBox') && $('searchHistoryDropdown')) {
      $('searchHistoryDropdown').hidden = true;
    }
    if (!e.target.closest('#addArtistWrap') && !e.target.closest('#addArtistToggleBtn') && $('artistSuggestDropdown')) {
      $('artistSuggestDropdown').hidden = true;
    }
  });

  function handleLocalFiles(files) {
    for (const file of files) {
      if (!file.type.startsWith('audio/') && !/\.(mp3|m4a|wav|aac|flac|ogg)$/i.test(file.name)) continue;
      const url = URL.createObjectURL(file);
      localTracks.unshift({
        id: 'local_' + Date.now() + '_' + Math.random(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'iPhone Files',
        album: 'Local',
        durationFormatted: 'Local',
        cover: DEFAULT_COVER,
        directAudioUrl: url,
        isLocal: true
      });
    }
    if ($('localCountBadge')) $('localCountBadge').textContent = localTracks.length;
    if ($('optionsModalOverlay')) $('optionsModalOverlay').hidden = true;
    switchBottomTab('local');
    if (localTracks[0]) loadTrack(localTracks[0], true);
  }
  if ($('uploadBox')) $('uploadBox').onclick = () => $('fileInput').click();
  if ($('localTabAddBtn')) $('localTabAddBtn').onclick = () => $('fileInput').click();
  if ($('fileInput')) $('fileInput').onchange = (e) => handleLocalFiles(e.target.files);

  if ($('sleepBtn')) {
    $('sleepBtn').onclick = () => {
      clearTimeout(sleepTimerId);
      const msg =
        currentLang === 'en'
          ? 'Enter minutes for Sleep Timer (e.g. 15, 30, or 0 to cancel):'
          : 'أدخل عدد الدقائق لإيقاف الموسيقى تلقائياً (مثلاً 15 أو 30، أو 0 للإلغاء):';
      const mins = prompt(msg, '15');
      const m = Number(mins);
      if (m > 0) {
        sleepTimerId = setTimeout(() => {
          audioDsp.pause();
          audioNative.pause();
        }, m * 60000);
        $('sleepBtn').classList.add('active');
      } else {
        $('sleepBtn').classList.remove('active');
      }
    };
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  initEqualizerUI();
  loadInitialCatalog();
})();
