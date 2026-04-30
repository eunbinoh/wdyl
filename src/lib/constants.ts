import { Theme } from "@/types";

type ResultMsg = {
  parts: Array<string | { key: "KEYWORD1" | "KEYWORD2" | "KEYWORD3" }>;
};
type ResultPart = string | { key: string; style?: React.CSSProperties };

type ResultSub = {
  parts: Array<ResultPart>;
};

export const TOOLTIPS: Record<string, string> = {
  TO: "받는 분 이름 - 첫 화면 타이틀에 사용돼요.",
  WHO: "받는 분 특징 - 설문 결과 화면에 적용돼요.",
  CONCEPT: "컨셉/테마 - 설문링크 질문/스타일을 결정해요.",
};

export const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ["", "", "하신"],
  friend: ["하고", "하며", "한"],
  sweet: ["하고", "하며", "한"],
};

// 1. 테마 정보 정의 (순서 및 단축 네이밍 반영)
export const THEMES = {
  1: { id: "MOOD", name: "데일리" },
  2: { id: "LUCK", name: "럭키템" },
  3: { id: "PERSONA", name: "캐릭터" },
  4: { id: "FAVORITE", name: "AI분석" },
  5: { id: "SURVIVAL", name: "생존력" },
} as const;

// 2. [화면 2] 테마별 10가지 카테고리 네이밍 (Update)
export const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  MOOD: {
    food: "맛있는 기록",
    voucher: "럭키 교환권",
    work: "몰입의 순간",
    cafe: "커피 향 무드",
    baby: "베이비 베이비",
    fun: "위트 있는 하루",
    beauty: "빛나는 나",
    health: "건강한 밸런스",
    living: "나만의 공간",
    anniversary: "잊지 못할 기념일",
  },
  LUCK: {
    food: "미식의 행운",
    voucher: "상품권 횡재",
    work: "성취의 기운",
    cafe: "카페인 휴식",
    baby: "새로운 생명력",
    fun: "유쾌한 반전",
    beauty: "매력의 축복",
    health: "강인한 수호",
    living: "공간의 평화",
    anniversary: "특별한 순간",
  },
  PERSONA: {
    food: "타고난 미식가",
    voucher: "상품권 전략가",
    work: "열정적인 워커홀릭",
    cafe: "낭만 카페러",
    baby: "다정한 패밀리",
    fun: "엉뚱한 수집가",
    beauty: "눈부신 주인공",
    health: "자기관리 끝판왕",
    living: "집돌이 집순이",
    anniversary: "로맨틱 기념일",
  },
  FAVORITE: {
    food: "식도락 지수",
    voucher: "자산 활용도",
    work: "커리어 열정",
    cafe: "카페인 의존도",
    baby: "돌봄 민감도",
    fun: "유머 스펙트럼",
    beauty: "외모 관리 지표",
    health: "신체 활성",
    living: "리빙 감각",
    anniversary: "기념일",
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
    title: "치열한 현생을 버티게 할 생존템 사전",
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
    step1: "지금 더 끌리는 무드는?",
    step2: "분위기를 바꿀 결정적 차이",
    step3: "놓치면 아쉬울 당신의 감각 한가지",
    step4: "마지막 라운드",
  },
  LUCK: {
    step1: "럭키비키를 가져와줄 쪽은?",
    step2: "당신을 지켜줄 행운요정의 선택",
    step3: "지금 이 순간, 네잎클로버 아이템",
    step4: "최종 럭키 리워드",
  },
  PERSONA: {
    step1: "당신의 본능이 끌리는 것",
    step2: "마음 속을 들여다보는 두 개의 저울",
    step3: "진짜 당신에게 더 가까운 것",
    step4: "결승",
  },
  FAVORITE: {
    step1: "취향 데이터 1차 검증",
    step2: "정밀 분석: 당신의 선호도는?",
    step3: "데이터가 지목한 최종 지표",
    step4: "FINAL",
  },
  SURVIVAL: {
    step1: "당장 챙겨야 할 생존 물자",
    step2: "현 필드에서 더 유용한 장비는?",
    step3: "최후의 1순위 보급품",
    step4: "파이널",
  },
};

