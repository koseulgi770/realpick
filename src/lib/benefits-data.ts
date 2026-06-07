// 2026년 대한민국 임신·출산·육아 혜택 데이터 및 계산 로직

export interface UserInput {
  region: string;
  childOrder: number; // 1=첫째, 2=둘째, 3=셋째+
  fetalCount: number; // 1=단태, 2+=다태
  employmentType: 'employed' | 'selfEmployed' | 'jobSeeking';
  incomeLevel: 'under50' | 'under100' | 'under150' | 'over150';
  housingType: 'homeless' | 'recentPurchase' | 'homeOwner';
  specialConditions: string[];
}

export interface Benefit {
  category: string;
  name: string;
  amount: string;
  amountValue: number; // 원 단위 (대략적 환산)
  timing: string;
  description: string;
  howToApply: string;
}

// 지자체별 출산장려금 (2026년 기준)
const regionalBonuses: Record<string, { name: string; amounts: number[]; notes?: string }> = {
  '서울': { name: '서울시 출산축하금', amounts: [1000000, 1500000, 2000000], notes: '자치구별 추가 지원 있음 (강남구 첫째 200만원 등)' },
  '부산': { name: '부산시 출산장려금', amounts: [0, 500000, 1500000], notes: '둘째 50만원(2회분할), 셋째이후 150만원(12회분할). 구별 추가 지원 있음' },
  '대구': { name: '대구시 출산장려금', amounts: [500000, 1000000, 2000000] },
  '인천': { name: '인천시 출산장려금', amounts: [1000000, 1500000, 2000000], notes: '구별 산전·산후 서비스 바우처 추가 지원' },
  '광주': { name: '광주시 출산장려금', amounts: [500000, 1000000, 2000000], notes: '자치구별 추가 지원 상이, 보건소 확인 필요' },
  '대전': { name: '대전시 출산장려금', amounts: [500000, 1000000, 1500000] },
  '울산': { name: '울산시 출산장려금', amounts: [1000000, 2000000, 3000000] },
  '세종': { name: '세종시 출산장려금', amounts: [1000000, 2000000, 5000000] },
  '경기': { name: '경기도 출산장려금', amounts: [500000, 1000000, 2000000], notes: '시군별 자체 지원 상이. 양평군 첫째 500만원 등 지역차 큼' },
  '강원': { name: '강원도 출산장려금', amounts: [1000000, 2000000, 3000000] },
  '충북': { name: '충북 출산장려금', amounts: [500000, 1000000, 2000000] },
  '충남': { name: '충남 출산장려금', amounts: [500000, 1500000, 3000000] },
  '전북': { name: '전북 출산장려금', amounts: [1000000, 2000000, 3000000] },
  '전남': { name: '전남 출산장려금', amounts: [1000000, 2000000, 5000000] },
  '경북': { name: '경북 출산장려금', amounts: [1000000, 2000000, 3000000] },
  '경남': { name: '경남 출산장려금', amounts: [500000, 1500000, 3000000] },
  '제주': { name: '제주 출산장려금', amounts: [500000, 1000000, 2000000] },
};

function formatWon(value: number): string {
  if (value >= 10000) {
    const man = Math.floor(value / 10000);
    const remainder = value % 10000;
    if (remainder === 0) return `${man}만원`;
    return `${man}만 ${remainder.toLocaleString()}원`;
  }
  return `${value.toLocaleString()}원`;
}

function formatWonRaw(value: number): string {
  if (value >= 100000000) {
    const eok = (value / 100000000).toFixed(1).replace('.0', '');
    return `약 ${eok}억원`;
  }
  if (value >= 10000000) {
    const man = Math.floor(value / 10000);
    return `약 ${man.toLocaleString()}만원`;
  }
  if (value >= 10000) {
    const man = Math.floor(value / 10000);
    return `약 ${man}만원`;
  }
  return `${value.toLocaleString()}원`;
}

