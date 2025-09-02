'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Send } from 'lucide-react';
import Link from 'next/link';

const DISMISS_KEY = 'social_popup_dismissed_v1';

export default function SocialMediaPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const phoneNumber = '+251965254514';

  // Open once per tab session unless dismissed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(DISMISS_KEY) === 'true';
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const seenThisSession = sessionStorage.getItem('social_popup_seen') === 'true';
    if (!seenThisSession) {
      setIsOpen(true);
      try { sessionStorage.setItem('social_popup_seen', 'true'); } catch {}
    }
    // No scroll/timer auto-open beyond first show in this tab
  }, []);

  const closeAndPersist = () => {
    setIsOpen(false);
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {}
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Main toggle button */}
      <button
        onClick={() => {
          // Allow reopening via icon, but don't auto-reopen after dismissal
          setIsOpen((prev) => !prev)
        }}
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        aria-label="Toggle contact popup"
      >
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity" />
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Popup content */}
      <div className={`${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'} transition-all duration-300 absolute bottom-16 right-0 w-[280px] origin-bottom-right`}
        style={{ transformOrigin: 'right bottom' }}
      >
        <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Glow strip */}
          <div className="pointer-events-none absolute -inset-x-8 -top-6 h-16 skew-y-6 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div>
              <h3 className="text-white font-playfair font-bold text-lg leading-none">Contact Us</h3>
              <p className="text-xs text-white/70 font-poppins">We reply within minutes</p>
            </div>
            <button
              onClick={closeAndPersist}
              className="text-gray-300 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-full"
              aria-label="Close contact popup"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            {/* WhatsApp */}
            <Link
              href={`https://wa.me/${phoneNumber.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/15 hover:bg-emerald-500/20 transition-all px-3 py-2 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-emerald-500 size-8 shadow-inner shadow-black/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.86 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <div className="leading-tight">
                  <div className="font-poppins font-semibold">WhatsApp</div>
                  <div className="text-xs text-white/70">Chat instantly</div>
                </div>
              </div>
              <Phone className="h-4 w-4 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Telegram */}
            <Link
              href={`https://t.me/${phoneNumber.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-sky-400/30 bg-sky-500/15 hover:bg-sky-500/20 transition-all px-3 py-2 text-white"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-sky-500 size-8 shadow-inner shadow-black/20">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="font-poppins font-semibold">Telegram</div>
                  <div className="text-xs text-white/70">Fast & secure</div>
                </div>
              </div>
              <Send className="h-4 w-4 text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 text-[11px] text-white/70 font-poppins">We typically respond within minutes</div>
        </div>
      </div>
    </div>
  );
}