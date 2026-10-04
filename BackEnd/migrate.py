from db import get_db_connection

conn = get_db_connection()
cur = conn.cursor()

# ---- users.created_at (joined date) ----
cur.execute("SHOW COLUMNS FROM users LIKE 'created_at'")
if cur.fetchone() is None:
    cur.execute("ALTER TABLE users ADD COLUMN created_at DATETIME NULL")
    cur.execute("ALTER TABLE users MODIFY created_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP")
    print("Added users.created_at")
else:
    print("users.created_at already exists")

# ---- password reset links ----
cur.execute("""
    CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token_hash VARCHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_token_hash (token_hash)
    )
""")
print("password_resets ready")

# ---- customer profile columns ----
profile_columns = {
    "phone": "VARCHAR(15) NULL",
    "gender": "VARCHAR(20) NULL",
    "dob": "DATE NULL",
    "address": "TEXT NULL",
    "city": "VARCHAR(100) NULL",
    "pincode": "VARCHAR(10) NULL",
}

for name, definition in profile_columns.items():
    cur.execute("SHOW COLUMNS FROM users LIKE %s", (name,))
    if cur.fetchone() is None:
        cur.execute(f"ALTER TABLE users ADD COLUMN {name} {definition}")
        print(f"Added users.{name}")
    else:
        print(f"users.{name} already exists")

conn.commit()
cur.close()
conn.close()