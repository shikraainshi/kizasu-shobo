'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Instagram, ChevronDown, BookOpen, Waves, Users, CalendarHeart } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
};

export default function KawaberiPage() {
  return (
    <div className="bg-[#faf7f1] text-[#2a2622]">
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 text-[10px] tracking-[0.3em] uppercase font-serif text-white/80 hover:text-white transition-colors mix-blend-difference"
      >
        萌書房 TOPへ
      </Link>

      {/* Hero — 没入型、写真主体（控えめな高さ） */}
      <section className="relative h-[58vh] min-h-[380px] max-h-[560px] w-full overflow-hidden">
        <img
          src="/ESEF5280.JPEG"
          alt="Book Cafe 川べり 外観"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 px-6 text-center text-white">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            src="/kawaberilogo.jpg"
            alt=""
            className="h-10 w-auto object-contain mb-6 opacity-90 mix-blend-screen"
          />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-[11vw] sm:text-5xl md:text-6xl leading-none tracking-[0.02em]"
          >
            川べり
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-5 text-[11px] sm:text-xs tracking-[0.5em] uppercase font-serif text-white/70"
          >
            Book Cafe, Nara
          </motion.p>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70"
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* リード文 — 見開きの扉ページのような余白 */}
      <section className="py-28 md:py-40 px-6">
        <motion.p
          {...fadeUp}
          className="max-w-3xl mx-auto text-center font-serif text-2xl md:text-[2.15rem] leading-[2] md:leading-[2.1] text-[#2a2622]/90"
        >
          佐保川のほとりで、
          <br className="hidden md:block" />
          本のページをめくるような静けさを。
        </motion.p>
      </section>

      {/* Story — テキストと写真、フラットな編集レイアウト */}
      <section className="px-6 pb-28 md:pb-40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-center">
          <motion.div {...fadeUp} className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#8a7d63]/40 text-[#8a7d63]">
                <BookOpen size={14} />
              </div>
              <span className="text-[10px] tracking-[0.5em] uppercase font-serif text-[#8a7d63]">About</span>
            </div>
            <div className="space-y-6 font-serif text-[15px] leading-loose text-[#2a2622]/80">
              <p>
                2025年4月6日、奈良・佐保川のほとりに「Book Cafe 川べり」は生まれました。
              </p>
              <p>
                店内には、萌書房が刊行してきた書籍の一部に加え、専門書の編集に長く携わってきたスタッフが選び抜いた、思想・文学・芸術・社会など幅広い分野の本が並びます。
              </p>
              <p>
                「川べり」という名前は、店の前を静かに流れる佐保川に由来しています。四季折々に表情を変える川の流れのように、ゆったりと本と向き合い、新しい考えや思いに出会える場所でありたいという願いを込めました。
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-[#2a2622]/10 grid grid-cols-3 gap-4">
              {[
                { icon: CalendarHeart, label: '2025.4.6 OPEN' },
                { icon: Waves, label: '佐保川のほとり' },
                { icon: BookOpen, label: '萌書房が運営' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <Icon size={18} className="text-[#8a7d63]" />
                  <span className="text-[10px] tracking-widest font-serif text-[#2a2622]/60">{label}</span>
                </div>
              ))}
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

      {/* 3つの時間 — 番号付きの横並びリスト */}
      <section className="px-6 pb-28 md:pb-40">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="block text-[10px] tracking-[0.5em] uppercase font-serif text-[#8a7d63] mb-4">
              Three Moments
            </span>
            <h2 className="font-serif text-3xl md:text-4xl">川べりで過ごす、三つの時間</h2>
          </motion.div>

          <div className="divide-y divide-[#2a2622]/10 border-t border-b border-[#2a2622]/10">
            {[
              {
                num: '01',
                icon: BookOpen,
                title: '選書',
                desc: '専門書の編集に長く携わってきたスタッフが、一冊一冊を丁寧に選び抜いています。萌書房の刊行書をはじめ、思想・文学・芸術・社会など、静かに思考を深めるための本を幅広く揃えています。',
              },
              {
                num: '02',
                icon: Waves,
                title: '空間',
                desc: '佐保川のせせらぎを背景に、ゆったりとした時間が流れる読書空間。日常から少し距離を置き、本と向き合い、思考に身を委ねる場所です。',
              },
              {
                num: '03',
                icon: Users,
                title: 'つながり',
                desc: '読書会や小さな演奏会など、本を中心とした静かな集いの場としてもご利用いただけます。人と人、思考と時間がゆるやかに交わる空間です。',
              },
            ].map((item) => (
              <motion.div key={item.num} {...fadeUp} className="py-10">
                <div className="flex items-center gap-5 mb-4 md:hidden">
                  <div className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full border border-[#8a7d63]/30 text-[#8a7d63]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                </div>
                <p className="font-serif text-sm leading-loose text-[#2a2622]/70 md:hidden">{item.desc}</p>

                <div className="hidden md:grid md:grid-cols-[64px_120px_140px_1fr] gap-x-8 items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border border-[#8a7d63]/30 text-[#8a7d63]">
                    <item.icon size={20} />
                  </div>
                  <span className="font-serif text-sm text-[#8a7d63] tracking-[0.2em]">{item.num}</span>
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="font-serif text-sm leading-loose text-[#2a2622]/70 max-w-xl">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 店内photo + Menu */}
      <section className="px-6 pb-28 md:pb-40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <motion.div {...fadeUp} className="aspect-[3/4]">
            <img src="/S__15638541.jpg" alt="川べり店内の本棚" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-col justify-center">
            <span className="block text-[10px] tracking-[0.5em] uppercase font-serif text-[#8a7d63] mb-4">
              Menu
            </span>
            <h2 className="font-serif text-2xl md:text-3xl mb-8">珈琲と、軽食を。</h2>
            <div className="border border-[#2a2622]/15 bg-white/60 p-3">
              <img src="/menu.jpg" alt="川べり ドリンク・軽食メニュー" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hours & Access — フラットな情報パネル */}
      <section className="px-6 pb-28 md:pb-40">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <span className="block text-[10px] tracking-[0.5em] uppercase font-serif text-[#8a7d63] mb-4">
              Hours &amp; Access
            </span>
            <h2 className="font-serif text-3xl md:text-4xl">営業時間・アクセス</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20">
            <motion.div {...fadeUp} className="space-y-10 font-serif">
              <div className="flex justify-between border-b border-[#2a2622]/10 pb-4">
                <span className="text-sm text-[#8a7d63] tracking-widest">営業時間</span>
                <span className="text-base">10:30 - 18:00</span>
              </div>
              <div className="flex justify-between border-b border-[#2a2622]/10 pb-4">
                <span className="text-sm text-[#8a7d63] tracking-widest">定休日</span>
                <span className="text-base text-right">
                  月曜日
                  <br />
                  <span className="text-xs text-[#2a2622]/50">（祝日の場合は翌火曜）</span>
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2a2622]/10 pb-4">
                <span className="text-sm text-[#8a7d63] tracking-widest">住所</span>
                <span className="text-base text-right">
                  〒630-8113
                  <br />
                  奈良県奈良市法蓮町1050-1
                </span>
              </div>
              <div className="flex justify-between border-b border-[#2a2622]/10 pb-4">
                <span className="text-sm text-[#8a7d63] tracking-widest">電話</span>
                <span className="text-base">0742-42-6986</span>
              </div>
              <div className="flex justify-between border-b border-[#2a2622]/10 pb-4">
                <span className="text-sm text-[#8a7d63] tracking-widest">最寄り駅</span>
                <span className="text-base">近鉄奈良駅より徒歩約15分</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-sm text-[#8a7d63] tracking-widest">駐車場</span>
                <span className="text-base text-right">
                  1台分
                  <br />
                  <span className="text-xs text-[#2a2622]/50">満車時は近隣コインパーキングへ</span>
                </span>
              </div>

              <a
                href="https://maps.google.com/?q=奈良県奈良市法蓮町1050-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase border-b border-[#2a2622]/30 pb-1 hover:border-[#2a2622] transition-colors"
              >
                <MapPin size={14} />
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
      <section className="px-6 pb-28 md:pb-36 text-center">
        <motion.div {...fadeUp} className="max-w-xl mx-auto space-y-8">
          <p className="font-serif text-lg leading-loose text-[#2a2622]/70">
            歴史ある奈良の街で、本とともに、
            <br />
            静かな時間をお楽しみください。
          </p>
          <a
            href="https://www.instagram.com/kawaberi_bookandcafe/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase text-[#2a2622]/70 hover:text-[#2a2622] transition-colors border-b border-[#2a2622]/20 pb-1"
          >
            <Instagram size={14} />
            @kawaberi_bookandcafe
          </a>
        </motion.div>
      </section>
    </div>
  );
}
