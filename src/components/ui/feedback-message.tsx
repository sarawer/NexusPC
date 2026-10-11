import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FeedbackTone = 'error' | 'success' | 'info';

interface FeedbackMessageProps {
  children: ReactNode;
  tone?: FeedbackTone;
  title?: string;
  className?: string;
}

const styles: Record<FeedbackTone, { icon: typeof AlertCircle; container: string; iconColor: string }> = {
  error: {
    icon: AlertCircle,
    container: 'border-rose-200 bg-rose-50 text-rose-900',
    iconColor: 'text-rose-600',
  },
  success: {
    icon: CheckCircle2,
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    iconColor: 'text-emerald-600',
  },
  info: {
    icon: Info,
    container: 'border-blue-200 bg-blue-50 text-blue-900',
    iconColor: 'text-blue-600',
  },
};

export function FeedbackMessage({ children, tone = 'error', title, className }: FeedbackMessageProps) {
  const style = styles[tone];
  const Icon = style.icon;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-5', style.container, className)}
    >
      <Icon aria-hidden="true" size={18} className={cn('mt-0.5 shrink-0', style.iconColor)} />
      <div className="min-w-0 break-words [overflow-wrap:anywhere]">
        {title && <p className="font-semibold">{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}
