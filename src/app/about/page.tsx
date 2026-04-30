import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col pb-24 bg-background">
      {/* =========================
          Hero
      ========================= */}
      <section className="py-28 text-center bg-wakaba/30">
        <h1 className="text-4xl font-serif tracking-[0.3em] font-bold text-foreground mb-8">
          萌書房について
        </h1>
      </section>

      {/* =========================
          About Content
      ========================= */}
      <section className="bg-[#edf4d2] py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <p className="font-serif text-base md:text-lg leading-loose whitespace-pre-wrap text-foreground/80 italic border-l border-accent/20 pl-8">
{`2001年1月，小社は古都奈良の地に産声を上げました。
萌という字のごとく，いまだ明確な輪郭を結ばないものの，
芽生えつつある新世紀の思想を，出版ということを通して世に問い，
その強度が増していくことに，微力ながら資することができればと考えております。`}
          </p>
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
