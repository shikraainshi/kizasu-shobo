'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, MapPin } from 'lucide-react';

function LineIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

// public/kawaberi-hero/ にファイルを追加・入れ替えするとスライドショーの写真を差し替えられる
const heroImages = [
  { src: '/kawaberi-hero/hero-01.jpeg', alt: 'Book Cafe 川べり 外観' },
  { src: '/kawaberi-hero/hero-02.jpeg', alt: 'Book Cafe 川べり 店内' },
  { src: '/kawaberi-hero/BFIT7809.JPEG', alt: 'Book Cafe 川べり 本棚' },
];

// 開いた本のシルエットのフレーム。中央のテキストは本の中に書かれているように見せる。
function OpenBookFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[650px] h-[300px] md:h-[340px]">
      {/* 本の輪郭（3項目とも同じ高さで固定） */}
      <svg viewBox="0 0 650 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path
          d="
            M 20 50
            Q 170 0, 325 45
            Q 480 0, 630 50
            L 630 450
            Q 480 410, 325 465
            Q 170 410, 20 450
            Z
          "
          fill="#709bbd"
          stroke="#709bbd"
          strokeWidth="4"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* 本の中の文章 */}
      <div className="relative flex items-center justify-center h-full px-[9%] py-[14%]">{children}</div>
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export default function KawaberiPage() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#faf7f1] text-[#2a2622]">
      {/* Hero — 没入型、写真主体（控えめな高さ） */}
      <section className="relative h-[58vh] min-h-[380px] max-h-[560px] w-full overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={heroImages[heroIndex].src}
            src={heroImages[heroIndex].src}
            alt={heroImages[heroIndex].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute left-6 md:left-12 bottom-6 md:bottom-12 z-10 w-36 h-36 md:w-48 md:h-48 rounded-full bg-white shadow-lg ring-2 ring-white flex items-center justify-center"
        >
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden bg-white flex items-center justify-center">
            <img src="/kawaberilogo.jpg" alt="Book Cafe 川べり" className="w-full h-full object-contain" />
          </div>
        </motion.div>
      </section>

      {/* リード文 — 見開きの扉ページのような余白 */}
      <section className="py-16 md:py-24 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <p className="font-serif text-2xl md:text-[2.15rem] leading-[2] md:leading-[2.1] text-[#2a2622]/90">
            水のさざやきと紙の音が、
            <br className="hidden md:block" />
            そっと重なる場所。
          </p>
        </motion.div>
      </section>

      {/* Story — テキストと写真、フラットな編集レイアウト */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-center">
          <motion.div {...fadeUp} className="order-2 md:order-1 text-center">
            <div className="flex items-center justify-center gap-3 mb-7">
              <span className="h-px w-8 bg-[#2a2622]/20" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2a2622]/40" />
              <span className="h-px w-8 bg-[#2a2622]/20" />
            </div>
            <div className="space-y-10 font-serif text-[15px] leading-loose text-[#2a2622]/85">
              <p>
                2025年4月6日、奈良・佐保川のほとりに
                <br />
                「Book Cafe 川べり」は生まれました。
              </p>
              <p>
                店内には、萌書房が刊行してきた
                <br />
                書籍の一部に加え、専門書の編集に
                <br />
                長く携わってきたスタッフが選び抜いた、
                <br />
                思想・文学・芸術・社会など
                <br />
                幅広い分野の本が並びます。
              </p>
              <p>
                「川べり」という名前は、
                <br />
                店の前を静かに流れる佐保川に由来しています。
                <br />
                四季折々に表情を変える川の流れのように
                <br />
                ゆったりと本と向き合い、
                <br />
                新しい考えや思いに出会える場所で
                <br />
                ありたいという願いを込めました。
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2 aspect-[4/5]"
          >
            <img
              src="/HTUB9783.JPEG"
              alt="川べり店内"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 3つの時間 — カード3枚横並び */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
            {[
              {
                num: '01',
                title: '選書',
                desc: (
                  <>
                    専門書の編集に
                    <br />
                    長く携わってきたスタッフが、
                    <br />
                    一冊一冊を丁寧に
                    <br />
                    選び抜いています。
                    <br />
                    萌書房の刊行書をはじめ、
                    <br />
                    思想・文学・芸術・社会など、
                    <br />
                    静かに思考を深めるための本を
                    <br />
                    幅広く揃えています。
                  </>
                ),
              },
              {
                num: '02',
                title: '空間',
                desc: (
                  <>
                    佐保川のせせらぎを背景に、
                    <br />
                    ゆったりとした時間が
                    <br />
                    流れる読書空間。
                    <br />
                    日常から少し距離を置き、
                    <br />
                    本と向き合い、
                    <br />
                    思考に身を委ねる場所です。
                  </>
                ),
              },
              {
                num: '03',
                title: 'つながり',
                desc: (
                  <>
                    読書会や小さな演奏会など、
                    <br />
                    本を中心とした
                    <br />
                    静かな集いの場としても
                    <br />
                    ご利用いただけます。
                    <br />
                    人と人、思考と時間が
                    <br />
                    ゆるやかに交わる空間です。
                  </>
                ),
              },
            ].map((item) => (
              <motion.div key={item.num} {...fadeUp} className="flex flex-col items-center text-center gap-5">
                <span className="font-serif text-xs text-[#8a7d63] tracking-[0.3em]">{item.num}</span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#2a2622]/75">{item.title}</h3>
                <OpenBookFrame>
                  <p className="text-center text-white/95 leading-[1.65] text-[clamp(12px,1.25vw,14.5px)] font-medium font-serif">
                    {item.desc}
                  </p>
                </OpenBookFrame>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 店内photo + Menu */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <motion.div {...fadeUp} className="aspect-[3/4]">
            <img src="/S__15638541.jpg" alt="川べり店内の本棚" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-col justify-center">
            <h2 className="font-serif text-2xl md:text-3xl mb-8">珈琲と、軽食を。</h2>
            <div className="border border-[#2a2622]/15 bg-white/60 p-3">
              <img src="/menu.jpg" alt="川べり ドリンク・軽食メニュー" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hours & Access — フラットな情報パネル */}
      <section className="px-6 pb-16 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl">営業時間・アクセス</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
            <motion.div {...fadeUp} className="space-y-8 font-serif">
              {[
                { label: '営業時間', value: <>10:30 - 18:00</> },
                {
                  label: '定休日',
                  value: (
                    <>
                      月曜日
                      <br />
                      <span className="text-xs text-[#2a2622]/50">（祝日の場合は翌火曜）</span>
                    </>
                  ),
                },
                {
                  label: '住所',
                  value: (
                    <>
                      〒630-8113
                      <br />
                      奈良県奈良市法蓮町1050-1
                    </>
                  ),
                },
                { label: '電話', value: <>0742-42-6986</> },
                { label: '最寄り駅', value: <>近鉄奈良駅より徒歩約15分</> },
                {
                  label: '駐車場',
                  value: (
                    <>
                      1台分
                      <br />
                      <span className="text-xs text-[#2a2622]/50">満車時は近隣コインパーキングへ</span>
                    </>
                  ),
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-6 border-b border-[#2a2622]/10 pb-4">
                  <span className="text-sm text-[#8a7d63] tracking-widest shrink-0">{label}</span>
                  <span className="text-base text-right pt-1">{value}</span>
                </div>
              ))}

              <a
                href="https://maps.google.com/?q=奈良県奈良市法蓮町1050-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase border border-[#2a2622]/30 rounded-full px-5 py-2.5 hover:border-[#2a2622] hover:bg-[#2a2622]/5 transition-colors"
              >
                <MapPin size={15} />
                Googleマップで見る
              </a>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="h-[320px] lg:h-auto min-h-[320px] border border-[#2a2622]/10"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.96695289524!2d135.818166376286!3d34.693427972923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60013970258074d1%3A0xc66415849a623a88!2z44CSNjMwLTgxMTMg5aWI6Imv55yM5aWI6Imv5biC5rOV6JOu55S677yR77yQ77yV77yQ4oiS77yR!5e0!3m2!1sja!2sjp!4v1712810000000!5m2!1sja!2sjp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="川べり Location"
                className="grayscale-[0.15] contrast-[1.05] w-full h-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-6 pb-16 md:pb-20 text-center">
        <motion.div {...fadeUp} className="max-w-xl mx-auto flex flex-col items-center space-y-8">
          <p className="font-serif text-lg leading-loose text-[#2a2622]/70">
            歴史ある奈良の街で、本とともに、
            <br />
            静かな時間をお楽しみください。
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://line.me/R/ti/p/@537ukidz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE公式アカウント"
              className="text-[#2a2622]/60 hover:text-[#2a2622] transition-colors"
            >
              <LineIcon size={26} />
            </a>
            <a
              href="https://www.instagram.com/kawaberi_bookandcafe/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#2a2622]/60 hover:text-[#2a2622] transition-colors"
            >
              <Instagram size={24} />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
