from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets

app = Flask(__name__)
CORS(app)
GOOGLE_CLIENT_ID = "372584787174-0s5gcujj3ajm22us7aou4o7fq7vce8iq.apps.googleusercontent.com"


@app.route("/")
def home():
    return "E-Commerce Backend is Running!"


@app.route("/db-test")
def db_test():
    connection = get_db_connection()

    if connection.is_connected():
        connection.close()
        return "MySQL Database Connected Successfully!"

    return "Database Connection Failed!"

# =========================
# Get All Products
# =========================

@app.route("/api/products", methods=["GET"])
def get_products():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.image,
            c.gender,
            c.name AS category
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
    """

    cursor.execute(query)
    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(products)


# =========================
# Get Single Product
# =========================

@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    product_query = """
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.image,
            c.gender,
            c.name AS category
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
        WHERE p.id = %s
    """

    cursor.execute(product_query, (product_id,))
    product = cursor.fetchone()

    if product is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Product not found"
        }), 404

    size_query = """
        SELECT
            size,
            stock
        FROM product_sizes
        WHERE product_id = %s
    """

    cursor.execute(size_query, (product_id,))
    sizes = cursor.fetchall()

    product["sizes"] = sizes

    cursor.close()
    connection.close()

    return jsonify(product)


# =========================
# Get Categories
# =========================

@app.route("/api/categories", methods=["GET"])
def get_categories():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            gender,
            name
        FROM categories
        ORDER BY gender, name
    """

    cursor.execute(query)
    categories = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(categories)


# =========================
# Get Products By Category
# =========================

@app.route("/api/categories/<int:category_id>/products", methods=["GET"])
def get_products_by_category(category_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    category_query = """
        SELECT
            id,
            gender,
            name
        FROM categories
        WHERE id = %s
    """

    cursor.execute(category_query, (category_id,))
    category = cursor.fetchone()

    if category is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Category not found"
        }), 404

    product_query = """
        SELECT
            id,
            name,
            description,
            price,
            brand,
            image
        FROM products
        WHERE category_id = %s
    """

    cursor.execute(product_query, (category_id,))
    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "category": category,
        "products": products
    })


# =========================
# Search Products
# =========================

@app.route("/api/search", methods=["GET"])
def search_products():
    search_query = request.args.get("q", "").strip()

    if not search_query:
        return jsonify({
            "message": "Please enter a search term"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.image,
            c.gender,
            c.name AS category
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
        WHERE
            p.name LIKE %s
            OR p.description LIKE %s
            OR p.brand LIKE %s
            OR c.name LIKE %s
    """

    search_pattern = f"%{search_query}%"

    cursor.execute(
        query,
        (
            search_pattern,
            search_pattern,
            search_pattern,
            search_pattern
        )
    )

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "search": search_query,
        "count": len(products),
        "products": products
    })


# =========================
# Filter Products
# =========================

@app.route("/api/products/filter", methods=["GET"])
def filter_products():
    gender = request.args.get("gender")
    category = request.args.get("category")
    min_price = request.args.get("min_price")
    max_price = request.args.get("max_price")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.image,
            c.gender,
            c.name AS category
        FROM products p
        JOIN categories c
            ON p.category_id = c.id
        WHERE 1=1
    """

    values = []

    if gender:
        query += " AND c.gender = %s"
        values.append(gender)

    if category:
        query += " AND c.name = %s"
        values.append(category)

    if min_price:
        query += " AND p.price >= %s"
        values.append(min_price)

    if max_price:
        query += " AND p.price <= %s"
        values.append(max_price)

    query += " ORDER BY p.id"

    cursor.execute(query, tuple(values))
    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "count": len(products),
        "products": products
    })


# =========================
# Register User
# =========================

