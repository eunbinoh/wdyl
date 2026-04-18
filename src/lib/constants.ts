import { Theme } from "@/types";

export const TOOLTIPS: Record<string, string> = {
  TO: "받는 분 이름 - 첫 화면 타이틀에 사용돼요.",
  WHO: "받는 분 특징 - 설문 결과 화면에 적용돼요.",
  CONCEPT: "컨셉/테마 - 설문링크의 말투와 분위기에요.",
};

export const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ["", "", "하신"],
  friend: ["하고", "하며", "한"],
  sweet: ["하고", "하며", "한"],
};

// 1. 테마 정보 정의 (순서 및 단축 네이밍 반영)
export const THEMES = {
  1: { id: "MOOD", name: "일상 무드 분석" },
  2: { id: "LUCK", name: "행운 탐지기" },
  3: { id: "PERSONA", name: "페르소나 테스트" },
  4: { id: "FAVORITE", name: "취향 분석" },
  5: { id: "SURVIVAL", name: "생존 장비 진단" },
} as const;

// 2. [화면 2] 테마별 10가지 카테고리 네이밍 (Update)
export const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  MOOD: {
    food: "맛있는 기록",
    voucher: "여유로운 교환",
    work: "몰입의 순간",
    cafe: "커피 향 무드",
    baby: "몽글몽글한 일상",
    fun: "위트 있는 하루",
    beauty: "빛나는 나",
    health: "건강한 밸런스",
    living: "나만의 은신처",
    anniversary: "잊지 못할 조각",
  },
  LUCK: {
    food: "미식의 행운",
    voucher: "뜻밖의 횡재",
    work: "성취의 기운",
    cafe: "휴식의 예언",
    baby: "새로운 생명력",
    fun: "유쾌한 반전",
    beauty: "매력의 축복",
    health: "강인한 수호",
    living: "공간의 평화",
    anniversary: "특별한 순간",
  },
  PERSONA: {
    food: "타고난 미식가",
    voucher: "실속 있는 전략가",
    work: "열정적인 워커홀릭",
    cafe: "여유를 아는 산책자",
    baby: "다정한 가디언",
    fun: "엉뚱한 수집가",
    beauty: "눈부신 주인공",
    health: "자기관리 끝판왕",
    living: "아늑한 홈 프로텍터",
    anniversary: "로맨틱한 기획자",
  },
  FAVORITE: {
    food: "식도락 지수",
    voucher: "자산 활용도",
    work: "커리어 열정",
    cafe: "카페인 의존도",
    baby: "돌봄 민감도",
    fun: "유머 스펙트럼",
    beauty: "외모 관리 지표",
    health: "신체 활성도",
    living: "리빙 감각",
    anniversary: "기념일 감도",
  },
  SURVIVAL: {
    food: "에너지 포션",
    voucher: "골드 파밍",
    work: "지능(INT) 스탯",
    cafe: "정신력(MP) 회복",
    baby: "생명력(HP) 케어",
    fun: "멘탈 강화템",
    beauty: "매력(CHA) 강화",
    health: "물리 방어력",
    living: "베이스캠프",
    anniversary: "이벤트 퀘스트",
  },
};

// 3. [화면 1] 인입 화면 정보
export const THEME_MAIN_INFO: Record<string, { title: string; keywords: string[] }> = {
  MOOD: {
    title: "지금 당신의 일상은 어떤 무드인가요?",
    keywords: ["#무드", "#공간", "#감성일상"],
  },
  LUCK: {
    title: "오늘 당신을 지켜줄 럭키 아이템은?",
    keywords: ["#운명", "#럭키", "#수호템"],
  },
  PERSONA: {
    title: "당신도 몰랐던 당신의 취향 부캐 찾기",
    keywords: ["#부캐", "#성격", "#취향발견"],
  },
  FAVORITE: {
    title: "데이터 기반: 당신의 취향 정밀 분석",
    keywords: ["#분석리포트", "#객관적", "#지표"],
  },
  SURVIVAL: {
    title: "치열한 현생을 버티게 할 생존 템 진단",
    keywords: ["#능력치", "#장비빨", "#생존템"],
  },
};

