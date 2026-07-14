from datetime import date
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.database import get_db, engine, Base
from app.models import Expense
from app import schemas, analytics

# Crea las tablas si no existen (además del init.sql de Postgres)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Dashboard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- CRUD de gastos ----------

@app.get("/api/expenses", response_model=list[schemas.ExpenseOut])
def list_expenses(
    start: Optional[date] = None,
    end: Optional[date] = None,
    category: Optional[str] = None,
    limit: int = Query(100, le=1000),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    stmt = select(Expense).order_by(desc(Expense.expense_date))
    if start:
        stmt = stmt.where(Expense.expense_date >= start)
    if end:
        stmt = stmt.where(Expense.expense_date <= end)
    if category:
        stmt = stmt.where(Expense.category == category)
    stmt = stmt.offset(offset).limit(limit)

    return db.execute(stmt).scalars().all()


@app.post("/api/expenses", response_model=schemas.ExpenseOut, status_code=201)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.delete("/api/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.get(Expense, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    db.delete(db_expense)
    db.commit()


# ---------- Endpoints de analítica (pandas) ----------

@app.get("/api/analytics/summary", response_model=schemas.SummaryOut)
def analytics_summary(start: Optional[date] = None, end: Optional[date] = None, db: Session = Depends(get_db)):
    return analytics.get_summary(db, start, end)


@app.get("/api/analytics/by-category", response_model=list[schemas.CategoryBreakdownItem])
def analytics_by_category(start: Optional[date] = None, end: Optional[date] = None, db: Session = Depends(get_db)):
    return analytics.get_category_breakdown(db, start, end)


@app.get("/api/analytics/monthly-trend", response_model=list[schemas.MonthlyTrendItem])
def analytics_monthly_trend(start: Optional[date] = None, end: Optional[date] = None, db: Session = Depends(get_db)):
    return analytics.get_monthly_trend(db, start, end)


@app.get("/api/analytics/top-merchants", response_model=list[schemas.MerchantItem])
def analytics_top_merchants(
    start: Optional[date] = None,
    end: Optional[date] = None,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    return analytics.get_top_merchants(db, start, end, limit)