@app.route("/api/register", methods=["POST"])
def register_user():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not name:
        return jsonify({
            "message": "Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not password:
        return jsonify({
            "message": "Password is required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "message": "Password must be at least 6 characters"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    check_query = """
        SELECT id
        FROM users
        WHERE email = %s
    """

    cursor.execute(check_query, (email,))
    existing_user = cursor.fetchone()

    if existing_user:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Email already registered"
        }), 409

    hashed_password = generate_password_hash(password)

    insert_query = """
        INSERT INTO users
        (name, email, password)
        VALUES (%s, %s, %s)
    """

    cursor.execute(
        insert_query,
        (
            name,
            email,
            hashed_password
        )
    )

    connection.commit()

    user_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Registration successful",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }), 201


# =========================
# Login User
# =========================

@app.route("/api/login", methods=["POST"])
def login_user():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not password:
        return jsonify({
            "message": "Password is required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            id,
            name,
            email,
            password,
            is_admin
        FROM users
        WHERE email = %s
    """

    cursor.execute(query, (email,))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    if not check_password_hash(user["password"], password):
        return jsonify({
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "is_admin": int(user["is_admin"])
        }
    }), 200

# =========================================================
# GOOGLE LOGIN
# =========================================================

@app.route("/api/google-login", methods=["POST"])
def google_login():
    connection = None
    cursor = None

    try:
        data = request.get_json() or {}
        credential = data.get("credential")

        if not credential:
            return jsonify({
                "message": "Google credential is required."
            }), 400

        try:
            google_user = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
        except ValueError:
            return jsonify({
                "message": "Invalid Google login token."
            }), 401

        google_id = google_user.get("sub")
        email = google_user.get("email", "").strip().lower()
        name = google_user.get("name") or email.split("@")[0]
        email_verified = google_user.get("email_verified", False)

        if not google_id or not email:
            return jsonify({
                "message": "Google account information is incomplete."
            }), 400

        if not email_verified:
            return jsonify({
                "message": "Google email is not verified."
            }), 401

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        # Check existing Google account
        cursor.execute(
            """
            SELECT id, name, email, password, is_admin, google_id
            FROM users
            WHERE google_id = %s
            """,
            (google_id,)
        )

        user = cursor.fetchone()

        if user:
            return jsonify({
                "message": "Google login successful",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "is_admin": int(user["is_admin"])
                }
            }), 200

        # Check whether email already exists
        cursor.execute(
            """
            SELECT id, name, email, password, is_admin, google_id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:

            # Admin accounts continue using email/password
            if existing_user["is_admin"]:
                return jsonify({
                    "message": "Admin accounts must use email and password login."
                }), 403

            # Link Google to existing normal account
            cursor.execute(
                """
                UPDATE users
                SET google_id = %s
                WHERE id = %s
                """,
                (google_id, existing_user["id"])
            )

            connection.commit()

            return jsonify({
                "message": "Google login successful",
                "user": {
                    "id": existing_user["id"],
                    "name": existing_user["name"],
                    "email": existing_user["email"],
                    "is_admin": 0
                }
            }), 200

        # Create new normal Google user
        random_password = secrets.token_urlsafe(32)
        password_hash = generate_password_hash(random_password)

        cursor.execute(
            """
            INSERT INTO users
                (name, email, google_id, password, is_admin)
            VALUES
                (%s, %s, %s, %s, 0)
            """,
            (
                name,
                email,
                google_id,
                password_hash
            )
        )

        connection.commit()

        new_user_id = cursor.lastrowid

        return jsonify({
            "message": "Google account created successfully",
            "user": {
                "id": new_user_id,
                "name": name,
                "email": email,
                "is_admin": 0
            }
        }), 201

    except Exception as e:

        if connection:
            connection.rollback()

        print("Google login error:", e)

        return jsonify({
            "message": "Google login failed. Please try again."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()



# ============================================================
# CART APIs
# ============================================================


# =========================
# Get User Cart
# =========================

@app.route("/api/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cart_query = """
        SELECT id
        FROM cart
        WHERE user_id = %s
        LIMIT 1
    """

    cursor.execute(cart_query, (user_id,))
    cart = cursor.fetchone()

    if cart is None:
        cursor.close()
        connection.close()

        return jsonify({
            "cart_id": None,
            "items": [],
            "total": 0
        })

    cart_id = cart["id"]

    items_query = """
        SELECT
            ci.id AS cart_item_id,
            ci.product_id,
            ci.size,
            ci.quantity,
            p.name,
            p.description,
            p.price,
            p.brand,
            p.image
        FROM cart_items ci
        JOIN products p
            ON ci.product_id = p.id
        WHERE ci.cart_id = %s
        ORDER BY ci.id DESC
    """

    cursor.execute(items_query, (cart_id,))
    items = cursor.fetchall()

    total = sum(
        float(item["price"]) * item["quantity"]
        for item in items
    )

    cursor.close()
    connection.close()

    return jsonify({
        "cart_id": cart_id,
        "items": items,
        "total": total
    })


# =========================
# Add Item To Cart
# =========================

@app.route("/api/cart", methods=["POST"])
def add_to_cart():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    user_id = data.get("user_id")
    product_id = data.get("product_id")
    size = data.get("size")
    quantity = data.get("quantity", 1)

    if not user_id:
        return jsonify({
            "message": "User ID is required"
        }), 400

    if not product_id:
        return jsonify({
            "message": "Product ID is required"
        }), 400

    if not size:
        return jsonify({
            "message": "Size is required"
        }), 400

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Quantity must be a number"
        }), 400

    if quantity < 1:
        return jsonify({
            "message": "Quantity must be at least 1"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    product_query = """
        SELECT id, name
        FROM products
        WHERE id = %s
    """

    cursor.execute(product_query, (product_id,))
    product = cursor.fetchone()

    if product is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Product not found"
        }), 404

    size_query = """
        SELECT stock
        FROM product_sizes
        WHERE product_id = %s
        AND size = %s
    """

    cursor.execute(size_query, (product_id, size))
    size_data = cursor.fetchone()

    if size_data is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Selected size is not available"
        }), 400

    if size_data["stock"] < quantity:
        cursor.close()
        connection.close()

        return jsonify({
            "message": f"Only {size_data['stock']} item(s) available for size {size}"
        }), 400

    cart_query = """
        SELECT id
        FROM cart
        WHERE user_id = %s
        LIMIT 1
    """

    cursor.execute(cart_query, (user_id,))
    cart = cursor.fetchone()

    if cart is None:
        create_cart_query = """
            INSERT INTO cart (user_id)
            VALUES (%s)
        """

        cursor.execute(create_cart_query, (user_id,))
        cart_id = cursor.lastrowid
    else:
        cart_id = cart["id"]

    item_query = """
        SELECT
            id,
            quantity
        FROM cart_items
        WHERE cart_id = %s
        AND product_id = %s
        AND size = %s
    """

    cursor.execute(
        item_query,
        (
            cart_id,
            product_id,
            size
        )
    )

    existing_item = cursor.fetchone()

    if existing_item:

        new_quantity = existing_item["quantity"] + quantity

        if new_quantity > size_data["stock"]:
            cursor.close()
            connection.close()

            return jsonify({
                "message": f"Only {size_data['stock']} item(s) available for size {size}"
            }), 400

        update_query = """
            UPDATE cart_items
            SET quantity = %s
            WHERE id = %s
        """

        cursor.execute(
            update_query,
            (
                new_quantity,
                existing_item["id"]
            )
        )

    else:

        insert_item_query = """
            INSERT INTO cart_items
            (cart_id, product_id, size, quantity)
            VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            insert_item_query,
            (
                cart_id,
                product_id,
                size,
                quantity
            )
        )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Product added to cart successfully"
    }), 201


