from db import get_db_connection


def insert_sizes():
    connection = get_db_connection()
    cursor = connection.cursor()

    sizes = [
        # Product 1 - Men's Classic T-Shirt
        (1, "XS", 5),
        (1, "S", 10),
        (1, "M", 15),
        (1, "L", 12),
        (1, "XL", 8),
        (1, "XXL", 3),

        # Product 2 - Men's Slim Fit Jeans
        (2, "XS", 2),
        (2, "S", 8),
        (2, "M", 12),
        (2, "L", 10),
        (2, "XL", 6),
        (2, "XXL", 2),

        # Product 3 - Women's Casual Top
        (3, "XS", 4),
        (3, "S", 9),
        (3, "M", 14),
        (3, "L", 10),
        (3, "XL", 5),
        (3, "XXL", 2),

        # Product 4 - Women's Denim Jacket
        (4, "XS", 3),
        (4, "S", 7),
        (4, "M", 10),
        (4, "L", 8),
        (4, "XL", 5),
        (4, "XXL", 2)
    ]

    sql = """
        INSERT INTO product_sizes (product_id, size, stock)
        VALUES (%s, %s, %s)
    """

    cursor.executemany(sql, sizes)
    connection.commit()

    print("Product sizes and stock inserted successfully!")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    insert_sizes()