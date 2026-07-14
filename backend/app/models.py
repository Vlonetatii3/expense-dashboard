from sqlalchemy import Column, Integer, String, Numeric, Date, Text, DateTime, func
from app.database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    expense_date = Column(Date, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    merchant = Column(String(120), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    payment_method = Column(String(30), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())