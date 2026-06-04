import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col pb-24 bg-background">
      {/* =========================
          Hero (Unified Design)
      ========================= */}
      <section className="relative overflow-hidden bg-[#fbfcf8] py-28 border-b border-accent/5">
        {/* 背景の淡いグリーン */}
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#edf6df] via-[#f7fbef] to-transparent" />

        {/* 丸い装飾 */}
        <div className="absolute right-[22%] top-32 h-64 w-64 rounded-full bg-[#dcecc5]/40 blur-sm" />
        <div className="absolute right-[15%] top-64 h-32 w-32 rounded-full bg-[#cfe4ad]/30" />

        {/* 若葉っぽい装飾 */}
        <div className="absolute right-20 top-44 h-72 w-72 opacity-60">
          <div className="absolute left-20 top-20 h-[1px] w-64 rotate-[-18deg] bg-[#9fbd7a]" />
          <div className="absolute left-44 top-12 h-8 w-4 rotate-45 rounded-full bg-[#b7d58b]" />
          <div className="absolute left-56 top-20 h-7 w-3 rotate-45 rounded-full bg-[#c5df9c]" />
          <div className="absolute left-32 top-28 h-6 w-3 rotate-45 rounded-full bg-[#a8c87d]" />
          <div className="absolute left-64 top-32 h-8 w-4 rotate-45 rounded-full bg-[#b8d98c]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-2 md:px-12">
          {/* 左：タイトル */}
          <div>
            <p className="mb-6 font-serif text-sm italic tracking-[0.25em] text-[#9ab673]">
              About Kizasu Shobo
            </p>

            <h2 className="font-serif text-4xl md:text-5xl leading-relaxed tracking-[0.12em] text-[#263326]">
              萌書房について
            </h2>

            <div className="mt-8 h-px w-16 bg-[#9ab673]" />
          </div>

          {/* 右：本文 */}
          <div className="font-serif text-[15px] leading-[2.4] tracking-[0.08em] text-stone-700">
            <p>
              2001年1月、新世紀への移行と軌を一にするかのように、
              それまで流布・通用し、人々の信頼を得ていた価値観あるいは技術が、
              急激な変容を迫られるようになりました。
            </p>

            <p className="mt-8">
              小社はそのような時代状況の下、古都奈良の地に産声を上げました。
              「萌」という字のごとく、芽生えつつある新たなる思想――それはしばしば茫洋として、等閑視されがちではあるものの――を「本」を通して世に問い、それがより明確なかたちとなって現れることに、微力ながら資することができればと考えております。
            </p>
          </div>
        </div>
      </section>

      {/* Business Activities Section (事業内容) */}
      <section id="activities" className="bg-wakaba/20 py-32 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/40 mb-4 text-center font-serif">Business Activities</h2>
            <h3 className="text-3xl font-serif font-bold mb-20 text-center text-foreground">事業内容</h3>
            
            <div className="space-y-32">
              {/* Publishing Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent/60 mb-4 font-serif">01. Publishing</h4>
                  <h5 className="text-2xl font-serif font-bold mb-8 text-foreground">出版活動</h5>
                  <div className="space-y-6 text-foreground/70 leading-relaxed font-serif text-base">
                    <p>
                      萌書房は、哲学、思想、批評、文学、歴史など、人文学の広範な領域にわたる出版活動を展開しています。
                    </p>
                    <p>
                      学術的な厳密さを保持しつつ、現代社会に対する鋭い洞察と、新しい感性を備えた言葉を届けることを使命としています。年に十数点から二十点ほどの刊行を続け、一冊一冊を丁寧に世に送り出しています。
                    </p>
                  </div>
                  <div className="mt-10">
                    <Link href="/books" className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase border border-accent/20 px-8 py-3 hover:bg-wakaba-hover hover:text-accent transition-all font-serif text-accent/70">
                      書籍案内を見る
                    </Link>
                  </div>
                </div>
                <div className="order-1 md:order-2 aspect-[4/3] bg-wakaba/10 relative border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000')] bg-cover bg-center grayscale-[0.3] opacity-80" />
                </div>
              </div>

              {/* Book Cafe Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="aspect-[4/3] bg-wakaba/10 relative border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/ESEF5280.JPEG')] bg-cover bg-center grayscale-[0.3] opacity-80" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-accent/60 mb-4 font-serif">02. Book Cafe</h4>
                  <h5 className="text-2xl font-serif font-bold mb-8 text-foreground">ブックカフェ</h5>
                  <div className="space-y-6 text-foreground/70 leading-relaxed font-serif text-base">
                    <p>
                      奈良の静かな環境の中で、本と共にある豊かな時間を提供しています。
                    </p>
                    <p>
                      萌書房の全刊行本を手に取ってご覧いただけるほか、厳選された珈琲と共に、思索を深め、あるいは日常の喧騒から離れてゆったりとしたひとときをお過ごしいただけます。
                    </p>
                  </div>
                  <div className="mt-10">
                    <Link href="/cafe" className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase border border-accent/20 px-8 py-3 hover:bg-wakaba-hover hover:text-accent transition-all font-serif text-accent/70">
                      カフェの詳細を見る
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview Section (会社概要) */}
      <section id="company" className="container mx-auto px-6 py-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[20px] font-bold tracking-[0.4em] uppercase text-accent/30 mb-20 text-center font-serif">会社概要</h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 border-b border-accent/5 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                名称
              </span>
              <span className="text-xl font-serif font-bold text-foreground">有限会社 萌書房（Kizasu Shobo）</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 border-b border-accent/5 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                住所
              </span>
              <div className="flex flex-col gap-6 font-serif text-sm text-foreground/70">
                <div className="space-y-1">
                  <p className="font-bold text-accent/60 text-[10px] uppercase tracking-widest">本社</p>
                  <p>〒630-1242 奈良市大柳生町3619-1</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-accent/60 text-[10px] uppercase tracking-widest">きたまちオフィス / Book Cafe 川べり</p>
                  <p>〒630-8113 奈良市法蓮町1050-1</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 border-b border-accent/5 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                代表
              </span>
              <span className="text-foreground/70 font-serif text-sm">白石 徳浩</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 border-b border-accent/5 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                設立
              </span>
              <span className="text-foreground/70 font-serif text-sm">2001年1月</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 border-b border-accent/5 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                連絡先
              </span>
              <div className="flex flex-col gap-10 font-serif text-sm text-foreground/70">
                <div className="space-y-2">
                  <p className="font-bold text-accent/60">［本社］</p>
                  <p>TEL：0742-93-2234 / FAX：0742-93-2235</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-accent/60">［きたまちオフィス／Book Cafe 川べり］</p>
                  <p>TEL：0742-42-6986 / FAX：0742-90-0044</p>
                </div>
                <p>Mail：kizasu-s@m3.kcn.ne.jp</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 pb-10">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent/70 w-32 font-serif flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent/30 rounded-full"></span>
                事業内容
              </span>
              <span className="text-foreground/70 font-serif text-sm">思想・社会・文化に関わる書籍の出版、<br className="hidden md:inline" />思考と出会いを生む企画・運営</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