# =========================
# Update Cart Item Quantity
# =========================

@app.route("/api/cart/item/<int:item_id>", methods=["PUT"])
def update_cart_item(item_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    quantity = data.get("quantity")

    try:
        quantity = int(quantity)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Quantity must be a number"
        }), 400

    if quantity < 1:
        return jsonify({
            "message": "Quantity must be at least 1"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            ci.id,
            ci.product_id,
            ci.size,
            ps.stock
        FROM cart_items ci
        JOIN product_sizes ps
            ON ci.product_id = ps.product_id
            AND ci.size = ps.size
        WHERE ci.id = %s
    """

    cursor.execute(query, (item_id,))
    item = cursor.fetchone()

    if item is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Cart item not found"
        }), 404

    if quantity > item["stock"]:
        cursor.close()
        connection.close()

        return jsonify({
            "message": f"Only {item['stock']} item(s) available"
        }), 400

    update_query = """
        UPDATE cart_items
        SET quantity = %s
        WHERE id = %s
    """

    cursor.execute(
        update_query,
        (
            quantity,
            item_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Cart quantity updated successfully"
    })


# =========================
# Remove Cart Item
# =========================

@app.route("/api/cart/item/<int:item_id>", methods=["DELETE"])
def remove_cart_item(item_id):

    connection = get_db_connection()
    cursor = connection.cursor()

    query = """
        DELETE FROM cart_items
        WHERE id = %s
    """

    cursor.execute(query, (item_id,))

    if cursor.rowcount == 0:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Cart item not found"
        }), 404

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Item removed from cart successfully"
    })


# =========================
# Clear User Cart
# =========================

@app.route("/api/cart/<int:user_id>", methods=["DELETE"])
def clear_cart(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cart_query = """
        SELECT id
        FROM cart
        WHERE user_id = %s
        LIMIT 1
    """

    cursor.execute(cart_query, (user_id,))
    cart = cursor.fetchone()

    if cart is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Cart is already empty"
        })

    delete_query = """
        DELETE FROM cart_items
        WHERE cart_id = %s
    """

    cursor.execute(delete_query, (cart["id"],))

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Cart cleared successfully"
    })


# ============================================================
# ORDER APIs
# ============================================================


# =========================
# Place Order
# =========================

@app.route("/api/orders", methods=["POST"])
def place_order():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    user_id = data.get("user_id")
    customer_name = data.get("customer_name", "").strip()
    phone = data.get("phone", "").strip()
    address = data.get("address", "").strip()
    city = data.get("city", "").strip()
    pincode = data.get("pincode", "").strip()

    if not user_id:
        return jsonify({
            "message": "User ID is required"
        }), 400

    if not customer_name:
        return jsonify({
            "message": "Customer name is required"
        }), 400

    if not phone:
        return jsonify({
            "message": "Phone number is required"
        }), 400

    if not address:
        return jsonify({
            "message": "Address is required"
        }), 400

    if not city:
        return jsonify({
            "message": "City is required"
        }), 400

    if not pincode:
        return jsonify({
            "message": "Pincode is required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        # -------------------------
        # Verify user
        # -------------------------

        user_query = """
            SELECT id
            FROM users
            WHERE id = %s
        """

        cursor.execute(user_query, (user_id,))
        user = cursor.fetchone()

        if user is None:
            return jsonify({
                "message": "User not found"
            }), 404

        # -------------------------
        # Find user's cart
        # -------------------------

        cart_query = """
            SELECT id
            FROM cart
            WHERE user_id = %s
            LIMIT 1
        """

        cursor.execute(cart_query, (user_id,))
        cart = cursor.fetchone()

        if cart is None:
            return jsonify({
                "message": "Cart is empty"
            }), 400

        cart_id = cart["id"]

        # -------------------------
        # Get cart items
        # -------------------------

        items_query = """
            SELECT
                ci.id AS cart_item_id,
                ci.product_id,
                ci.size,
                ci.quantity,
                p.name,
                p.price,
                ps.stock
            FROM cart_items ci
            JOIN products p
                ON ci.product_id = p.id
            JOIN product_sizes ps
                ON ci.product_id = ps.product_id
                AND ci.size = ps.size
            WHERE ci.cart_id = %s
            FOR UPDATE
        """

        cursor.execute(items_query, (cart_id,))
        items = cursor.fetchall()

        if not items:
            return jsonify({
                "message": "Cart is empty"
            }), 400

        # -------------------------
        # Check stock and calculate total
        # -------------------------

        total_amount = 0

        for item in items:

            if item["quantity"] > item["stock"]:
                return jsonify({
                    "message": (
                        f"Only {item['stock']} item(s) available "
                        f"for {item['name']} - size {item['size']}"
                    )
                }), 400

            total_amount += float(item["price"]) * item["quantity"]

        # -------------------------
        # Create order
        # -------------------------

        order_query = """
            INSERT INTO orders
            (
                user_id,
                customer_name,
                phone,
                address,
                city,
                pincode,
                total_amount,
                status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending')
        """

        cursor.execute(
            order_query,
            (
                user_id,
                customer_name,
                phone,
                address,
                city,
                pincode,
                total_amount
            )
        )

        order_id = cursor.lastrowid

        # -------------------------
        # Create order items
        # -------------------------

        order_item_query = """
            INSERT INTO order_items
            (
                order_id,
                product_id,
                size,
                quantity,
                price
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        for item in items:

            cursor.execute(
                order_item_query,
                (
                    order_id,
                    item["product_id"],
                    item["size"],
                    item["quantity"],
                    item["price"]
                )
            )

        # -------------------------
        # Reduce stock
        # -------------------------

        stock_update_query = """
            UPDATE product_sizes
            SET stock = stock - %s
            WHERE product_id = %s
            AND size = %s
            AND stock >= %s
        """

        for item in items:

            cursor.execute(
                stock_update_query,
                (
                    item["quantity"],
                    item["product_id"],
                    item["size"],
                    item["quantity"]
                )
            )

            if cursor.rowcount == 0:
                raise Exception(
                    f"Stock changed for {item['name']} - size {item['size']}. "
                    f"Please try again."
                )

        # -------------------------
        # Clear cart
        # -------------------------

        delete_cart_items_query = """
            DELETE FROM cart_items
            WHERE cart_id = %s
        """

        cursor.execute(
            delete_cart_items_query,
            (cart_id,)
        )

        # -------------------------
        # Commit everything
        # -------------------------

        connection.commit()

        return jsonify({
            "message": "Order placed successfully",
            "order_id": order_id,
            "total_amount": round(total_amount, 2),
            "status": "Pending"
        }), 201

    except Exception as error:

        connection.rollback()

        return jsonify({
            "message": "Failed to place order",
            "error": str(error)
        }), 500

    finally:

        cursor.close()
        connection.close()


# =========================
# Get User Orders
# =========================

@app.route("/api/orders/<int:user_id>", methods=["GET"])
def get_user_orders(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    user_query = """
        SELECT id
        FROM users
        WHERE id = %s
    """

    cursor.execute(user_query, (user_id,))
    user = cursor.fetchone()

    if user is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "User not found"
        }), 404

    query = """
        SELECT
            id,
            customer_name,
            phone,
            address,
            city,
            pincode,
            total_amount,
            status,
            created_at
        FROM orders
        WHERE user_id = %s
        ORDER BY created_at DESC
    """

    cursor.execute(query, (user_id,))
    orders = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify({
        "count": len(orders),
        "orders": orders
    })


# =========================
# Get Single Order
# =========================

@app.route("/api/orders/<int:user_id>/<int:order_id>", methods=["GET"])
def get_single_order(user_id, order_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    order_query = """
        SELECT
            id,
            user_id,
            customer_name,
            phone,
            address,
            city,
            pincode,
            total_amount,
            status,
            created_at
        FROM orders
        WHERE id = %s
        AND user_id = %s
    """

    cursor.execute(
        order_query,
        (
            order_id,
            user_id
        )
    )

    order = cursor.fetchone()

    if order is None:
        cursor.close()
        connection.close()

        return jsonify({
            "message": "Order not found"
        }), 404

    items_query = """
        SELECT
            oi.id,
            oi.product_id,
            oi.size,
            oi.quantity,
            oi.price,
            p.name,
            p.image
        FROM order_items oi
        JOIN products p
            ON oi.product_id = p.id
        WHERE oi.order_id = %s
        ORDER BY oi.id
    """

    cursor.execute(items_query, (order_id,))
    items = cursor.fetchall()

    order["items"] = items

    cursor.close()
    connection.close()

    return jsonify(order)



# =========================
# Cancel Customer Order
# =========================

@app.route("/api/orders/<int:user_id>/<int:order_id>/cancel", methods=["PUT"])
def cancel_customer_order(user_id, order_id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        # -------------------------
        # Verify user
        # -------------------------

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if user is None:
            return jsonify({
                "message": "User not found"
            }), 404

        # -------------------------
        # Lock the order
        # -------------------------

        cursor.execute(
            """
            SELECT
                id,
                user_id,
                status
            FROM orders
            WHERE id = %s
            AND user_id = %s
            FOR UPDATE
            """,
            (order_id, user_id)
        )

        order = cursor.fetchone()

        if order is None:
            return jsonify({
                "message": "Order not found"
            }), 404

        current_status = order["status"] or "Pending"

        # Customers can cancel only before shipment.
        if current_status not in ["Pending", "Processing"]:
            return jsonify({
                "message": (
                    f"This order cannot be cancelled because its status is "
                    f"{current_status}."
                )
            }), 400

        # -------------------------
        # Get ordered items
        # -------------------------

        cursor.execute(
            """
            SELECT
                product_id,
                size,
                quantity
            FROM order_items
            WHERE order_id = %s
            """,
            (order_id,)
        )

        items = cursor.fetchall()

        if not items:
            return jsonify({
                "message": "Order items not found"
            }), 400

        # -------------------------
        # Restore stock
        # -------------------------

        for item in items:
            cursor.execute(
                """
                UPDATE product_sizes
                SET stock = stock + %s
                WHERE product_id = %s
                AND size = %s
                """,
                (
                    item["quantity"],
                    item["product_id"],
                    item["size"]
                )
            )

            if cursor.rowcount == 0:
                raise Exception(
                    f"Unable to restore stock for product {item['product_id']} "
                    f"size {item['size']}."
                )

        # -------------------------
        # Mark order as cancelled
        # -------------------------

        cursor.execute(
            """
            UPDATE orders
            SET status = 'Cancelled'
            WHERE id = %s
            AND user_id = %s
            """,
            (order_id, user_id)
        )

        connection.commit()

        return jsonify({
            "message": "Order cancelled successfully",
            "order_id": order_id,
            "status": "Cancelled"
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to cancel order",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# ============================================================
# ADMIN APIs
# ============================================================


# =========================
# Admin Access Helper
# =========================

def verify_admin(user_id, cursor):
    """
    Check whether the supplied user ID belongs to an admin user.
    Returns the admin user record when valid, otherwise None.
    """
    if not user_id:
        return None

    query = """
        SELECT
            id,
            name,
            email,
            is_admin
        FROM users
        WHERE id = %s
        AND is_admin = 1
    """

    cursor.execute(query, (user_id,))
    return cursor.fetchone()


# =========================
# Admin Dashboard Statistics
# =========================

@app.route("/api/admin/stats", methods=["GET"])
def admin_stats():
    admin_id = request.args.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute("SELECT COUNT(*) AS total_products FROM products")
        total_products = cursor.fetchone()["total_products"]

        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) AS total_orders FROM orders")
        total_orders = cursor.fetchone()["total_orders"]

        cursor.execute("""
            SELECT COALESCE(SUM(total_amount), 0) AS total_sales
            FROM orders
        """)
        total_sales = cursor.fetchone()["total_sales"]

        cursor.execute("""
            SELECT COUNT(*) AS pending_orders
            FROM orders
            WHERE status = 'Pending'
        """)
        pending_orders = cursor.fetchone()["pending_orders"]

        return jsonify({
            "total_products": total_products,
            "total_users": total_users,
            "total_orders": total_orders,
            "total_sales": float(total_sales),
            "pending_orders": pending_orders
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load admin statistics",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Get All Products
# =========================

@app.route("/api/admin/products", methods=["GET"])
def admin_get_products():
    admin_id = request.args.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        query = """
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.brand,
                p.image,
                p.category_id,
                c.gender,
                c.name AS category
            FROM products p
            JOIN categories c
                ON p.category_id = c.id
            ORDER BY p.id DESC
        """

        cursor.execute(query)
        products = cursor.fetchall()

        for product in products:
            size_query = """
                SELECT
                    id,
                    size,
                    stock
                FROM product_sizes
                WHERE product_id = %s
                ORDER BY FIELD(size, 'XS', 'S', 'M', 'L', 'XL', 'XXL')
            """

            cursor.execute(size_query, (product["id"],))
            product["sizes"] = cursor.fetchall()

        return jsonify({
            "count": len(products),
            "products": products
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load admin products",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Get All Orders
# =========================

@app.route("/api/admin/orders", methods=["GET"])
def admin_get_orders():
    admin_id = request.args.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        query = """
            SELECT
                o.id,
                o.user_id,
                u.name AS user_name,
                u.email AS user_email,
                o.customer_name,
                o.phone,
                o.address,
                o.city,
                o.pincode,
                o.total_amount,
                o.status,
                o.created_at
            FROM orders o
            JOIN users u
                ON o.user_id = u.id
            ORDER BY o.created_at DESC
        """

        cursor.execute(query)
        orders = cursor.fetchall()

        return jsonify({
            "count": len(orders),
            "orders": orders
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load admin orders",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Update Order Status
# =========================

@app.route("/api/admin/orders/<int:order_id>/status", methods=["PUT"])
def admin_update_order_status(order_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    admin_id = data.get("user_id")
    status = data.get("status", "").strip()

    allowed_statuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ]

    if not admin_id:
        return jsonify({
            "message": "Admin user ID is required"
        }), 400

    if status not in allowed_statuses:
        return jsonify({
            "message": (
                "Invalid status. Allowed values: "
                + ", ".join(allowed_statuses)
            )
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute(
            """
            SELECT id
            FROM orders
            WHERE id = %s
            """,
            (order_id,)
        )

        order = cursor.fetchone()

        if order is None:
            return jsonify({
                "message": "Order not found"
            }), 404

        cursor.execute(
            """
            UPDATE orders
            SET status = %s
            WHERE id = %s
            """,
            (status, order_id)
        )

        connection.commit()

        return jsonify({
            "message": "Order status updated successfully",
            "order_id": order_id,
            "status": status
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to update order status",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Get Customers
# =========================

@app.route("/api/admin/customers", methods=["GET"])
def admin_get_customers():
    admin_id = request.args.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        query = """
            SELECT
                id,
                name,
                email,
                is_admin
            FROM users
            ORDER BY id DESC
        """

        cursor.execute(query)
        customers = cursor.fetchall()

        return jsonify({
            "count": len(customers),
            "customers": customers
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load customers",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Update Product
# =========================

@app.route("/api/admin/products/<int:product_id>", methods=["PUT"])
def admin_update_product(product_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    admin_id = data.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute(
            """
            SELECT id
            FROM products
            WHERE id = %s
            """,
            (product_id,)
        )

        product = cursor.fetchone()

        if product is None:
            return jsonify({
                "message": "Product not found"
            }), 404

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        brand = data.get("brand")
        image = data.get("image")
        category_id = data.get("category_id")

        if name is None or price is None or category_id is None:
            return jsonify({
                "message": "Name, price and category are required"
            }), 400

        try:
            price = float(price)
        except (ValueError, TypeError):
            return jsonify({
                "message": "Price must be a valid number"
            }), 400

        if price < 0:
            return jsonify({
                "message": "Price cannot be negative"
            }), 400

        cursor.execute(
            """
            SELECT id
            FROM categories
            WHERE id = %s
            """,
            (category_id,)
        )

        category = cursor.fetchone()

        if category is None:
            return jsonify({
                "message": "Category not found"
            }), 404

        update_query = """
            UPDATE products
            SET
                name = %s,
                description = %s,
                price = %s,
                brand = %s,
                image = %s,
                category_id = %s
            WHERE id = %s
        """

        cursor.execute(
            update_query,
            (
                name,
                description or "",
                price,
                brand or "",
                image or "",
                category_id,
                product_id
            )
        )

        connection.commit()

        return jsonify({
            "message": "Product updated successfully",
            "product_id": product_id
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to update product",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Update Product Size Stock
# =========================

@app.route("/api/admin/products/<int:product_id>/stock", methods=["PUT"])
def admin_update_stock(product_id):
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    admin_id = data.get("user_id")
    size = data.get("size", "").strip()
    stock = data.get("stock")

    if not admin_id:
        return jsonify({
            "message": "Admin user ID is required"
        }), 400

    if not size:
        return jsonify({
            "message": "Size is required"
        }), 400

    try:
        stock = int(stock)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Stock must be a number"
        }), 400

    if stock < 0:
        return jsonify({
            "message": "Stock cannot be negative"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute(
            """
            SELECT id
            FROM products
            WHERE id = %s
            """,
            (product_id,)
        )

        product = cursor.fetchone()

        if product is None:
            return jsonify({
                "message": "Product not found"
            }), 404

        cursor.execute(
            """
            SELECT id
            FROM product_sizes
            WHERE product_id = %s
            AND size = %s
            """,
            (product_id, size)
        )

        size_row = cursor.fetchone()

        if size_row is None:
            cursor.execute(
                """
                INSERT INTO product_sizes
                (product_id, size, stock)
                VALUES (%s, %s, %s)
                """,
                (product_id, size, stock)
            )
        else:
            cursor.execute(
                """
                UPDATE product_sizes
                SET stock = %s
                WHERE product_id = %s
                AND size = %s
                """,
                (stock, product_id, size)
            )

        connection.commit()

        return jsonify({
            "message": "Stock updated successfully",
            "product_id": product_id,
            "size": size,
            "stock": stock
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to update stock",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Admin Delete Product
# =========================

@app.route("/api/admin/products/<int:product_id>", methods=["DELETE"])
def admin_delete_product(product_id):
    admin_id = request.args.get("user_id")

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute(
            """
            SELECT id
            FROM products
            WHERE id = %s
            """,
            (product_id,)
        )

        product = cursor.fetchone()

        if product is None:
            return jsonify({
                "message": "Product not found"
            }), 404

        # Keep order history intact. Do not allow deletion of a product
        # that already appears in an order.
        cursor.execute(
            """
            SELECT id
            FROM order_items
            WHERE product_id = %s
            LIMIT 1
            """,
            (product_id,)
        )

        ordered_product = cursor.fetchone()

        if ordered_product is not None:
            return jsonify({
                "message": (
                    "This product cannot be deleted because it is already "
                    "part of an order. You can update its stock instead."
                )
            }), 409

        cursor.execute(
            """
            DELETE FROM cart_items
            WHERE product_id = %s
            """,
            (product_id,)
        )

        cursor.execute(
            """
            DELETE FROM product_sizes
            WHERE product_id = %s
            """,
            (product_id,)
        )

        cursor.execute(
            """
            DELETE FROM products
            WHERE id = %s
            """,
            (product_id,)
        )

        connection.commit()

        return jsonify({
            "message": "Product deleted successfully",
            "product_id": product_id
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to delete product",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# ============================================================
# WISHLIST APIs
# ============================================================


# =========================
# Get User Wishlist
# =========================

@app.route("/api/wishlist/<int:user_id>", methods=["GET"])
def get_wishlist(user_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT product_id
            FROM wishlist
            WHERE user_id = %s
            ORDER BY id DESC
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        return jsonify({
            "wishlist": [row["product_id"] for row in rows]
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load wishlist",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Add To Wishlist
# =========================

@app.route("/api/wishlist", methods=["POST"])
def add_to_wishlist():

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    user_id = data.get("user_id")
    product_id = data.get("product_id")

    if not user_id or not product_id:
        return jsonify({
            "message": "User ID and product ID are required"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            INSERT IGNORE INTO wishlist
            (user_id, product_id)
            VALUES (%s, %s)
            """,
            (user_id, product_id)
        )

        connection.commit()

        return jsonify({
            "message": "Added to wishlist"
        }), 201

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to add to wishlist",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()


# =========================
# Remove From Wishlist
# =========================

@app.route("/api/wishlist/<int:user_id>/<int:product_id>", methods=["DELETE"])
def remove_from_wishlist(user_id, product_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            DELETE FROM wishlist
            WHERE user_id = %s
            AND product_id = %s
            """,
            (user_id, product_id)
        )

        connection.commit()

        return jsonify({
            "message": "Removed from wishlist"
        }), 200

    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to remove from wishlist",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# =========================
# Admin Add Product
# =========================

@app.route("/api/admin/products", methods=["POST"])
def admin_add_product():
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request data is required"
        }), 400

    admin_id = data.get("user_id")
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip()
    brand = (data.get("brand") or "").strip()
    image = (data.get("image") or "").strip()
    price = data.get("price")
    category_id = data.get("category_id")

    if not name:
        return jsonify({
            "message": "Product name is required"
        }), 400

    if price is None or category_id is None:
        return jsonify({
            "message": "Price and category are required"
        }), 400

    try:
        price = float(price)
    except (ValueError, TypeError):
        return jsonify({
            "message": "Price must be a valid number"
        }), 400

    if price < 0:
        return jsonify({
            "message": "Price cannot be negative"
        }), 400

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        admin = verify_admin(admin_id, cursor)

        if admin is None:
            return jsonify({
                "message": "Admin access required"
            }), 403

        cursor.execute(
            """
            SELECT id
            FROM categories
            WHERE id = %s
            """,
            (category_id,)
        )

        if cursor.fetchone() is None:
            return jsonify({
                "message": "Category not found"
            }), 404

        cursor.execute(
            """
            INSERT INTO products
            (name, description, price, brand, image, category_id)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                name,
                description,
                price,
                brand,
                image,
                category_id
            )
        )

        new_product_id = cursor.lastrowid

        try:
            initial_stock = max(0, int(data.get("stock", 0)))
        except (ValueError, TypeError):
            initial_stock = 0

        for size in ["XS", "S", "M", "L", "XL", "XXL"]:
            cursor.execute(
                """
                INSERT INTO product_sizes
                (product_id, size, stock)
                VALUES (%s, %s, %s)
                """,
                (new_product_id, size, initial_stock)
            )

        connection.commit()

        return jsonify({
            "message": "Product added successfully",
            "product_id": new_product_id
        }), 201
    except Exception as error:
        connection.rollback()

        return jsonify({
            "message": "Failed to add product",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

# =========================
# Get Related Products
# =========================

@app.route("/api/products/<int:product_id>/related", methods=["GET"])
def get_related_products(product_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute(
            """
            SELECT category_id
            FROM products
            WHERE id = %s
            """,
            (product_id,)
        )

        product = cursor.fetchone()

        if product is None:
            return jsonify({
                "message": "Product not found"
            }), 404

        cursor.execute(
            """
            SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.brand,
                p.image,
                c.gender,
                c.name AS category
            FROM products p
            JOIN categories c
                ON p.category_id = c.id
            WHERE p.category_id = %s
            AND p.id != %s
            ORDER BY p.id DESC
            LIMIT 4
            """,
            (product["category_id"], product_id)
        )

        related = cursor.fetchall()

        return jsonify({
            "products": related
        }), 200

    except Exception as error:
        return jsonify({
            "message": "Failed to load related products",
            "error": str(error)
        }), 500

    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(debug=False)
