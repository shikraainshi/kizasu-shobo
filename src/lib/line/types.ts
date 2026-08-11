export type LineTextMessage = {
  type: "text";
  text: string;
};

export type LineMessage = LineTextMessage;

export type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  message?: {
    type: string;
    text?: string;
  };
};

export type LineWebhookBody = {
  destination?: string;
  events?: LineWebhookEvent[];
};
