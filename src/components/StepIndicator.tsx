import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isDone = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isDone
                    ? 'step-indicator-done'
                    : isActive
                    ? 'step-indicator-active'
                    : 'step-indicator-pending'
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={`text-[10px] mt-1 max-w-[60px] text-center leading-tight ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`w-6 h-0.5 mx-1 mb-4 ${isDone ? 'bg-accent' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
