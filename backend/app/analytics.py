import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import Expense


def _load_dataframe(db: Session, start=None, end=None) -> pd.DataFrame:
    """Trae los gastos de PostgreSQL a un DataFrame, opcionalmente filtrado por fecha."""
    stmt = select(Expense)
    if start:
        stmt = stmt.where(Expense.expense_date >= start)
    if end:
        stmt = stmt.where(Expense.expense_date <= end)

    rows = db.execute(stmt).scalars().all()

    if not rows:
        return pd.DataFrame(
            columns=["expense_date", "category", "merchant", "amount", "payment_method"]
        )

    df = pd.DataFrame(
        [
            {
                "expense_date": r.expense_date,
                "category": r.category,
                "merchant": r.merchant,
                "amount": float(r.amount),
                "payment_method": r.payment_method,
            }
            for r in rows
        ]
    )
    df["expense_date"] = pd.to_datetime(df["expense_date"])
    return df


def get_summary(db: Session, start=None, end=None) -> dict:
    df = _load_dataframe(db, start, end)
    if df.empty:
        return {
            "total_spent": 0.0,
            "average_ticket": 0.0,
            "transaction_count": 0,
            "top_category": None,
            "period_start": None,
            "period_end": None,
        }

    top_category = df.groupby("category")["amount"].sum().idxmax()

    return {
        "total_spent": round(df["amount"].sum(), 2),
        "average_ticket": round(df["amount"].mean(), 2),
        "transaction_count": int(len(df)),
        "top_category": top_category,
        "period_start": df["expense_date"].min().date(),
        "period_end": df["expense_date"].max().date(),
    }


def get_category_breakdown(db: Session, start=None, end=None) -> list[dict]:
    df = _load_dataframe(db, start, end)
    if df.empty:
        return []

    grouped = df.groupby("category")["amount"].agg(["sum", "count"]).reset_index()
    total = grouped["sum"].sum()
    grouped["percentage"] = (grouped["sum"] / total * 100).round(2)
    grouped = grouped.sort_values("sum", ascending=False)

    return [
        {
            "category": row["category"],
            "total": round(row["sum"], 2),
            "percentage": row["percentage"],
            "transaction_count": int(row["count"]),
        }
        for _, row in grouped.iterrows()
    ]


def get_monthly_trend(db: Session, start=None, end=None) -> list[dict]:
    df = _load_dataframe(db, start, end)
    if df.empty:
        return []

    df["month"] = df["expense_date"].dt.to_period("M").astype(str)
    grouped = df.groupby("month")["amount"].agg(["sum", "count"]).reset_index()
    grouped = grouped.sort_values("month")

    return [
        {
            "month": row["month"],
            "total": round(row["sum"], 2),
            "transaction_count": int(row["count"]),
        }
        for _, row in grouped.iterrows()
    ]


def get_top_merchants(db: Session, start=None, end=None, limit: int = 10) -> list[dict]:
    df = _load_dataframe(db, start, end)
    if df.empty:
        return []

    grouped = (
        df.groupby("merchant")["amount"]
        .agg(["sum", "count"])
        .reset_index()
        .sort_values("sum", ascending=False)
        .head(limit)
    )

    return [
        {
            "merchant": row["merchant"],
            "total": round(row["sum"], 2),
            "transaction_count": int(row["count"]),
        }
        for _, row in grouped.iterrows()
    ]