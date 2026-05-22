export type Theme = "formal" | "friend" | "sweet";
export type Status = "created" | "sent" | "progress" | "complete" | "cancelled";
export type Ticket = {
  ticket_id: string;
  receiver_name: string;
  comment: string;
  theme: string;
  status: Status;
  created_at?: string;
  user_id?: string;
  result?: string;
  pick_history?: string;
};
export type Category = {
  category_code: string;
  name: string;
};
export type Item = {
  item_id: string;
  item_name: string;
  category_code: string;
  img_url?: string;
  link_url?: string;
  level?: number;
};
export type Phase = "intro" | "step1" | "step2" | "step3" | "result" | "expired";

type KakaoShareOptions = Record<string, unknown>;

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key?: string) => void;
      Share: {
        sendCustom: (options: KakaoShareOptions) => void;
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}
