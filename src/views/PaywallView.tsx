
import React, { useState } from 'react';
import { XCircle, Zap, Check, Loader2, Key, ShieldCheck } from 'lucide-react';
import { t } from '../services/translations';
import { Language, Platform } from '../types';
import { NativeBridge } from '../services/nativeBridge';
import { isMobileApp, sendToApp } from '../utils/appBridge';

interface PaywallViewProps {
    language: Language;
    onClose: () => void;
    onBuy: () => void;
    onTestPro?: () => void;
    platform?: Platform;
}

export const PaywallView: React.FC<PaywallViewProps> = ({ language, onClose, onBuy, onTestPro, platform = 'web' }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBuy = () => {
        // Hybrid App Logic (WebView)
        if (isMobileApp()) {
            // Мы в приложении - зовем Apple Pay via Flutter Bridge
            sendToApp('payBridge', {
                product: 'x5_pro_monthly', // Correct Product ID
                price: '4990'
            });
            return;
        }

        // Native Bridge for iOS/Android (Legacy Native Wrapper)
        if (platform === 'ios' || platform === 'android') {
            NativeBridge.triggerHaptic('medium');
            setIsProcessing(true);

            // Send request to Native Wrapper
            NativeBridge.requestPayment('x5_pro_monthly', 4990, 'KZT');

            // Reset button state after delay (assuming native modal takes over)
            setTimeout(() => {
                setIsProcessing(false);
            }, 3000);
        } else {
            // Web Flow
            onBuy();
        }
    };

    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const isWeb = platform === 'web';
    const isHybrid = isMobileApp();

    return (
        <div className="fixed inset-0 z-50 bg-[#f8fafc] flex flex-col animate-fade-in overflow-y-auto">
            {/* Container for content max width on Desktop */}
            <div className="w-full max-w-md mx-auto min-h-full flex flex-col relative px-6 pt-20 pb-10">

                <button onClick={() => { NativeBridge.triggerHaptic('light'); onClose(); }} className="absolute top-12 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm z-20 hover:bg-slate-50 transition-colors"><XCircle size={24} className="text-slate-400" /></button>

                <div className="flex-1 flex flex-col items-center justify-center text-center">

                    <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-xl shadow-purple-100 mb-6 animate-pulse border border-slate-50">
                        <Zap size={40} className="text-purple-600 fill-purple-600" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('profile_buy', language)}</h2>
                    <p className="text-slate-500 mb-8 max-w-xs text-sm">{t('profile_upgrade', language)}</p>

                    <div className="w-full bg-white p-6 rounded-[32px] shadow-xl border border-slate-100 mb-8 transform transition-transform hover:scale-[1.01]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">Pro</span>
                                <div className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-[10px] font-bold uppercase">Plan</div>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-slate-900 block">4 990 ₸</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">{t('pay_month', language)}</span>
                            </div>
                        </div>

                        <div className="h-px w-full bg-slate-50 mb-4"></div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check size={18} className="text-green-500" strokeWidth={3} /> <span>{t('pay_features_model', language)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check size={18} className="text-green-500" strokeWidth={3} /> <span>{t('pay_features_img', language)}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <Check size={18} className="text-green-500" strokeWidth={3} /> <span>{t('pay_features_video', language)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ADAPTIVE PAYMENT BUTTON */}
                    {isIOS ? (
                        <button
                            onClick={handleBuy}
                            disabled={isProcessing}
                            className="w-full py-4 bg-black text-white rounded-[20px] font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 mb-4"
                        >
                            {isProcessing ? <Loader2 className="animate-spin text-white" /> : (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xl font-medium tracking-tight">{t('pay_btn', language)} with</span>
                                    <span className="flex items-center font-bold text-2xl tracking-tighter">
                                        Pay
                                    </span>
                                </div>
                            )}
                        </button>
                    ) : isAndroid ? (
                        <button
                            onClick={handleBuy}
                            disabled={isProcessing}
                            className="w-full py-4 bg-black text-white rounded-[24px] font-bold text-lg shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2 mb-4"
                        >
                            {isProcessing ? <Loader2 className="animate-spin text-white" /> : (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{t('pay_btn', language)} with</span>
                                    <span className="flex items-center font-bold text-xl tracking-tight">
                                        <span className="text-blue-500">G</span>
                                        <span className="text-red-500">P</span>
                                        <span className="text-yellow-500">a</span>
                                        <span className="text-green-500">y</span>
                                    </span>
                                </div>
                            )}
                        </button>
                    ) : (
                        // WEB DEFAULT (AND HYBRID APP DEFAULT BUTTON)
                        <button
                            onClick={handleBuy}
                            disabled={isProcessing}
                            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mb-4"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : `${t('pay_btn', language)} ${isHybrid ? '' : '4 990 ₸'}`}
                        </button>
                    )}

                    {/* Payment Logos & Security - ONLY SHOW ON WEB AND NOT HYBRID */}
                    {isWeb && !isHybrid && (
                        <div className="mt-4 flex flex-col items-center gap-3">
                            <div className="flex justify-center items-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
                                <div className="w-px h-5 bg-slate-300"></div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                                <div className="w-px h-5 bg-slate-300"></div>
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-1 rounded">Freedom Pay</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full">
                                <ShieldCheck size={12} />
                                {t('pay_secure', language)}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
