from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ExpenseBase(BaseModel):
    expense_date: date
    category: str = Field(..., max_length=50)
    merchant: str = Field(..., max_length=120)
    amount: float = Field(..., ge=0)
    payment_method: str = Field(..., max_length=30)
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class SummaryOut(BaseModel):
    total_spent: float
    average_ticket: float
    transaction_count: int
    top_category: Optional[str]
    period_start: Optional[date]
    period_end: Optional[date]


class CategoryBreakdownItem(BaseModel):
    category: str
    total: float
    percentage: float
    transaction_count: int


class MonthlyTrendItem(BaseModel):
    month: str  # formato "YYYY-MM"
    total: float
    transaction_count: int


class MerchantItem(BaseModel):
    merchant: str
    total: float
    transaction_count: int