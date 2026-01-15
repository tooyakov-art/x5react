
// ... existing imports ...
import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Briefcase, Zap, PenTool, Smartphone, Code, Megaphone, FileText, Layout, ChevronLeft, Star, MessageCircle, Plus, CheckCircle2, User as UserIcon, Edit3, Trash2 } from 'lucide-react';
import { ViewProps, Specialist } from '../types';
import { t } from '../services/translations';
import { db } from '../firebase';
import firebase from 'firebase/compat/app';

interface SpecialistData extends Specialist {
    categoryId: string;
    description?: string;
}

export const HireView: React.FC<ViewProps> = ({ onNavigate, user, language = 'ru' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [specialists, setSpecialists] = useState<SpecialistData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
      role: '',
      price: '',
      categoryId: 'marketing',
      description: ''
  });

  // Fetch Real Specialists
  useEffect(() => {
      const unsubscribe = db.collection('specialists').onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpecialistData));
          setSpecialists(data);
          setLoading(false);
      });
      return () => unsubscribe();
  }, []);

  const categories = [
      { id: 'marketing', title: t('hire_cat_marketing', language), icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50' },
      { id: 'design', title: t('hire_cat_design', language), icon: PenTool, color: 'text-pink-600', bg: 'bg-pink-50' },
      { id: 'smm', title: 'SMM & Stories', icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-50' },
      { id: 'dev', title: 'IT & Разработка', icon: Code, color: 'text-slate-700', bg: 'bg-slate-100' },
      { id: 'copy', title: 'Копирайтинг', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { id: 'video', title: 'Видеомонтаж', icon: Layout, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  // Find my profile
  const myProfile = user ? specialists.find(s => s.id === user.id) : null;

  const handleChat = (spec: Specialist) => {
      if (onNavigate) {
          onNavigate('chat', spec);
      }
  };

  const handleEditProfile = () => {
      if (myProfile) {
          setFormData({
              role: myProfile.role,
              price: myProfile.price.replace(/[^0-9]/g, ''), // Extract number
              categoryId: myProfile.categoryId || 'marketing',
              description: myProfile.description || ''
          });
          setIsRegistering(true);
      }
  };

  const handleDeleteProfile = async () => {
      if (!user) return;
      if (confirm('Вы уверены, что хотите удалить свое объявление?')) {
          try {
              await db.collection('specialists').doc(user.id).delete();
          } catch (e) {
              alert('Ошибка удаления');
          }
      }
  };

  const handlePublishProfile = async () => {
      if (!user) return;
      if (!formData.role || !formData.price) {
          alert("Заполните роль и цену");
          return;
      }

      const newSpecialist = {
          userId: user.id,
          name: user.name,
          avatar: user.avatar || '',
          role: formData.role,
          price: formData.price + ' ₸/час',
          categoryId: formData.categoryId,
          rating: 5.0,
          online: true,
          skills: ['Pro'],
          description: formData.description,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
          // Use user ID as doc ID so one user = one specialist profile
          await db.collection('specialists').doc(user.id).set(newSpecialist);
          setIsRegistering(false);
          setSelectedCategory(formData.categoryId); // Go to category to see result
      } catch (e) {
          console.error("Error publishing profile:", e);
          alert("Ошибка сохранения");
      }
  };

  const handleSupportChat = () => {
      if (onNavigate) {
          onNavigate('chat', {
              id: 'support',
              name: 'X5 HR Manager',
              role: 'Подбор персонала',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
              rating: 5.0,
              price: '',
              skills: [],
              online: true
          });
      }
  }

  // --- REGISTRATION FORM ---
  if (isRegistering) {
      return (
          <div className="flex flex-col h-full animate-fade-in bg-[#f2f4f6] px-6 pt-12 pb-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-8">
                  <button onClick={() => setIsRegistering(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                      <ChevronLeft size={20} className="text-slate-800"/>
                  </button>
                  <h2 className="text-xl font-black text-slate-900">{myProfile ? 'Редактирование' : 'Создание портфолио'}</h2>
              </div>

              <div className="bg-white p-6 rounded-[32px] shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden">
                          {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon className="m-4 text-slate-400"/>}
                      </div>
                      <div>
                          <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500">Ваш профиль</p>
                      </div>
                  </div>

                  <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Категория</label>
                      <div className="grid grid-cols-2 gap-2">
                          {categories.map(cat => (
                              <button 
                                key={cat.id}
                                onClick={() => setFormData({...formData, categoryId: cat.id})}
                                className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${formData.categoryId === cat.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-transparent'}`}
                              >
                                  {cat.title}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Ваша Специальность</label>
                      <input 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        placeholder="Например: Графический Дизайнер"
                        className="w-full bg-slate-50 p-4 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100 transition-all"
                      />
                  </div>

                  <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Цена за час (Тенге)</label>
                      <input 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="5000"
                        type="number"
                        className="w-full bg-slate-50 p-4 rounded-[20px] text-sm font-bold text-slate-900 outline-none focus:ring-2 ring-blue-100 transition-all"
                      />
                  </div>

                  <button 
                    onClick={handlePublishProfile}
                    className="w-full py-4 bg-green-500 text-white rounded-[24px] font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                      <CheckCircle2 size={20} />
                      <span>{myProfile ? 'Сохранить изменения' : 'Опубликовать'}</span>
                  </button>
                  
                  {myProfile && (
                      <button 
                        onClick={() => { handleDeleteProfile(); setIsRegistering(false); }}
                        className="w-full py-4 bg-red-50 text-red-500 rounded-[24px] font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                      >
                          <Trash2 size={18} />
                          <span>Удалить объявление</span>
                      </button>
                  )}
              </div>
          </div>
      )
  }

  // --- MAIN VIEW ---
  return (
    <div className="flex flex-col h-full animate-fade-in bg-[#f2f4f6] overflow-y-auto">
        <div className="px-6 pt-12 pb-6 min-h-full flex flex-col">
            
            {selectedCategory ? (
                // SPECIALISTS LIST VIEW
                <div className="animate-slide-up flex-1">
                    <div className="flex items-center gap-4 mb-6 shrink-0 pt-4">
                        <button onClick={() => setSelectedCategory(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                            <ChevronLeft size={20} className="text-slate-800"/>
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-none">{categories.find(c => c.id === selectedCategory)?.title}</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Топ Специалисты</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {specialists.filter(s => s.categoryId === selectedCategory).length === 0 ? (
                            <div className="text-center py-20 opacity-50">
                                <Briefcase size={40} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-sm font-bold text-slate-500">В этой категории пока пусто</p>
                                <button onClick={() => { setSelectedCategory(null); setIsRegistering(true); }} className="mt-4 text-blue-500 text-xs font-bold uppercase tracking-widest">Станьте первым</button>
                            </div>
                        ) : (
                            specialists.filter(s => s.categoryId === selectedCategory).map((spec) => (
                                <div key={spec.id} className="glass-card p-4 rounded-[24px] bg-white border border-slate-100 flex items-center gap-4 shadow-sm active:scale-[0.99] transition-transform">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                                            {spec.avatar ? <img src={spec.avatar} className="w-full h-full object-cover" alt={spec.name} /> : <UserIcon className="m-3 text-slate-400" />}
                                        </div>
                                        {spec.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-slate-900 text-sm truncate">{spec.name}</h3>
                                            <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded text-[10px] text-yellow-700 font-bold">
                                                <Star size={10} className="fill-yellow-500 text-yellow-500" />
                                                {spec.rating}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium truncate">{spec.role}</p>
                                        <p className="text-xs font-bold text-slate-900 mt-1">{spec.price}</p>
                                    </div>

                                    {spec.id !== user?.id && (
                                        <button 
                                            onClick={() => handleChat(spec)}
                                            className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/20 active:scale-95 transition-transform"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                    {/* SPACER for Dock */}
                    <div className="h-32 w-full"></div>
                </div>
            ) : (
                // CATEGORIES LIST VIEW
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 shrink-0 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                                <Briefcase size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 leading-none tracking-tight">{t('hire_title', language)}</h2>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1.5">{t('hire_subtitle', language)}</p>
                            </div>
                        </div>
                        {/* INBOX BUTTON */}
                        <button 
                            onClick={() => onNavigate && onNavigate('chats_list')}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 text-slate-900 active:scale-90 transition-transform relative"
                        >
                            <MessageCircle size={22} />
                            {/* Unread Indicator Mockup */}
                            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></div>
                        </button>
                    </div>

                    {/* MANAGE MY PROFILE BUTTON OR ADD */}
                    {myProfile ? (
                        <div className="w-full bg-white p-5 rounded-[28px] shadow-lg shadow-emerald-900/5 border border-emerald-100 mb-8 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[18px] bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Briefcase size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">Мое объявление</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{myProfile.role}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleEditProfile}
                                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                <Edit3 size={18} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsRegistering(true)}
                            className="w-full bg-white p-5 rounded-[28px] flex items-center gap-4 shadow-lg shadow-blue-900/5 border border-blue-100 mb-8 active:scale-[0.98] transition-transform group"
                        >
                            <div className="w-12 h-12 rounded-[18px] bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                                <Plus size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-base font-extrabold text-slate-900 leading-tight">Добавить свое портфолио</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Станьте специалистом и получайте заказы</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors"/>
                        </button>
                    )}

                    <div className="relative mb-8">
                        <input 
                            placeholder={t('hire_search', language)}
                            className="w-full bg-white h-16 pl-14 pr-4 rounded-[24px] text-[15px] font-bold text-slate-900 shadow-lg shadow-slate-200/50 border border-transparent focus:border-blue-500 transition-all outline-none placeholder:text-slate-400"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                    </div>

                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className="w-full bg-white p-5 rounded-[28px] flex items-center justify-between shadow-sm border border-slate-100 active:scale-[0.98] transition-transform group hover:bg-white/80"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center ${cat.bg} ${cat.color}`}>
                                        <cat.icon size={30} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{cat.title}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1">Посмотреть профили</p>
                                    </div>
                                </div>
                                
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                    <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Не нашли нужного?</span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight mb-2">Оставьте заявку на подбор</h3>
                            <p className="text-sm text-slate-400 mb-6 max-w-[90%] leading-relaxed">Наш AI-HR подберет специалиста под вашу задачу за 15 минут.</p>
                            <button 
                                onClick={handleSupportChat}
                                className="bg-white text-slate-900 px-6 py-3.5 rounded-[20px] text-sm font-bold uppercase tracking-wider shadow-lg active:scale-95 transition-transform hover:bg-slate-100 w-full sm:w-auto"
                            >
                                Создать заявку
                            </button>
                        </div>
                        <div className="absolute right-[-30px] top-[-30px] w-40 h-40 bg-blue-600/30 rounded-full blur-[50px]"></div>
                        <div className="absolute left-[-20px] bottom-[-20px] w-32 h-32 bg-purple-600/20 rounded-full blur-[40px]"></div>
                    </div>

                    {/* SPACER for Dock */}
                    <div className="h-40 w-full"></div>
                </div>
            )}
        </div>
    </div>
  );
};
