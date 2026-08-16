import {
  CONTACT_ANSWERS,
  CONTACT_CATEGORIES,
  CONTACT_QUESTIONS,
  ContactCategoryId,
  ContactQuestionCategoryId,
  EVENT_FREE_TEXT_PROMPT,
  EVENT_PLACEHOLDER_MESSAGE,
  FREE_TEXT_ITEMS,
  FREE_TEXT_PROMPT,
  RENTAL_PLACEHOLDER_MESSAGE,
} from "@/lib/line/contact-content";
import { markAwaitingFreeText } from "@/lib/line/contact-state";
import { LineFlexMessage, LineMessage } from "@/lib/line/types";

// ブックカフェ「川べり」のトーンに合わせた落ち着いた配色（LINEグリーンは使わない）。
const FLEX_COLORS = {
  background: "#FAF7F2",
  title: "#3B2F2A",
  description: "#6B5D52",
  separator: "#E4DED2",
  button: "#8095A8",
  buttonText: "#FFFFFF",
};

function isQuestionCategoryId(id: string): id is ContactQuestionCategoryId {
  return id === "event" || id === "business" || id === "books";
}

function buildMenuFlex(
  title: string,
  description: string | undefined,
  buttons: { label: string; data: string }[]
): LineFlexMessage {
  return {
    type: "flex",
    altText: title,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: FLEX_COLORS.background,
        paddingAll: "20px",
        spacing: "md",
        contents: [
          { type: "text", text: title, weight: "bold", size: "md", color: FLEX_COLORS.title, wrap: true },
          ...(description
            ? [
                {
                  type: "text",
                  text: description,
                  size: "sm",
                  color: FLEX_COLORS.description,
                  wrap: true,
                  margin: "sm",
                },
              ]
            : []),
          { type: "separator", margin: "md", color: FLEX_COLORS.separator },
          ...buttons.map((button) => ({
            type: "button",
            style: "primary",
            color: FLEX_COLORS.button,
            height: "sm",
            margin: "md",
            action: {
              type: "postback",
              label: button.label,
              data: button.data,
              displayText: button.label,
            },
          })),
        ],
      },
    },
  };
}

export function showContactMenu(intro?: string): LineFlexMessage {
  return buildMenuFlex(
    intro ?? "お問い合わせ",
    intro ? undefined : "気になる項目をお選びください。",
    CONTACT_CATEGORIES.map((category) => ({
      label: category.label,
      data: `contact_category:${category.id}`,
    }))
  );
}

export function showContactSubMenu(categoryId: string): LineMessage {
  if (!isQuestionCategoryId(categoryId)) {
    return showContactMenu();
  }
  const category = CONTACT_CATEGORIES.find((c) => c.id === categoryId);
  return buildMenuFlex(
    category?.label ?? "お問い合わせ",
    "気になる項目をお選びください。",
    CONTACT_QUESTIONS[categoryId].map((question) => ({
      label: question.label,
      data: `contact_answer:${categoryId}:${question.id}`,
    }))
  );
}

async function sendContactAnswer(
  categoryId: string,
  itemId: string,
  userId?: string
): Promise<LineMessage> {
  if (!isQuestionCategoryId(categoryId)) {
    return showContactMenu();
  }
  const isFreeTextItem = FREE_TEXT_ITEMS[categoryId].includes(itemId);
  if (isFreeTextItem) {
    if (userId) await markAwaitingFreeText(userId);
    const promptText = categoryId === "event" ? EVENT_FREE_TEXT_PROMPT : FREE_TEXT_PROMPT;
    return { type: "text", text: promptText };
  }

  const answer = CONTACT_ANSWERS[`${categoryId}:${itemId}`];
  if (!answer) {
    return showContactMenu();
  }
  return { type: "text", text: answer };
}

async function handleContactCategory(categoryId: string, userId?: string): Promise<LineMessage> {
  if (categoryId === "other") {
    if (userId) await markAwaitingFreeText(userId);
    return { type: "text", text: FREE_TEXT_PROMPT };
  }
  return showContactSubMenu(categoryId);
}

export async function resolvePostbackMessage(data: string, userId?: string): Promise<LineMessage> {
  if (data === "event_placeholder") {
    return { type: "text", text: EVENT_PLACEHOLDER_MESSAGE };
  }
  if (data === "rental_placeholder") {
    return { type: "text", text: RENTAL_PLACEHOLDER_MESSAGE };
  }
  if (data === "contact_menu") {
    return showContactMenu();
  }

  const categoryMatch = data.match(/^contact_category:(.+)$/);
  if (categoryMatch) {
    return handleContactCategory(categoryMatch[1] as ContactCategoryId, userId);
  }

  const answerMatch = data.match(/^contact_answer:([^:]+):(.+)$/);
  if (answerMatch) {
    return sendContactAnswer(answerMatch[1], answerMatch[2], userId);
  }

  // 不明なpostback dataは問い合わせトップメニューへフォールバック
  return showContactMenu();
}
