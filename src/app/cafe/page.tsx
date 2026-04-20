'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Coffee, BookOpen, Music, Wind, Library, Waves, Users } from 'lucide-react';

export default function CafePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-[#fdfcf8] pb-24 overflow-hidden">
      {/* 1. Hero Section - Dynamic & Pop */}
      <section className="relative h-[70vh] flex items-start justify-center pt-16 md:pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="/S__15638541.jpg" 
            alt="Cafe View" 
            className="w-full h-full object-cover brightness-90 contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full flex items-center justify-start">
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-white/60 backdrop-blur-md py-8 px-10 md:py-12 md:pl-16 md:pr-24 lg:pl-24 lg:pr-40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-[95%] md:max-w-4xl lg:max-w-5xl"
          >
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-accent/60 mb-4 block font-serif">Kizasu Book Cafe</span>
            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
              <img 
                src="/kawaberilogo.jpg" 
                alt="川べりロゴ" 
                className="h-16 md:h-24 w-auto object-contain"
              />
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-none tracking-tighter">川べり</h1>
            </div>
            <p className="text-sm md:text-xl text-foreground/80 font-serif leading-relaxed max-w-2xl">
              川のせせらぎ、本の匂い、珈琲の香り。<br />
              日常から少しだけ離れた、思考のための場所。
            </p>
          </motion.div>
        </div>

        {/* Floating Decorative Element */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-wakaba-base/20 rounded-full blur-3xl hidden lg:block"
        />
      </section>

      {/* 2. Intro Cards Section - Playful Grid */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { 
              title: "① 選書", 
              desc: "専門書の編集に長く携わってきたスタッフが、一冊一冊を丁寧に選び抜いています。流行に流されない、静かに思考を深めるための本たちを揃えています。" 
            },
            { 
              title: "② 空間", 
              desc: "佐保川のせせらぎを背景に、ゆったりとした時間が流れる読書空間。日常から少し距離を置き、思考に身を委ねる場所です。" 
            },
            { 
              title: "③ つながり", 
              desc: "読書会や小さな演奏会など、本を中心とした静かな集いの場としてもご利用いただけます。人と人、思考と時間がゆるやかに交わる空間です。" 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="bg-white p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-border/40 flex flex-col items-center group hover:-translate-y-2 transition-all duration-500 min-h-[250px] justify-center"
            >
              <h3 className="text-xl font-serif font-bold text-foreground mb-8 text-center border-b border-accent/20 pb-2 w-full">{item.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed font-serif whitespace-pre-wrap text-left w-full">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Main Feature Section - Asymmetrical & Visual */}
      <section className="py-24 bg-wakaba/10 relative">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-wakaba-base/20 relative z-10 overflow-hidden shadow-2xl">
              <img 
                src="/HTUB9783.JPEG" 
                alt="Cafe Atmosphere" 
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 border-l-2 border-t-2 border-accent/10 z-0" />
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-wakaba-base/10 -z-10" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <div className="inline-block px-4 py-1 bg-accent text-white text-[10px] font-bold tracking-[0.4em] uppercase font-serif">Concept</div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">奈良の出版社・萌書房が運営する、<br />特別なブックカフェ。</h2>
            <div className="space-y-6 text-lg text-foreground/70 font-serif leading-loose">
              <p>
                2025年4月6日、奈良の街角に新しい「兆し」が生まれます。
              </p>
              <p>
                店内に並ぶのは、萌書房が25年以上かけて世に送り出してきた思想書や文学の数々。
              </p>
              <p>
                「川べり」という名前には、境界線上にある曖昧なもの、これから何かへと変わっていく「兆し」を見守る場所という意味を込めています。
              </p>
            </div>
            <div className="pt-8">
              <div className="flex items-center gap-4 text-accent/40 font-serif italic text-sm">
                <Wind size={20} />
                <span>歴史ある奈良の街で、新しい思考の芽生えを楽しんでください</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Access Section - Expanded Layout */}
      <section className="py-32 container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-border/40 overflow-hidden p-12 md:p-20">
          <div className="space-y-12">
            <h2 className="text-4xl font-serif font-bold text-foreground flex items-center gap-4">
              <MapPin className="text-accent" size={32} />
              Access
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="w-full lg:w-1/3 space-y-10">
                <div className="space-y-4">
                  <p className="font-serif text-foreground/80 leading-relaxed text-base md:text-base">
                    〒630-8113<br />
                    奈良県奈良市法蓮町1050-1
                  </p>
                  <a 
                    href="https://maps.google.com/?q=奈良県奈良市法蓮町1050-1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-accent uppercase font-serif border-b border-accent/20 pb-1 hover:text-accent/60 hover:border-accent/10 transition-all"
                  >
                    Googleマップで見る
                  </a>
                </div>

                <div className="space-y-8">
                  {/* 駅からのアクセス */}
                  <div className="flex items-start gap-4">
                    <Library size={18} className="text-accent/40 mt-1" />
                    <div>
                      <h3 className="text-[10px] font-bold tracking-widest text-accent uppercase font-serif mb-1">最寄り駅</h3>
                      <p className="text-sm font-serif text-foreground/70 leading-relaxed">近鉄奈良駅より 徒歩約15分</p>
                    </div>
                  </div>

                  {/* 駐車場情報 */}
                  <div className="flex items-start gap-4">
                    <Users size={18} className="text-accent/40 mt-1" />
                    <div>
                      <h3 className="text-[10px] font-bold tracking-widest text-accent uppercase font-serif mb-1">駐車場</h3>
                      <div className="text-sm font-serif text-foreground/70 leading-relaxed space-y-1">
                        <p>1台分（先着順）</p>
                        <p className="text-[11px] opacity-80">※満車時は近隣のコインパーキングをご利用ください</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:flex-1 h-[450px] bg-white shadow-inner border border-border/40 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.96695289524!2d135.818166376286!3d34.693427972923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60013970258074d1%3A0xc66415849a623a88!2z44CSNjMwLTgxMTMg5aWI6Imv55yM5aWI6Imv5biC5rOV6JOu55S677yR77yQ77yV77yQ4oiS77yR!5e0!3m2!1sja!2sjp!4v1712810000000!5m2!1sja!2sjp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="川べり Location"
                  className="grayscale-[0.1] contrast-[1.05]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
