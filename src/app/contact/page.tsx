'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-wakaba-base/30 rounded-full flex items-center justify-center mx-auto">
            <Send className="text-accent" size={32} />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-bold text-foreground">お問い合わせを承りました</h1>
            <p className="text-foreground/60 font-serif leading-relaxed">
              この度は萌書房へお問い合わせいただき、誠にありがとうございます。<br />
              内容を確認の上、担当者より折り返しご連絡を差し上げます。
            </p>
          </div>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-[11px] font-bold tracking-[0.4em] uppercase border-b border-accent/20 pb-2 text-accent/60 hover:text-accent hover:border-accent/40 transition-all font-serif"
          >
            トップページに戻る
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-background">
      {/* Page Header */}
      <section className="bg-wakaba/30 py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-serif font-bold text-center text-foreground tracking-[0.2em]">お問い合わせ</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-24">
          
          {/* Left: Contact Info (2/5) */}
          <div className="lg:col-span-2 space-y-16">
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent/40 font-serif border-l-2 border-accent/20 pl-4">Information</h2>
              <p className="text-foreground/70 font-serif leading-loose">
                書籍のご注文、公費でのご購入、企画の持ち込み、または弊社の活動に関するご質問など、お気軽にお問い合わせください。
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-10 h-10 bg-wakaba/30 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-accent/60" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.3em] uppercase text-accent/40 mb-2 font-serif">Address</h3>
                  <p className="text-sm font-serif text-foreground/80">〒630-8113 奈良県奈良市法蓮町1050-1</p>
                </div>

              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 bg-wakaba/30 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-accent/60" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.3em] uppercase text-accent/40 mb-2 font-serif">Phone / Fax</h3>
                  <p className="text-sm font-serif text-foreground/80">Tel: 0742-93-2234</p>
                  <p className="text-sm font-serif text-foreground/80">Fax: 0742-93-2235</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-10 h-10 bg-wakaba/30 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-accent/60" />
                </div>
                <div>
                  <h3 className="text-[9px] font-bold tracking-[0.3em] uppercase text-accent/40 mb-2 font-serif">Email</h3>
                  <p className="text-sm font-serif text-foreground/80">kizasu-s@m3.kcn.ne.jp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form (3/5) */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-10 bg-wakaba/5 p-8 md:p-12 border border-border/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">お名前 <span className="text-accent/40 ml-2">Required</span></label>
                  <input 
                    required
                    type="text" 
                    placeholder="萌 太郎"
                    className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-accent/20 shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">メールアドレス <span className="text-accent/40 ml-2">Required</span></label>
                  <input 
                    required
                    type="email" 
                    placeholder="example@kizasu.com"
                    className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-accent/20 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">お問い合わせ種別</label>
                <div className="relative">
                  <select className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all appearance-none cursor-pointer shadow-sm">
                    <option>書籍のご注文について</option>
                    <option>公費購入について</option>
                    <option>企画・執筆の持ち込み</option>
                    <option>その他のお問い合わせ</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent/40">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">メッセージ内容 <span className="text-accent/40 ml-2">Required</span></label>
                <textarea 
                  required
                  rows={8}
                  placeholder="お問い合わせ内容をご記入ください。"
                  className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all placeholder:text-accent/20 resize-none shadow-sm"
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-6 font-bold tracking-[0.5em] text-[11px] uppercase hover:bg-accent/90 transition-all font-serif shadow-lg"
                >
                  メッセージを送信する
                </button>
                <p className="text-[9px] text-accent/30 text-center mt-6 font-serif tracking-widest">
                  ※ 通常2〜3営業日以内にご返信いたします。
                </p>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

function ChevronDown({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
