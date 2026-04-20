'use client';

import { useState } from 'react';
import { Instagram, X } from 'lucide-react';

export default function Footer() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const closeModal = () => setModalType(null);

  const legalContent = {
    privacy: {
      title: '個人情報保護方針',
      content: `有限会社 萌書房（以下「当社」）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。

1. 個人情報の管理
当社は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。

2. 個人情報の利用目的
お客さまからお預かりした個人情報は、当社からのご連絡や業務のご案内やご質問に対する回答として、電子メールや資料のご送付に利用いたします。

3. 個人情報の第三者への開示・提供の禁止
当社は、お客さまよりお預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。
・お客さまの同意がある場合
・お客さまが希望されるサービスを行なうために当社が業務を委託する業者に対して開示する場合
・法令に基づき開示することが必要である場合

4. 個人情報の安全対策
当社は、個人情報の正確性及び安全性確保のために、セキュリティに万全の対策を講じています。

5. ご本人の照会
お客さまがご本人の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。

6. 法令、規範の遵守と見直し
当社は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。`
    },
    terms: {
      title: '利用規約',
      content: `この利用規約（以下「本規約」）は、有限会社 萌書房（以下「当社」）が提供する本ウェブサイト（以下「本サービス」）の利用条件を定めるものです。ご利用の皆さま（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。

1. 適用
本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。

2. 禁止事項
ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
・法令または公序良俗に違反する行為
・犯罪行為に関連する行為
・当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
・当社のサービスの運営を妨害するおそれのある行為
・他のユーザーに関する個人情報等を収集または蓄積する行為
・本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
・その他、当社が不適切と判断する行為

3. 本サービスの提供の停止等
当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
・本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
・地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
・その他、当社が本サービスの提供が困難と判断した場合
当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害について、理由を問わず一切の責任を負わないものとします。

4. 著作権
本サービスに掲載されている画像、文章、ロゴ等の著作権は当社または正当な権利者に帰属します。無断での転載、複製、改変等を禁止します。

5. 利用規約の変更
当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。`
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-wakaba/30 py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-16">
            {/* Left 3/5: Company Name and Contact Info */}
            <div className="col-span-1 md:col-span-3 border-l border-accent/10 pl-12 md:pl-20">
              <div className="flex flex-col mb-8">
                <span className="text-[11px] uppercase tracking-[0.5em] text-accent/50 font-serif font-bold mb-2">Kizasu Shobo</span>
                <span className="text-3xl font-serif font-bold tracking-[0.2em] text-foreground">萌書房</span>
              </div>
              <div className="space-y-4 text-[14px] font-serif text-foreground/80 leading-relaxed">
                <p>〒630-8113 奈良県奈良市法蓮町1050-1</p>
                <p>Tel: 0742-93-2234</p>
                <p>Fax: 0742-93-2235</p>
                <p>Mail: kizasu-s@m3.kcn.ne.jp</p>
              </div>
            </div>

            {/* Right 2/5: Content and Social Links tucked to the right */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-12">
              <div className="flex flex-col">
                <h4 className="font-serif font-bold text-[10px] mb-8 uppercase tracking-[0.3em] text-accent/40 border-b border-accent/5 pb-2">コンテンツ</h4>
                <ul className="space-y-4 text-sm text-foreground/80 font-serif">
                  <li><a href="/books" className="hover:text-accent transition-colors">書籍案内</a></li>
                  <li><a href="/cafe" className="hover:text-accent transition-colors">ブックカフェ</a></li>
                  <li><a href="/about" className="hover:text-accent transition-colors">萌書房について</a></li>
                  <li><a href="/for-bookstores" className="hover:text-accent transition-colors">書店様へ</a></li>
                </ul>
              </div>
              <div className="flex flex-col">
                <h4 className="font-serif font-bold text-[10px] mb-8 uppercase tracking-[0.3em] text-accent/40 border-b border-accent/5 pb-2">公式アカウント</h4>
                <ul className="space-y-4 text-sm text-foreground/80 font-serif">
                  <li>
                    <a 
                      href="https://www.instagram.com/kawaberi_bookandcafe/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 hover:text-accent transition-colors group"
                    >
                      <Instagram size={16} className="text-accent/40 group-hover:text-accent transition-colors" />
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] tracking-[0.2em] text-accent/40 uppercase font-serif font-bold">
              © 2026 Kizasu Shobo. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[9px] tracking-[0.2em] text-accent/40 uppercase font-serif font-bold">
              <button onClick={() => setModalType('privacy')} className="hover:text-accent transition-colors">個人情報保護方針</button>
              <button onClick={() => setModalType('terms')} className="hover:text-accent transition-colors">利用規約</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {modalType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
          <div 
            className="bg-background w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border border-accent/10 shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-accent/5 flex justify-between items-center bg-wakaba/10">
              <h3 className="text-xl font-serif font-bold text-accent tracking-widest">{legalContent[modalType].title}</h3>
              <button 
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-wakaba/30 transition-colors text-accent/40 hover:text-accent"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 md:p-12 overflow-y-auto font-serif text-sm leading-relaxed text-foreground/70 space-y-4">
              <div className="whitespace-pre-wrap">
                {legalContent[modalType].content}
              </div>
            </div>
            <div className="p-6 border-t border-accent/5 text-center bg-wakaba/5">
              <button 
                onClick={closeModal}
                className="px-12 py-3 bg-accent text-white font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-accent/90 transition-all"
              >
                閉じる
              </button>
            </div>
          </div>
          {/* Invisible Backdrop Click Area */}
          <div className="absolute inset-0 -z-10" onClick={closeModal}></div>
        </div>
      )}
    </>
  );
}
