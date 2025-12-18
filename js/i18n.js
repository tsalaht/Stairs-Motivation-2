// Simple i18n helper for EN / AR

const I18N_DICTIONARY = {
    en: {
      app_title: 'Stair Motivation',
      welcome_title: 'Welcome',
      welcome_subtitle: 'Climb the stairs, track your progress, and stay motivated!',
      label_name: 'Your name',
      placeholder_name: 'Enter your name',
      label_language: 'Language',
      lang_en: 'English',
      lang_ar: 'Arabic',
      btn_start: 'Start',
      link_scoreboard: 'View Scoreboard',
      link_qr_generator: 'QR Generator',
      footer_note: '8-floor building · 21 steps per floor · No elevator excuses!',
      scanner_title: 'Scan Floor QR',
      scanner_instruction: 'Scan the QR code at your current floor to start.',
      label_timer: 'Time',
      btn_restart_session: 'Restart Session',
      btn_cancel_session: 'Cancel',
      scanner_hint_start: '1) Scan your start floor. 2) Climb. 3) Scan your end floor.',
      result_title: 'Your Result',
      result_summary_title: 'Session Summary',
      label_start_floor: 'Start floor',
      label_end_floor: 'End floor',
      label_floors_climbed: 'Floors climbed',
      label_steps_climbed: 'Steps climbed',
      label_time_spent: 'Time spent',
      label_avg_per_floor: 'Avg time/floor',
      btn_continue_climbing: 'Continue from this floor',
      btn_new_session: 'New Session',
      btn_view_scoreboard: 'View Scoreboard',
      btn_back_home: 'Back to Home',
      scoreboard_title: 'Scoreboard',
      scoreboard_subtitle: 'Top Climbers',
      btn_sort_time: 'Sort by Lowest Time',
      btn_sort_steps: 'Sort by Most Steps',
      th_rank: '#',
      th_name: 'Name',
      th_floors: 'Floors',
      th_steps: 'Steps',
      th_time: 'Time',
      th_date: 'Date',
      scoreboard_empty: 'No climbs yet. Be the first to take the stairs!',
      qrgen_title: 'QR Code Generator',
      qrgen_description: 'Automatically generate QR codes for floors 0–8. Each QR contains the floor number in JSON format.',
      btn_download_pdf: 'Download PDF',
      qr_caption_floor: 'Scan at Floor {floor}',
      error_name_required: 'Please enter your name.',
      error_invalid_qr: 'Invalid QR code. This QR is not a floor code.',
      error_scanner_not_ready: 'Scanner not ready yet.',
      toast_start_floor: 'Start floor: {floor}. Now climb and scan your end floor.',
      toast_end_floor: 'End floor: {floor}. Session saved.',
    btn_lang_ar: 'عربي',
    btn_lang_en: 'English',
    scanner_using_current_floor: 'Current floor: {floor}. Scan your next floor.',
    label_time_elapsed: 'Time Elapsed',
    btn_scan_qr: 'Scan Floor QR Code',
    label_your_rank: 'Your Rank',
    btn_sort_time_short: '⏱ Time',
    btn_sort_steps_short: '🦵 Steps',
  },
    ar: {
      app_title: 'تحفيز السلالم',
      welcome_title: 'مرحباً',
      welcome_subtitle: 'اصعد الدرج، وتتبع تقدمك، وابقَ متحفزاً!',
      label_name: 'اسمك',
      placeholder_name: 'اكتب اسمك',
      label_language: 'اللغة',
      lang_en: 'الإنجليزية',
      lang_ar: 'العربية',
      btn_start: 'ابدأ',
      link_scoreboard: 'عرض لوحة النتائج',
      link_qr_generator: 'مولّد رموز QR',
      footer_note: 'مبنى من 8 طوابق · 21 درجة في كل طابق · لا أعذار للمصعد!',
      scanner_title: 'إمسح رمز الطابق',
      scanner_instruction: 'قم بمسح رمز QR للطابق الذي أنت فيه لبدء الجلسة.',
      label_timer: 'الوقت',
      btn_restart_session: 'إعادة الجلسة',
      btn_cancel_session: 'إلغاء',
      scanner_hint_start: '1) امسح الطابق الذي تبدأ منه. 2) اصعد. 3) امسح الطابق الذي تصل إليه.',
      result_title: 'نتيجة الجلسة',
      result_summary_title: 'ملخص الجلسة',
      label_start_floor: 'الطابق الابتدائي',
      label_end_floor: 'الطابق النهائي',
      label_floors_climbed: 'عدد الطوابق',
      label_steps_climbed: 'عدد الدرجات',
      label_time_spent: 'الوقت المستغرق',
      label_avg_per_floor: 'متوسط الوقت لكل طابق',
      btn_continue_climbing: 'تابع من هذا الطابق',
      btn_new_session: 'جلسة جديدة',
      btn_view_scoreboard: 'عرض لوحة النتائج',
      btn_back_home: 'العودة للصفحة الرئيسية',
      scoreboard_title: 'لوحة النتائج',
      scoreboard_subtitle: 'أفضل المتسلقين',
      btn_sort_time: 'ترتيب حسب أقل وقت',
      btn_sort_steps: 'ترتيب حسب أكثر درجات',
      th_rank: 'الترتيب',
      th_name: 'الاسم',
      th_floors: 'الطوابق',
      th_steps: 'الدرجات',
      th_time: 'الوقت',
      th_date: 'التاريخ',
      scoreboard_empty: 'لا توجد عمليات صعود بعد. كن أول من يستعمل السلالم!',
      qrgen_title: 'مولّد رموز QR',
      qrgen_description: 'يولّد تلقائياً رموز QR للطوابق من 0 إلى 8. يحتوي كل رمز على رقم الطابق بصيغة JSON.',
      btn_download_pdf: 'تحميل ملف PDF',
      qr_caption_floor: 'امسح عند الطابق {floor}',
      error_name_required: 'من فضلك أدخل اسمك.',
      error_invalid_qr: 'رمز QR غير صالح لهذا التطبيق.',
      error_scanner_not_ready: 'القارئ غير جاهز بعد.',
      toast_start_floor: 'طابق البداية: {floor}. الآن اصعد وامسح الطابق الذي تصل إليه.',
      toast_end_floor: 'طابق النهاية: {floor}. تم حفظ الجلسة.',
      btn_lang_ar: 'عربي',
      btn_lang_en: 'English',
      scanner_using_current_floor: 'الطابق الحالي: {floor}. امسح الطابق التالي.',
      label_time_elapsed: 'الوقت المنقضي',
      btn_scan_qr: 'امسح رمز الطابق',
      label_your_rank: 'ترتيبك',
      btn_sort_time_short: '⏱ الوقت',
      btn_sort_steps_short: '🦵 الدرجات',
    },
  };
  
  function getCurrentLang() {
    try {
      const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
      return appState.lang || document.documentElement.dataset.lang || 'en';
    } catch {
      return 'en';
    }
  }
  
  function getI18nText(key) {
    const lang = getCurrentLang();
    return (I18N_DICTIONARY[lang] && I18N_DICTIONARY[lang][key]) || I18N_DICTIONARY.en[key];
  }
  
  // Replace placeholders like {floor} in translation strings
  function i18nFormat(text, params) {
    if (!text || !params) return text;
    return Object.keys(params).reduce((acc, k) => acc.replace(`{${k}}`, params[k]), text);
  }
  
  function applyTranslations() {
    const lang = getCurrentLang();
    const dict = I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;
  
    // Direction & lang attrs
    const isArabic = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  
    // Text content
    document.querySelectorAll('[data-i18n-key]').forEach((el) => {
      const key = el.getAttribute('data-i18n-key');
      if (!key) return;
      const value = dict[key] || I18N_DICTIONARY.en[key] || '';
      el.textContent = value;
    });
  
    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = dict[key] || I18N_DICTIONARY.en[key] || '';
      if ('placeholder' in el) {
        el.placeholder = value;
      }
    });
  
    // Lang toggle button text if present
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = isArabic
        ? I18N_DICTIONARY.en.btn_lang_en
        : I18N_DICTIONARY.ar.btn_lang_ar;
    }
  }
  
  function setLanguage(lang) {
    const safeLang = lang === 'ar' ? 'ar' : 'en';
    const appState = JSON.parse(localStorage.getItem('stairApp') || '{}');
    appState.lang = safeLang;
    localStorage.setItem('stairApp', JSON.stringify(appState));
    applyTranslations();
  }
  
  function toggleLanguage() {
    const current = getCurrentLang();
    const next = current === 'en' ? 'ar' : 'en';
    setLanguage(next);
  }
  
  // Auto-apply translations on DOM ready
  document.addEventListener('DOMContentLoaded', applyTranslations);