'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'ログインに失敗しました。');
      }

      const redirect = searchParams.get('redirect') || '/admin';
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || '予期せぬエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-background">
      <div className="max-w-sm w-full">
        <div className="text-center mb-10 space-y-3">
          <div className="w-14 h-14 bg-wakaba-base/30 rounded-full flex items-center justify-center mx-auto">
            <Lock className="text-accent" size={22} />
          </div>
          <h1 className="text-xl font-serif font-bold text-foreground tracking-[0.15em]">管理画面ログイン</h1>
          <p className="text-xs text-foreground/50 font-serif">萌書房 コンテンツ管理</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-serif">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-wakaba/5 p-8 border border-border/40">
          <div className="space-y-3">
            <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/80 font-serif block">
              パスワード
            </label>
            <input
              required
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-accent/20 px-5 py-4 text-sm font-serif focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/10 transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-accent text-white py-4 font-bold tracking-[0.4em] text-[11px] uppercase transition-all font-serif shadow-lg ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent/90'
            }`}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
