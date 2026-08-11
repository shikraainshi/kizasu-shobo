import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Missing STRIPE_SECRET_KEY environment variable");
}

// Stripe SDKはコンストラクタで空文字だと即エラーになるため、未設定時はダミー値でビルドだけ通す
// （実際のAPI呼び出し時にStripe側の認証エラーとして失敗する）
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_missing_stripe_secret_key");
