import { ExternalLink, ArrowLeft, Gift, Stethoscope, Briefcase, Home, MapPin } from 'lucide-react';
import type { Benefit } from '@/lib/benefits-data';
import { actionSteps, officialLinks } from '@/lib/benefits-data';

interface BenefitResultsProps {
  benefits: Benefit[];
  totalEstimate: string;
  onReset: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  '현금성 지원': <Gift className="w-5 h-5" />,
  '의료비 지원': <Stethoscope className="w-5 h-5" />,
  '근로 지원': <Briefcase className="w-5 h-5" />,
  '생활/주거 지원': <Home className="w-5 h-5" />,
  '지자체 특화': <MapPin className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  '현금성 지원': 'bg-primary/10 text-primary',
  '의료비 지원': 'bg-accent/10 text-accent',
  '근로 지원': 'bg-secondary text-secondary-foreground',
  '생활/주거 지원': 'bg-peach text-foreground',
  '지자체 특화': 'bg-sage/30 text-foreground',
};

const BenefitResults = ({ benefits, totalEstimate, onReset }: BenefitResultsProps) => {
  const categories = [...new Set(benefits.map(b => b.category))];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Total */}
      <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/20">
        <p className="text-muted-foreground mb-2">예상 최대 수령 총액</p>
        <p className="text-4xl font-bold text-primary">{totalEstimate}</p>
        <p className="text-sm text-muted-foreground mt-2">
          * 실제 수령액은 개인 상황에 따라 달라질 수 있습니다
        </p>
      </div>

      {/* Benefits by category */}
      {categories.map(cat => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`p-2 rounded-lg ${categoryColors[cat] || 'bg-muted'}`}>
              {categoryIcons[cat]}
            </span>
            <h2 className="section-title mb-0">{cat}</h2>
          </div>
          <div className="space-y-3">
            {benefits.filter(b => b.category === cat).map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h3 className="font-semibold text-foreground">{b.name}</h3>
                  <span className="text-primary font-bold text-lg whitespace-nowrap">{b.amount}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{b.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="bg-secondary rounded-full px-3 py-1">⏰ {b.timing}</span>
                  <span className="bg-peach rounded-full px-3 py-1">📋 {b.howToApply}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Action Steps */}
      <div>
        <h2 className="section-title">📋 지금 당장 해야 할 신청 순서</h2>
        <div className="space-y-3">
          {actionSteps.map(s => (
            <div key={s.step} className="flex gap-3 items-start benefit-card">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {s.step}
              </span>
              <p className="text-foreground text-sm">{s.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Links */}
      <div>
        <h2 className="section-title">🔗 정부 공식 사이트</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {officialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="benefit-card flex items-center gap-3 hover:border-primary/50 group"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors py-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>다시 계산하기</span>
      </button>
    </div>
  );
};

export default BenefitResults;
