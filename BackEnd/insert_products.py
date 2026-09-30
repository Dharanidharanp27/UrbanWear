from db import get_db_connection


def insert_products():
    connection = get_db_connection()
    cursor = connection.cursor()

    products = [
        (
            1,
            "Men's Classic T-Shirt",
            "Comfortable cotton round-neck T-shirt for everyday wear.",
            599.00,
            "UrbanWear",
            "classic-tshirt.jpg"
        ),
        (
            3,
            "Men's Slim Fit Jeans",
            "Modern slim-fit denim jeans with a comfortable stretch.",
            1299.00,
            "DenimCo",
            "slim-fit-jeans.jpg"
        ),
        (
            7,
            "Women's Casual Top",
            "Stylish casual top suitable for everyday use.",
            799.00,
            "StyleHub",
            "casual-top.jpg"
        ),
        (
            9,
            "Women's Denim Jacket",
            "Classic denim jacket with a modern casual look.",
            1599.00,
            "DenimCo",
            "denim-jacket.jpg"
        )
    ]

    sql = """
        INSERT INTO products
        (category_id, name, description, price, brand, image)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.executemany(sql, products)
    connection.commit()

    print("Products inserted successfully!")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    insert_products()