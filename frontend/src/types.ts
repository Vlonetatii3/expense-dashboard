export interface Expense {
  id: number;
  expense_date: string; // "YYYY-MM-DD"
  category: string;
  merchant: string;
  amount: number;
  payment_method: string;
  description: string | null;
  created_at: string;
}

export interface Summary {
  total_spent: number;
  average_ticket: number;
  transaction_count: number;
  top_category: string | null;
  period_start: string | null;
  period_end: string | null;
}

export interface CategoryBreakdownItem {
  category: string;
  total: number;
  percentage: number;
  transaction_count: number;
}

export interface MonthlyTrendItem {
  month: string; // "YYYY-MM"
  total: number;
  transaction_count: number;
}

export interface MerchantItem {
  merchant: string;
  total: number;
  transaction_count: number;
}

export interface DateRange {
  start: string | null;
  end: string | null;
}