import { useState } from 'react';
import { Baby, ArrowRight, ArrowLeft } from 'lucide-react';
import StepIndicator from '@/components/StepIndicator';
import OptionButton from '@/components/OptionButton';
import BenefitResults from '@/components/BenefitResults';
import { calculateBenefits, regions, type UserInput } from '@/lib/benefits-data';

const stepLabels = ['지역', '자녀', '태아', '고용', '소득', '주거', '특이사항'];

const Index = () => {
  const [step, setStep] = useState(0); // 0 = intro
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState<UserInput>({
    region: '',
    childOrder: 1,
    fetalCount: 1,
    employmentType: 'employed',
    incomeLevel: 'under150',
    housingType: 'homeless',
    specialConditions: [],
  });

  const updateInput = <K extends keyof UserInput>(key: K, value: UserInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const toggleSpecial = (cond: string) => {
    setInput(prev => ({
      ...prev,
      specialConditions: prev.specialConditions.includes(cond)
        ? prev.specialConditions.filter(c => c !== cond)
        : [...prev.specialConditions, cond],
    }));
  };

  const canProceed = () => {
    if (step === 1) return input.region !== '';
    return true;
  };

  const handleNext = () => {
    if (step === 7) {
      setShowResults(true);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else {
      setStep(s => Math.max(0, s - 1));
    }
  };

  const handleReset = () => {
    setStep(0);
    setShowResults(false);
    setInput({
      region: '',
      childOrder: 1,
      fetalCount: 1,
      employmentType: 'employed',
      incomeLevel: 'under150',
      housingType: 'homeless',
      specialConditions: [],
    });
  };

  const results = showResults ? calculateBenefits(input) : null;

  // Intro
  if (step === 0 && !showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Baby className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              임신·출산 혜택 계산기
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              2026년 최신 정책 기준으로<br />
              받을 수 있는 모든 혜택을 계산해 드립니다
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            혜택 계산 시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground">
            약 2분 소요 · 7가지 간단한 질문
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-lg mx-auto">
        {!showResults && (
          <>
            <StepIndicator currentStep={step} totalSteps={7} labels={stepLabels} />

            <div className="min-h-[300px] animate-in fade-in duration-300">
              {/* Step 1: Region */}
              {step === 1 && (
                <div>
                  <h2 className="section-title">거주 지역을 선택해주세요</h2>
                  <p className="text-sm text-muted-foreground mb-4">지자체별 혜택 계산에 필요합니다</p>
                  <div className="grid grid-cols-3 gap-2">
                    {regions.map(r => (
                      <OptionButton
                        key={r}
                        label={r}
                        selected={input.region === r}
                        onClick={() => updateInput('region', r)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Child Order */}
              {step === 2 && (
                <div>
                  <h2 className="section-title">몇째 자녀인가요?</h2>
                  <div className="space-y-3">
                    {[
                      { value: 1, label: '첫째', desc: '첫 번째 자녀' },
                      { value: 2, label: '둘째', desc: '두 번째 자녀' },
                      { value: 3, label: '셋째 이상', desc: '세 번째 이상 자녀' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.childOrder === opt.value}
                        onClick={() => updateInput('childOrder', opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Fetal Count */}
              {step === 3 && (
                <div>
                  <h2 className="section-title">태아 수를 선택해주세요</h2>
                  <div className="space-y-3">
                    {[
                      { value: 1, label: '단태아', desc: '한 명' },
                      { value: 2, label: '쌍둥이', desc: '두 명' },
                      { value: 3, label: '세쌍둥이 이상', desc: '세 명 이상' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.fetalCount === opt.value}
                        onClick={() => updateInput('fetalCount', opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Employment */}
              {step === 4 && (
                <div>
                  <h2 className="section-title">고용 형태를 선택해주세요</h2>
                  <div className="space-y-3">
                    {[
                      { value: 'employed' as const, label: '직장인', desc: '4대 보험 가입 근로자' },
                      { value: 'selfEmployed' as const, label: '프리랜서/자영업자', desc: '개인사업자 또는 프리랜서' },
                      { value: 'jobSeeking' as const, label: '구직 중', desc: '현재 구직 중이거나 경력 단절' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.employmentType === opt.value}
                        onClick={() => updateInput('employmentType', opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Income */}
              {step === 5 && (
                <div>
                  <h2 className="section-title">가구 소득 수준을 선택해주세요</h2>
                  <p className="text-sm text-muted-foreground mb-4">중위소득 기준 (2026년 4인가구 기준 약 609만원)</p>
                  <div className="space-y-3">
                    {[
                      { value: 'under50' as const, label: '중위소득 50% 이하', desc: '기초생활수급·차상위' },
                      { value: 'under100' as const, label: '중위소득 100% 이하', desc: '약 609만원 이하' },
                      { value: 'under150' as const, label: '중위소득 150% 이하', desc: '약 914만원 이하' },
                      { value: 'over150' as const, label: '중위소득 150% 초과', desc: '약 914만원 초과' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.incomeLevel === opt.value}
                        onClick={() => updateInput('incomeLevel', opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Housing */}
              {step === 6 && (
                <div>
                  <h2 className="section-title">주거 형태를 선택해주세요</h2>
                  <div className="space-y-3">
                    {[
                      { value: 'homeless' as const, label: '무주택', desc: '현재 주택을 소유하지 않음' },
                      { value: 'recentPurchase' as const, label: '최근 주택 구입', desc: '최근 주택을 구입했거나 구입 예정' },
                      { value: 'homeOwner' as const, label: '주택 소유', desc: '이미 주택을 보유 중' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.housingType === opt.value}
                        onClick={() => updateInput('housingType', opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Special Conditions */}
              {step === 7 && (
                <div>
                  <h2 className="section-title">해당하는 항목을 선택해주세요</h2>
                  <p className="text-sm text-muted-foreground mb-4">복수 선택 가능 · 해당 없으면 바로 결과 보기</p>
                  <div className="space-y-3">
                    {[
                      { value: 'highRisk', label: '고위험 임산부', desc: '임신 합병증 등 고위험 진단' },
                      { value: 'youngParent', label: '청년 임산부 (만 34세 이하)', desc: '청년 특별 지원 대상' },
                    ].map(opt => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        description={opt.desc}
                        selected={input.specialConditions.includes(opt.value)}
                        onClick={() => toggleSpecial(opt.value)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
              >
                {step === 7 ? '결과 보기' : '다음'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {showResults && results && (
          <BenefitResults
            benefits={results.benefits}
            totalEstimate={results.totalEstimate}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