// 4. [화면 2] 카테고리 선택 질문
export const THEME_CATEGORY_MSG: Record<string, { question: string; sub: string }> = {
  MOOD: { question: "오늘 당신의 감각이 향하는 곳은 어디인가요?", sub: "지금 당신의 마음을 끄는 무드는?" },
  LUCK: { question: "어느 영역에서 행운이 필요하신가요?", sub: "행운이 깃들 곳을 선택하세요" },
  PERSONA: { question: "어떤 삶을 사는 당신의 모습이 궁금한가요?", sub: "분석하고 싶은 당신의 자아는?" },
  FAVORITE: { question: "정밀 분석을 시작할 카테고리를 선택하세요.", sub: "취향 데이터 분석 대상 선정" },
  SURVIVAL: { question: "어떤 스탯(분야)을 레벨업하고 싶으신가요?", sub: "장비를 보충할 인벤토리 칸 선택" },
};

// 5. [화면 3, 4, 5] Step별 타이틀
export const THEME_STEP_TITLE: Record<string, { step1: string; step2: string; step3: string; step4: string }> = {
  MOOD: {
    step1: "지금 더 끌리는 감각은?",
    step2: "분위기를 바꿀 결정적 차이",
    step3: "놓치면 아쉬울 당신의 무드",
    step4: "결승전",
  },
  LUCK: {
    step1: "운명이 가리키는 쪽은?",
    step2: "당신을 지켜줄 수호신의 선택",
    step3: "지금 이 순간, 행운의 방향",
    step4: "결승전",
  },
  PERSONA: {
    step1: "당신의 본능이 답하는 곳",
    step2: "자아를 증명할 두 개의 단서",
    step3: "진짜 당신에게 더 가까운 것",
    step4: "결승전",
  },
  FAVORITE: {
    step1: "취향 데이터 1차 검증",
    step2: "정밀 분석: 당신의 선호도는?",
    step3: "데이터가 지목한 최종 지표",
    step4: "결승전",
  },
  SURVIVAL: {
    step1: "당장 챙겨야 할 생존 물자",
    step2: "필드에서 더 유용한 장비는?",
    step3: "최후의 1인을 위한 보급품",
    step4: "결승전",
  },
};

// 5. [화면 3, 4, 5] Step별 진행 멘트
export const THEME_STEP_MSG: Record<string, { step1: string; step2: string; step3: string }> = {
  MOOD: {
    step1: "당신의 공간에 더 잘 어울리는 느낌은?",
    step2: "당신의 무드를 완성할 최후의 한 조각은?",
    step3: "감성의 깊이를 결정할 세부 옵션을 배치하세요.",
  },
  LUCK: {
    step1: "당신의 운명이 더 강력하게 끌리는 쪽은?",
    step2: "이 중 당신을 가장 빛내줄 진정한 럭키템은?",
    step3: "행운을 극대화할 마지막 세부 설정을 정해주세요.",
  },
  PERSONA: {
    step1: "평소 당신의 성격에 더 가까운 선택은?",
    step2: "당신의 정체성을 가장 잘 나타내는 물건은?",
    step3: "본캐와 부캐 사이, 당신만의 디테일 우선순위는?",
  },
  FAVORITE: {
    step1: "귀하의 선호도가 더 높은 지표를 고르세요.",
    step2: "데이터 분석 결과, 가장 비중이 높게 나타나는 항목은?",
    step3: "분석의 정교함을 높이기 위해 우선순위를 골라주세요.",
  },
  SURVIVAL: {
    step1: "전투(일상) 효율이 더 높은 장비는?",
    step2: "당신의 파이널 인벤토리에 넣을 최종 병기는?",
    step3: "최종 장비의 성능을 최적화할 튜닝 순위를 결정하세요.",
  },
};

// 6. [화면 6] 결과 화면 베이스
export const THEME_RESULT_MSG: Record<string, string> = {
  MOOD: "현재 무드는 [ITEM]. [FRIEND_KEYWORD] 같은 분위기가 감도는 중입니다.",
  LUCK: "축하합니다! 당신의 수호템은 [ITEM]! 행운의 기운이 가득하네요.",
  PERSONA: "당신은 [ITEM] 타입! 주변에서 보는 당신은 [FRIEND_KEYWORD] 하군요.",
  FAVORITE: "분석 완료. 당신은 [FRIEND_KEYWORD] 기반의 [ITEM] 선호형입니다.",
  SURVIVAL: "생존 랭크 S! [ITEM] 장착 완료. [FRIEND_KEYWORD] 능력이 상승합니다.",
};
