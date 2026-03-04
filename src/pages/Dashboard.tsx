import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DailyOverview from '@/components/dashboard/DailyOverview';
import DailyLimitAlerts from '@/components/dashboard/DailyLimitAlerts';
import SmartInsight from '@/components/dashboard/SmartInsight';
import SpendingSuggestion from '@/components/dashboard/SpendingSuggestion';
import TodaysExpensesList from '@/components/dashboard/TodaysExpensesList';
import AddTransactionModal from '@/components/dashboard/AddTransactionModal';
import { useFinance } from '@/contexts/FinanceContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/finance';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownLimitWarning, setHasShownLimitWarning] = useState(false);
  const [hasShownLimitExceeded, setHasShownLimitExceeded] = useState(false);
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const { user } = useUser();
  const { toast } = useToast();

  // Get user's limits from context
  const dailyLimit = user?.dailyLimit || 100;
  const routineExpenses = user?.routineExpenses || [];

  // Calculate today's spending
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTransactions = transactions.filter(t => {
    const transDate = new Date(t.date);
    transDate.setHours(0, 0, 0, 0);
    return transDate.getTime() === today.getTime() && t.type === 'expense';
  });

  const spentToday = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Show toast notification when limit is about to hit (80%)
  useEffect(() => {
    const percentUsed = (spentToday / dailyLimit) * 100;
    const remaining = dailyLimit - spentToday;

    if (percentUsed >= 80 && percentUsed < 100 && !hasShownLimitWarning) {
      toast({
        title: '⚠️ Warning: Daily Limit Alert',
        description: `You've used 80% of your daily limit. Only ${remaining.toFixed(0)} remains.`,
        variant: 'destructive',
      });
      setHasShownLimitWarning(true);
    }

    if (spentToday >= dailyLimit && !hasShownLimitExceeded) {
      const overAmount = spentToday - dailyLimit;
      toast({
        title: '🚨 Daily Limit Exceeded',
        description: `You've exceeded your daily limit by ₹${overAmount.toFixed(0)}. Please be cautious!`,
        variant: 'destructive',
      });
      setHasShownLimitExceeded(true);
    }
  }, [spentToday, dailyLimit, hasShownLimitWarning, hasShownLimitExceeded, toast]);
  
  // Calculate routine expenses remaining based on time of day
  const currentHour = new Date().getHours();
  let routineExpensesRemaining = 0;
  
  if (currentHour < 12) {
    routineExpensesRemaining = routineExpenses.reduce((sum, e) => sum + e.amount, 0);
  } else if (currentHour < 18) {
    routineExpensesRemaining = Math.round(routineExpenses.reduce((sum, e) => sum + e.amount, 0) * 0.5);
  }

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    
    // Check if this transaction exceeds the limit
    const newSpentAmount = spentToday + (transaction.type === 'expense' ? transaction.amount : 0);
    const percentUsed = (newSpentAmount / dailyLimit) * 100;

    if (transaction.type === 'expense') {
      // Show appropriate notification based on new total
      if (percentUsed >= 80 && percentUsed < 100) {
        toast({
          title: '⚠️ Nearing Daily Limit',
          description: `Expense added. You're now at ${percentUsed.toFixed(0)}% of your daily limit.`,
          variant: 'destructive',
        });
      } else if (newSpentAmount >= dailyLimit) {
        const overAmount = newSpentAmount - dailyLimit;
        toast({
          title: '🚨 Daily Limit Exceeded!',
          description: `You've exceeded your limit by ₹${overAmount.toFixed(0)}. Be careful!`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Transaction added!',
          description: `Expense of ₹${transaction.amount} recorded.`,
        });
      }
    } else {
      toast({
        title: 'Transaction added!',
        description: `Income of ₹${transaction.amount} recorded.`,
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    toast({
      title: 'Transaction deleted',
      description: 'The transaction has been removed.',
    });
  };

  return (
    <AppLayout onAddExpense={() => setIsModalOpen(true)}>
      <div className="p-4 md:p-6 pb-24 md:pb-6 space-y-4">
        {/* Page header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Daily overview card */}
        <DailyOverview
          dailyLimit={dailyLimit}
          spentToday={spentToday}
          routineExpensesRemaining={routineExpensesRemaining}
        />

        {/* Daily limit alerts */}
        <DailyLimitAlerts
          dailyLimit={dailyLimit}
          spentToday={spentToday}
        />

        {/* Spending suggestion / warning */}
        <SpendingSuggestion
          dailyLimit={dailyLimit}
          spentToday={spentToday}
          routineExpenses={routineExpenses}
        />

        {/* Smart insight of the day */}
        <SmartInsight
          transactions={todayTransactions}
          dailyLimit={dailyLimit}
          spentToday={spentToday}
        />

        {/* Today's expenses list */}
        <TodaysExpensesList 
          transactions={todayTransactions} 
          onDelete={handleDeleteTransaction}
        />
      </div>

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </AppLayout>
  );
};

export default Dashboard;
