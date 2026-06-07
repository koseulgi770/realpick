import { ExternalLink, ArrowLeft, Gift, Stethoscope, Briefcase, Home, MapPin, Share2 } from 'lucide-react';
import type { Benefit } from '@/lib/benefits-data';
import { actionSteps, officialLinks } from '@/lib/benefits-data';

interface BenefitResultsProps {
  benefits: Benefit[];
  totalEstimate: string;
  onReset: () => void;
  region?: string;
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

// 지역별 블로그 글 매핑
const regionalBlogPosts: Record<string, { title: string; url: string; desc: string }> = {
  '부산': {
    title: '부산출산혜택 2026 최신판 1000만원 진짜 줄까?',
    url: 'https://iksgi77.blogspot.com/2026/05/2026-1000.html',
    desc: '부산 중구 천만원 출산장려금 실제 받는 방법',
  },
  '광주': {
    title: '광주임산부혜택 2026 최신판 출산지원금',
    url: 'https://iksgi77.blogspot.com/2026/05/2026_0919592916.html',
    desc: '광주시 출산지원금 50만원 상생카드 받는 방법',
  },
  '인천': {
    title: '인천임산부혜택 2026 최신판 출산지원금 1억?',
    url: 'https://iksgi77.blogspot.com/2026/05/2026-1.html',
    desc: '인천 출산지원금 최대 1억 실제로 받을 수 있을까',
  },
};

// 제휴/공식 신청 링크
const affiliateLinks = [
  {
    name: '국민행복카드 발급 신청방법',
    desc: '임신 바우처 100만원 받는 필수 카드',
    url: 'https://iksgi77.blogspot.com/2026/05/blog-post_26.html',
    emoji: '💳',
    highlight: true,
  },
  {
    name: '복지로 바우처 신청',
    desc: '부모급여·아동수당 온라인 신청',
    url: 'https://www.bokjiro.go.kr',
    emoji: '🏛️',
    highlight: false,
  },
  {
    name: '정부24 행복출산 원스톱',
    desc: '출생신고부터 지원금까지 한번에',
    url: 'https://www.gov.kr/portal/onestopSvc/happyBirth',
    emoji: '🎁',
    highlight: false,
  },
  {
    name: '고용보험 육아휴직 신청',
    desc: '직장인 육아휴직급여 신청',
    url: 'https://www.ei.go.kr',
    emoji: '👶',
    highlight: false,
  },
];

const BenefitResults = ({ benefits, totalEstimate, onReset, region = '' }: BenefitResultsProps) => {
  const categories = [...new Set(benefits.map(b => b.category))];

  // 카카오톡 공유
  const handleKakaoShare = () => {
    const text = `나의 임신·출산 혜택 계산 결과\n\n예상 수령액: ${totalEstimate}\n\n지금 바로 계산해보세요👇\nhttps://therealpick.com`;
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?app_key=&validation_action=default&validation_params={}`;
    // 카카오 미설정 시 일반 공유
    if (navigator.share) {
      navigator.share({ title: '임신·출산 혜택 계산기', text, url: 'https://therealpick.com' });
    } else {
      const encoded = encodeURIComponent('https://therealpick.com');
      window.open(`https://sharer.kakao.com/talk/friends/picker/easylink?app_key=&validation_action=default&url=${encoded}`, '_blank');
    }
  };

  // URL 복사
  const handleCopy = () => {
    navigator.clipboard.writeText('https://therealpick.com');
    alert('링크가 복사됐어요! 친구에게 공유해보세요 😊');
  };

  // 지역별 관련 글
  const matchedPost = Object.entries(regionalBlogPosts).find(([r]) => region.includes(r));

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

      {/* 공유 버튼 */}
      <div className="benefit-card">
        <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          결과 공유하기
        </p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleKakaoShare}
            className="flex-1 min-w-[120px] bg-[#FEE500] text-[#3C1E1E] font-semibold py-3 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>💬</span> 카카오톡 공유
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 min-w-[120px] bg-secondary text-secondary-foreground font-semibold py-3 px-4 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>🔗</span> 링크 복사
          </button>
        </div>
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

      {/* 제휴/신청 링크 */}
      <div>
        <h2 className="section-title">⚡ 지금 바로 신청하기</h2>
        <div className="space-y-3">
          {affiliateLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`benefit-card flex items-center gap-3 hover:border-primary/50 group transition-all ${link.highlight ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              <span className="text-2xl">{link.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{link.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* 지역별 관련 글 */}
      {matchedPost && (
        <div>
          <h2 className="section-title">📖 {matchedPost[0]} 지역 상세 정보</h2>
          <a
            href={matchedPost[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="benefit-card hover:border-primary/50 group block transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{matchedPost[1].title}</p>
                <p className="text-xs text-muted-foreground mt-1">{matchedPost[1].desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </div>
          </a>
        </div>
      )}

      {/* 블로그 더보기 */}
      <div>
        <h2 className="section-title">📚 관련 글 더보기</h2>
        <div className="space-y-3">
          {Object.entries(regionalBlogPosts).map(([region, post]) => (
            <a
              key={region}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="benefit-card flex items-center gap-3 hover:border-primary/50 group transition-all"
            >
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{post.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          ))}
          <a
            href="https://iksgi77.blogspot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="benefit-card flex items-center justify-center gap-2 hover:border-primary/50 group transition-all text-sm font-semibold text-primary"
          >
            블로그에서 글 더보기 →
          </a>
        </div>
      </div>

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
