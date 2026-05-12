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
  CONCEPT: "컨셉 - 설문 테마/스타일을 결정해요.",
};

export const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ["", "", "하신"],
  friend: ["하고", "하며", "한"],
  sweet: ["하고", "하며", "한"],
};

// 1. 테마 정보 정의 (순서 및 단축 네이밍 반영)
export const THEMES = {
  1: { id: "MOOD", name: "일상" },
  2: { id: "LUCK", name: "럭키" },
  3: { id: "PERSONA", name: "부캐" },
  4: { id: "FAVORITE", name: "AI분석" },
  5: { id: "SURVIVAL", name: "생존" },
} as const;

// 2. [화면 2] 테마별 10가지 카테고리 네이밍 (Update)
export const CATEGORY_NAMES: Record<string, Record<string, string>> = {
  MOOD: {
    food: "식사",
    voucher: "상품권",
    work: "워커홀릭",
    cafe: "카페",
    baby: "육아/출산",
    fun: "재미",
    beauty: "뷰티",
    health: "건강",
    living: "집꾸미기",
    anniversary: "기념일",
  },
  LUCK: {
    food: "미식 찬스",
    voucher: "상품권 횡재",
    work: "직장인 꿀템",
    cafe: "카페인 휴식",
    baby: "새로운 생명",
    fun: "유쾌한 반전",
    beauty: "매력의 축복",
    health: "무병장수",
    living: "리빙/인테리어",
    anniversary: "특별한 순간",
  },
  PERSONA: {
    food: "고독한 미식가",
    voucher: "자본주의 전략가",
    work: "갓생 직장인",
    cafe: "카페인 중독자",
    baby: "다정한 패밀리",
    fun: "엉뚱한 수집가",
    beauty: "나르시즘 자기관리",
    health: "건강/운동 전문가",
    living: "집돌이 집순이",
    anniversary: "기념일에 진심",
  },
  FAVORITE: {
    food: "식문화 지표",
    voucher: "화폐만능주의",
    work: "업무 생산성",
    cafe: "카페인 의존도",
    baby: "아기/돌봄/케어",
    fun: "유머 스펙트럼",
    beauty: "외모 관리",
    health: "건강 지수",
    living: "공간 활용",
    anniversary: "완벽한 기념일",
  },
  SURVIVAL: {
    food: "에너지 포션",
    voucher: "골드 파밍",
    work: "지능(INT) 스탯",
    cafe: "카페인(MP) 수혈",
    baby: "생명력(HP) 케어",
    fun: "멘탈 강화템",
    beauty: "매력(CHA) 강화",
    health: "체력/방어력",
    living: "베이스캠프",
    anniversary: "이벤트 퀘스트",
  },
};

// [화면 1] 인입 화면 정보
export const THEME_MAIN_INFO: Record<string, { title: string; keywords: string[] }> = {
  MOOD: {
    title: "요즘 당신의 일상은 어떤가요?",
    keywords: ["#데일리", "#일상", "#소확행"],
  },
  LUCK: {
    title: "당신에게 행운을 가져다줄 럭키요정으로부터 온 Q&A",
    keywords: ["#럭키템", "#네잎클로버", "#행운부적"],
  },
  PERSONA: {
    title: "당신도 몰랐던 자아/부캐 찾기",
    keywords: ["#부캐", "#본능", "#욕망"],
  },
  FAVORITE: {
    title: "데이터 기반 취향 분석 리포트",
    keywords: ["#분석알고리즘", "#객관적데이터", "#AI통계"],
  },
  SURVIVAL: {
    title: "치열한 현생을 버티게 할 생존템",
    keywords: ["#능력치", "#장비빨", "#생존템"],
  },
};

// [화면 2] 카테고리 선택 질문
export const THEME_CATEGORY_MSG: Record<string, { question: string; sub: string }> = {
  MOOD: { question: "당신이 가장 좋아하는 일상을 선택하세요.", sub: "일상 카테고리 선택" },
  LUCK: { question: "행운을 가져다 줄 영역을 선택하세요.", sub: "행운 카테고리 선택" },
  PERSONA: { question: "가장 관심 있는 분야를 선택하세요.", sub: "본능적 욕망 선택" },
  FAVORITE: { question: "당신의 취향을 분석할 대분류를 선택하세요.", sub: "10가지 카테고리 중 선택" },
  SURVIVAL: { question: "가장 좋아하는 세계관을 선택하세요.", sub: "관심 세계관 선택" },
};

// 결과 화면 베이스
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
      "의 대명사!\n 부캐는 ",
      { key: "KEYWORD2" },
      " ",
      { key: "KEYWORD3" },
      ". \n ",
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
      "은 당신에게 \n",
      { key: "KEYWORD3" },
      " 캐릭터를 완성해줄거에요.\n당신의 ",
      { key: "KEYWORD2" },
      " 매력에 \n부스터가 되어줄 아이템이에요.",
    ],
  },
  FAVORITE: {
    parts: [
      { key: "KEYWORD1" },
      " 취향을 저격한 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "은(는)\n 당신의 아이덴티티 그 자체입니다.\n",
      { key: "KEYWORD2" },
      " 당신의 손에 들어올 확률 \n",
      " 58000% 입니다.",
    ],
  },
  SURVIVAL: {
    parts: [
      { key: "KEYWORD2" },
      " 당신에게 필요한\n",
      " 생존템 ",
      { key: "ITEM", style: { color: "#ef4444", fontWeight: 800 } },
      "만 있다면 \n ",
      { key: "KEYWORD3" },
      "력 100% 든든합니다. \n 하루 더 생존 연장 완료!",
    ],
  },
};
