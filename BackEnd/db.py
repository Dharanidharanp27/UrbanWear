import os
import mysql.connector


def get_db_connection():
    config = {
        "host": os.environ.get("DB_HOST", "localhost"),
        "port": int(os.environ.get("DB_PORT", 3306)),
        "user": os.environ.get("DB_USER", "root"),
        "password": os.environ.get("DB_PASSWORD", ""),
        "database": os.environ.get("DB_NAME", "ecommerce_db"),
    }

    # Cloud databases (like Aiven) need a secure connection
    if os.environ.get("DB_SSL", "false").lower() == "true":
        config["ssl_disabled"] = False

    return mysql.connector.connect(**config)