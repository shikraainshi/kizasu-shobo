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
          <section className="space-y-12 font-serif">
            <h2 className="text-2xl font-serif font-bold border-b border-accent/10 pb-6 text-foreground tracking-tight">萌書房書籍のご注文について</h2>
            <div className="space-y-8 text-foreground/70 leading-relaxed text-lg">
              <p>
                日頃、皆さまには萌書房の書籍をご販売いただき、深く御礼を申し上げます。
              </p>
              <div className="bg-wakaba/10 border-l-4 border-accent/30 p-8 space-y-6">
                <p className="text-foreground font-bold">
                  小社書籍は、下記取次各社を通じてご注文いただけます。
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-xl text-accent font-bold tracking-wider ml-6">
                  <li className="list-disc">トーハン</li>
                  <li className="list-disc">日販</li>
                  <li className="list-disc">楽天ブックスネットワーク</li>
                  <li className="list-disc">JRC</li>
                </ul>
              </div>
              <p className="mt-20">
                その他、直接のお取引や在庫確認、仕入条件に関するお問い合わせは、下記までご連絡ください。
              </p>
            </div>
            
            <div className="mt-16 space-y-12 max-w-2xl mx-auto">
              {/* きたまちオフィス */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-accent/5 pb-10">
                <div className="w-56 shrink-0 flex items-center gap-3">
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent font-serif flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                    きたまちオフィス
                  </span>
                  <span className="text-[8px] px-1.5 py-0.5 bg-accent/10 text-accent font-bold rounded-full whitespace-nowrap">主連絡先</span>
                </div>
                <div className="flex flex-col gap-3 font-serif text-sm text-foreground/70">
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] text-accent/40 uppercase tracking-widest w-8">Tel</span>
                    <span className="text-lg font-bold text-accent">0742-42-6986</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] text-accent/40 uppercase tracking-widest w-8">Fax</span>
                    <span className="text-lg font-bold text-accent">0742-90-0044</span>
                  </span>
                </div>
              </div>

              {/* 本社 */}
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-accent/5 pb-10 opacity-70">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-56 shrink-0 font-serif flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                  本社
                </span>
                <div className="flex flex-col gap-3 font-serif text-sm text-foreground/70">
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] text-accent/40 uppercase tracking-widest w-8">Tel</span>
                    0742-93-2234
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="text-[10px] text-accent/40 uppercase tracking-widest w-8">Fax</span>
                    0742-93-2235
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
