
import { Language } from '../types';

export const translations = {
  ru: {
    // NAV
    nav_home: "Главная", nav_courses: "Академия", nav_profile: "Профиль", nav_chat: "Чат", nav_analytics: "Аналитика", nav_hire: "Биржа",
    
    // HOME
    welcome: "Привет", creative_os: "Creative OS",
    home_banner_ads: "Рекламные Баннеры", home_banner_ads_desc: "С продающим текстом",
    home_banner_lookbook: "Фешн Съемка", home_banner_lookbook_desc: "В 1 клик",
    home_banner_cyber: "Меняй Локацию", home_banner_cyber_desc: "AI Фон",
    home_banner_product: "Предметная Съемка", home_banner_product_desc: "Продающие фото",
    home_tool_insta: "Упаковка", home_tool_insta_desc: "Instagram Pro",
    home_tool_video: "Видео Мейкер", home_tool_video_desc: "Reels & Shorts",
    home_tool_logo: "Создать Лого", home_tool_logo_desc: "AI Логотипы",
    home_tool_brand: "Брендинг", home_tool_brand_desc: "Мокапы & Мерч",
    home_veo_title: "Veo Animator", home_veo_desc: "Оживи фото",
    home_chat_btn: "AI Ментор", home_chat_desc: "Бизнес Ассистент",
    tool_photo: "Фото Lab", tool_design: "Дизайн", tool_contract: "Договор", tool_video: "Видео Мейкер", tool_courses: "Академия", tool_all: "Все",
    
    // COURSES
    courses_title: "Академия", courses_subtitle: "База знаний X5",
    courses_premium: "Премиум Курс", courses_benefits: "Что вы получите", courses_syllabus: "Программа курса",
    courses_my_course: "Мой Курс", courses_my_progress: "Мой Прогресс", courses_editor: "Редактор", courses_homework: "Домашка",
    courses_keep_learning: "Продолжайте обучение для сертификации", courses_your_lessons: "Ваши Уроки",
    courses_hw_review: "Проверка ДЗ", courses_accept: "Принять", courses_reject: "Отклонить", courses_all_reviewed: "Все проверено!",
    courses_create: "Создать Курс", courses_sign_in: "Войти как Автор",
    courses_price_free: "Бесплатно", courses_locked: "Купить доступ", courses_continue: "Продолжить", courses_start: "Начать",

    // PROFILE
    profile_title: "Профиль", profile_guest: "Гость", profile_credits: "Баланс", profile_buy: "Пополнить", profile_upgrade: "Улучшить до Pro",
    profile_login_promo: "Войдите в аккаунт", profile_login_desc: "Сохраните историю и получите Pro.", profile_login_btn: "Войти / Создать",
    profile_stats: "Статистика", profile_contracts: "Договоров", profile_creatives: "Креативов",
    profile_sub_basic: "Basic Plan", profile_sub_pro: "Pro Member", profile_sub_black: "Black Member",
    profile_history: "История", profile_history_empty: "История пуста", profile_history_guest: "Войдите, чтобы сохранять историю",
    
    // SETTINGS
    settings_title: "Настройки", settings_account: "Аккаунт", settings_language: "Язык", settings_info: "Инфо", settings_support: "Поддержка",
    settings_offer: "Публичная оферта", settings_privacy: "Безопасность", settings_payment: "Оплата и Возврат", settings_system: "Система",
    settings_faceid: "Face ID Вход", settings_touchid: "Вход по отпечатку", settings_ram: "Сброс RAM", settings_reload: "Перезагрузить", settings_logout: "Выйти", settings_platform: "Окружение",
    
    // AUTH
    auth_welcome_title: "Маркетинг OS", auth_welcome_desc: "Элитный ИИ-ассистент для вашего бизнеса.", auth_action_login: "Войти", auth_action_signup: "Создать аккаунт",
    auth_email_placeholder: "Email", auth_pass_placeholder: "Пароль", auth_toggle_login: "Уже есть аккаунт? Войти", auth_toggle_signup: "Нет аккаунта? Создать",
    auth_google: "Войти через Google", auth_apple: "Войти через Apple", auth_guest: "Войти как Гость",
    auth_terms: "Я принимаю условия оферты и политики конфиденциальности",

    // PAYWALL
    pay_pro_plan: "Pro Plan", pay_month: "В месяц", pay_features_model: "Gemini 2.5 Pro Model", pay_features_img: "4K Image Generation", pay_features_video: "Veo Video Creator",
    pay_btn: "Оплатить", pay_restore: "Восстановить", pay_secure: "Безопасный платеж SSL",

    // ANALYTICS
    analytics_title: "Traffic Core", analytics_subtitle: "Трекинг ссылок", analytics_input: "Вставьте ссылку на ваш сайт...", analytics_btn_create: "Создать",
    analytics_empty: "Нет активных ссылок", analytics_clicks: "кликов", analytics_locked_title: "Аналитика закрыта", analytics_locked_desc: "Войдите в аккаунт для доступа.",

    // HIRE / EXPERTS
    hire_title: "X5 Team", hire_subtitle: "Топ Специалисты", hire_search: "Найти маркетолога, дизайнера...",
    hire_cat_all: "Все", hire_cat_marketing: "Маркетинг", hire_cat_design: "Дизайн", hire_cat_smm: "SMM", hire_cat_dev: "Разработка",
    hire_btn_write: "Написать", hire_status_online: "В сети",

    // CHAT
    chat_title: "AI Ментор", chat_subtitle: "Online", chat_placeholder: "Сообщение...", chat_empty_title: "Чат с Ментором", chat_empty_desc: "Задайте вопрос или попросите совета.",

    // VIDEO & INSTAGRAM
    video_setup_title: "Reels Maker", video_setup_subtitle: "One-Click Gen", video_upload: "Загрузить Видео", video_upload_desc: "Вертикальный формат 9:16",
    video_prompt_label: "Задача для AI", video_prompt_placeholder: "Например: Скидка 50% на все товары...", video_variants: "Варианты",
    insta_title: "Instagram AI", insta_mode_std: "Standard", insta_mode_pro: "Pro Quality", insta_topic: "Тема / Бренд", insta_desc: "О чем пост?", insta_btn_plan: "Создать план",
    veo_title: "Veo Animator", veo_subtitle: "Image to Video AI", veo_mode_animate: "Оживить (1 Фото)", veo_mode_morph: "Морфинг (2 Фото)", veo_btn_gen: "Создать Видео",

    // COMMON
    btn_generate: "Сгенерировать", btn_save: "Сохранить", btn_back: "Назад", btn_download: "Скачать", btn_share: "Поделиться", btn_copy: "Копировать", btn_copied: "Скопировано",
  },
  en: {
    nav_home: "Home", nav_courses: "Academy", nav_profile: "Profile", nav_chat: "Chat", nav_analytics: "Analytics", nav_hire: "Experts",
    
    welcome: "Hello", creative_os: "Creative OS",
    home_banner_ads: "Ad Banners", home_banner_ads_desc: "With selling text",
    home_banner_lookbook: "Fashion Shoot", home_banner_lookbook_desc: "In 1 click",
    home_banner_cyber: "Change Location", home_banner_cyber_desc: "AI Background",
    home_banner_product: "Product Shoot", home_banner_product_desc: "Sales photos",
    home_tool_insta: "Social Pack", home_tool_insta_desc: "Instagram Pro",
    home_tool_video: "Video Maker", home_tool_video_desc: "Reels & Shorts",
    home_tool_logo: "Create Logo", home_tool_logo_desc: "AI Logos",
    home_tool_brand: "Branding", home_tool_brand_desc: "Mockups & Merch",
    home_veo_title: "Veo Animator", home_veo_desc: "Animate Photos",
    home_chat_btn: "AI Mentor", home_chat_desc: "Business Assistant",
    tool_photo: "Photo Lab", tool_design: "Design", tool_contract: "Legal AI", tool_video: "Video Maker", tool_courses: "Academy", tool_all: "All Tools",
    
    courses_title: "Academy", courses_subtitle: "Knowledge Base",
    courses_premium: "Premium Course", courses_benefits: "Benefits", courses_syllabus: "Syllabus",
    courses_my_course: "My Course", courses_my_progress: "My Progress", courses_editor: "Editor", courses_homework: "Homework",
    courses_keep_learning: "Keep learning to get certified", courses_your_lessons: "Your Lessons",
    courses_hw_review: "Homework Review", courses_accept: "Accept", courses_reject: "Reject", courses_all_reviewed: "All reviewed!",
    courses_create: "Create Course", courses_sign_in: "Sign in as Creator",
    courses_price_free: "Free", courses_locked: "Unlock", courses_continue: "Continue", courses_start: "Start",

    profile_title: "Profile", profile_guest: "Guest", profile_credits: "Credits", profile_buy: "Top Up", profile_upgrade: "Upgrade to Pro",
    profile_login_promo: "Sign In", profile_login_desc: "Save history and get Pro features.", profile_login_btn: "Login / Sign Up",
    profile_stats: "Statistics", profile_contracts: "Contracts", profile_creatives: "Creatives",
    profile_sub_basic: "Basic Plan", profile_sub_pro: "Pro Member", profile_sub_black: "Black Member",
    profile_history: "History", profile_history_empty: "History is empty", profile_history_guest: "Sign in to save history",

    settings_title: "Settings", settings_account: "Account", settings_language: "Language", settings_info: "Info", settings_support: "Support",
    settings_offer: "Terms of Service", settings_privacy: "Privacy Policy", settings_payment: "Payment & Refund", settings_system: "System",
    settings_faceid: "Face ID Login", settings_touchid: "Fingerprint Login", settings_ram: "Reset RAM", settings_reload: "Reload App", settings_logout: "Log Out", settings_platform: "Environment",
    
    auth_welcome_title: "Marketing OS", auth_welcome_desc: "Elite AI Assistant for your business.", auth_action_login: "Login", auth_action_signup: "Create Account",
    auth_email_placeholder: "Email", auth_pass_placeholder: "Password", auth_toggle_login: "Have an account? Login", auth_toggle_signup: "No account? Sign Up",
    auth_google: "Sign in with Google", auth_apple: "Sign in with Apple", auth_guest: "Continue as Guest",
    auth_terms: "I accept Terms of Service and Privacy Policy",

    pay_pro_plan: "Pro Plan", pay_month: "Per Month", pay_features_model: "Gemini 2.5 Pro Model", pay_features_img: "4K Image Generation", pay_features_video: "Veo Video Creator",
    pay_btn: "Pay", pay_restore: "Restore", pay_secure: "Secure SSL Payment",

    analytics_title: "Traffic Core", analytics_subtitle: "Link Tracking", analytics_input: "Paste your website link...", analytics_btn_create: "Create",
    analytics_empty: "No active links", analytics_clicks: "clicks", analytics_locked_title: "Analytics Locked", analytics_locked_desc: "Sign in to access analytics.",

    hire_title: "X5 Team", hire_subtitle: "Top Specialists", hire_search: "Find marketer, designer...",
    hire_cat_all: "All", hire_cat_marketing: "Marketing", hire_cat_design: "Design", hire_cat_smm: "SMM", hire_cat_dev: "Dev",
    hire_btn_write: "Contact", hire_status_online: "Online",

    chat_title: "AI Mentor", chat_subtitle: "Online", chat_placeholder: "Message...", chat_empty_title: "Chat with Mentor", chat_empty_desc: "Ask a question or get advice.",

    video_setup_title: "Reels Maker", video_setup_subtitle: "One-Click Gen", video_upload: "Upload Video", video_upload_desc: "Vertical 9:16 format",
    video_prompt_label: "AI Task", video_prompt_placeholder: "E.g.: 50% discount on all items...", video_variants: "Variants",
    insta_title: "Instagram AI", insta_mode_std: "Standard", insta_mode_pro: "Pro Quality", insta_topic: "Topic / Brand", insta_desc: "Post description?", insta_btn_plan: "Create Plan",
    veo_title: "Veo Animator", veo_subtitle: "Image to Video AI", veo_mode_animate: "Animate (1 Photo)", veo_mode_morph: "Morph (2 Photos)", veo_btn_gen: "Create Video",

    btn_generate: "Generate", btn_save: "Save", btn_back: "Back", btn_download: "Download", btn_share: "Share", btn_copy: "Copy", btn_copied: "Copied",
  },
  // Default fallback for other languages to English for now, can be expanded
  cn: {
     nav_home: "首页", nav_courses: "学院", nav_profile: "个人资料", nav_chat: "聊天", nav_analytics: "分析",
     welcome: "你好", creative_os: "创意 OS",
     profile_title: "个人资料", profile_guest: "访客", profile_credits: "积分", profile_buy: "充值", profile_upgrade: "升级 Pro",
     settings_title: "设置", settings_logout: "退出",
     btn_generate: "生成", btn_save: "保存", btn_back: "返回",
  },
  kz: {
    nav_home: "Басты", nav_courses: "Академия", nav_profile: "Профиль", nav_chat: "Чат", nav_analytics: "Аналитика", nav_hire: "Мамандар",
    welcome: "Сәлем", creative_os: "Creative OS",
    profile_title: "Профиль", profile_guest: "Қонақ", profile_credits: "Баланс", profile_buy: "Толықтыру", profile_upgrade: "Pro-ға өту",
    settings_title: "Баптаулар", settings_logout: "Шығу",
    settings_faceid: "Face ID кіру", settings_touchid: "Саусақ ізімен кіру",
    btn_generate: "Жасау", btn_save: "Сақтау", btn_back: "Артқа",
    hire_title: "X5 Командасы", hire_subtitle: "Топ Мамандар", hire_search: "Маркетолог іздеу...",
    hire_cat_all: "Барлығы", hire_cat_marketing: "Маркетинг", hire_cat_design: "Дизайн", hire_cat_smm: "SMM", hire_cat_dev: "IT",
    hire_btn_write: "Жазу", hire_status_online: "Желіде",
  }
};

export const t = (key: string, lang: string): string => {
  const dict = (translations as any)[lang];
  // Fallback chain: Requested Lang -> English -> Russian -> Key itself
  if (dict && dict[key]) return dict[key];
  
  const enDict = (translations as any)['en'];
  if (enDict && enDict[key]) return enDict[key];

  const ruDict = (translations as any)['ru'];
  if (ruDict && ruDict[key]) return ruDict[key];

  return key;
};
