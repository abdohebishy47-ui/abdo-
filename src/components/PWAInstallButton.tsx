import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types/agent';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const isArabic = language === 'ar';

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-lg whitespace-nowrap">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{isArabic ? 'مثبت كتطبيق' : 'Installed App'}</span>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Install Button */}
      {isInstallable ? (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-900/30 transition-all whitespace-nowrap shrink-0 active:scale-95"
          title={isArabic ? 'تثبيت التطبيق على جهازك' : 'Install App on your device'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isArabic ? 'تثبيت التطبيق' : 'Install App'}</span>
        </button>
      ) : isIOS ? (
        <button
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isArabic ? 'تثبيت على الآيفون' : 'Install on iOS'}</span>
        </button>
      ) : (
        <button
          onClick={() => setShowGuideModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap shrink-0"
          title={isArabic ? 'دليل التثبيت على اللابتوب والهاتف' : 'Installation Guide'}
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>{isArabic ? 'تثبيت التطبيق' : 'Install App'}</span>
        </button>
      )}

      {/* Cross-Platform Installation Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">
                  {isArabic ? 'كيفية تثبيت OmniAgent على أجهزتك' : 'How to Install OmniAgent'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Guides */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto bg-[#090d16] text-xs leading-relaxed text-slate-300">
              {/* Laptop Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-100">
                  <Laptop className="w-4 h-4 text-indigo-400" />
                  <span>{isArabic ? 'على أجهزة اللابتوب والكمبيوتر (Chrome / Edge / Windows / Mac):' : 'On Laptops & Desktops (Chrome / Edge / Windows / Mac):'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 ps-1">
                  <li>
                    {isArabic
                      ? 'ستجد أيقونة تثبيت صغيرة (شاشة مع سهم لأسفل) في شريط العنوان أعلى المتصفح.'
                      : 'Look for the Install icon (computer screen with a down arrow) in the browser address bar.'}
                  </li>
                  <li>
                    {isArabic
                      ? 'أو اضغط على زر "تثبيت التطبيق" الظاهر في أعلى الصفحة.'
                      : 'Or click the "Install App" button in the top navigation bar.'}
                  </li>
                  <li>
                    {isArabic
                      ? 'اضغط "تثبيت" (Install) وسيفتح التطبيق فوراً كنافذة مستقلة على سطح المكتب وشريط المهام.'
                      : 'Click "Install" to open OmniAgent as a native standalone desktop app.'}
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-100">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>{isArabic ? 'على هواتف أندرويد (Google Chrome):' : 'On Android Smartphones (Google Chrome):'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 ps-1">
                  <li>
                    {isArabic
                      ? 'اضغط على زر "تثبيت التطبيق" أعلى الشاشة، أو افتح قائمة الخيارات (الثلاث نقاط).'
                      : 'Tap the "Install App" button or open the 3-dots Chrome browser menu.'}
                  </li>
                  <li>
                    {isArabic
                      ? 'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".'
                      : 'Select "Add to Home screen" or "Install app".'}
                  </li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-100">
                  <Share className="w-4 h-4 text-sky-400" />
                  <span>{isArabic ? 'على هواتف آيفون و iPad (متصفح Safari):' : 'On iPhones & iPads (Safari Browser):'}</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 ps-1">
                  <li>
                    {isArabic
                      ? 'اضغط على أيقونة المشاركة (Share) في شريط Safari أسفل الشاشة.'
                      : 'Tap the Share icon at the bottom of the Safari screen.'}
                  </li>
                  <li>
                    {isArabic
                      ? 'مرر للأسفل واضغط على "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </li>
                  <li>
                    {isArabic
                      ? 'اضغط "إضافة" (Add) في الزاوية العلوية.'
                      : 'Tap "Add" in the top right corner to finish.'}
                  </li>
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/80 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                {isArabic ? 'حسناً، فهمت' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
