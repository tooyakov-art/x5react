
import React, { useState, useEffect, useRef } from 'react';
import { PenTool, ShieldCheck, Sparkles, LayoutGrid, Instagram, Smartphone, PlayCircle, Zap, Box, Tag, Lock, Globe, BarChart2, MessageCircle } from 'lucide-react';
import { ViewState, ViewProps } from '../types';
import { t } from '../services/translations';

export const HomeView: React.FC<ViewProps> = ({ onNavigate, user, language = 'ru' }) => {
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dynamic Content Arrays inside component to use current 'language'
  const bannerStyles = [
    { 
        id: 'ads', 
        headline: t('home_banner_ads', language), 
        sub: t('home_banner_ads_desc', language), 
        img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', 
        view: 'photo' 
    },
    { 
        id: 'lookbook', 
        headline: t('home_banner_lookbook', language), 
        sub: t('home_banner_lookbook_desc', language), 
        img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80', 
        view: 'photo'
    },
    { 
        id: 'cyber', 
        headline: t('home_banner_cyber', language), 
        sub: t('home_banner_cyber_desc', language), 
        img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80', 
        view: 'photo' 
    },
    { 
        id: 'product', 
        headline: t('home_banner_product', language), 
        sub: t('home_banner_product_desc', language), 
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 
        view: 'photo'
    },
  ];

  const featuredTools = [
    { 
      id: 'instagram', 
      label: t('home_tool_insta', language), 
      sub: t('home_tool_insta_desc', language), 
      icon: Instagram, 
      color: 'text-pink-600', 
      bg: 'bg-white',
      border: 'border-pink-100',
      isPro: false
    },
    { 
      id: 'video', 
      label: t('home_tool_video', language), 
      sub: t('home_tool_video_desc', language), 
      icon: Smartphone, 
      color: 'text-indigo-600', 
      bg: 'bg-white',
      border: 'border-indigo-100',
      isPro: true
    },
    {
      id: 'logo',
      label: t('home_tool_logo', language), 
      sub: t('home_tool_logo_desc', language), 
      icon: Box,
      color: 'text-orange-600', 
      bg: 'bg-white',
      border: 'border-orange-100',
      isPro: true
    },
    {
      id: 'branding',
      label: t('home_tool_brand', language), 
      sub: t('home_tool_brand_desc', language), 
      icon: Tag,
      color: 'text-emerald-600', 
      bg: 'bg-white',
      border: 'border-emerald-100',
      isPro: true
    }
  ];

  const categories = [
    { id: 'design', label: t('tool_design', language), icon: PenTool, color: 'text-blue-600' },
    { id: 'contract', label: t('tool_contract', language), icon: ShieldCheck, color: 'text-emerald-600' },
    { id: 'courses', label: t('tool_courses', language), icon: Sparkles, color: 'text-orange-600' },
    { id: 'all_tech', label: t('tool_all', language), icon: LayoutGrid, color: 'text-slate-600' },
  ];

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isInteracting && scrollRef.current) {
        const nextIndex = (activeIndex + 1) % bannerStyles.length;
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, isInteracting, bannerStyles.length]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
      if (index !== activeIndex) setActiveIndex(index);
    }
  };

  const handleToolClick = (toolId: string, isPro: boolean) => {
      if (isPro && user?.plan === 'free') {
          alert('Эта функция доступна в Pro версии');
          return;
      }
      onNavigate && onNavigate(toolId as ViewState);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar pb-32 px-5 pt-14 animate-fade-in scrolling-touch md:pt-8 md:pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0 relative z-20">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                <span className="font-bold text-xs">X5</span>
             </div>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('creative_os', language)}</span>
           </div>
           <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
             {t('welcome', language)}, {user?.name.split(' ')[0] || 'User'}
           </h1>
        </div>
        
        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button 
                onClick={() => onNavigate && onNavigate('language')} 
                className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-transform"
            >
                <Globe size={18} />
            </button>

            {/* Credit Badge */}
            <div className="glass-card px-3 py-2 rounded-full flex items-center gap-1.5 bg-white/80 border-slate-200 shadow-sm h-10">
                <Zap size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-extrabold text-slate-900">{user?.credits || 0}</span>
            </div>
        </div>
      </div>

      {/* BIG PHOTO LAB BANNER - Swiping Enabled */}
      <div className="mb-5 relative rounded-[32px] shadow-2xl shadow-orange-900/10 overflow-hidden h-64 md:h-80 group shrink-0">
        
        {/* Label */}
        <div className="absolute top-6 left-6 z-30 pointer-events-none">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex flex-col items-start">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-0.5">AI Studio</span>
                <span className="text-xl font-extrabold text-white leading-none">{t('tool_photo', language)}</span>
            </div>
        </div>

        {/* Scroll Container */}
        <div 
           ref={scrollRef}
           onScroll={handleScroll}
           onTouchStart={() => setIsInteracting(true)}
           onTouchEnd={() => setTimeout(() => setIsInteracting(false), 2000)}
           className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth touch-pan-x touch-pan-y"
        >
           {bannerStyles.map((style) => (
              <button 
                 key={style.id}
                 onClick={() => onNavigate && onNavigate(style.view as ViewState)}
                 className="relative min-w-full h-full snap-center flex-shrink-0 text-left"
              >
                 <img 
                    src={style.img} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt={style.headline}
                    draggable={false} 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                 
                 <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10 pb-12">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 tracking-tight drop-shadow-xl max-w-[95%]">
                        {style.headline}
                    </h3>
                    <p className="text-sm md:text-lg text-white/90 font-medium drop-shadow-md">
                        {style.sub}
                    </p>
                 </div>
              </button>
           ))}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-5 left-8 flex gap-2 z-20 pointer-events-none">
           {bannerStyles.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/40'}`} 
              />
           ))}
        </div>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 shrink-0">
         {featuredTools.map((tool) => {
           const isLocked = tool.isPro && user?.plan === 'free';
           return (
           <button 
             key={tool.id}
             onClick={() => handleToolClick(tool.id, tool.isPro)}
             className={`relative h-40 rounded-[28px] p-5 flex flex-col justify-between items-start text-left transition-all active:scale-[0.96] group overflow-hidden border bg-white/90 ${tool.border} shadow-xl shadow-orange-100 hover:shadow-2xl`}
           >
             <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-sm ${tool.color}`}>
                <tool.icon size={24} strokeWidth={2.5} />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{tool.label}</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{tool.sub}</p>
             </div>
             
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 ${tool.color.replace('text', 'bg')}`}></div>
             
             {isLocked && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                     <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shadow-xl">
                         <Lock size={16} className="text-white" />
                     </div>
                 </div>
             )}
           </button>
         )})}
      </div>

      {/* Veo (Full Width) */}
      <div className="mb-3 shrink-0">
        <button 
           onClick={() => handleToolClick('video_gen', true)}
           className="w-full relative h-24 rounded-[28px] overflow-hidden shadow-lg shadow-purple-200 group active:scale-[0.98] transition-all"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600"></div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl transform -translate-x-5 translate-y-5"></div>

            {user?.plan === 'free' && (
                 <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-20">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                         <Lock size={16} className="text-slate-900" />
                     </div>
                 </div>
            )}

            <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                         <Sparkles size={16} className="text-purple-200 animate-pulse"/>
                         <span className="text-[10px] font-bold text-purple-100 uppercase tracking-widest">AI Video</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{t('home_veo_title', language)}</h3>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <PlayCircle size={24} fill="currentColor" className="text-white/20" />
                </div>
            </div>
        </button>
      </div>

      {/* Classic Tools Grid (Orange Themed) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 shrink-0">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onNavigate && onNavigate(cat.id as ViewState)}
            className="glass-card p-4 rounded-[24px] flex items-center gap-3 active:scale-95 transition-transform hover:bg-white border border-orange-100/50 shadow-sm bg-white/60 min-h-[72px] relative overflow-hidden"
          >
            <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0 ${cat.color}`}>
              <cat.icon size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700 leading-tight text-left">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* System Core (Analytics Only) */}
      <div className="mb-6 shrink-0">
          <button 
            onClick={() => onNavigate && onNavigate('analytics')}
            className="w-full glass-card p-5 rounded-[24px] flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-white border border-slate-100 shadow-sm"
          >
              <div className="w-12 h-12 rounded-[20px] bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
                  <BarChart2 size={24} />
              </div>
              <div className="text-left flex-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{t('analytics_title', language)}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{t('analytics_subtitle', language)}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <LayoutGrid size={16} />
              </div>
          </button>
      </div>

    </div>
  );
};
