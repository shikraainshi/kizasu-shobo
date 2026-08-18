export type LineTextMessage = {
  type: "text";
  text: string;
};

export type LineFlexMessage = {
  type: "flex";
  altText: string;
  contents: unknown;
};

export type LineImageMessage = {
  type: "image";
  originalContentUrl: string;
  previewImageUrl: string;
};

export type LineMessage = LineTextMessage | LineFlexMessage | LineImageMessage;

export type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  message?: {
    type: string;
    text?: string;
  };
  postback?: {
    data: string;
  };
  source?: {
    type: string;
    userId?: string;
  };
};

export type LineWebhookBody = {
  destination?: string;
  events?: LineWebhookEvent[];
};
