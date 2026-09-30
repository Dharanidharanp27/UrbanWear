from db import get_db_connection


def insert_categories():
    connection = get_db_connection()
    cursor = connection.cursor()

    categories = [
        ("Men", "T-Shirts"),
        ("Men", "Shirts"),
        ("Men", "Jeans"),
        ("Men", "Trousers"),
        ("Men", "Hoodies"),
        ("Women", "Dresses"),
        ("Women", "Tops"),
        ("Women", "Jeans"),
        ("Women", "Jackets"),
        ("Women", "Hoodies")
    ]

    sql = """
        INSERT INTO categories (gender, name)
        VALUES (%s, %s)
    """

    cursor.executemany(sql, categories)
    connection.commit()

    print("Categories inserted successfully!")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    insert_categories()