// 5. [화면 3, 4, 5] Step별 진행 멘트
export const THEME_STEP_MSG: Record<string, { step1: string; step2: string; step3: string }> = {
  MOOD: {
    step1: "지금 당신의 일상에 더 필요한 것은?",
    step2: "당신의 무드를 완성할 퍼스널 한 조각은?",
    step3: "감성의 깊이를 결정할 세부 순서를 결정하세요.",
  },
  LUCK: {
    step1: "당신을 행운으로 이끌어줄 키워드는?",
    step2: "당신에게 지금 꼭 필요한 럭키템은?",
    step3: "행운을 극대화할 세부 옵션을 정해주세요.",
  },
  PERSONA: {
    step1: "평소 당신의 취향을 나타내는 위시 카테고리는?",
    step2: "당신의 머릿속에 더 강력하게 자리하고있는 아이템은?",
    step3: "진짜 내가 원하는, 당신의 페르소나에게 필요한 우선순위는?",
  },
  FAVORITE: {
    step1: "귀하의 선호도가 더 높은 지표를 고르세요.",
    step2: "지금 이 순간 가장 눈이 많이 가는 항목은?",
    step3: "분석의 정교함을 높이기 위해 우선순위대로 배치하세요.",
  },
  SURVIVAL: {
    step1: "오늘도 힘든 하루를 버티게 해주는 당신의 원동력은?",
    step2: "희망 인벤토리 중 도파민 에너지 물약 아이템이 있다면?",
    step3: "현생 생존 장비의 성능을 최적화할 튜닝 순위를 세팅하세요.",
  },
};

// 6. [화면 6] 결과 화면 베이스
export const THEME_RESULT_MSG: Record<string, ResultMsg> = {
  MOOD: {
    parts: [
      "요즘 당신의 일상은 ",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD3" },
      ".\n",
      { key: "KEYWORD1" },
      " 무드의 날들이네요.",
    ],
  },
  LUCK: {
    parts: [
      "축하합니다!\n당신의 럭키 키워드는 ",
      { key: "KEYWORD3" },
      "!\n",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD1" },
      " 에너지가 가득해요.",
    ],
  },
  PERSONA: {
    parts: [
      "당신은 ",
      { key: "KEYWORD1" },
      "의 대명사!\n 당신의 부캐는 ",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD3" },
      "\n 알고 있었나요?",
    ],
  },
  FAVORITE: {
    parts: [
      "분석 완료.\n당신은 ",
      { key: "KEYWORD1" },
      " 베이스의 \n",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD3" },
      " 인간 입니다.",
    ],
  },
  SURVIVAL: {
    parts: [
      "생존 랭크 S ! \n",
      { key: "KEYWORD1" },
      " 장착 완료.\n",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD3" },
      " 능력이 상승합니다.",
    ],
  },
};
// 7. [부연설명]
export const THEME_RESULT_SUB: Record<string, ResultSub> = {
  MOOD: {
    parts: [
      "이 분위기에 딱인 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "(으)로 \n 당신의 일상을 채워보세요.\n",
      { key: "KEYWORD2" },
      " 감성이 더해져 \n 한층 더 특별해질 거예요.",
    ],
  },
  LUCK: {
    parts: [
      "행운 아이템인 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "이(가) \n ",
      { key: "KEYWORD2" },
      " 기운에 날개를 달아줄거예요.\n 만약 선물로 받는다면 그날은, \n 럭키 ",
      { key: "KEYWORD3" },
      " 데이가 될거예요!",
    ],
  },
  PERSONA: {
    parts: [
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      " + 당신의 조화는 \n",
      { key: "KEYWORD3" },
      " 캐릭터를 완성해줄거에요.\n당신의 ",
      { key: "KEYWORD2" },
      " 매력에 \n부스터가 되어줄 거예요.",
    ],
  },
  FAVORITE: {
    parts: [
      { key: "KEYWORD1" },
      " 취향을 저격한 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "은(는)\n 당신의 아이덴티티 그 자체입니다.\n",
      { key: "KEYWORD2" },
      " 면을 완성해줄 아이템으로 \n",
      { key: "KEYWORD3" },
      " 라이프를 즐겨보세요.",
    ],
  },
  SURVIVAL: {
    parts: [
      { key: "KEYWORD2" },
      " 전략의 당신에게 \n",
      " 생존템 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "만 있다면 \n 이제",
      { key: "KEYWORD3" },
      "력 100% 든든합니다. \n 하루 더 생존 연장 완료!",
    ],
  },
};