export function calculateBenefits(input: UserInput): { benefits: Benefit[]; totalEstimate: string; totalValue: number } {
  const benefits: Benefit[] = [];
  const orderIdx = Math.min(input.childOrder, 3) - 1;

  // 1. 첫만남 이용권
  const firstMeetAmounts = [2000000, 3000000, 3000000];
  const firstMeetVal = firstMeetAmounts[orderIdx] * input.fetalCount;
  benefits.push({
    category: '현금성 지원',
    name: '첫만남 이용권',
    amount: formatWon(firstMeetVal),
    amountValue: firstMeetVal,
    timing: '출생 후 (출생신고 시)',
    description: `첫째 200만원, 둘째 이상 300만원 바우처 지급`,
    howToApply: '정부24 또는 주민센터에서 출생신고 시 자동 안내',
  });

  // 2. 부모급여 (0~23개월, 총 1,800만원 기준)
  const parentPayTotal = 18000000;
  benefits.push({
    category: '현금성 지원',
    name: '부모급여',
    amount: `총 ${formatWon(parentPayTotal)}`,
    amountValue: parentPayTotal,
    timing: '출생 후 0~23개월 매월',
    description: '0~11개월 월 100만원, 12~23개월 월 50만원 지급',
    howToApply: '복지로 또는 주민센터에서 신청',
  });

  // 3. 아동수당 (월 10만원, 만 8세까지)
  const childAllowTotal = 100000 * 12 * 8;
  benefits.push({
    category: '현금성 지원',
    name: '아동수당',
    amount: `월 10만원 (만 8세까지 총 ${formatWonRaw(childAllowTotal)})`,
    amountValue: childAllowTotal,
    timing: '출생 후 매월',
    description: '만 8세 미만 아동에게 월 10만원 지급',
    howToApply: '복지로 또는 주민센터에서 신청',
  });

  // 4. 임신 바우처 (국민행복카드)
  const pregVoucherVal = input.fetalCount >= 2 ? 1400000 : 1000000;
  benefits.push({
    category: '의료비 지원',
    name: '임신·출산 진료비 바우처 (국민행복카드)',
    amount: formatWon(pregVoucherVal),
    amountValue: pregVoucherVal,
    timing: '임신 확인 후',
    description: `단태아 100만원, 다태아 140만원 의료비 지원`,
    howToApply: '국민건강보험공단 또는 카드사에서 국민행복카드 신청',
  });

  // 5. 제왕절개 본인부담금 0원
  benefits.push({
    category: '의료비 지원',
    name: '제왕절개 본인부담금 면제',
    amount: '해당 시 전액 면제',
    amountValue: 0,
    timing: '출산 시',
    description: '제왕절개 수술 시 본인부담금 0원',
    howToApply: '건강보험 자동 적용',
  });

  // 6. 고위험 임산부 의료비 지원
  if (input.specialConditions.includes('highRisk')) {
    benefits.push({
      category: '의료비 지원',
      name: '고위험 임산부 의료비 지원',
      amount: '최대 300만원',
      amountValue: 3000000,
      timing: '진단 후',
      description: '고위험 임신 진단 시 입원·치료비 최대 90% 지원',
      howToApply: '보건소에서 신청',
    });
  }

  // 7. 산후조리비 지원 (지자체별)
  benefits.push({
    category: '의료비 지원',
    name: '산후조리비 지원',
    amount: '지자체별 상이 (약 50~100만원)',
    amountValue: 700000,
    timing: '출산 후',
    description: '지자체별 산후조리원 이용비 또는 산후도우미 지원',
    howToApply: '거주지 보건소 또는 복지로에서 신청',
  });

  // 8. 육아휴직 급여 (2026년 개정 기준, 직장인만)
  if (input.employmentType === 'employed') {
    const childLeaveTotal = 2500000 * 3 + 2000000 * 3 + 1600000 * 6;
    benefits.push({
      category: '근로 지원',
      name: '육아휴직 급여 (2026년 개정)',
      amount: `1~3개월 월 250만원, 4~6개월 월 200만원, 7~12개월 월 160만원`,
      amountValue: childLeaveTotal,
      timing: '육아휴직 기간 중',
      description: '2026년 개정: 1~3개월 통상임금 100%(상한 250만원), 4~6개월 100%(상한 200만원), 7~12개월 80%(상한 160만원)',
      howToApply: '고용보험 홈페이지(ei.go.kr)에서 신청',
    });

    benefits.push({
      category: '근로 지원',
      name: '임신 중 근로시간 단축',
      amount: '임금 삭감 없음',
      amountValue: 0,
      timing: '임신 기간 중',
      description: '임신 12주 이내, 36주 이후 1일 2시간 단축 (임금 삭감 없음)',
      howToApply: '사업주에게 신청 (근로기준법 보장)',
    });
  }

  // 9. 출산전후휴가 급여
  if (input.employmentType === 'employed') {
    benefits.push({
      category: '근로 지원',
      name: '출산전후휴가 급여',
      amount: '최대 월 210만원 (90일)',
      amountValue: 6300000,
      timing: '출산 전후',
      description: '출산 전후 90일 휴가 (다태아 120일), 통상임금 지급',
      howToApply: '고용보험 홈페이지에서 신청',
    });
  }

  // 10. 전기세 감면
  benefits.push({
    category: '생활/주거 지원',
    name: '전기요금 감면',
    amount: '월 30% 감면',
    amountValue: 360000,
    timing: '출생신고 후',
    description: '영아(3세 미만) 가구 전기요금 30% 할인',
    howToApply: '한국전력 고객센터 또는 온라인에서 신청',
  });

  // 11. KTX/SRT 할인
  benefits.push({
    category: '생활/주거 지원',
    name: 'KTX/SRT 할인',
    amount: '임산부 75% 할인',
    amountValue: 0,
    timing: '임신 기간 중',
    description: '임산부 KTX/SRT 일반실 75% 할인',
    howToApply: '맘편한 KTX 예약 (코레일 앱)',
  });

  // 12. 취득세 감면 (무주택자 주택 구입 시)
  if (input.housingType === 'recentPurchase' || input.housingType === 'homeless') {
    benefits.push({
      category: '생활/주거 지원',
      name: '생애최초 주택 취득세 감면',
      amount: '최대 500만원 감면',
      amountValue: 5000000,
      timing: '주택 구입 시',
      description: '출산 가구 생애최초 주택 구입 시 취득세 최대 500만원 감면',
      howToApply: '주택 취득 시 시·군·구청에서 신청',
    });
  }

  // 13. 서울시 교통비 (서울 거주 시)
  if (input.region.includes('서울')) {
    benefits.push({
      category: '지자체 특화',
      name: '서울시 임산부 교통비',
      amount: '70만원',
      amountValue: 700000,
      timing: '임신 확인 후',
      description: '서울시 거주 임산부 교통비 70만원 지원',
      howToApply: '서울시 임산부 교통비 지원 사이트에서 신청',
    });
  }

  // 14. 지자체 출산장려금
  const matchedRegion = Object.keys(regionalBonuses).find(r => input.region.includes(r));
  if (matchedRegion) {
    const bonus = regionalBonuses[matchedRegion];
    const bonusVal = bonus.amounts[orderIdx];
    if (bonusVal > 0) {
      benefits.push({
        category: '지자체 특화',
        name: bonus.name,
        amount: formatWon(bonusVal),
        amountValue: bonusVal,
        timing: '출생신고 후',
        description: `${matchedRegion} 지역 출산장려금 (자녀 순위별 차등)${bonus.notes ? '. ' + bonus.notes : ''}`,
        howToApply: '주민센터 또는 지자체 복지포털에서 신청',
      });
    }
  }

  // 15. 저소득 추가 지원
  if (input.incomeLevel === 'under50' || input.incomeLevel === 'under100') {
    benefits.push({
      category: '현금성 지원',
      name: '저소득층 기저귀·조제분유 지원',
      amount: '월 약 9만원',
      amountValue: 1080000,
      timing: '출생 후 24개월까지',
      description: '기초생활수급자·차상위 가구 기저귀 월 9만원, 조제분유 추가 지원',
      howToApply: '복지로 또는 주민센터에서 신청',
    });
  }

  // 16. 산모·신생아 건강관리 지원 (산후도우미)
  if (input.incomeLevel !== 'over150') {
    benefits.push({
      category: '의료비 지원',
      name: '산모·신생아 건강관리 지원 (정부지원 산후도우미)',
      amount: '중위소득 150% 이하 가구 지원 (본인부담금 차등)',
      amountValue: 1000000,
      timing: '출산 후',
      description: '중위소득 150% 이하 출산가정에 산후도우미 파견. 소득에 따라 본인부담금 차등. 단태아 표준형 기준 정부지원금 약 120~170만원 수준',
      howToApply: '복지로 또는 보건소에서 임신 중 사전 신청 권장',
    });
  }

  // 17. 자녀장려금
  if (input.incomeLevel === 'under50' || input.incomeLevel === 'under100') {
    benefits.push({
      category: '현금성 지원',
      name: '자녀장려금',
      amount: '자녀 1인당 최대 100만원',
      amountValue: 1000000,
      timing: '매년 신청 (5월)',
      description: '저소득 가구 자녀 양육 지원. 홑벌이·맞벌이 가구 소득 기준에 따라 차등 지급',
      howToApply: '국세청 홈택스(hometax.go.kr) 또는 세무서에서 신청',
    });
  }

  // 18. 다자녀 아동수당 추가 (비수도권/인구감소지역, 2026년 신규)
  const isNonMetro = ['강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'].some(r => input.region.includes(r));
  if (isNonMetro) {
    benefits.push({
      category: '지자체 특화',
      name: '비수도권 아동수당 추가 지원 (2026년 신규)',
      amount: '월 10만원 추가 (지역별 상이)',
      amountValue: 1200000,
      timing: '출생 후 매월',
      description: '2026년부터 비수도권·인구감소지역 거주 아동에게 아동수당 추가 지원. 지역별로 금액 상이',
      howToApply: '주민센터 또는 복지로에서 신청',
    });
  }

  // 19. 부산 특화 - 둘째 이상 추가 지원
  if (input.region.includes('부산') && input.childOrder >= 2) {
    benefits.push({
      category: '지자체 특화',
      name: '부산시 첫만남이용권 추가 지원',
      amount: '둘째 이상 100만원 추가 (일시금)',
      amountValue: 1000000,
      timing: '출생신고 후 3개월 이내 신청',
      description: '부산시 거주 둘째 이상 출생아에게 첫만남이용권 300만원 외 추가 100만원 현금 지급',
      howToApply: '읍·면·동 행정복지센터 또는 복지로에서 신청',
    });
  }

  // 20. 광주 특화 - 임산부 지원
  if (input.region.includes('광주')) {
    benefits.push({
      category: '지자체 특화',
      name: '광주시 임산부 건강관리 지원',
      amount: '자치구별 상이',
      amountValue: 300000,
      timing: '임신 확인 후',
      description: '광주시 각 자치구(동구·서구·남구·북구·광산구)별로 임산부 교통비, 영양제, 검진비 등 추가 지원. 관할 보건소 확인 필요',
      howToApply: '거주 자치구 보건소 방문 신청',
    });
  }

  // 21. 청년 임산부
  if (input.specialConditions.includes('youngParent')) {
    benefits.push({
      category: '현금성 지원',
      name: '청년 임산부 특별 지원',
      amount: '추가 바우처 50만원',
      amountValue: 500000,
      timing: '임신 확인 후',
      description: '만 34세 이하 청년 임산부 추가 지원',
      howToApply: '보건소에서 신청',
    });
  }

  const totalValue = benefits.reduce((sum, b) => sum + b.amountValue, 0);
  const totalEstimate = formatWonRaw(totalValue);

  return { benefits, totalEstimate, totalValue };
}

export const regions = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
];

export const actionSteps = [
  { step: 1, action: '임신 확인 후 보건소 방문 → 임산부 등록 + 국민행복카드 신청' },
  { step: 2, action: '정부24에서 "맘편한 임신 원스톱 서비스" 신청 (각종 바우처 통합)' },
  { step: 3, action: '복지로에서 부모급여·아동수당 사전 신청' },
  { step: 4, action: '출생신고 시 첫만남 이용권 + 지자체 출산장려금 동시 신청' },
  { step: 5, action: '직장인은 고용보험에서 육아휴직급여 신청' },
  { step: 6, action: '한국전력에 영아 가구 전기요금 감면 신청' },
];

export const officialLinks = [
  { name: '맘편한 임신 원스톱 서비스 (정부24)', url: 'https://www.gov.kr' },
  { name: '복지로 (복지서비스 신청)', url: 'https://www.bokjiro.go.kr' },
  { name: '국민건강보험공단 (바우처 신청)', url: 'https://www.nhis.or.kr' },
  { name: '고용보험 (육아휴직 급여)', url: 'https://www.ei.go.kr' },
];
