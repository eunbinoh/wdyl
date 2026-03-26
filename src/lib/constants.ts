import { Theme } from "@/types";

export const TOOLTIPS: Record<string, string> = {
  TO: "받는 분 이름 - 첫 화면 타이틀에 사용돼요.",
  WHO: "받는 분 특징 - 설문 결과 화면에 적용돼요.",
  CONCEPT: "컨셉/테마 - 설문링크의 말투와 분위기에요.",
};

export const THEME_START_MSG: Record<string, string> = {
  formal: "당신의 선택으로 취향을 알려주세요.",
  friend: "너의 취향을 솔직하게 골라봐 🤝🏻",
  sweet: "두근두근 취향 테스트 시작 💕",
};

export const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ["", "", "하신"],
  friend: ["하고", "하며", "한"],
  sweet: ["하고", "하며", "한"],
};
