
import React, { useState, useEffect } from 'react';
import { GraduationCap, PlayCircle, Lock, X, Clock, Star, Plus, Trash2, Video, Save, ChevronLeft, BookOpen, CheckCircle2, Send, FileText, Edit2, UserCheck, MessageSquare, ThumbsUp, ThumbsDown, PenTool, Layout, Monitor, LogIn, ChevronDown, ShieldCheck, Zap } from 'lucide-react';
import { db } from '../firebase';
import { Course, Lesson, ViewProps } from '../types';
import { LoadingSpinner } from '../components/GlassComponents';
import { t } from '../services/translations';

// Note: Dynamic course content from Firebase remains in its original language unless structure supports multilingual fields.
// For this demo, static UI elements are translated.

const INITIAL_COURSES: Course[] = [
    {
        id: 'target_pro',
        title: 'Таргет: Быстрый Старт',
        marketingHook: 'Запусти рекламу в Instagram за 3 дня и получи первых клиентов',
        description: 'Полный курс по настройке рекламы в Instagram/Facebook. От создания бизнес-менеджера до первых лидов. Идеально для новичков и владельцев бизнеса.',
        features: [
            'Настройка Business Manager без банов',
            'Секреты дешевого клика в 2025',
            'Готовые шаблоны продающих креативов'
        ],
        duration: '2.5 часа',
        price: 14990,
        lessons: [
            { id: 'l1', title: 'Урок 1: Подготовка', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', description: 'Создание Business Manager и привязка карт.', homeworkTask: 'Создайте БМ и прикрепите скриншот настроек.' },
            { id: 'l2', title: 'Урок 2: Аудитории', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', description: 'Как найти платежеспособных клиентов.', homeworkTask: 'Опишите 3 аватара вашей целевой аудитории.' },
            { id: 'l3', title: 'Урок 3: Креативы', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', description: 'Создаем рекламные макеты в X5.', homeworkTask: 'Сделайте 3 креатива через раздел Фото Lab.' }
        ]
    },
    {
        id: 'ai_neural',
        title: 'Нейросети для Бизнеса',
        marketingHook: 'Автоматизируй 80% рутины и уволь ассистента',
        description: 'Как использовать AI для контента, продаж и юридических вопросов. Полное руководство по внедрению ChatGPT и Midjourney.',
        features: [
            'Пишем контент-план за 5 минут',
            'Генерируем фото товаров без фотографа',
            'Автоответы клиентам 24/7'
        ],
        duration: '4 часа',
        price: 19990,
        lessons: [
            { id: 'n1', title: 'Введение в LLM', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', description: 'Что такое промпт-инжиниринг.', homeworkTask: 'Напишите промпт для создания КП.' },
            { id: 'n2', title: 'Генерация Видео', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', description: 'Работа с Veo и анимацией.', homeworkTask: 'Анимируйте логотип через Veo.' },
            { id: 'n3', title: 'Автоматизация', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', description: 'Интеграция в CRM.', homeworkTask: 'Опишите процесс, который хотите автоматизировать.' }
        ]
    }
];

const MOCK_HOMEWORKS = [
    { id: 'hw1', student: 'Алина К.', course: 'Таргет: Быстрый Старт', lesson: 'Урок 1', text: 'Я создала БМ, но карта не привязывается. Вот скриншот...', time: '10 мин назад' },
    { id: 'hw2', student: 'Ержан Б.', course: 'Нейросети для Бизнеса', lesson: 'Генерация Видео', text: 'Сделал анимацию логотипа для кофейни. Ссылка: instagram.com/reel/...', time: '1 час назад' },
];

export const CoursesView: React.FC<ViewProps> = ({ user, onBuyCourse, onNavigate, onBack, onToggleTabBar, language = 'ru' }) => {
  const [viewState, setViewState] = useState<'list' | 'course_landing' | 'course_detail' | 'lesson_player' | 'admin_homework'>('list');
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Homework State
  const [homeworkText, setHomeworkText] = useState('');
  const [homeworkSent, setHomeworkSent] = useState(false);
  const [adminHomeworks, setAdminHomeworks] = useState(MOCK_HOMEWORKS);

  const [showEditor, setShowEditor] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Admin Form State
  const [courseForm, setCourseForm] = useState<Partial<Course>>({
      title: '',
      description: '',
      marketingHook: '',
      features: [],
      price: 14990,
      duration: '1 час',
      lessons: []
  });
  const [newFeature, setNewFeature] = useState('');
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ title: '', videoUrl: '', description: '', homeworkTask: '' });

  // Reset Tab Bar when unmounting or returning to list
  useEffect(() => {
      // Ensure tab bar is visible when mounting the main list
      if (onToggleTabBar) onToggleTabBar(true);
      
      return () => {
          // Safety reset on unmount
          if (onToggleTabBar) onToggleTabBar(true);
      };
  }, []);

  // Fetch Courses
  useEffect(() => {
      const unsubscribe = db.collection('courses').onSnapshot(snapshot => {
          if (snapshot.empty) {
              setCourses(INITIAL_COURSES);
          } else {
              const fetchedCourses = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              })) as Course[];
              setCourses(fetchedCourses);
          }
          setLoading(false);
      });
      return () => unsubscribe();
  }, []);

  const openEditModal = (course?: Course) => {
      if (course) {
          setEditingCourseId(course.id);
          setCourseForm({ ...course });
      } else {
          setEditingCourseId(null);
          setCourseForm({ title: '', description: '', marketingHook: '', features: [], price: 14990, duration: '1 час', lessons: [] });
      }
      setShowEditor(true);
  };

  const handleSaveCourse = async () => {
      if (!courseForm.title || !user?.id) return;
      try {
          const payload = {
              ...courseForm,
              authorId: user.id,
              lessons: courseForm.lessons || []
          };
          if (editingCourseId) {
              await db.collection('courses').doc(editingCourseId).update(payload);
          } else {
              await db.collection('courses').add(payload);
          }
          setShowEditor(false);
      } catch (e) {
          console.error("Error saving course", e);
          alert("Error saving");
      }
  };

  const handleAddFeature = () => {
      if(newFeature.trim()) {
          setCourseForm(prev => ({ ...prev, features: [...(prev.features || []), newFeature] }));
          setNewFeature('');
      }
  };

  const handleAddLessonToForm = () => {
      if (!newLesson.title) return;
      const lesson: Lesson = {
          id: Date.now().toString(),
          title: newLesson.title!,
          videoUrl: newLesson.videoUrl || '',
          description: newLesson.description || '',
          homeworkTask: newLesson.homeworkTask || ''
      };
      setCourseForm(prev => ({ ...prev, lessons: [...(prev.lessons || []), lesson] }));
      setNewLesson({ title: '', videoUrl: '', description: '', homeworkTask: '' });
  };

  // --- NAVIGATION LOGIC ---
  const handleCourseClick = (course: Course) => {
      setSelectedCourse(course);
      const isOwner = isUserOwner(course);
      const isPurchased = user?.purchasedCourseIds?.includes(course.id);

      // Hide dock when going deeper
      if (onToggleTabBar) onToggleTabBar(false);

      if (isOwner || isPurchased) {
          setViewState('course_detail'); // Go to Dashboard/Lessons
      } else {
          setViewState('course_landing'); // Go to Sales Page
      }
  };

  const handleLessonClick = (lesson: Lesson, index: number) => {
      if (!selectedCourse) return;
      const isOwner = isUserOwner(selectedCourse);
      const isPurchased = user?.purchasedCourseIds?.includes(selectedCourse.id);
      const isFreePreview = index === 0; // First lesson is free hook

      if (isOwner || isPurchased || isFreePreview) {
          setSelectedLesson(lesson);
          setViewState('lesson_player');
          // Hide dock (already hidden usually, but safe to enforce)
          if (onToggleTabBar) onToggleTabBar(false);
          setHomeworkText('');
          setHomeworkSent(false);
      } else {
          // If trying to access locked lesson, show landing
          setViewState('course_landing');
      }
  };

  const handleInternalBack = () => {
      if (viewState === 'lesson_player') {
          // Check ownership to decide where to go back
          const isOwner = selectedCourse && isUserOwner(selectedCourse);
          const isPurchased = selectedCourse && user?.purchasedCourseIds?.includes(selectedCourse.id);
          
          if (isOwner || isPurchased) setViewState('course_detail');
          else setViewState('course_landing'); // If watching free preview
          
          setSelectedLesson(null);
      } else if (viewState === 'course_detail' || viewState === 'course_landing' || viewState === 'admin_homework') {
          setViewState('list');
          setSelectedCourse(null);
          // Show dock again when returning to list
          if (onToggleTabBar) onToggleTabBar(true);
      } else if (onBack) {
          // Show dock if leaving component entirely (though usually handled by mount/unmount)
          if (onToggleTabBar) onToggleTabBar(true);
          onBack();
      }
  };

  const isUserOwner = (course: Course) => user && !user.isGuest && course.authorId === user.id;

  // --- 1. LANDING PAGE VIEW (SALES) ---
  if (viewState === 'course_landing' && selectedCourse) {
      return (
          <div className="flex flex-col h-full animate-fade-in bg-white relative overflow-y-auto no-scrollbar">
              
              {/* Sticky Back Button */}
              <button onClick={handleInternalBack} className="fixed top-6 left-6 z-50 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20 active:scale-95 transition-transform">
                  <ChevronLeft size={22} className="text-slate-900" />
              </button>

              {/* Hero Section */}
              <div className="relative h-[65vh] w-full shrink-0 overflow-hidden">
                  {/* Abstract Background */}
                  <div className="absolute inset-0 bg-slate-900">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-white"></div>
                      <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
                      <div className="absolute bottom-[20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[80px]"></div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-8 pb-20 z-10">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full self-start mb-6">
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{t('courses_premium', language)}</span>
                      </div>
                      
                      <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] mb-4 tracking-tight drop-shadow-lg">
                          {selectedCourse.title}
                      </h1>
                      
                      <p className="text-lg text-white/90 font-medium leading-relaxed max-w-md drop-shadow-md">
                          {selectedCourse.marketingHook || selectedCourse.description}
                      </p>
                  </div>
              </div>

              {/* Content Section */}
              <div className="px-6 py-10 -mt-10 relative z-20 bg-white rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
                  
                  {/* Benefits Grid */}
                  <div className="mb-12">
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">{t('courses_benefits', language)}</h3>
                      <div className="space-y-4">
                          {(selectedCourse.features || [selectedCourse.description]).map((feature, i) => (
                              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600 mt-0.5">
                                      <CheckCircle2 size={18} />
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 leading-relaxed pt-1">{feature}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Syllabus Teaser */}
                  <div className="mb-24">
                      <div className="flex justify-between items-end mb-6">
                          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em]">{t('courses_syllabus', language)}</h3>
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">{selectedCourse.duration}</span>
                      </div>
                      
                      <div className="relative">
                          {/* Visual Connector Line */}
                          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                          
                          <div className="space-y-6">
                              {selectedCourse.lessons.map((lesson, idx) => (
                                  <div key={lesson.id} className="relative pl-12">
                                      <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center z-10 ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                          <span className="text-xs font-bold">{idx + 1}</span>
                                      </div>
                                      <div onClick={() => idx === 0 && handleLessonClick(lesson, idx)} className={`p-4 rounded-2xl border transition-all ${idx === 0 ? 'bg-white border-slate-200 shadow-sm active:scale-95' : 'bg-slate-50 border-transparent opacity-70'}`}>
                                          <div className="flex justify-between items-center mb-1">
                                              <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
                                              {idx === 0 ? <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">{t('courses_price_free', language)}</span> : <Lock size={12} className="text-slate-400"/>}
                                          </div>
                                          {idx === 0 && <p className="text-xs text-slate-500 line-clamp-2 mt-1">{lesson.description}</p>}
                                      </div>
                                  </div>
                              ))}
                          </div>
                          
                          {/* Fade for locked content */}
                          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
                      </div>
                  </div>
              </div>

              {/* Sticky CTA Bar - Visible because Dock is hidden */}
              <div className="fixed bottom-0 left-0 w-full p-4 pb-8 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-40 flex items-center justify-between shadow-2xl animate-slide-up">
                  <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide line-through decoration-red-400 decoration-2">{(selectedCourse.price * 1.5).toLocaleString()} ₸</p>
                      <p className="text-2xl font-black text-slate-900 leading-none">{selectedCourse.price.toLocaleString()} ₸</p>
                  </div>
                  <button 
                      onClick={() => onBuyCourse && onBuyCourse(selectedCourse)}
                      className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-bold text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-transform flex items-center gap-2"
                  >
                      <span>{t('courses_locked', language)}</span>
                      <ChevronLeft size={16} className="rotate-180" />
                  </button>
              </div>
          </div>
      );
  }

  // --- 2. COURSE DASHBOARD (OWNER VIEW) ---
  if (viewState === 'course_detail' && selectedCourse) {
      const isOwner = isUserOwner(selectedCourse);
      return (
          <div className="flex flex-col h-full animate-fade-in px-6 pt-16 pb-32 overflow-y-auto bg-[#f2f4f6] relative">
              <div className="flex items-center gap-4 mb-6 shrink-0">
                  <button onClick={handleInternalBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                      <ChevronLeft size={20} className="text-slate-900" />
                  </button>
                  <div>
                      <h2 className="text-xl font-extrabold text-slate-900 truncate pr-4">{selectedCourse.title}</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase">{t('courses_my_course', language)}</p>
                  </div>
              </div>

              {/* Creator Tools */}
              {isOwner && (
                  <div className="flex gap-2 mb-6">
                      <button onClick={() => openEditModal(selectedCourse)} className="flex-1 bg-black text-white py-3 rounded-[20px] text-xs font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                          <Edit2 size={14} /> {t('courses_editor', language)}
                      </button>
                      <button onClick={() => setViewState('admin_homework')} className="flex-1 bg-white text-slate-900 border border-slate-200 py-3 rounded-[20px] text-xs font-bold shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                          <UserCheck size={14} /> {t('courses_homework', language)}
                      </button>
                  </div>
              )}

              {/* Progress Card */}
              <div className="bg-white p-6 rounded-[32px] shadow-sm mb-8 border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('courses_my_progress', language)}</span>
                      <span className="text-xs font-bold text-slate-900">0%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[5%] bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 font-medium">{t('courses_keep_learning', language)}</p>
              </div>

              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-2">{t('courses_your_lessons', language)}</h3>

              <div className="space-y-3">
                  {selectedCourse.lessons.map((lesson, idx) => (
                      <button 
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson, idx)}
                        className="w-full bg-white p-4 rounded-[24px] flex items-center gap-4 text-left transition-all border border-slate-100 hover:shadow-md active:scale-[0.98] group"
                      >
                          <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              {idx + 1}
                          </div>
                          <div className="flex-1">
                              <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">{lesson.title}</h4>
                              <div className="flex items-center gap-2">
                                  <Clock size={10} className="text-slate-400" />
                                  <span className="text-[10px] text-slate-400">15 min</span>
                              </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-green-500">
                              <PlayCircle size={18} />
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      );
  }

  // --- 3. LESSON PLAYER ---
  if (viewState === 'lesson_player' && selectedLesson && selectedCourse) {
      return (
        <div className="flex flex-col h-full animate-fade-in relative z-20 bg-black text-white">
            <div className="w-full aspect-video bg-black relative shadow-2xl">
                <video src={selectedLesson.videoUrl} controls className="w-full h-full object-contain" />
                <button onClick={handleInternalBack} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20 z-50 active:scale-95 transition-transform">
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#f2f4f6] text-slate-900 rounded-t-[32px] -mt-6 relative z-10">
                <div className="mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{selectedCourse.title}</span>
                    <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-2">{selectedLesson.title}</h1>
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedLesson.description}</p>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-8">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-50">
                        <FileText size={18} className="text-purple-600" />
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{t('courses_homework', language)}</h3>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-4">
                        {selectedLesson.homeworkTask || "Repeat steps from video."}
                    </p>

                    {!homeworkSent ? (
                        <div className="space-y-3">
                            <textarea 
                                value={homeworkText}
                                onChange={(e) => setHomeworkText(e.target.value)}
                                placeholder="Your answer..."
                                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:bg-white transition-all resize-none"
                            />
                            <button onClick={() => { if(homeworkText) setHomeworkSent(true); }} className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${homeworkText ? 'bg-slate-900 text-white shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400'}`}>
                                <Send size={16} /> Send
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100 text-green-700 font-bold text-sm">
                            <CheckCircle2 size={18} /> Sent successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  }

  // --- 4. ADMIN HOMEWORK CHECK ---
  if (viewState === 'admin_homework') {
      return (
          <div className="flex flex-col h-full animate-fade-in px-6 pt-16 pb-32 overflow-y-auto bg-[#f2f4f6]">
              <div className="flex items-center gap-4 mb-6">
                  <button onClick={handleInternalBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"><ChevronLeft size={20} className="text-slate-900" /></button>
                  <h2 className="text-xl font-extrabold text-slate-900">{t('courses_hw_review', language)}</h2>
              </div>
              <div className="space-y-4">
                  {adminHomeworks.map(hw => (
                      <div key={hw.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
                          <div className="flex justify-between items-start mb-3">
                              <div><h3 className="font-bold text-slate-900">{hw.student}</h3><p className="text-xs text-slate-500">{hw.course}</p></div>
                              <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">{hw.time}</span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-700 mb-4 font-medium">"{hw.text}"</div>
                          <div className="flex gap-2">
                              <button onClick={() => setAdminHomeworks(p => p.filter(h => h.id !== hw.id))} className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg font-bold text-xs">{t('courses_accept', language)}</button>
                              <button onClick={() => setAdminHomeworks(p => p.filter(h => h.id !== hw.id))} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs">{t('courses_reject', language)}</button>
                          </div>
                      </div>
                  ))}
                  {adminHomeworks.length === 0 && <div className="text-center py-12 text-slate-400">{t('courses_all_reviewed', language)}</div>}
              </div>
          </div>
      )
  }

  // --- 5. MAIN LIST VIEW ---
  return (
    <div className="flex flex-col h-full animate-fade-in px-6 pt-16 pb-32 overflow-y-auto bg-[#f2f4f6] relative">
      
      {/* EDITOR MODAL */}
      {showEditor && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#f8fafc] w-full max-w-md rounded-[32px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-900">{t('courses_create', language)}</h3>
                      <button onClick={() => setShowEditor(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <input placeholder="Title" value={courseForm.title} onChange={e => setCourseForm({...courseForm, title: e.target.value})} className="w-full bg-white p-4 rounded-[20px] text-sm font-bold border border-slate-200 outline-none" />
                      
                      {/* Marketing Fields */}
                      <div className="bg-yellow-50 p-4 rounded-[24px] border border-yellow-100">
                          <label className="text-[10px] font-bold text-yellow-600 uppercase mb-2 block flex items-center gap-1"><Zap size={10}/> Hook</label>
                          <textarea placeholder="e.g. Earn your first million..." value={courseForm.marketingHook} onChange={e => setCourseForm({...courseForm, marketingHook: e.target.value})} className="w-full bg-white p-3 rounded-xl text-sm font-medium border-none h-16 resize-none outline-none mb-3" />
                          
                          <label className="text-[10px] font-bold text-yellow-600 uppercase mb-2 block">Benefits (Bullets)</label>
                          <div className="flex gap-2 mb-2">
                              <input placeholder="+ Add Benefit" value={newFeature} onChange={e => setNewFeature(e.target.value)} className="flex-1 bg-white p-2 rounded-lg text-xs outline-none" />
                              <button onClick={handleAddFeature} className="bg-yellow-400 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">+</button>
                          </div>
                          <div className="space-y-1">
                              {courseForm.features?.map((f, i) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-yellow-800 bg-white/50 px-2 py-1 rounded"><CheckCircle2 size={10}/> {f}</div>
                              ))}
                          </div>
                      </div>

                      <textarea placeholder="Full Description..." value={courseForm.description} onChange={e => setCourseForm({...courseForm, description: e.target.value})} className="w-full bg-white p-4 rounded-[20px] text-sm font-medium border border-slate-200 outline-none h-24 resize-none" />
                      
                      <div className="flex gap-3">
                          <input type="number" placeholder="Price" value={courseForm.price} onChange={e => setCourseForm({...courseForm, price: parseInt(e.target.value)})} className="flex-1 bg-white p-4 rounded-[20px] text-sm font-bold border border-slate-200 outline-none" />
                          <input placeholder="Duration" value={courseForm.duration} onChange={e => setCourseForm({...courseForm, duration: e.target.value})} className="flex-1 bg-white p-4 rounded-[20px] text-sm font-bold border border-slate-200 outline-none" />
                      </div>

                      <div className="h-px bg-slate-200 my-2"></div>
                      
                      <div className="bg-white p-4 rounded-[24px] border border-slate-200">
                          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">New Lesson</h4>
                          <input placeholder="Lesson Title" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl text-xs font-bold mb-2 outline-none" />
                          <input placeholder="Video URL (mp4)" value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} className="w-full bg-slate-50 p-3 rounded-xl text-xs mb-2 outline-none" />
                          <button onClick={handleAddLessonToForm} className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                      </div>

                      <div className="space-y-1">
                          {courseForm.lessons?.map((l, i) => (
                              <div key={i} className="text-xs text-slate-500 bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                                  <span>{i+1}. {l.title}</span>
                                  <button onClick={() => setCourseForm(p => ({...p, lessons: p.lessons?.filter((_, idx) => idx !== i)}))} className="text-red-400"><Trash2 size={12}/></button>
                              </div>
                          ))}
                      </div>

                      <button onClick={handleSaveCourse} className="w-full py-4 bg-green-500 text-white rounded-[20px] font-bold shadow-lg active:scale-95 transition-transform"><Save size={18} className="inline mr-2"/> {t('btn_save', language)}</button>
                  </div>
              </div>
          </div>
      )}

      {/* Main Header with Back Button */}
      <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-10 h-10 glass-card rounded-full flex items-center justify-center active:scale-95 transition-transform hover:bg-slate-100">
                <ChevronLeft className="text-slate-900" size={22} />
            </button>
            <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">{t('courses_title', language)}</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{t('courses_subtitle', language)}</p>
            </div>
          </div>
      </div>

      <div className="space-y-6">
        {/* Create Button */}
        {!user?.isGuest ? (
            <div onClick={() => openEditModal()} className="h-20 rounded-[32px] border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all active:scale-95 group mb-2 bg-white/50">
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-purple-600 transition-colors">
                    <Plus size={20} /> <span className="text-xs font-bold uppercase tracking-widest">{t('courses_create', language)}</span>
                </div>
            </div>
        ) : (
            <div onClick={() => onNavigate && onNavigate('profile')} className="h-20 rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer bg-slate-50 transition-all active:scale-95 mb-2">
                <div className="flex items-center gap-2 opacity-60"><LogIn size={18} /> <span className="text-xs font-bold">{t('courses_sign_in', language)}</span></div>
            </div>
        )}

        {/* Course List */}
        {loading ? <LoadingSpinner /> : courses.map((course) => {
          const isPurchased = user?.purchasedCourseIds?.includes(course.id);
          const isOwner = isUserOwner(course);
          
          return (
          <div key={course.id} onClick={() => handleCourseClick(course)} className="group relative h-64 overflow-hidden rounded-[32px] cursor-pointer transition-all duration-500 active:scale-[0.98] border border-white shadow-xl shadow-slate-200">
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isPurchased || isOwner ? "from-emerald-600 to-teal-800" : "from-slate-800 to-black"}`}>
                <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-white/10 rounded-full blur-[60px]" />
            </div>

            {/* Owner Actions */}
            {isOwner && (
                <div className="absolute top-4 right-4 z-30 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(course); }} className="bg-white/20 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"><Edit2 size={16} /></button>
                </div>
            )}

            <div className="relative p-7 flex flex-col h-full justify-between z-10">
              <div className="flex justify-between items-start">
                 <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider`}>
                    <Video size={10} /> {course.lessons?.length || 0} Lessons
                 </div>
                 {!isPurchased && !isOwner && (
                     <div className="bg-white text-black px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                         {course.price.toLocaleString()} ₸
                     </div>
                 )}
              </div>

              <div>
                   <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-md pr-8 line-clamp-2">{course.title}</h3>
                   <p className="text-xs text-white/70 font-medium line-clamp-2 leading-relaxed mb-5 max-w-[90%]">
                       {course.marketingHook || course.description}
                   </p>
                   
                   <div className="flex items-center gap-3">
                       <div className={`h-10 px-5 rounded-full flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-all ${isPurchased || isOwner ? 'bg-white text-emerald-700' : 'bg-white/20 text-white backdrop-blur-md border border-white/20 group-hover:bg-white group-hover:text-black'}`}>
                           {isPurchased || isOwner ? t('courses_continue', language) : t('courses_start', language)}
                       </div>
                   </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
};
