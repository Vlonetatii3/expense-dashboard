CREATE TABLE IF NOT EXISTS expenses (
    id              SERIAL PRIMARY KEY,
    expense_date    DATE NOT NULL,
    category        VARCHAR(50) NOT NULL,
    merchant        VARCHAR(120) NOT NULL,
    amount          NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    payment_method  VARCHAR(30) NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);