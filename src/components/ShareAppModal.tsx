import React, { useState } from 'react';
import { X, Copy, Check, Share2, ExternalLink, QrCode, Smartphone, Send, ArrowUpRight, CheckCircle2, Download } from 'lucide-react';
import { Language } from '../types/agent';

interface ShareAppModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'share' | 'apk';
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  language,
  isOpen,
  onClose,
  defaultTab = 'share',
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'share' | 'apk'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const isArabic = language === 'ar';
  
  // Public Shared App URL
  const appUrl = 'https://ais-pre-6kehfg6x37cpx47wzqqvpl-145828402206.europe-west2.run.app';
  
  // WhatsApp Share URL
  const whatsappText = encodeURIComponent(
    isArabic
      ? `رابط تطبيق وكيل الذكاء الاصطناعي OmniAgent للعمل على اللابتوب والموبايل:\n${appUrl}`
      : `OmniAgent AI Workspace link for laptops and smartphones:\n${appUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

  // PWABuilder APK Generator URL
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  // Direct Built APK from GitHub Release
  const githubApkUrl = 'https://github.com/abdohebishy47-ui/abdo-/releases/download/v1.0.0/omniagent.apk';
  const githubReleasesUrl = 'https://github.com/abdohebishy47-ui/abdo-/releases/tag/v1.0.0';

  // QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&bgcolor=0d1424&color=38bdf8`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-[#0d1424] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              {activeTab === 'apk' ? <Smartphone className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {isArabic ? 'رابط التطبيق وملف الـ APK' : 'App Link & APK Generator'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isArabic ? 'افتح التطبيق على هاتفك أو حوّله لملف APK' : 'Open on smartphone or generate installable APK'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="p-3 bg-[#0a0f1d] border-b border-slate-800/70">
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'share'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'رابط التطبيق والمشاركة' : 'Direct Link & Share'}
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'apk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isArabic ? 'توليد ملف APK لأندرويد' : 'Generate Android APK'}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4 bg-[#090d16] text-xs">
          {activeTab === 'share' ? (
            <>
              {/* Public URL Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-200">
                    {isArabic ? 'الرابط المباشر العام للتطبيق:' : 'Public Live App Link:'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {isArabic ? 'متاح أونلاين' : 'Live Online'}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    className="flex-1 bg-transparent text-slate-200 text-xs font-mono outline-none select-all truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'نسخ الرابط' : 'Copy Link'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions (WhatsApp & Camera QR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Share Card */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col justify-between p-4 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-emerald-300">
                        <Send className="w-4 h-4 text-emerald-400" />
                        <span>{isArabic ? 'إرسال عبر واتساب' : 'Share via WhatsApp'}</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isArabic
                        ? 'أرسل الرابط لنفسك على واتساب لتفتحه وتثبته بلمسة واحدة على الهاتف.'
                        : 'Send link directly to your WhatsApp to open and install on smartphone instantly.'}
                    </p>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 text-[11px] font-semibold text-emerald-900 bg-emerald-400 rounded-md">
                      {isArabic ? 'فتح واتساب الآن' : 'Open WhatsApp'}
                    </span>
                  </div>
                </a>

                {/* QR Code Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-sky-400" />
                    <span>{isArabic ? 'مسح بالكاميرا' : 'Scan with Camera'}</span>
                  </div>
                  <div className="p-2 bg-[#0d1424] rounded-lg border border-slate-700/60">
                    <img
                      src={qrCodeUrl}
                      alt="OmniAgent QR Code"
                      width={120}
                      height={120}
                      className="rounded"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isArabic ? 'وجّه كاميرا هاتفك لفتح الرابط فوراً' : 'Point smartphone camera to open link'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* PWABuilder APK Generator Section */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-indigo-300 text-sm">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>{isArabic ? 'توليد ملف APK رسمي لأندرويد' : 'Official Android APK Package Generator'}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                    PWABuilder / TWA
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  {isArabic
                    ? 'تم تهيئة التطبيق بنجاح ليكون متوافقاً 100% مع أداة PWABuilder (المدعومة رسمياً من مايكروسوفت وجوجل كروم) لتحويل التطبيق إلى ملف APK حقيقي في ثوانٍ.'
                    : 'The app is 100% configured for PWABuilder (official Google & Microsoft TWA tool) to compile your PWA into an installable Android APK in seconds.'}
                </p>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
                  <div className="font-semibold text-slate-200">
                    {isArabic ? 'خطوات التحميل والتثبيت البسيطة:' : '3 Simple Steps to Download & Install:'}
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                    <li>
                      {isArabic
                        ? 'اضغط على زر "فتح أداة PWABuilder" بالأسفل (سيفتح الموقع مع فحص رابط تطبيقك تلقائياً).'
                        : 'Click "Launch PWABuilder Generator" below (it will analyze your live app URL automatically).'}
                    </li>
                    <li>
                      {isArabic
                        ? 'اضغط على زر "Package for Android" الأخضر في صفحة PWABuilder.'
                        : 'Click the green "Package for Android" button on PWABuilder.'}
                    </li>
                    <li>
                      {isArabic
                        ? 'اضغط "Generate APK" وسيتم تحميل ملف الـ APK لجهازك فوراً لتثبيته على أي هاتف أندرويد.'
                        : 'Click "Generate APK" to download the ready .apk file and install it on any Android device.'}
                    </li>
                  </ol>
                </div>

                {/* Direct Built APK Download Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isArabic ? 'ملف الـ APK جاهز للتحميل والتثبيت الفوري (5.5 MB)' : 'Compiled APK Ready for Direct Download (5.5 MB)'}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isArabic
                          ? 'تم تجميع وتوليد ملف APK للأندرويد بنجاح. يمكنك تحميله مباشرة إلى هاتفك وتثبيته فوراً بدون الحاجة لأي خطوات معقدة.'
                          : 'Android APK was successfully compiled and ready for instant installation on any Android phone.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="/omniagent.apk"
                      download="omniagent.apk"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isArabic ? 'تحميل ملف APK مباشرة للموبايل' : 'Download APK Directly'}</span>
                    </a>

                    <a
                      href="https://github.com/abdohebishy47-ui/abdo-/releases"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                      <span>{isArabic ? 'عرض الإصدار على GitHub' : 'View on GitHub Releases'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-900/40 transition-all text-center"
                  >
                    <span>{isArabic ? 'فتح أداة PWABuilder وتحميل الـ APK' : 'Launch PWABuilder Generator'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isArabic ? 'تم نسخ الرابط' : 'Link Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'نسخ رابط التطبيق أولاً' : 'Copy App Link'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 truncate max-w-xs">
            {appUrl}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
