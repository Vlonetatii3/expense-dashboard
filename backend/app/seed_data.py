"""
Genera ~9 meses de gastos personales sintéticos y los inserta en PostgreSQL.
Uso: python -m app.seed_data
"""
import random
from datetime import date, timedelta

from app.database import SessionLocal, engine, Base
from app.models import Expense

CATEGORIES = {
    "Alimentación": (["Supermercado Central", "Verdulería Don José", "Panadería Luz"], (5, 80)),
    "Restaurantes": (["Pizzería Napoli", "Café Martínez", "Sushi Ko"], (8, 60)),
    "Transporte": (["Nafta YPF", "Uber", "Peaje Autopista"], (3, 40)),
    "Servicios": (["Internet Fibra", "Electricidad", "Agua Corriente", "Celular"], (15, 90)),
    "Entretenimiento": (["Cine Hoyts", "Spotify", "Netflix"], (5, 35)),
    "Salud": (["Farmacia San Martín", "Consulta Médica", "Gimnasio"], (10, 70)),
    "Compras": (["Tienda de Ropa", "Librería", "Electrodomésticos"], (10, 150)),
}

PAYMENT_METHODS = ["Tarjeta de crédito", "Tarjeta de débito", "Efectivo", "Transferencia"]


def generate_expenses(n_days: int = 270):
    today = date.today()
    start_day = today - timedelta(days=n_days)
    rows = []

    d = start_day
    while d <= today:
        # entre 0 y 4 gastos por día
        for _ in range(random.randint(0, 4)):
            category = random.choice(list(CATEGORIES.keys()))
            merchants, (low, high) = CATEGORIES[category]
            rows.append(
                Expense(
                    expense_date=d,
                    category=category,
                    merchant=random.choice(merchants),
                    amount=round(random.uniform(low, high), 2),
                    payment_method=random.choice(PAYMENT_METHODS),
                    description=None,
                )
            )
        d += timedelta(days=1)

    return rows


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Expense).count()
        if existing > 0:
            print(f"La tabla ya tiene {existing} registros, no se vuelve a poblar.")
            return

        rows = generate_expenses()
        db.add_all(rows)
        db.commit()
        print(f"Se insertaron {len(rows)} gastos de ejemplo.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()