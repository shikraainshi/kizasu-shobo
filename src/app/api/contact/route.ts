import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, type, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: '萌書房 お問い合わせ <info@kizasu-shobo.jp>', // ドメイン認証後に使用可能。未認証なら onboarding@resend.dev を一時的に使用
      to: ['kizasu-s@m3.kcn.ne.jp'], // ユーザー指定のメールアドレス
      replyTo: email,
      subject: `【お問い合わせ】${type} - ${name}様より`,
      text: `
お名前: ${name}
メールアドレス: ${email}
お問い合わせ種別: ${type}

メッセージ内容:
${message}
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
