import os
from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL",  
                         "postgresql+psycopg2://expenses_user:expenses_pass@localhost:5432/expenses_db")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal= sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependencia de FastAPI, abre una sesión por request y la cierra al final"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()