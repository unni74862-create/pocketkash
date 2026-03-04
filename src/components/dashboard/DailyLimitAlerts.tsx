import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface DailyLimitAlertsProps {
  dailyLimit: number;
  spentToday: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger';
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
}

const DailyLimitAlerts = ({ dailyLimit, spentToday }: DailyLimitAlertsProps) => {
  const alerts: Alert[] = [];
  const percentUsed = (spentToday / dailyLimit) * 100;
  const remaining = dailyLimit - spentToday;

  // Warning: About to hit (80-99%)
  if (percentUsed >= 80 && percentUsed < 100) {
    const warningAmount = spentToday - (dailyLimit * 0.8);
    alerts.push({
      id: 'warning-limit',
      type: 'warning',
      title: '⚠️ Warning: Approaching Daily Limit',
      message: `You've used ₹${warningAmount.toFixed(0)} above 80% of your daily limit. You have only ${formatINR(remaining)} remaining.`,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800',
    });
  }

  // Critical: Limit exceeded (100%+)
  if (spentToday >= dailyLimit) {
    const overAmount = spentToday - dailyLimit;
    alerts.push({
      id: 'critical-limit',
      type: 'danger',
      title: '🚨 Alert: Daily Limit Exceeded',
      message: `You've exceeded your daily limit by ${formatINR(overAmount)}. Please be cautious with your spending.`,
      icon: <TrendingDown className="h-5 w-5 text-destructive" />,
      color: 'bg-destructive/10 border-destructive/20',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border ${alert.color}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{alert.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{alert.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailyLimitAlerts;
