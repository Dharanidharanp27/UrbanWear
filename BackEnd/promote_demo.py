from db import get_db_connection

DEMO_EMAIL = "demo-admin@urbanwear.com"

connection = get_db_connection()   # uses DB_HOST etc. from environment
cursor = connection.cursor()

cursor.execute(
    "UPDATE users SET is_admin = 1 WHERE email = %s",
    (DEMO_EMAIL,),
)
connection.commit()

print("Rows updated:", cursor.rowcount)

cursor.close()
connection.close()