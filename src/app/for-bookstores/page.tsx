import React from 'react';

export default function ForBookstoresPage() {
  return (
    <div className="flex flex-col gap-16 pb-24 bg-background">
      {/* Page Header */}
      <section className="bg-wakaba/30 py-24 border-b border-border text-center">
        <div className="container mx-auto px-6">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent/50 mb-4 block font-serif">For Bookstores</span>
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">書店様へ</h1>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-20">
          
          {/* Main Message */}
          <section className="space-y-8 font-serif">
            <h2 className="text-2xl font-serif font-bold border-b border-accent/10 pb-6 text-foreground tracking-tight">萌書房書籍のご注文先について</h2>
            <div className="space-y-6 text-foreground/70 leading-relaxed text-lg">
              <p>
                日頃、皆さまには萌書房の書籍をご販売いただき、深く御礼を申し上げます。
              </p>
              <p>
                萌書房が自社販売を始めました2024年12月以降の刊行作品につきましては、萌書房まで直接ご注文ください。
              </p>
            </div>
            
            <div className="bg-wakaba/10 border border-accent/10 p-10 mt-10">
              <h3 className="text-xs font-bold mb-8 uppercase tracking-[0.3em] text-accent/50 font-serif">萌書房 書店注文専用</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
                <div className="space-y-2">
                  <p className="text-[10px] text-accent/40 uppercase tracking-[0.2em] font-serif font-bold">TEL</p>
                  <p className="text-3xl font-mono font-bold text-accent tracking-tighter tabular-nums">0742-93-2234</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-accent/40 uppercase tracking-[0.2em] font-serif font-bold">FAX</p>
                  <p className="text-3xl font-mono font-bold text-accent tracking-tighter tabular-nums">0742-93-2235</p>
                </div>
              </div>
              <p className="mt-10 text-[11px] text-accent/50 font-serif border-t border-accent/10 pt-6 italic">
                受付時間：平日10:00～17:00。土日祝日とお盆、年末年始は営業しておりません。
              </p>
            </div>
          </section>

          {/* Special Condition Section */}
          <section className="bg-accent text-white p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rotate-45" />
            
            <h2 className="text-[10px] font-bold mb-8 uppercase tracking-[0.4em] text-white/40 font-serif">
              仕入条件に関するお知らせ
            </h2>
            <div className="space-y-8 font-serif">
              <h3 className="text-2xl md:text-3xl font-serif leading-tight tracking-tight border-b border-white/10 pb-6">
                特定書籍の「書店様正味50%」での出庫継続について
              </h3>
              <div className="space-y-6 text-white/80 leading-relaxed text-lg">
                <p>
                  2024年12月に刊行いたしました一部の書籍につきましては、現在もそして今後も、発売当初の仕入条件<span className="text-white font-bold underline decoration-white/30 underline-offset-8">「書店様仕入正味50%」</span>の書籍として出庫いたします。
                </p>
                <p>
                  末永くご販売をいただけますよう、なにとぞよろしくお願い申し上げます。
                </p>
                <p className="text-sm italic text-white/50 pt-4 border-t border-white/5">
                  ※なお返品の際は、発売当初の返品条件である「10%歩安入帳」が適用となりますことをご了承ください。
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
