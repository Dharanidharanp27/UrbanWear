import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from '@react-oauth/google'
import "./App.css";

const API_URL = "http://127.0.0.1:5000";

const getWishlistKey = (user) =>
  user && user.id
    ? `urbanwearWishlist_${user.id}`
    : "urbanwearWishlist_guest";

const readWishlist = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch {
    return [];
  }
};

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("urbanwearUser"));
  } catch {
    return null;
  }
};

function App() {
 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);

 const [showWishlist, setShowWishlist] = useState(false);
 const [wishlistProducts, setWishlistProducts] = useState([]);
 const [wishlistLoading, setWishlistLoading] = useState(false);

 const [selectedGender, setSelectedGender] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("");

 const [adminMenuOpen, setAdminMenuOpen] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 // =========================
 // Product Filters
 // =========================

 const [showFilters, setShowFilters] = useState(false);
 const [filterSize, setFilterSize] = useState("");
 const [filterBrand, setFilterBrand] = useState("");
 const [filterMinPrice, setFilterMinPrice] = useState("");
 const [filterMaxPrice, setFilterMaxPrice] = useState("");
 const [sortOption, setSortOption] = useState("");

 const [showCategories, setShowCategories] = useState(false);
 const categoryMenuRef = useRef(null);

 const [selectedProduct, setSelectedProduct] = useState(null);
 const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 const [productLoading, setProductLoading] = useState(false);

 const [searchText, setSearchText] = useState("");
 const [isSearchOpen, setIsSearchOpen] = useState(false);

 const [selectedSize, setSelectedSize] = useState("");

 // =========================
 // Wishlist
 // =========================

const [wishlist, setWishlist] = useState(() =>
  readWishlist(getWishlistKey(getSavedUser()))
);
// =========================
// Cart
// =========================

const [cart, setCart] = useState([]);
const [cartTotal, setCartTotal] = useState(0);
const [showCart, setShowCart] = useState(false);
const [cartLoading, setCartLoading] = useState(false);

// =========================
// Checkout
// =========================

const [showCheckout, setShowCheckout] = useState(false);

const [checkoutName, setCheckoutName] = useState("");
const [checkoutPhone, setCheckoutPhone] = useState("");
const [checkoutAddress, setCheckoutAddress] =useState("");
const [checkoutCity, setCheckoutCity] = useState("");
const [checkoutPincode, setCheckoutPincode] =useState("");

const [checkoutError, setCheckoutError] = useState("");
const [checkoutLoading, setCheckoutLoading] =useState(false);
const [paymentMethod, setPaymentMethod] = useState("COD");
const [showPayment, setShowPayment] = useState(false);
const [paymentProcessing, setPaymentProcessing] = useState(false);
const [paymentError, setPaymentError] = useState("");

const [upiId, setUpiId] = useState("");
const [cardNumber, setCardNumber] = useState("");
const [cardHolderName, setCardHolderName] = useState("");
const [cardExpiry, setCardExpiry] = useState("");
const [cardCvv, setCardCvv] = useState("");

const [orderSuccess, setOrderSuccess] = useState(false);
const [placedOrderId, setPlacedOrderId] = useState(null);
const [placedOrderTotal, setPlacedOrderTotal] =useState(0);

// =========================
// My Orders
// =========================
const [showOrders, setShowOrders] = useState(false);
const [orders, setOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);

const [selectedOrder, setSelectedOrder] = useState(null);
const [orderDetailsLoading, setOrderDetailsLoading] =
 useState(false);
const [cancellingOrderId, setCancellingOrderId] = useState(null);

// =========================
// Registration
// =========================

const [showRegister, setShowRegister] = useState(false);
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] =
  useState("");
const [
  registerConfirmPassword,
  setRegisterConfirmPassword,
] = useState("");
const [registerMessage, setRegisterMessage] =
  useState("");
const [registerError, setRegisterError] = useState("");
const [registerLoading, setRegisterLoading] =
  useState(false);

// =========================
// Login
// =========================

const [showLogin, setShowLogin] = useState(false);
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [loginMessage, setLoginMessage] = useState("");
const [loginError, setLoginError] = useState("");
const [loginLoading, setLoginLoading] = useState(false);

// =========================
// Logged-in user
// =========================

const [loggedInUser, setLoggedInUser] = useState(() => {
 const savedUser =
  localStorage.getItem("urbanwearUser");

 if (savedUser) {
   try {
     return JSON.parse(savedUser);
   } catch (error) {
     localStorage.removeItem("urbanwearUser");
     return null;
   }
 }

 return null;
});

// =========================
// ADMIN
// =========================

const [showAdmin, setShowAdmin] = useState(false);
const [adminSection, setAdminSection] =
 useState("dashboard");

const [adminStats, setAdminStats] = useState(null);
const [adminProducts, setAdminProducts] = useState([]);
const [adminOrders, setAdminOrders] = useState([]);
const [adminCustomers, setAdminCustomers] = useState([]);

const [adminLoading, setAdminLoading] = useState(false);
const [adminError, setAdminError] = useState("");

const [editingProduct, setEditingProduct] = useState(null);
const [editProductLoading, setEditProductLoading] =
 useState(false);

const [editProductName, setEditProductName] = useState("");
const [
  editProductDescription,
  setEditProductDescription,
] = useState("");
const [editProductPrice, setEditProductPrice] =
  useState("");
const [editProductBrand, setEditProductBrand] =
  useState("");
const [editProductImage, setEditProductImage] =
  useState("");
const [editProductCategory, setEditProductCategory] =
  useState("");

const [stockProduct, setStockProduct] = useState(null);
const [stockLoading, setStockLoading] = useState(false);
const [stockValues, setStockValues] = useState({});

const [showAddProduct, setShowAddProduct] = useState(false);
const [addProductLoading, setAddProductLoading] = useState(false);
const [addProductName, setAddProductName] = useState("");
const [addProductDescription, setAddProductDescription] = useState("");
const [addProductPrice, setAddProductPrice] = useState("");
const [addProductBrand, setAddProductBrand] = useState("");
const [addProductImage, setAddProductImage] = useState("");
const [addProductCategory, setAddProductCategory] = useState("");
const [addProductStock, setAddProductStock] = useState("0");
// =========================
// Related Products
// =========================

const [relatedProducts, setRelatedProducts] = useState([]);

useEffect(() => {
  if (!selectedProduct) {
    setRelatedProducts([]);
    return;
  }

  fetch(`${API_URL}/api/products/${selectedProduct.id}/related`)
    .then((response) => response.json())
    .then((data) => {
      setRelatedProducts(data.products || []);
    })
    .catch((error) => {
      console.error("Error loading related products:", error);
      setRelatedProducts([]);
    });
}, [selectedProduct]);

// =========================
// Save Wishlist
// =========================

const wishlistKey = getWishlistKey(loggedInUser);

// Logged in: load from database. Logged out: load guest list.
useEffect(() => {
  if (!loggedInUser) {
    setWishlist(readWishlist(wishlistKey));
    return;
  }

  fetch(`${API_URL}/api/wishlist/${loggedInUser.id}`)
    .then((response) => response.json())
    .then((data) => {
      setWishlist((data.wishlist || []).map(Number));
    })
    .catch((error) => {
      console.error("Error loading wishlist:", error);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [wishlistKey]);

// Only the guest list is saved in localStorage
useEffect(() => {
  if (!loggedInUser) {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [wishlist]);

 useEffect(() => {
 if (wishlist.length === 0) {
   setWishlistProducts([]);
   return;
 }

 setWishlistLoading(true);

 Promise.all(
  wishlist.map((productId) =>
   fetch(`${API_URL}/api/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch product ${productId}`
        );
      }

          return response.json();
         })
         .catch((error) => {
          console.error(
            `Error loading wishlist product ${productId}:`,
            error
          );

          return null;
         })
     )
 )
   .then((results) => {
     setWishlistProducts(
       results.filter((product) => product !== null)
     );
   })
   .finally(() => {
     setWishlistLoading(false);
   });
}, [wishlist]);

 // =========================
 // Wishlist Functions
 // =========================

 const isInWishlist = (productId) => {
   return wishlist.includes(Number(productId));
 };

const toggleWishlist = (productId) => {
  const numericProductId = Number(productId);
  const alreadySaved = wishlist.includes(numericProductId);

  // Update the screen immediately
  setWishlist((currentWishlist) =>
    alreadySaved
      ? currentWishlist.filter((id) => id !== numericProductId)
      : [...currentWishlist, numericProductId]
  );

  // Save to database (only when logged in)
  if (loggedInUser) {
    if (alreadySaved) {
      fetch(
        `${API_URL}/api/wishlist/${loggedInUser.id}/${numericProductId}`,
        { method: "DELETE" }
      ).catch((error) =>
        console.error("Wishlist remove error:", error)
      );
    } else {
      fetch(`${API_URL}/api/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: loggedInUser.id,
          product_id: numericProductId,
        }),
      }).catch((error) =>
        console.error("Wishlist add error:", error)
      );
    }
  }
};

const removeFromWishlist = (productId) => {
  const numericProductId = Number(productId);

  setWishlist((currentWishlist) =>
    currentWishlist.filter((id) => id !== numericProductId)
  );

  if (loggedInUser) {
    fetch(
      `${API_URL}/api/wishlist/${loggedInUser.id}/${numericProductId}`,
      { method: "DELETE" }
    ).catch((error) =>
      console.error("Wishlist remove error:", error)
    );
  }
};

const clearWishlist = () => {
  const idsToRemove = [...wishlist];

  setWishlist([]);

  if (loggedInUser) {
    idsToRemove.forEach((productId) => {
      fetch(
        `${API_URL}/api/wishlist/${loggedInUser.id}/${productId}`,
        { method: "DELETE" }
      ).catch((error) =>
        console.error("Wishlist clear error:", error)
      );
    });
  }
};

 // =========================
 // Open Wishlist
 // =========================

 const openWishlist = () => {
  setShowWishlist(true);
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setShowAdmin(false);
  setSelectedOrder(null);
  setSelectedProduct(null);
  setSelectedSize("");
  setShowRegister(false);
  setShowLogin(false);
  setIsSearchOpen(false);
};

 // =========================
 // Fetch Categories
 // =========================

 useEffect(() => {
  fetch(`${API_URL}/api/categories`)
   .then((response) => response.json())
   .then((data) => {
     setCategories(data);
   })
   .catch((error) => {
     console.error(
       "Error fetching categories:",
       error
     );
   });
}, []);

// =========================
// Categories Dropdown Control
// =========================

useEffect(() => {
 const handleOutsideClick = (event) => {
   if (
     categoryMenuRef.current &&
     !categoryMenuRef.current.contains(event.target)
   ){
     setShowCategories(false);
   }
 };

 const handleEscape = (event) => {
   if (event.key === "Escape") {
     setShowCategories(false);
   }
 };

 document.addEventListener(
   "mousedown",
   handleOutsideClick
 );

 document.addEventListener(
   "keydown",
   handleEscape
 );

 return () => {
  document.removeEventListener(
    "mousedown",
    handleOutsideClick
  );

    document.removeEventListener(
      "keydown",
      handleEscape
    );
  };
}, []);

// =========================
// Fetch Products
// =========================

const fetchProducts = (gender = "") => {
 setLoading(true);
 let url = `${API_URL}/api/products`;

 if (gender) {
   url =
     `${API_URL}/api/products/filter?gender=` +
     encodeURIComponent(gender);
 }

 fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (gender) {
      setProducts(data.products || []);
    } else {
      setProducts(data || []);
    }

       setLoading(false);
     })
     .catch((error) => {
       console.error(
         "Error fetching products:",
         error
       );
       setLoading(false);
     });
};

useEffect(() => {
  fetchProducts();
}, []);

// =========================
// Load Cart
// =========================

const loadCart = async (userId) => {
 if (!userId) {
   setCart([]);
   setCartTotal(0);
   return;
 }

 setCartLoading(true);

 try {
  const response = await fetch(
    `${API_URL}/api/cart/${userId}`
  );

     const data = await response.json();

     if (!response.ok) {
      throw new Error(
        data.message || "Unable to load cart."
      );
  }

  const formattedItems = (data.items || []).map(
    (item) => ({
      cartItemId: item.cart_item_id,
      productId: item.product_id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      brand: item.brand,
      image: item.image,
      size: item.size,
      quantity: item.quantity,
    })
  );

    setCart(formattedItems);
    setCartTotal(Number(data.total || 0));
  } catch (error) {
    console.error(
      "Error loading cart:",
      error
    );
  } finally {
    setCartLoading(false);
  }
};

useEffect(() => {
  if (loggedInUser) {
    loadCart(loggedInUser.id);
  } else {
    setCart([]);
    setCartTotal(0);
  }
}, [loggedInUser]);

// =========================
// Load Orders
// =========================

const loadOrders = async (userId) => {
 if (!userId) {
   setOrders([]);
   return;
 }

 setOrdersLoading(true);

 try {
  const response = await fetch(
    `${API_URL}/api/orders/${userId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to load orders."
    );
  }

    setOrders(data.orders || []);
  } catch (error) {
    console.error(
      "Error loading orders:",
      error
    );
    alert(error.message);
    setOrders([]);
  } finally {
    setOrdersLoading(false);
  }
};

// =========================
// Open My Orders
// =========================

const openOrders = () => {
 if (!loggedInUser) {
   alert(
     "Please login to view your orders."
   );
   openLogin();
   return;
 }

 setShowOrders(true);
 setShowCart(false);
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowRegister(false);
 setShowLogin(false);
 setShowAdmin(false);
 setSelectedProduct(null);
 setSelectedSize("");
 setSelectedOrder(null);
 setIsSearchOpen(false);

  loadOrders(loggedInUser.id);
};
// =========================
// View Order Details
// =========================

const viewOrderDetails = async (orderId) => {
 if (!loggedInUser) {
   return;
 }

 setOrderDetailsLoading(true);
 setSelectedOrder(null);

 try {
  const response = await fetch(
    `${API_URL}/api/orders/${loggedInUser.id}/${orderId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to load order details."
    );
  }

    setSelectedOrder(data.order || data);
  } catch (error) {
    console.error(
      "Error loading order details:",
      error
    );
    alert(error.message);
  } finally {
    setOrderDetailsLoading(false);
  }
};

// =========================
// Back To Orders
// =========================

const backToOrders = () => {
 setSelectedOrder(null);

  if (loggedInUser) {
    loadOrders(loggedInUser.id);
  }
};

// =========================
// Cancel Customer Order
// =========================

const cancelOrder = async (orderId) => {
 if (!loggedInUser || !orderId) {
   return;
 }

 const confirmed = window.confirm(
   `Are you sure you want to cancel Order #${orderId}?`
 );

 if (!confirmed) {
   return;
 }

 setCancellingOrderId(orderId);

 try {
   const response = await fetch(
     `${API_URL}/api/orders/${loggedInUser.id}/${orderId}/cancel`,
     {
       method: "PUT",
     }
   );

   const data = await response.json();

   if (!response.ok) {
     throw new Error(
       data.message || "Unable to cancel the order."
     );
   }

   alert(data.message || "Order cancelled successfully.");

   await loadOrders(loggedInUser.id);

   if (selectedOrder && Number(selectedOrder.id) === Number(orderId)) {
     await viewOrderDetails(orderId);
   }
 } catch (error) {
   console.error("Cancel order error:", error);
   alert(error.message);
 } finally {
   setCancellingOrderId(null);
 }
};

// =========================
// Format Date
// =========================

const formatOrderDate = (dateValue) => {
 if (!dateValue) {
   return "Date unavailable";
 }

 const date = new Date(dateValue);

 if (Number.isNaN(date.getTime())) {
   return dateValue;
 }

  return date.toLocaleString("en-IN", {
   day: "2-digit",
   month: "short",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
  });
};

// =========================
// Store Navigation
// =========================

const showAllProducts = () => {
  setSelectedGender("");
  setSelectedCategory("");
  setSelectedProduct(null);
  setSearchText("");
  setSelectedSize("");
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setSelectedOrder(null);
  setShowRegister(false);
  setShowLogin(false);
  setShowAdmin(false);
  setIsSearchOpen(false);
  setShowWishlist(false);
  setRegisterMessage("");
  setRegisterError("");
  setLoginMessage("");
  setLoginError("");
  fetchProducts();
};

const showMenProducts = () => {
 setSelectedGender("Men");
 setSelectedCategory("");
 setSelectedProduct(null);
  setSearchText("");
  setSelectedSize("");
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setSelectedOrder(null);
  setShowRegister(false);
  setShowLogin(false);
  setShowAdmin(false);
  setIsSearchOpen(false);
  setShowWishlist(false);
  fetchProducts("Men");
};

const showWomenProducts = () => {
  setSelectedGender("Women");
  setSelectedCategory("");
  setSelectedProduct(null);
  setSearchText("");
  setSelectedSize("");
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setSelectedOrder(null);
  setShowRegister(false);
  setShowLogin(false);
  setShowAdmin(false);
  setIsSearchOpen(false);
   setShowWishlist(false);
  fetchProducts("Women");
};

const showCategoryProducts = (category) => {
 setSelectedGender(category.gender);
 setSelectedCategory(category.name);
 setSelectedProduct(null);
 setSearchText("");
 setSelectedSize("");
 setShowCart(false);
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowOrders(false);
 setSelectedOrder(null);
 setShowRegister(false);
 setShowLogin(false);
 setShowAdmin(false);
 setIsSearchOpen(false);
 setLoading(true);
 setShowWishlist(false);

 fetch(
     `${API_URL}/api/categories/${category.id}/products`
 )
     .then((response) => response.json())
     .then((data) => {
       setProducts(data.products || []);
       setLoading(false);
     })
     .catch((error) => {
       console.error(
         "Error fetching category products:",
         error
       );
       setLoading(false);
     });
};

// =========================
// Search
// =========================

const searchProducts = () => {
 const query = searchText.trim();

 if (!query) {
   setSelectedGender("");
   setSelectedCategory("");
   setSelectedSize("");
   setShowCart(false);
   setShowCheckout(false);
   setOrderSuccess(false);
   setShowOrders(false);
   setSelectedOrder(null);
   setShowAdmin(false);
   fetchProducts();
   return;
 }

 setLoading(true);
 setSelectedProduct(null);
 setSelectedGender("");
 setSelectedCategory("");
 setSelectedSize("");
 setShowCart(false);
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowOrders(false);
 setSelectedOrder(null);
 setShowRegister(false);
 setShowLogin(false);
 setShowAdmin(false);

 fetch(
  `${API_URL}/api/search?q=` +
      encodeURIComponent(query)
 )
     .then((response) => response.json())
     .then((data) => {
       setProducts(data.products || []);
       setLoading(false);
     })
     .catch((error) => {
       console.error(
         "Error searching products:",
         error
       );
       setProducts([]);
       setLoading(false);
     });
};

const handleSearchSubmit = (event) => {
  event.preventDefault();
  searchProducts();
};

// =========================
// Product Details
// =========================

const openProductDetails = (productId) => {
 setProductLoading(true);
 setSelectedProduct(null);
 setSelectedSize("");
 setSelectedImageIndex(0);
 setShowCart(false);
 setShowWishlist(false);
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowOrders(false);
 setSelectedOrder(null);
 setShowRegister(false);
 setShowLogin(false);
 setShowAdmin(false);
 setIsSearchOpen(false);

 fetch(`${API_URL}/api/products/${productId}`)
  .then((response) => response.json())
  .then((data) => {
    setSelectedProduct(data);
    setSelectedImageIndex(0);
    setProductLoading(false);
  })
  .catch((error) => {
    console.error(
      "Error fetching product details:",
      error
    );
      setProductLoading(false);
     });
};

const closeProductDetails = () => {
  setSelectedProduct(null);
  setSelectedSize("");
};

// =========================
// Search Toggle
// =========================

const toggleSearch = () => {
  setIsSearchOpen((current) => !current);
};

// =========================
// Registration
// =========================

const openRegister = () => {
  setShowRegister(true);
  setShowLogin(false);
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setShowAdmin(false);
  setSelectedOrder(null);
  setSelectedProduct(null);
  setSelectedSize("");
  setIsSearchOpen(false);
  setRegisterMessage("");
  setRegisterError("");
};

const closeRegister = () => {
  setShowRegister(false);
  setRegisterMessage("");
  setRegisterError("");
};

const goToRegister = () => {
 setShowLogin(false);
 setShowRegister(true);

 setLoginMessage("");
 setLoginError("");

  setRegisterMessage("");
  setRegisterError("");
};
const handleRegister = (event) => {
 event.preventDefault();

 setRegisterMessage("");
 setRegisterError("");

 if (!registerName.trim()) {
   setRegisterError(
     "Please enter your name."
   );
   return;
 }

 if (!registerEmail.trim()) {
   setRegisterError(
     "Please enter your email."
   );
   return;
 }

 if (!registerPassword) {
   setRegisterError(
     "Please enter a password."
   );
   return;
 }

 if (registerPassword.length < 6) {
   setRegisterError(
     "Password must contain at least 6 characters."
   );
   return;
 }

 if (
   registerPassword !==
   registerConfirmPassword
 ){
   setRegisterError(
     "Passwords do not match."
   );
   return;
 }

 setRegisterLoading(true);

 fetch(`${API_URL}/api/register`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: registerName.trim(),
    email: registerEmail.trim(),
    password: registerPassword,
  }),
 })
  .then(async (response) => {
    const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
           "Registration failed."
        );
      }

       return data;
     })
     .then((data) => {
       setRegisterMessage(
         data.message ||
          "Registration successful!"
       );

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");

       setTimeout(() => {
         setShowRegister(false);
         setRegisterMessage("");
         setShowLogin(true);
       }, 1800);
     })
     .catch((error) => {
       console.error(
         "Registration error:",
         error
       );

       setRegisterError(
         error.message ||
          "Unable to register. Please try again."
       );
     })
     .finally(() => {
       setRegisterLoading(false);
     });
};

// =========================
// Login
// =========================
const openLogin = () => {
  setShowLogin(true);
  setShowRegister(false);
  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setShowAdmin(false);
  setSelectedOrder(null);
  setSelectedProduct(null);
  setSelectedSize("");
  setIsSearchOpen(false);
  setLoginMessage("");
  setLoginError("");
};

const closeLogin = () => {
  setShowLogin(false);
  setLoginMessage("");
  setLoginError("");
};

const goToLogin = () => {
 setShowRegister(false);
 setShowLogin(true);

 setRegisterMessage("");
 setRegisterError("");

  setLoginMessage("");
  setLoginError("");
};

const handleLogin = (event) => {
 event.preventDefault();

 setLoginMessage("");
 setLoginError("");

 if (!loginEmail.trim()) {
   setLoginError(
     "Please enter your email."
   );
   return;
 }

 if (!loginPassword) {
   setLoginError(
     "Please enter your password."
   );
   return;
 }
setLoginLoading(true);

fetch(`${API_URL}/api/login`, {
 method: "POST",
 headers: {
   "Content-Type": "application/json",
 },
 body: JSON.stringify({
   email: loginEmail.trim(),
   password: loginPassword,
 }),
})
 .then(async (response) => {
   const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

   return data;
 })
 .then((data) => {
   console.log("LOGIN RESPONSE:", data);
   console.log("LOGIN USER:", data.user);
   console.log("IS ADMIN:", data.user?.is_admin);
   setLoggedInUser(data.user);

  localStorage.setItem(
    "urbanwearUser",
    JSON.stringify(data.user)
  );

  setLoginMessage(
    data.message ||
     "Login successful!"
  );

  setLoginEmail("");
  setLoginPassword("");

  setTimeout(() => {
   setShowLogin(false);
   setLoginMessage("");

     if (
       data.user &&
       data.user.is_admin
     ){
       openAdmin(data.user);
     }
   }, 1200);
 })
 .catch((error) => {
      console.error(
        "Login error:",
        error
      );

       setLoginError(
         error.message ||
          "Unable to login. Please try again."
       );
     })
     .finally(() => {
       setLoginLoading(false);
     });
};

// =========================
// Logout
// =========================

const handleLogout = () => {
 setLoggedInUser(null);
 localStorage.removeItem(
   "urbanwearUser"
 );

 setCart([]);
 setCartTotal(0);

 setOrders([]);
 setSelectedOrder(null);

  setShowLogin(false);
  setShowRegister(false);
  setShowCart(false);
  setShowCheckout(false);
  setShowOrders(false);
  setShowAdmin(false);
  setOrderSuccess(false);
  setSelectedProduct(null);
  setSelectedSize("");
};

// =========================
// Size
// =========================

const handleSizeSelect = (size) => {
  if (size.stock > 0) {
    setSelectedSize(size.size);
  }
};

// =========================
// Add To Cart
// =========================

const addToCart = async () => {
 if (!loggedInUser) {
   alert(
     "Please login before adding products to cart."
   );
   openLogin();
   return;
 }

 if (!selectedProduct || !selectedSize) {
   alert("Please select a size.");
   return;
 }

 const selectedSizeData =
  selectedProduct.sizes.find(
    (size) =>
     size.size === selectedSize
  );

 if (
   !selectedSizeData ||
   selectedSizeData.stock <= 0
 ){
   alert(
     "Selected size is out of stock."
   );
   return;
 }

 try {
  const response = await fetch(
    `${API_URL}/api/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        user_id: loggedInUser.id,
        product_id:
          selectedProduct.id,
        size: selectedSize,
        quantity: 1,
      }),
    }
  );

  const data =
   await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to add product to cart."
    );
  }

  await loadCart(
    loggedInUser.id
  );

    alert(
      selectedProduct.name +
       " (" +
       selectedSize +
       ") added to cart!"
    );
  } catch (error) {
    console.error(
      "Add to cart error:",
      error
    );
    alert(error.message);
  }
};

// =========================
// Open Cart
// =========================

const openCart = () => {
 if (!loggedInUser) {
   alert(
     "Please login to view your cart."
   );
   openLogin();
   return;
 }

 setShowCart(true);
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowOrders(false);
 setShowAdmin(false);
 setSelectedOrder(null);
 setSelectedProduct(null);
 setSelectedSize("");
 setShowRegister(false);
 setShowLogin(false);
 setIsSearchOpen(false);
  loadCart(
    loggedInUser.id
  );
};

// =========================
// Remove Cart Item
// =========================

const removeFromCart = async (
  cartItemId
) => {
  try {
   const response = await fetch(
     `${API_URL}/api/cart/item/${cartItemId}`,
     {
       method: "DELETE",
     }
   );

  const data =
   await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to remove item."
    );
  }

    await loadCart(
      loggedInUser.id
    );
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error
    );
    alert(error.message);
  }
};

// =========================
// Quantity
// =========================

const increaseQuantity = async (
  item
) => {
  try {
    const newQuantity =
     item.quantity + 1;
  const response = await fetch(
    `${API_URL}/api/cart/item/${item.cartItemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        quantity: newQuantity,
      }),
    }
  );

  const data =
   await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to update quantity."
    );
  }

    await loadCart(
      loggedInUser.id
    );
  } catch (error) {
    console.error(
      "Increase quantity error:",
      error
    );
    alert(error.message);
  }
};

const decreaseQuantity = async (
  item
) => {
  if (item.quantity <= 1) {
    return;
  }

 try {
  const newQuantity =
    item.quantity - 1;

  const response = await fetch(
   `${API_URL}/api/cart/item/${item.cartItemId}`,
   {
     method: "PUT",
     headers: {
      "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
    }
  );

  const data =
   await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
       "Unable to update quantity."
    );
  }

    await loadCart(
      loggedInUser.id
    );
  } catch (error) {
    console.error(
      "Decrease quantity error:",
      error
    );
    alert(error.message);
  }
};

// =========================
// Checkout
// =========================

const openCheckout = () => {
 if (!loggedInUser) {
   alert(
     "Please login before checkout."
   );
   openLogin();
   return;
 }

 if (cart.length === 0) {
   alert("Your cart is empty.");
   return;
 }

 setCheckoutError("");
 setOrderSuccess(false);
 setShowCart(false);
 setShowPayment(false);
 setPaymentError("");
 setShowCheckout(true);
 setShowOrders(false);
 setShowAdmin(false);
 setSelectedOrder(null);
 setShowRegister(false);
 setShowLogin(false);
 setSelectedProduct(null);
 setSelectedSize("");
 setIsSearchOpen(false);

  setCheckoutName(
    loggedInUser.name || ""
  );
};

const backToCart = () => {
 setCheckoutError("");
 setShowCheckout(false);
 setOrderSuccess(false);
 setShowCart(true);

  if (loggedInUser) {
    loadCart(
      loggedInUser.id
    );
  }
};


const handlePayment = async () => {
  setPaymentError("");

  // Basic validation for UPI
  if (paymentMethod === "UPI") {
    if (!upiId.trim()) {
      setPaymentError("Please enter your UPI ID.");
      return;
    }
  }

  // Basic validation for Card
  if (paymentMethod === "CARD") {
    if (
      !cardNumber.trim() ||
      !cardHolderName.trim() ||
      !cardExpiry.trim() ||
      !cardCvv.trim()
    ) {
      setPaymentError("Please fill in all card details.");
      return;
    }
  }

  setPaymentProcessing(true);

  // Simulated payment processing
  setTimeout(async () => {
    try {
      /*
       * Simulated payment failure conditions.
       *
       * UPI:
       * fail@upi = payment failure
       *
       * Card:
       * card number ending with 0000 = payment failure
       */

      const normalizedUpiId = upiId.trim().toLowerCase();
      const normalizedCardNumber = cardNumber.replace(/\s/g, "");

      const simulatedPaymentFailure =
        (paymentMethod === "UPI" &&
          normalizedUpiId === "fail@upi") ||
        (paymentMethod === "CARD" &&
          normalizedCardNumber.endsWith("0000"));

      if (simulatedPaymentFailure) {
        setPaymentProcessing(false);
        setPaymentError(
          "Payment failed. Please check your payment details and try again."
        );
        return;
      }

      /*
       * Payment is simulated as successful.
       * Only after successful payment do we create the order.
       */

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: loggedInUser.id,
            customer_name: checkoutName.trim(),
            phone: checkoutPhone.trim(),
            address: checkoutAddress.trim(),
            city: checkoutCity.trim(),
            pincode: checkoutPincode.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to place order after payment."
        );
      }

      // Order created successfully
      setPlacedOrderId(data.order_id);

      setPlacedOrderTotal(
        Number(
          data.total_amount ||
            cartTotal
        )
      );

      setCart([]);
      setCartTotal(0);

      setPaymentProcessing(false);
      setPaymentError("");

      setShowPayment(false);
      setShowCheckout(false);
      setOrderSuccess(true);

      // Clear checkout fields
      setCheckoutName("");
      setCheckoutPhone("");
      setCheckoutAddress("");
      setCheckoutCity("");
      setCheckoutPincode("");

      // Clear payment fields
      setUpiId("");
      setCardNumber("");
      setCardHolderName("");
      setCardExpiry("");
      setCardCvv("");

    } catch (error) {
      console.error(
        "Payment/order error:",
        error
      );

      setPaymentProcessing(false);

      setPaymentError(
        error.message ||
          "Payment succeeded, but the order could not be created. Please try again."
      );
    }
  }, 2000);
};
// =========================
// Place Order
// =========================
const handleCheckoutSubmit = (event) => {
  event.preventDefault();
  handlePlaceOrder(event);
};

const handlePlaceOrder = async (
  event
) => {
  event.preventDefault();

 setCheckoutError("");

 if (!checkoutName.trim()) {
   setCheckoutError(
     "Please enter your full name."
   );
   return;
 }

 if (!checkoutPhone.trim()) {
   setCheckoutError(
     "Please enter your phone number."
   );
   return;
 }

 if (
   !/^[0-9]{10}$/.test(
    checkoutPhone.trim()
  )
){
  setCheckoutError(
    "Please enter a valid 10-digit phone number."
  );
  return;
}

if (!checkoutAddress.trim()) {
  setCheckoutError(
    "Please enter your address."
  );
  return;
}

if (!checkoutCity.trim()) {
  setCheckoutError(
    "Please enter your city."
  );
  return;
}

if (!checkoutPincode.trim()) {
  setCheckoutError(
    "Please enter your pincode."
  );
  return;
}

if (
  !/^[0-9]{6}$/.test(
    checkoutPincode.trim()
  )
){
  setCheckoutError(
    "Please enter a valid 6-digit pincode."
  );
  return;
}

if (cart.length === 0) {
  setCheckoutError(
    "Your cart is empty."
  );
  return;
}

// For UPI/Card, open the payment screen
// instead of creating the order immediately.
if (paymentMethod !== "COD") {
  setPaymentError("");
  setShowPayment(true);
  return;
}

setCheckoutLoading(true);

try {
 const response = await fetch(
   `${API_URL}/api/orders`,
 {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        user_id:
          loggedInUser.id,
        customer_name:
          checkoutName.trim(),
        phone:
          checkoutPhone.trim(),
        address:
          checkoutAddress.trim(),
        city:
          checkoutCity.trim(),
        pincode:
          checkoutPincode.trim(),
      }),
  }
);

const data =
 await response.json();

if (!response.ok) {
  throw new Error(
    data.message ||
     "Unable to place order."
  );
}

setPlacedOrderId(
  data.order_id
);

setPlacedOrderTotal(
  Number(
    data.total_amount ||
     cartTotal
  )
);

setCart([]);
setCartTotal(0);

setCheckoutError("");
setShowCheckout(false);
setOrderSuccess(true);

setCheckoutName("");
setCheckoutPhone("");
   setCheckoutAddress("");
   setCheckoutCity("");
   setCheckoutPincode("");
 } catch (error) {
   console.error(
     "Place order error:",
     error
   );

    setCheckoutError(
      error.message ||
       "Unable to place order. Please try again."
    );
  } finally {
    setCheckoutLoading(false);
  }
};

// =========================
// Order Success
// =========================

const continueAfterOrder = () => {
 setOrderSuccess(false);
 setShowCheckout(false);
 setShowCart(false);
 setShowOrders(false);
 setSelectedOrder(null);
 setPlacedOrderId(null);
 setPlacedOrderTotal(0);
 setShowWishlist(false);

  showAllProducts();
};

const viewOrdersAfterSuccess = () => {
 setOrderSuccess(false);
 setShowCheckout(false);
 setShowCart(false);
 setShowOrders(true);
 setShowAdmin(false);
 setSelectedOrder(null);

  if (loggedInUser) {
    loadOrders(
      loggedInUser.id
    );
  }
};

// =====================================================
// ADMIN FUNCTIONS
// =====================================================
const isAdmin = Boolean(
  loggedInUser &&
   Number(loggedInUser.is_admin) ===
    1
);

// =========================
// Open Admin
// =========================

const openAdmin = (userOverride = null) => {
  const currentUser =
    userOverride || loggedInUser;

  if (!currentUser) {
    alert("Please login first.");
    openLogin();
    return;
  }

  if (!currentUser.is_admin) {
    alert(
      "Admin access required."
    );
    return;
  }

  setShowAdmin(true);
  setAdminSection(
    "dashboard"
  );

  setShowCart(false);
  setShowCheckout(false);
  setOrderSuccess(false);
  setShowOrders(false);
  setSelectedOrder(null);
  setSelectedProduct(null);
  setSelectedSize("");
  setShowRegister(false);
  setShowLogin(false);
  setIsSearchOpen(false);

  loadAdminStats();
};

// =========================
// Admin Request Helper
// =========================

const adminRequest = async (
  url,
  options = {}
) => {
  const response = await fetch(
   url,
   options
 );

 const data =
  await response.json();

 if (!response.ok) {
   throw new Error(
     data.message ||
      "Admin request failed."
   );
 }

  return data;
};

// =========================
// Admin Stats
// =========================

const loadAdminStats = async () => {
 if (!isAdmin) {
   return;
 }

 setAdminLoading(true);
 setAdminError("");

 try {
  const data =
    await adminRequest(
      `${API_URL}/api/admin/stats?user_id=${loggedInUser.id}`
    );

    setAdminStats(data);
  } catch (error) {
    console.error(
      "Admin stats error:",
      error
    );
    setAdminError(
      error.message
    );
  } finally {
    setAdminLoading(false);
  }
};

// =========================
// Admin Products
// =========================
const loadAdminProducts =
 async () => {
  if (!isAdmin) {
    return;
  }

  setAdminLoading(true);
  setAdminError("");

  try {
   const data =
    await adminRequest(
      `${API_URL}/api/admin/products?user_id=${loggedInUser.id}`
    );

     setAdminProducts(
       data.products ||
        data ||
        []
     );
   } catch (error) {
     console.error(
       "Admin products error:",
       error
     );
     setAdminError(
       error.message
     );
   } finally {
     setAdminLoading(false);
   }
 };

// =========================
// Admin Orders
// =========================

const loadAdminOrders =
 async () => {
  if (!isAdmin) {
    return;
  }

  setAdminLoading(true);
  setAdminError("");

  try {
   const data =
    await adminRequest(
      `${API_URL}/api/admin/orders?user_id=${loggedInUser.id}`
    );

   setAdminOrders(
       data.orders ||
        data ||
        []
     );
   } catch (error) {
     console.error(
       "Admin orders error:",
       error
     );
     setAdminError(
       error.message
     );
   } finally {
     setAdminLoading(false);
   }
 };

// =========================
// Admin Customers
// =========================

const loadAdminCustomers =
 async () => {
  if (!isAdmin) {
    return;
  }

  setAdminLoading(true);
  setAdminError("");

  try {
   const data =
    await adminRequest(
      `${API_URL}/api/admin/customers?user_id=${loggedInUser.id}`
    );

     setAdminCustomers(
       data.customers ||
        data ||
        []
     );
   } catch (error) {
     console.error(
       "Admin customers error:",
       error
     );
     setAdminError(
       error.message
     );
   } finally {
     setAdminLoading(false);
   }
 };
// =========================
// Change Admin Section
// =========================

const changeAdminSection = (
  section
) => {
  setAdminSection(section);
  setAdminError("");

  if (section === "dashboard") {
    loadAdminStats();
  } else if (
    section === "products"
  ){
    loadAdminProducts();
  } else if (
    section === "orders"
  ){
    loadAdminOrders();
  } else if (
    section === "customers"
  ){
    loadAdminCustomers();
  }
};

// =========================
// Edit Product
// =========================

const openEditProduct = (
  product
) => {
  setEditingProduct(product);

 setEditProductName(
   product.name || ""
 );

 setEditProductDescription(
   product.description || ""
 );

 setEditProductPrice(
   product.price ?? ""
 );

 setEditProductBrand(
   product.brand || ""
 );
 setEditProductImage(
   product.image || ""
 );

  setEditProductCategory(
    product.category_id ||
     product.categoryId ||
     ""
  );
};

const closeEditProduct = () => {
  setEditingProduct(null);
  setEditProductName("");
  setEditProductDescription("");
  setEditProductPrice("");
  setEditProductBrand("");
  setEditProductImage("");
  setEditProductCategory("");
};
const openAddProduct = () => {
  setShowAddProduct(true);
};

const closeAddProduct = () => {
  setShowAddProduct(false);
  setAddProductName("");
  setAddProductDescription("");
  setAddProductPrice("");
  setAddProductBrand("");
  setAddProductImage("");
  setAddProductCategory("");
  setAddProductStock("0");
};

const saveNewProduct = async (event) => {
  event.preventDefault();

  if (!addProductName.trim()) {
    alert("Product name is required.");
    return;
  }

  if (addProductPrice === "" || Number(addProductPrice) < 0) {
    alert("Please enter a valid price.");
    return;
  }

  if (!addProductCategory) {
    alert("Please select a category.");
    return;
  }

  setAddProductLoading(true);

  try {
    await adminRequest(`${API_URL}/api/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: loggedInUser.id,
        name: addProductName.trim(),
        description: addProductDescription.trim(),
        price: Number(addProductPrice),
        brand: addProductBrand.trim(),
        image: addProductImage.trim(),
        category_id: Number(addProductCategory),
        stock: Number(addProductStock) || 0,
      }),
    });

    alert("Product added successfully.");

    closeAddProduct();
    await loadAdminProducts();
    fetchProducts();
  } catch (error) {
    console.error("Add product error:", error);
    alert(error.message);
  } finally {
    setAddProductLoading(false);
  }
};

const saveProductChanges =
 async (event) => {
  event.preventDefault();

  if (!editingProduct) {
    return;
  }

  if (!editProductName.trim()) {
    alert(
      "Product name is required."
    );
    return;
  }

  if (
    editProductPrice === "" ||
    Number(editProductPrice) < 0
  ){
    alert(
      "Please enter a valid price."
    );
    return;
  }

  if (!editProductCategory) {
    alert(
      "Please select a category."
    );
    return;
  }
 setEditProductLoading(true);

 try {
  await adminRequest(
    `${API_URL}/api/admin/products/${editingProduct.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        user_id:
          loggedInUser.id,
        name:
          editProductName.trim(),
        description:
          editProductDescription.trim(),
        price: Number(
          editProductPrice
        ),
        brand:
          editProductBrand.trim(),
        image:
          editProductImage.trim(),
        category_id:
          Number(
            editProductCategory
          ),
      }),
    }
  );

  alert(
    "Product updated successfully."
  );

    closeEditProduct();
    await loadAdminProducts();
    fetchProducts();
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );
    alert(error.message);
  } finally {
    setEditProductLoading(false);
  }
};

// =========================
// Delete Product
// =========================

const deleteAdminProduct =
 async (productId) => {
  const confirmed =
   window.confirm(
     "Are you sure you want to delete this product?"
   );

  if (!confirmed) {
    return;
  }

  try {
   await adminRequest(
     `${API_URL}/api/admin/products/${productId}?user_id=${loggedInUser.id}`,
     {
       method: "DELETE",
     }
   );

   alert(
     "Product deleted successfully."
   );

   await loadAdminProducts();
   fetchProducts();

     removeFromWishlist(
       productId
     );
   } catch (error) {
     console.error(
       "Delete product error:",
       error
     );
     alert(error.message);
   }
 };

// =========================
// Open Stock Manager
// =========================

const openStockManager = (
  product
) => {
  setStockProduct(product);

 const initialStock = {};

 if (
   product.sizes &&
   Array.isArray(product.sizes)
 ){
   product.sizes.forEach(
     (size) => {
       initialStock[size.size] =
        size.stock;
     }
   );
 }

  setStockValues(initialStock);
};

const closeStockManager = () => {
  setStockProduct(null);
  setStockValues({});
};

// =========================
// Update Stock
// =========================

const updateProductStock =
 async (size) => {
  if (!stockProduct) {
    return;
  }

  const stock = Number(
    stockValues[size]
  );

  if (
    !Number.isInteger(stock) ||
    stock < 0
  ){
    alert(
      "Stock must be a whole number 0 or greater."
    );
    return;
  }

  setStockLoading(true);

  try {
   await adminRequest(
    `${API_URL}/api/admin/products/${stockProduct.id}/stock`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
         "application/json",
      },
         body: JSON.stringify({
          user_id:
             loggedInUser.id,
          size: size,
          stock: stock,
         }),
     }
   );

   alert(
     `${stockProduct.name} - ${size} stock updated.`
   );

   await loadAdminProducts();

   const refreshedProduct =
    adminProducts.find(
      (product) =>
       Number(product.id) ===
       Number(
         stockProduct.id
       )
    );

     if (refreshedProduct) {
       openStockManager(
         refreshedProduct
       );
     }
   } catch (error) {
     console.error(
       "Update stock error:",
       error
     );
     alert(error.message);
   } finally {
     setStockLoading(false);
   }
 };

// =========================
// Update Order Status
// =========================

const updateAdminOrderStatus =
 async (
   orderId,
   status
 ) => {
   try {
    await adminRequest(
     `${API_URL}/api/admin/orders/${orderId}/status`,
     {
         method: "PUT",
         headers: {
           "Content-Type":
             "application/json",
         },
         body: JSON.stringify({
           user_id:
             loggedInUser.id,
           status: status,
         }),
     }
   );

   alert(
     `Order #${orderId} status updated to ${status}.`
   );

     await loadAdminOrders();
   } catch (error) {
     console.error(
       "Update order status error:",
       error
     );
     alert(error.message);
   }
 };

// =========================
// Cart Count
// =========================

const cartItemCount =
 cart.reduce(
   (total, item) =>
    total + item.quantity,
   0
 );

// =========================
// Wishlist Count
// =========================

const wishlistCount =
 wishlist.length;

// =========================
// Categories
// =========================

const filteredCategories =
 categories.filter(
  (category) =>
   category.gender ===
      selectedGender
 );

// =========================
// Product Filter Logic
// =========================

const availableBrands = [
  ...new Set(
    products
     .map(
       (product) =>
         product.brand
     )
     .filter(
       (brand) => brand
     )
  ),
].sort();

const filteredProducts =
 products.filter(
  (product) => {
   const price = Number(
     product.price || 0
   );

      if (filterSize) {
        const hasSize =
         Array.isArray(
           product.sizes
         )
           ? product.sizes.some(
               (size) =>
                size.size ===
                  filterSize &&
                Number(
                  size.stock
                )>0
             )
           : true;

          if (!hasSize) {
            return false;
          }
      }

      if (
        filterBrand &&
        product.brand !==
          filterBrand
      ){
        return false;
       }

       if (
         filterMinPrice !==
           "" &&
         price <
           Number(
             filterMinPrice
           )
       ){
         return false;
       }

       if (
         filterMaxPrice !==
           "" &&
         price >
           Number(
             filterMaxPrice
           )
       ){
         return false;
       }

       return true;
   }
 );

const clearFilters = () => {
  setFilterSize("");
  setFilterBrand("");
  setFilterMinPrice("");
  setFilterMaxPrice("");
};
const sortedProducts = [...filteredProducts].sort((a, b) => {
  if (sortOption === "price-low") {
    return Number(a.price) - Number(b.price);
  }

  if (sortOption === "price-high") {
    return Number(b.price) - Number(a.price);
  }

  if (sortOption === "name-az") {
    return a.name.localeCompare(b.name);
  }

  if (sortOption === "newest") {
    return b.id - a.id;
  }

  return 0;
});

// =====================================================
// ADMIN DASHBOARD UI
// =====================================================

const renderAdminDashboard =
 () => {
   if (
     adminLoading &&
     adminSection ===
       "dashboard"
   ){
     return (
       <div className="admin-loading">
        Loading dashboard...
       </div>
     );
   }
if (!adminStats) {
  return (
   <div className="admin-empty">
     <h3>
      No dashboard data available.
     </h3>

       <button
        className="admin-primary-button"
        onClick={
          loadAdminStats
        }
       >
        Refresh
       </button>
      </div>
    );
}

return (
 <div>
  <div className="admin-page-heading">
   <div>
    <h1>Dashboard</h1>
    <p>
     Welcome to the UrbanWear
     administration panel.
    </p>
   </div>
  </div>

    <div className="admin-stat-grid">
     <div className="admin-stat-card">
      <span>
       Total Customers
      </span>

       <strong>
        {adminStats.total_customers ??
         adminStats.customers ??
         0}
       </strong>
      </div>

      <div className="admin-stat-card">
       <span>
        Total Products
       </span>

       <strong>
        {adminStats.total_products ??
         adminStats.products ??
         0}
  </strong>
 </div>

 <div className="admin-stat-card">
  <span>
   Total Orders
  </span>

  <strong>
   {adminStats.total_orders ??
    adminStats.orders ??
    0}
  </strong>
 </div>

 <div className="admin-stat-card">
  <span>
   Total Revenue
  </span>

  <strong>
   ₹
   {Number(
     adminStats.total_revenue ??
      adminStats.revenue ??
      0
   ).toFixed(2)}
  </strong>
 </div>
</div>

<div className="admin-dashboard-info">
 <h2>
  Quick Management
 </h2>

 <div className="admin-quick-grid">
  <button
   onClick={() =>
     changeAdminSection(
       "products"
     )
   }
  >
   <strong>
     Manage Products
   </strong>

   <span>
    Edit products and manage
    size stock.
   </span>
  </button>
      <button
       onClick={() =>
         changeAdminSection(
           "orders"
         )
       }
      >
       <strong>
         Manage Orders
       </strong>

       <span>
        View orders and update
        delivery status.
       </span>
      </button>

      <button
       onClick={() =>
         changeAdminSection(
           "customers"
         )
       }
      >
       <strong>
         View Customers
       </strong>

         <span>
          See registered UrbanWear
          customers.
         </span>
        </button>
       </div>
      </div>
     </div>
   );
 };

// =====================================================
// ADMIN PRODUCTS UI
// =====================================================

const renderAdminProducts =
 () => {
   return (
    <div>
     <div className="admin-page-heading">
      <div>
        <h1>Products</h1>

      <p>
   Manage UrbanWear products
   and inventory.
  </p>
 </div>

  <div style={{ display: "flex", gap: "10px" }}>
  <button
   className="admin-primary-button"
   onClick={openAddProduct}
  >
   + Add Product
  </button>

  <button
   className="admin-secondary-button"
   onClick={loadAdminProducts}
  >
   Refresh
  </button>
 </div>
</div>

{adminLoading ? (
  <div className="admin-loading">
    Loading products...
  </div>
) : adminProducts.length ===
  0?(
  <div className="admin-empty">
    <h3>
     No products found.
    </h3>
  </div>
):(
  <div className="admin-product-table-wrapper">
    <table className="admin-table">
     <thead>
      <tr>
       <th>Product</th>
       <th>
        Category
       </th>
       <th>Gender</th>
       <th>Price</th>
       <th>Stock</th>
       <th>Actions</th>
      </tr>
     </thead>

   <tbody>
    {adminProducts.map(
     (product) => (
      <tr
       key={
         product.id
       }
      >
       <td>
         <div className="admin-product-cell">
          <img
   src={
     product.image
      ? "/images/" +
        product.image
      : "/images/placeholder.jpg"
   }
   alt={
     product.name
   }
  />

  <div>
   <strong>
    {
      product.name
    }
   </strong>

   <span>
    {
      product.brand
    }
   </span>
  </div>
 </div>
</td>

<td>
 {product.category ||
  "-"}
</td>

<td>
 {product.gender ||
  "-"}
</td>

<td>
 ₹
 {Number(
   product.price ||
    0
 ).toFixed(
   2
 )}
</td>

<td>
 <div className="admin-stock-summary">
  {product.sizes &&
  product
   .sizes
   .length >
   0?(
   product.sizes.map(
     (
       size
     ) => (
       <span
        key={
          size.size
        }
        className={
          size.stock >
          0
           ? "stock-available"
           : "stock-empty"
        }
       >
        {
          size.size
        }
        :{" "}
        {
          size.stock
        }
       </span>
     )
   )
  ):(
   <span>
     No stock
     data
   </span>
  )}
 </div>
</td>

<td>
 <div className="admin-action-buttons">
  <button
   className="admin-edit-button"
   onClick={() =>
     openEditProduct(
       product
     )
   }
  >
   Edit
  </button>

  <button
   className="admin-stock-button"
   onClick={() =>
    openStockManager(
      product
                  )
                }
               >
                Stock
               </button>

              <button
               className="admin-delete-button"
               onClick={() =>
                 deleteAdminProduct(
                   product.id
                 )
               }
              >
               Delete
              </button>
             </div>
            </td>
           </tr>
            )
           )}
          </tbody>
         </table>
       </div>
      )}
     </div>
   );
 };

// =====================================================
// ADMIN ORDERS UI
// =====================================================

const renderAdminOrders =
 () => {
   return (
    <div>
     <div className="admin-page-heading">
      <div>
        <h1>Orders</h1>

      <p>
       Manage customer orders and
       delivery status.
      </p>
     </div>

     <button
      className="admin-secondary-button"
      onClick={
        loadAdminOrders
      }
     >
  Refresh
 </button>
</div>

{adminLoading ? (
  <div className="admin-loading">
    Loading orders...
  </div>
) : adminOrders.length ===
  0?(
  <div className="admin-empty">
    <h3>
     No orders found.
    </h3>
  </div>
):(
  <div className="admin-order-list">
    {adminOrders.map(
     (order) => (
      <div
       className="admin-order-card"
       key={
         order.id
       }
      >
       <div className="admin-order-header">
         <div>
          <span>
           Order ID
          </span>

       <h2>
        #{order.id}
       </h2>
      </div>

      <span
       className={
         "admin-order-status " +
         String(
           order.status ||
            "Pending"
         ).toLowerCase()
       }
      >
       {order.status ||
         "Pending"}
      </span>
     </div>

     <div className="admin-order-grid">
      <div>
       <span>
  Customer
 </span>

 <strong>
  {order.customer_name ||
   order.name ||
   "-"}
 </strong>
</div>

<div>
 <span>
  Phone
 </span>

 <strong>
  {order.phone ||
   "-"}
 </strong>
</div>

<div>
 <span>
  City
 </span>

 <strong>
  {order.city ||
   "-"}
 </strong>
</div>

<div>
 <span>
  Date
 </span>

 <strong>
  {formatOrderDate(
   order.created_at
  )}
 </strong>
</div>

<div>
 <span>
  Total
 </span>

 <strong>
  ₹
  {Number(
   order.total_amount ||
      0
   ).toFixed(
     2
   )}
  </strong>
 </div>

 <div>
  <span>
   Order Status
  </span>

  <select
   value={
     order.status ||
     "Pending"
   }
   onChange={(
     event
   ) =>
     updateAdminOrderStatus(
       order.id,
       event
        .target
        .value
     )
   }
  >
   <option value="Pending">
     Pending
   </option>

   <option value="Processing">
    Processing
   </option>

   <option value="Shipped">
    Shipped
   </option>

   <option value="Delivered">
    Delivered
   </option>

   <option value="Cancelled">
    Cancelled
   </option>
  </select>
 </div>
</div>

<div className="admin-order-address">
 <span>
             Delivery Address
            </span>

           <p>
            {order.address ||
             "-"},{" "}
            {order.city ||
             ""}{" "}
            {order.pincode ||
             ""}
           </p>
          </div>
         </div>
          )
         )}
       </div>
      )}
     </div>
   );
 };

// =====================================================
// ADMIN CUSTOMERS UI
// =====================================================

const renderAdminCustomers =
 () => {
   return (
    <div>
     <div className="admin-page-heading">
      <div>
        <h1>Customers</h1>

      <p>
       View registered UrbanWear
       customers.
      </p>
     </div>

     <button
      className="admin-secondary-button"
      onClick={
        loadAdminCustomers
      }
     >
      Refresh
     </button>
    </div>

    {adminLoading ? (
     <div className="admin-loading">
      Loading customers...
     </div>
) : adminCustomers.length ===
  0?(
  <div className="admin-empty">
    <h3>
     No customers found.
    </h3>
  </div>
):(
  <div className="admin-product-table-wrapper">
    <table className="admin-table">
     <thead>
      <tr>
       <th>ID</th>
       <th>Name</th>
       <th>Email</th>
       <th>Admin</th>
       <th>Joined</th>
      </tr>
     </thead>

   <tbody>
    {adminCustomers.map(
     (customer) => (
      <tr
       key={
         customer.id
       }
      >
       <td>
         #{customer.id}
       </td>

       <td>
        <strong>
         {customer.name ||
          "-"}
        </strong>
       </td>

       <td>
        {customer.email ||
         "-"}
       </td>

       <td>
        {Number(
          customer.is_admin ||
           0
        ) === 1 ? (
          <span className="admin-badge">
           Admin
          </span>
        ):(
                 <span className="customer-badge">
                   Customer
                 </span>
                )}
               </td>

               <td>
                {formatOrderDate(
                 customer.created_at
                )}
               </td>
              </tr>
            )
           )}
          </tbody>
         </table>
       </div>
      )}
     </div>
   );
 };

// =====================================================
// ADMIN MAIN UI
// =====================================================

const renderAdmin = () => {
 if (!isAdmin) {
   return (
     <main className="admin-denied">
      <h2>
        Admin Access Required
      </h2>

       <p>
        This section is available
        only to authorized
        administrators.
       </p>

        <button
         className="admin-primary-button"
         onClick={
           showAllProducts
         }
        >
         Back to Store
        </button>
       </main>
     );
 }

 return (
<main className="admin-page">
 <div className="admin-layout">
 <aside className={`admin-sidebar ${adminMenuOpen ? "mobile-open" : ""}`}>
  <div className="admin-sidebar-brand">
    <span>
      UrbanWear
    </span>

    <small>
      ADMIN PANEL
    </small>
  </div>

  {/* Mobile hamburger */}
  <button
    type="button"
    className="admin-mobile-menu-button"
    onClick={() =>
      setAdminMenuOpen(!adminMenuOpen)
    }
  >
    ☰ Menu
  </button>

  <nav className="admin-sidebar-nav">
    <button
      className={
        adminSection === "dashboard"
          ? "active"
          : ""
      }
      onClick={() => {
        changeAdminSection("dashboard");
        setAdminMenuOpen(false);
      }}
    >
      Dashboard
    </button>

    <button
      className={
        adminSection === "products"
          ? "active"
          : ""
      }
      onClick={() => {
        changeAdminSection("products");
        setAdminMenuOpen(false);
      }}
    >
      Products
    </button>

    <button
      className={
        adminSection === "orders"
          ? "active"
          : ""
      }
      onClick={() => {
        changeAdminSection("orders");
        setAdminMenuOpen(false);
      }}
    >
      Orders
    </button>

    <button
      className={
        adminSection === "customers"
          ? "active"
          : ""
      }
      onClick={() => {
        changeAdminSection("customers");
        setAdminMenuOpen(false);
      }}
    >
      Customers
    </button>
  </nav>

  <div className="admin-sidebar-bottom">
    <button
      onClick={showAllProducts}
    >
      ← Back to Store
    </button>
  </div>
</aside>
<section className="admin-content">
 {adminError && (
  <div className="admin-error">
    {adminError}
  </div>
 )}

 {adminSection ===
  "dashboard" &&
  renderAdminDashboard()}

 {adminSection ===
  "products" &&
  renderAdminProducts()}

 {adminSection ===
   "orders" &&
   renderAdminOrders()}

  {adminSection ===
   "customers" &&
   renderAdminCustomers()}
 </section>
</div>

{/* Add Product Modal */}

{showAddProduct && (
 <div className="admin-modal-overlay">
  <div className="admin-modal">
   <div className="admin-modal-header">
    <div>
     <h2>Add Product</h2>
     <p>Create a new product</p>
    </div>

    <button
     className="admin-modal-close"
     onClick={closeAddProduct}
    >
     ×
    </button>
   </div>

   <form
    className="admin-form"
    onSubmit={saveNewProduct}
   >
    <label>Product Name</label>
    <input
     type="text"
     value={addProductName}
     onChange={(event) =>
       setAddProductName(event.target.value)
     }
    />

    <label>Description</label>
    <textarea
     rows="4"
     value={addProductDescription}
     onChange={(event) =>
       setAddProductDescription(event.target.value)
     }
    />

    <div className="admin-form-two">
     <div>
      <label>Price</label>
      <input
       type="number"
       min="0"
       step="0.01"
       value={addProductPrice}
       onChange={(event) =>
         setAddProductPrice(event.target.value)
       }
      />
     </div>

     <div>
      <label>Brand</label>
      <input
       type="text"
       value={addProductBrand}
       onChange={(event) =>
         setAddProductBrand(event.target.value)
       }
      />
     </div>
    </div>

    <label>Image Filename</label>
    <input
     type="text"
     placeholder="example.jpg"
     value={addProductImage}
     onChange={(event) =>
       setAddProductImage(event.target.value)
     }
    />

    <div className="admin-form-two">
     <div>
      <label>Category</label>
      <select
       value={addProductCategory}
       onChange={(event) =>
         setAddProductCategory(event.target.value)
       }
      >
       <option value="">Select Category</option>

       {categories.map((category) => (
        <option key={category.id} value={category.id}>
         {category.gender} - {category.name}
        </option>
       ))}
      </select>
     </div>

     <div>
      <label>Stock per size</label>
      <input
       type="number"
       min="0"
       value={addProductStock}
       onChange={(event) =>
         setAddProductStock(event.target.value)
       }
      />
     </div>
    </div>

    <div className="admin-modal-actions">
     <button
      type="button"
      className="admin-secondary-button"
      onClick={closeAddProduct}
     >
      Cancel
     </button>

     <button
      type="submit"
      className="admin-primary-button"
      disabled={addProductLoading}
     >
      {addProductLoading ? "Saving..." : "Add Product"}
     </button>
    </div>
   </form>
  </div>
 </div>
)}

{/* Edit Product Modal */}

{editingProduct && (
 <div className="admin-modal-overlay">
  <div className="admin-modal">
   <div className="admin-modal-header">
     <div>
      <h2>
       Edit Product
      </h2>

     <p>
      Product #
      {
        editingProduct.id
      }
     </p>
    </div>

    <button
     className="admin-modal-close"
     onClick={
       closeEditProduct
     }
    >
     ×
    </button>
   </div>

   <form
    className="admin-form"
    onSubmit={
      saveProductChanges
    }
   >
    <label>
      Product Name
    </label>

    <input
     type="text"
     value={
       editProductName
     }
 onChange={(event) =>
   setEditProductName(
     event.target
      .value
   )
 }
/>

<label>
 Description
</label>

<textarea
 rows="4"
 value={
   editProductDescription
 }
 onChange={(event) =>
   setEditProductDescription(
     event.target
      .value
   )
 }
/>

<div className="admin-form-two">
 <div>
  <label>
   Price
  </label>

  <input
   type="number"
   min="0"
   step="0.01"
   value={
     editProductPrice
   }
   onChange={(event) =>
     setEditProductPrice(
       event.target
        .value
     )
   }
  />
 </div>

 <div>
  <label>
   Brand
  </label>

  <input
   type="text"
   value={
     editProductBrand
   }
   onChange={(event) =>
     setEditProductBrand(
       event.target
        .value
     )
   }
  />
 </div>
</div>

<label>
 Image Filename
</label>

<input
 type="text"
 placeholder="example.jpg"
 value={
   editProductImage
 }
 onChange={(event) =>
   setEditProductImage(
     event.target
      .value
   )
 }
/>

<label>
 Category
</label>

<select
 value={
   editProductCategory
 }
 onChange={(event) =>
   setEditProductCategory(
     event.target
      .value
   )
 }
>
 <option value="">
   Select Category
 </option>

 {categories.map(
  (category) => (
       <option
        key={
          category.id
        }
        value={
          category.id
        }
       >
        {
          category.gender
        }{" "}
        -{" "}
        {
          category.name
        }
       </option>
      )
     )}
    </select>

    <div className="admin-modal-actions">
     <button
      type="button"
      className="admin-secondary-button"
      onClick={
        closeEditProduct
      }
     >
      Cancel
     </button>

      <button
       type="submit"
       className="admin-primary-button"
       disabled={
         editProductLoading
       }
      >
       {editProductLoading
         ? "Saving..."
         : "Save Changes"}
      </button>
     </div>
    </form>
   </div>
 </div>
)}

{/* Stock Modal */}

{stockProduct && (
 <div className="admin-modal-overlay">
   <div className="admin-modal stock-modal">
<div className="admin-modal-header">
 <div>
  <h2>
   Manage Stock
  </h2>

  <p>
   {
     stockProduct.name
   }
  </p>
 </div>

 <button
  className="admin-modal-close"
  onClick={
    closeStockManager
  }
 >
  ×
 </button>
</div>

<div className="stock-size-list">
 {Object.keys(
   stockValues
 ).length > 0 ? (
   Object.entries(
     stockValues
   ).map(
     ([size, stock]) => (
       <div
        className="stock-size-row"
        key={size}
       >
        <strong>
         Size {size}
        </strong>

     <input
      type="number"
      min="0"
      value={stock}
      onChange={(
        event
      ) =>
        setStockValues(
         (
           current
         ) => ({
           ...current,
           [size]:
             event
                         .target
                         .value,
                    })
                )
            }
           />

           <button
            className="admin-primary-button"
            onClick={() =>
              updateProductStock(
                size
              )
            }
            disabled={
              stockLoading
            }
           >
            Update
           </button>
          </div>
          )
        )
       ):(
        <p>
          No size stock records
          found for this
          product.
        </p>
       )}
      </div>

         <div className="admin-modal-actions">
          <button
           className="admin-secondary-button"
           onClick={
             closeStockManager
           }
          >
           Close
          </button>
         </div>
        </div>
      </div>
     )}
    </main>
  );
};

// =====================================================
// WISHLIST UI
// =====================================================
const renderWishlist = () => {


 return (
  <main
   style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px 60px",
   }}
  >
   <button
    className="back-button"
    onClick={showAllProducts}
   >
    ← Back to Store
   </button>

   <div
    style={{
     display: "flex",
     justifyContent:
       "space-between",
     alignItems: "center",
     gap: "20px",
     marginBottom: "30px",
     flexWrap: "wrap",
    }}
   >
    <div>
     <h1
       style={{
        marginBottom: "8px",
       }}
     >
       My Wishlist
     </h1>

     <p
      style={{
       margin: 0,
       color: "#666",
      }}
     >
      {wishlistCount === 0
       ? "Save your favorite products here."
       : `${wishlistCount} saved product${
          wishlistCount !== 1
            ? "s"
            : ""
         }`}
     </p>
 </div>
</div>

{wishlistCount === 0 ? (
 <div
  style={{
   textAlign: "center",
   padding: "70px 20px",
   background: "#fff",
   border:
     "1px solid #e5e5e5",
   borderRadius: "12px",
  }}
 >
  <div
   style={{
     fontSize: "52px",
     marginBottom: "15px",
   }}
  >
   ♡
  </div>

  <h2>
   Your Wishlist is Empty
  </h2>

  <p
   style={{
    color: "#666",
    marginBottom: "25px",
   }}
  >
   Add products you love to
   your wishlist.
  </p>

   <button
    className="view-product-button"
    onClick={
      showAllProducts
    }
   >
    Start Shopping
   </button>
  </div>
) : wishlistProducts.length ===
  0?(
  <div
   style={{
    textAlign: "center",
    padding: "50px 20px",
   background: "#fff",
   border:
     "1px solid #e5e5e5",
   borderRadius: "12px",
  }}
 >
  <h2>
   Wishlist Products
   Unavailable
  </h2>

  <p
   style={{
    color: "#666",
   }}
  >
   Some saved products may
   have been removed from
   the store.
  </p>

  <button
    className="view-product-button"
    onClick={clearWishlist}

  >
    Clear Wishlist
  </button>
 </div>
):(
 <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "24px",
  }}
 >
  {wishlistProducts.map(
    (product) => (
      <div
       className="product-card"
       key={product.id}
       style={{
         position:
           "relative",
       }}
       onClick={() =>
         openProductDetails(
           product.id
         )
       }
>
 <button
  type="button"
  aria-label="Remove from wishlist"
  onClick={(event) => {
   event.stopPropagation();

   removeFromWishlist(
     product.id
   );
  }}
  style={{
   position:
     "absolute",
   top: "12px",
   right: "12px",
   width: "38px",
   height: "38px",
   borderRadius:
     "50%",
   border:
     "1px solid #ddd",
   background:
     "#fff",
   color: "#111",
   fontSize: "20px",
   cursor:
     "pointer",
   zIndex: 2,
   display: "flex",
   alignItems:
     "center",
   justifyContent:
     "center",
  }}
 >
  ♥
 </button>

 <img
  src={
    "/images/" +
    product.image
  }
  alt={
    product.name
  }
  className="product-image"
 />

 <h3>
  {product.name}
        </h3>

        <p>
         {
           product.description
         }
        </p>

        <p className="price">
         ₹
         {
           product.price
         }
        </p>

        <p>
         {
           product.gender
         }{" "}
         |{" "}
         {
           product.category
         }
        </p>

        <p>
         Brand:{" "}
         {
           product.brand
         }
        </p>

        <button
         className="view-product-button"
         onClick={(
           event
         ) => {
           event.stopPropagation();

         openProductDetails(
           product.id
         );
        }}
       >
        View Product
       </button>
      </div>
       )
      )}
    </div>
   )}
  </main>
);
};

// =====================================================
// RENDER
// =====================================================

return (
 <div>
  {/* =========================
    Navigation
  ========================= */}

     {!showAdmin && (
  <header className="navbar">
    <div
      className="logo"
      onClick={() => {
        setMobileMenuOpen(false);
        showAllProducts();
      }}
    >
      UrbanWear
    </div>

    {/* Mobile hamburger */}
    <button
      type="button"
      className="mobile-menu-button"
      onClick={() =>
        setMobileMenuOpen(
          !mobileMenuOpen
        )
      }
      aria-label="Toggle navigation menu"
      aria-expanded={mobileMenuOpen}
    >
      {mobileMenuOpen ? "✕" : "☰"}
    </button>

    <nav
      className={`nav-links ${
        mobileMenuOpen
          ? "mobile-menu-open"
          : ""
      }`}
    >
      <button
        onClick={() => {
          setShowCategories(false);
          setMobileMenuOpen(false);
          showAllProducts();
        }}
      >
        Home
      </button>

      <button
        onClick={() => {
          setShowCategories(false);
          setMobileMenuOpen(false);
          showMenProducts();
        }}
      >
        Men
      </button>

      <button
        onClick={() => {
          setShowCategories(false);
          setMobileMenuOpen(false);
          showWomenProducts();
        }}
      >
        Women
      </button>

      <div
        className="category-menu"
        ref={categoryMenuRef}
      >
        <button
          type="button"
          onClick={() =>
            setShowCategories(
              (current) => !current
            )
          }
          aria-expanded={
            showCategories
          }
        >
          Categories{" "}
          {showCategories
            ? "▴"
            : "▾"}
        </button>

        {showCategories && (
          <div
            className="category-dropdown"
            role="menu"
          >
            {categories.length === 0 ? (
              <div className="category-dropdown-empty">
                No categories
                available
              </div>
            ) : (
              categories.map(
                (category) => (
                  <button
                    key={category.id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setShowCategories(
                        false
                      );
                      setMobileMenuOpen(
                        false
                      );

                      showCategoryProducts(
                        category
                      );
                    }}
                  >
                    {category.gender}{" "}
                    -{" "}
                    {category.name}
                  </button>
                )
              )
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setShowCategories(false);
          toggleSearch();
          setMobileMenuOpen(false);
        }}
      >
        Search
      </button>

      {/* Wishlist */}
      <button
        onClick={() => {
          setMobileMenuOpen(false);
          openWishlist();
        }}
        style={{
          position: "relative",
        }}
      >
        Wishlist
        {wishlistCount > 0 && (
          <span>
            {" "}
            ({wishlistCount})
          </span>
        )}
      </button>

      {/* Cart */}
      <button
        onClick={() => {
          setMobileMenuOpen(false);
          openCart();
        }}
      >
        Cart
        {cartItemCount > 0 && (
          <span>
            {" "}
            ({cartItemCount})
          </span>
        )}
      </button>

      {loggedInUser ? (
        <>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openOrders();
            }}
          >
            My Orders
          </button>

          {isAdmin && (
            <button
              className="admin-nav-button"
              onClick={() => {
                setMobileMenuOpen(false);
                openAdmin();
              }}
            >
              Admin Panel
            </button>
          )}

          <span className="welcome-user">
            Hi,{" "}
            {loggedInUser.name}
          </span>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openLogin();
            }}
          >
            Login
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openRegister();
            }}
          >
            Register
          </button>
        </>
      )}
    </nav>
  </header>
)}

{/* =========================
  Search Bar
========================= */}

{isSearchOpen &&
  !showAdmin &&
  !showCart &&
  !showCheckout &&
  !orderSuccess &&
  !showOrders &&
  !showRegister &&
  !showLogin &&
  selectedProduct ===
   null && (
   <div className="search-container">
    <form
      className="search-form"
      onSubmit={
        handleSearchSubmit
      }
    >
      <input
        type="text"
        placeholder="Search products..."
        value={
          searchText
        }
        onChange={(event) =>
          setSearchText(
           event.target
            .value
       )
     }
     autoFocus
    />

     <button type="submit">
      Search
     </button>
    </form>
  </div>
 )}

{/* =========================
  ADMIN
========================= */}

{showAdmin ? (
  renderAdmin()
) : showLogin ? (
  /* Login */

 <main className="login-page">
  <button
   className="back-button"
   onClick={
     closeLogin
   }
  >
   ← Back to Store
  </button>

  <div className="login-container">
   <div className="login-header">
    <h1>
     Welcome Back
    </h1>

    <p>
     Login to your UrbanWear
     account.
    </p>
   </div>

   <form
    className="login-form"
    onSubmit={
      handleLogin
    }
   >
    <label>
      Email
    </label>
<input
 type="email"
 placeholder="Enter your email"
 value={
   loginEmail
 }
 onChange={(event) =>
   setLoginEmail(
     event.target
      .value
   )
 }
/>

<label>
 Password
</label>

<input
 type="password"
 placeholder="Enter your password"
 value={
   loginPassword
 }
 onChange={(event) =>
   setLoginPassword(
     event.target
      .value
   )
 }
/>

{loginError && (
  <div className="login-error">
   {
     loginError
   }
  </div>
)}

{loginMessage && (
  <div className="login-success">
   {
     loginMessage
   }
  </div>
)}

<button
 type="submit"
 className="login-button"
 disabled={
  loginLoading
     }
    >
     {loginLoading
       ? "Logging in..."
       : "Login"}
    </button>
    <div className="google-login-section">
  <div className="google-divider">
    <span>OR</span>
  </div>

 <div className="google-login-section">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const response = await fetch(`${API_URL}/api/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential: credentialResponse.credential,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setLoginError(data.message || "Google login failed.")
          return
        }

        setLoggedInUser(data.user)

        localStorage.setItem(
          "urbanwearUser",
          JSON.stringify(data.user)
        )

        setLoginMessage(
          data.message || "Google login successful!"
        )

        setLoginError("")

        setTimeout(() => {
          setShowLogin(false)
          setLoginMessage("")
        }, 1200)

      } catch (error) {
        console.error("Google login error:", error)
        setLoginError("Unable to connect to the server.")
      }
    }}

    onError={() => {
      setLoginError("Google Login Failed.")
    }}

    theme="outline"
    size="large"
    shape="pill"
    text="signin_with"
    logo_alignment="left"
    width="360"
  />
</div>

<div className="login-divider">
  <span>OR</span>
</div>
</div>
   </form>

   <div className="login-register-link">
    <p>
     Don't have an account?
    </p>

      <button
       type="button"
       onClick={
         goToRegister
       }
      >
       Create an Account
      </button>
     </div>
   </div>
  </main>
) : showRegister ? (
      /* Registration */

     <main className="register-page">
      <button
       className="back-button"
       onClick={
         closeRegister
       }
      >
       ← Back to Store
      </button>

      <div className="register-container">
       <div className="register-header">
        <h1>
         Create Your Account
        </h1>

        <p>
         Join UrbanWear and
         start shopping.
        </p>
       </div>

       <form
        className="register-form"
        onSubmit={
         handleRegister
     }
    >
     <label>
       Full Name
     </label>

     <input
      type="text"
      placeholder="Enter your name"
      value={
        registerName
      }
      onChange={(event) =>
        setRegisterName(
          event.target
           .value
        )
      }
     />

     <label>
      Email
     </label>

     <input
      type="email"
      placeholder="Enter your email"
      value={
        registerEmail
      }
      onChange={(event) =>
        setRegisterEmail(
          event.target
           .value
        )
      }
     />

     <label>
      Password
     </label>

     <input
      type="password"
      placeholder="Minimum 6 characters"
      value={
        registerPassword
      }
      onChange={(event) =>
        setRegisterPassword(
          event.target
           .value
        )
      }
     />

     <label>
      Confirm Password
     </label>

     <input
      type="password"
      placeholder="Re-enter your password"
      value={
        registerConfirmPassword
      }
      onChange={(event) =>
        setRegisterConfirmPassword(
          event.target
           .value
        )
      }
     />

     {registerError && (
      <div className="register-error">
        {
          registerError
        }
      </div>
     )}

     {registerMessage && (
      <div className="register-success">
        {
          registerMessage
        }
      </div>
     )}

     <button
      type="submit"
      className="register-button"
      disabled={
        registerLoading
      }
     >
      {registerLoading
        ? "Creating Account..."
        : "Create Account"}
     </button>
    </form>

    <div className="login-register-link">
     <p>
      Already have an
         account?
        </p>

          <button
           type="button"
           onClick={
             goToLogin
           }
          >
           Login
          </button>
         </div>
       </div>
      </main>
   ) : showCheckout && showPayment ? (

    /* Payment */

  <main className="checkout-page">

    <button
      className="back-button"
      onClick={() => {
        setShowPayment(false);
        setPaymentError("");
      }}
    >
      ← Back to Checkout
    </button>

    <h2>
      {paymentMethod === "UPI"
        ? "UPI Payment"
        : "Card Payment"}
    </h2>

    <div className="payment-page-container">
      <div className="payment-box">

        <h3>Payment Details</h3>

        <div className="payment-amount">
          Amount to Pay: ₹{cartTotal.toFixed(2)}
        </div>

        {paymentMethod === "UPI" && (
          <div className="payment-form">

            <label>UPI ID</label>

            <input
          type="text"
          placeholder="example@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />
        <button
          type="button"
          className="place-order-button"
          onClick={handlePayment}
          disabled={paymentProcessing}
        >
          {paymentProcessing
            ? "Processing Payment..."
            : `Pay ₹${cartTotal.toFixed(2)}`}
        </button>
        <button
          type="button"
          className="back-button"
          onClick={() => {
            setPaymentProcessing(false);
            setPaymentError("");
            setShowPayment(false);
          }}
          disabled={paymentProcessing}
        >
          Cancel Payment
        </button>

          </div>
        )}

        {paymentMethod === "CARD" && (
          <div className="payment-form">

            <label>Card Number</label>

        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />

            <label>Card Holder Name</label>

        <input
          type="text"
          placeholder="Name on card"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
        />

            <div className="payment-two-columns">

              <div>
                <label>Expiry Date</label>

        <input
          type="text"
          placeholder="MM/YY"
          maxLength="5"
          value={cardExpiry}
          onChange={(e) => setCardExpiry(e.target.value)}
        />
              </div>

              <div>
                <label>CVV</label>

        <input
          type="password"
          placeholder="123"
          maxLength="3"
          value={cardCvv}
          onChange={(e) => setCardCvv(e.target.value)}
        />
              </div>

            </div>

        <button
          type="button"
          className="place-order-button"
          onClick={handlePayment}
          disabled={paymentProcessing}
        >
          {paymentProcessing
            ? "Processing Payment..."
            : `Pay ₹${cartTotal.toFixed(2)}`}
        </button>
        <button
          type="button"
          className="back-button"
          onClick={() => {
            setPaymentProcessing(false);
            setPaymentError("");
            setShowPayment(false);
          }}
          disabled={paymentProcessing}
        >
          Cancel Payment
        </button>

          </div>
        )}

        {paymentError && (
          <div className="checkout-error">
            {paymentError}
          </div>
        )}

      </div>
    </div>

  </main>
) : showCheckout ? (


  /* Checkout */

 <main className="checkout-page">
  <button
   className="back-button"
   onClick={
     backToCart
   }
  >
   ← Back to Cart
  </button>

  <h2>
   Checkout
  </h2>

  <div className="checkout-container">
   <div className="checkout-form-container">
    <div className="checkout-section">
     <h3>Delivery Information</h3>

{/* ADD PAYMENT METHOD SECTION HERE */}
<div className="payment-method-section">
  <h3>Payment Method</h3>

  <div className="payment-method-options">
    <label
      className={
        paymentMethod === "COD"
          ? "payment-method-option selected"
          : "payment-method-option"
      }
    >
      <input
        type="radio"
        name="paymentMethod"
        value="COD"
        checked={paymentMethod === "COD"}
        onChange={(event) => setPaymentMethod(event.target.value)}
      />

      <div>
        <strong>Cash on Delivery</strong>
        <span>Pay when your order is delivered.</span>
      </div>
    </label>

    <label
      className={
        paymentMethod === "UPI"
          ? "payment-method-option selected"
          : "payment-method-option"
      }
    >
      <input
        type="radio"
        name="paymentMethod"
        value="UPI"
        checked={paymentMethod === "UPI"}
        onChange={(event) => setPaymentMethod(event.target.value)}
      />

      <div>
        <strong>UPI</strong>
        <span>Pay using UPI.</span>
      </div>
    </label>

    <label
      className={
        paymentMethod === "CARD"
          ? "payment-method-option selected"
          : "payment-method-option"
      }
    >
      <input
        type="radio"
        name="paymentMethod"
        value="CARD"
        checked={paymentMethod === "CARD"}
        onChange={(event) => setPaymentMethod(event.target.value)}
      />

      <div>
        <strong>Card</strong>
        <span>Pay using debit or credit card.</span>
      </div>
    </label>
  </div>
</div>

<form className="checkout-form" onSubmit={handleCheckoutSubmit}>

      <label>
        Full Name
      </label>

      <input
       type="text"
       placeholder="Enter your full name"
       value={
        checkoutName
 }
 onChange={(event) =>
   setCheckoutName(
     event.target
      .value
   )
 }
/>

<label>
 Phone Number
</label>

<input
 type="tel"
 placeholder="10-digit phone number"
 value={
   checkoutPhone
 }
 maxLength="10"
 onChange={(event) =>
   setCheckoutPhone(
     event.target
      .value.replace(
        /\D/g,
        ""
      )
   )
 }
/>

<label>
 Address
</label>

<textarea
 placeholder="Enter your complete delivery address"
 value={
   checkoutAddress
 }
 onChange={(event) =>
   setCheckoutAddress(
     event.target
      .value
   )
 }
 rows="4"
/>

<div className="checkout-two-columns">
 <div>
  <label>
   City
  </label>

  <input
   type="text"
   placeholder="Enter city"
   value={
     checkoutCity
   }
   onChange={(event) =>
     setCheckoutCity(
       event.target
        .value
     )
   }
  />
 </div>

 <div>
  <label>
   Pincode
  </label>

  <input
   type="text"
   placeholder="6-digit pincode"
   value={
     checkoutPincode
   }
   maxLength="6"
   onChange={(event) =>
     setCheckoutPincode(
       event.target
        .value.replace(
          /\D/g,
          ""
        )
     )
   }
  />
 </div>
</div>

{checkoutError && (
 <div className="checkout-error">
   {
     checkoutError
   }
 </div>
)}

<button
  type="submit"
  className="place-order-button"
  disabled={checkoutLoading}
>
  {paymentMethod === "COD" ? "Place Order" : "Continue to Payment"}
</button>
  </form>
 </div>
</div>

<div className="checkout-summary">
 <h3>
  Order Summary
 </h3>

 <div className="checkout-summary-items">
  {cart.map(
   (item) => (
     <div
      className="checkout-summary-item"
      key={
        item.cartItemId
      }
     >
      <img
        src={
          "/images/" +
          item.image
        }
        alt={
          item.name
        }
      />

     <div>
      <h4>
       {
         item.name
       }
      </h4>

       <p>
        Size:{" "}
        {
          item.size
        }
       </p>

       <p>
        Quantity:{" "}
        {
            item.quantity
          }
         </p>
        </div>

        <strong>
         ₹
         {(
           item.price *
           item.quantity
         ).toFixed(
           2
         )}
        </strong>
       </div>
      )
     )}
    </div>

    <div className="checkout-total-row">
     <span>
      Total
     </span>

     <strong>
      ₹
      {cartTotal.toFixed(
       2
      )}
     </strong>
    </div>

      <p className="checkout-note">
       Your order will be
       placed with the delivery
       details provided.
      </p>
     </div>
   </div>
  </main>
) : orderSuccess ? (
  /* Order Success */

 <main className="order-success-page">
  <div className="order-success-container">
   <div className="success-icon">
    ✓
   </div>

   <h1>
    Order Placed Successfully!
   </h1>
<p className="success-message">
 Thank you for shopping
 with UrbanWear.
</p>

<div className="order-details-box">
 <div>
  <span>
   Order ID
  </span>

  <strong>
   #
   {
     placedOrderId
   }
  </strong>
 </div>

 <div>
  <span>
   Order Total
  </span>

  <strong>
   ₹
   {placedOrderTotal.toFixed(
    2
   )}
  </strong>
 </div>

 <div>
  <span>
   Status
  </span>

  <strong>
   Pending
  </strong>
 </div>
</div>

<p className="success-info">
 Your order has been
 saved successfully.
 You can view it in your
 My Orders section.
</p>

<div className="success-buttons">
 <button
     className="continue-shopping-button"
     onClick={
       viewOrdersAfterSuccess
     }
    >
     View My Orders
    </button>

      <button
       className="continue-shopping-button"
       onClick={
         continueAfterOrder
       }
      >
       Continue Shopping
      </button>
     </div>
   </div>
  </main>
) : showOrders ? (
  /* My Orders */

 <main className="orders-page">
  <button
   className="back-button"
   onClick={
     showAllProducts
   }
  >
   ← Back to Store
  </button>

  {selectedOrder ? (
   <div className="order-details-page">
    <button
      className="back-button"
      onClick={
        backToOrders
      }
    >
      ← Back to My Orders
    </button>

    {orderDetailsLoading ? (
     <div className="orders-loading">
      <h3>
        Loading order
        details...
      </h3>
     </div>
    ):(
     <>
      <div className="orders-page-header">
 <h1>
  Order #
  {
    selectedOrder.id
  }
 </h1>

 <span
  className={
    "order-status " +
    String(
      selectedOrder.status ||
       "Pending"
    ).toLowerCase()
  }
 >
  {
    selectedOrder.status ||
      "Pending"
  }
 </span>
</div>

<p className="order-date">
 Placed on{" "}
 {formatOrderDate(
  selectedOrder.created_at
 )}
</p>

<div className="order-info-grid">
 <div className="order-info-box">
  <h3>
   Delivery Information
  </h3>

  <p>
   <strong>
     Name:
   </strong>{" "}
   {
     selectedOrder.customer_name
   }
  </p>

  <p>
   <strong>
     Phone:
   </strong>{" "}
   {
     selectedOrder.phone
   }
  </p>
 <p>
  <strong>
    Address:
  </strong>{" "}
  {
    selectedOrder.address
  }
 </p>

 <p>
  <strong>
    City:
  </strong>{" "}
  {
    selectedOrder.city
  }
 </p>

 <p>
  <strong>
    Pincode:
  </strong>{" "}
  {
    selectedOrder.pincode
  }
 </p>
</div>

<div className="order-info-box">
 <h3>
  Order Summary
 </h3>

 <p>
  <strong>
    Order ID:
  </strong>{" "}
  #
  {
    selectedOrder.id
  }
 </p>

 <p>
  <strong>
    Status:
  </strong>{" "}
  {
    selectedOrder.status ||
     "Pending"
  }
 </p>
  <p>
   <strong>
     Total:
   </strong>{" "}
   ₹
   {Number(
     selectedOrder.total_amount ||
      0
   ).toFixed(
     2
   )}
  </p>
 </div>
</div>

<div className="ordered-items-section">
 <h2>
  Items Ordered
 </h2>

 {selectedOrder.items &&
 selectedOrder.items
  .length >
  0?(
  <div className="ordered-items">
    {selectedOrder.items.map(
     (
       item,
       index
     ) => (
       <div
         className="ordered-item"
         key={
           item.id ||
           index
         }
       >
         <img
           src={
             item.image
               ? "/images/" +
                 item.image
               : "/images/placeholder.jpg"
           }
           alt={
             item.name ||
             "Product"
           }
         />

       <div className="ordered-item-info">
        <h3>
       {
           item.name ||
             "Product"
       }
      </h3>

      <p>
       Size:{" "}
       <strong>
        {
          item.size
        }
       </strong>
      </p>

      <p>
       Quantity:{" "}
       <strong>
        {
          item.quantity
        }
       </strong>
      </p>

      <p>
       Unit Price:
       ₹
       {Number(
         item.price ||
           0
       ).toFixed(
         2
       )}
      </p>
     </div>

     <div className="ordered-item-total">
      ₹
      {(
        Number(
          item.price ||
            0
        )*
        Number(
          item.quantity ||
            0
        )
      ).toFixed(
        2
      )}
     </div>
    </div>
)
        )}
      </div>
     ):(
      <p>
        No item details
        available.
      </p>
     )}
    </div>

    <div className="order-final-total">
     <span>
      Order Total
     </span>

      <strong>
       ₹
       {Number(
         selectedOrder.total_amount ||
          0
       ).toFixed(
         2
       )}
      </strong>
     </div>

     {(selectedOrder.status === "Pending" ||
       selectedOrder.status === "Processing") && (
       <div
        style={{
         marginTop: "20px",
         display: "flex",
         justifyContent: "flex-end",
        }}
       >
        <button
         type="button"
         className="cancel-order-button"
         onClick={() =>
           cancelOrder(selectedOrder.id)
         }
         disabled={
           cancellingOrderId === selectedOrder.id
         }
         style={{
          padding: "10px 18px",
          border: "1px solid #c62828",
          borderRadius: "6px",
          background: "#fff",
          color: "#c62828",
          cursor:
           cancellingOrderId === selectedOrder.id
            ? "not-allowed"
            : "pointer",
          opacity:
           cancellingOrderId === selectedOrder.id
            ? 0.6
            : 1,
         }}
        >
         {cancellingOrderId === selectedOrder.id
          ? "Cancelling..."
          : "Cancel Order"}
        </button>
       </div>
     )}
    </>
  )}
 </div>
):(
 <>
  <div className="orders-page-header">
    <div>
     <h1>
      My Orders
     </h1>

    <p>
     View your UrbanWear
     order history.
    </p>
   </div>
  </div>

  {ordersLoading ? (
    <div className="orders-loading">
     <h3>
       Loading your
       orders...
     </h3>
    </div>
  ) : orders.length ===
    0?(
    <div className="empty-orders">
  <div className="empty-orders-icon">

  </div>

  <h2>
   You haven't placed
   any orders yet
  </h2>

  <p>
   Your completed
   orders will appear
   here.
  </p>

  <button
    className="view-product-button"
    onClick={
      showAllProducts
    }
  >
    Start Shopping
  </button>
 </div>
):(
 <div className="orders-list">
  {orders.map(
    (order) => (
      <div
       className="order-card"
       key={
         order.id
       }
      >
       <div className="order-card-top">
         <div>
          <span className="order-label">
           Order ID
          </span>

       <h2>
        #
        {
          order.id
        }
       </h2>
      </div>

      <span
       className={
        "order-status " +
        String(
        order.status ||
         "Pending"
      ).toLowerCase()
  }
 >
  {
      order.status ||
       "Pending"
  }
 </span>
</div>

<div className="order-card-info">
 <div>
  <span>
   Order Date
  </span>

  <strong>
   {formatOrderDate(
    order.created_at
   )}
  </strong>
 </div>

 <div>
  <span>
   Customer
  </span>

  <strong>
   {
     order.customer_name
   }
  </strong>
 </div>

 <div>
  <span>
   City
  </span>

  <strong>
   {
     order.city
   }
  </strong>
 </div>

 <div>
  <span>
   Total
  </span>
            <strong>
             ₹
             {Number(
               order.total_amount ||
                0
             ).toFixed(
               2
             )}
            </strong>
           </div>
          </div>

          <div className="order-card-bottom">
           <span>
            Order #
            {
              order.id
            }
           </span>

           <button
            className="view-order-button"
            onClick={() =>
              viewOrderDetails(
                order.id
              )
            }
           >
            View Details
           </button>

           {(order.status === "Pending" ||
             order.status === "Processing") && (
             <button
              type="button"
              className="cancel-order-button"
              onClick={() =>
                cancelOrder(order.id)
              }
              disabled={
                cancellingOrderId === order.id
              }
              style={{
               marginLeft: "10px",
               padding: "10px 16px",
               border: "1px solid #c62828",
               borderRadius: "6px",
               background: "#fff",
               color: "#c62828",
               cursor:
                cancellingOrderId === order.id
                 ? "not-allowed"
                 : "pointer",
               opacity:
                cancellingOrderId === order.id
                 ? 0.6
                 : 1,
              }}
             >
              {cancellingOrderId === order.id
               ? "Cancelling..."
               : "Cancel Order"}
             </button>
           )}
          </div>
         </div>
          )
         )}
       </div>
      )}
     </>
   )}
  </main>
) : showCart ? (
  /* Cart */

 <main className="cart-page">
  <button
   className="back-button"
   onClick={
     showAllProducts
   }
  >
   ← Continue Shopping
  </button>
<h2>
 Your Cart
</h2>

{cartLoading ? (
  <div className="empty-cart">
    <h3>
     Loading your cart...
    </h3>
  </div>
) : cart.length ===
  0?(
  <div className="empty-cart">
    <h3>
     Your cart is empty
    </h3>

  <p>
   Add some products to
   your cart to see them
   here.
  </p>

  <button
    className="view-product-button"
    onClick={
      showAllProducts
    }
  >
    Start Shopping
  </button>
 </div>
):(
 <div className="cart-container">
  <div className="cart-items">
    {cart.map(
      (item) => (
        <div
         className="cart-item"
         key={
           item.cartItemId
         }
        >
         <img
           src={
             "/images/" +
             item.image
           }
           alt={
             item.name
           }
           className="cart-item-image"
         />
<div className="cart-item-info">
 <h3>
  {
    item.name
  }
 </h3>

 <p>
  Size:{" "}
  <strong>
   {
     item.size
   }
  </strong>
 </p>

 <p>
  Price: ₹
  {
    item.price
  }
 </p>

 <div className="quantity-control">
  <span>
   Quantity:
  </span>

  <button
   type="button"
   className="quantity-button"
   onClick={() =>
     decreaseQuantity(
       item
     )
   }
   disabled={
     item.quantity <=
     1
   }
  >
   −
  </button>

  <strong className="quantity-number">
   {
     item.quantity
   }
  </strong>

  <button
   type="button"
       className="quantity-button"
       onClick={() =>
         increaseQuantity(
           item
         )
       }
      >
       +
      </button>
     </div>

     <p className="cart-item-subtotal">
      Item Total: ₹
      {item.price *
        item.quantity}
     </p>

     <button
      className="remove-cart-button"
      onClick={() =>
        removeFromCart(
          item.cartItemId
        )
      }
     >
      Remove
     </button>
    </div>
   </div>
  )
 )}
</div>

<div className="cart-summary">
 <h3>
  Cart Summary
 </h3>

 <div className="summary-row">
  <span>
   Items
  </span>

  <span>
   {
     cartItemCount
   }
  </span>
 </div>

 <div className="summary-row total-row">
  <span>
   Total
         </span>

         <span>
          ₹
          {cartTotal.toFixed(
           2
          )}
         </span>
        </div>

            <button
             className="checkout-button"
             onClick={
               openCheckout
             }
            >
             Proceed to Checkout
            </button>
           </div>
         </div>
        )}
       </main>
   ) : showWishlist ? (
  renderWishlist()
) : selectedProduct ? (
       /* Product Details */

    <main className="product-details-page">
     <button
      className="back-button"
      onClick={
        closeProductDetails
      }
     >
      ← Back to Products
     </button>

     {productLoading ? (
      <p>
       Loading product...
      </p>
     ):(
      <div className="product-details">
       <div className="product-details-image">
         <img
          src={
            "/images/" +
            selectedProduct.image
          }
          alt={
            selectedProduct.name
          }
         />
</div>

<div className="product-details-info">
 <p className="details-category">
  {
    selectedProduct.gender
  }{" "}
  |{" "}
  {
    selectedProduct.category
  }
 </p>

 <h1>
  {
    selectedProduct.name
  }
 </h1>

 <p className="details-brand">
  Brand:{" "}
  {
    selectedProduct.brand
  }
 </p>

 <p className="details-price">
  ₹
  {
    selectedProduct.price
  }
 </p>

 <p className="details-description">
  {
    selectedProduct.description
  }
 </p>

 {/* Wishlist button */}

 <button
  type="button"
  onClick={() =>
    toggleWishlist(
      selectedProduct.id
    )
  }
  style={{
    marginBottom:
      "22px",
    padding:
      "11px 18px",
   border:
     "1px solid #ddd",
   borderRadius:
     "6px",
   background:
     isInWishlist(
       selectedProduct.id
     )
       ? "#111"
       : "#fff",
   color:
     isInWishlist(
       selectedProduct.id
     )
       ? "#fff"
       : "#111",
   cursor:
     "pointer",
   fontSize:
     "14px",
   fontWeight:
     "600",
 }}
>
 {isInWishlist(
   selectedProduct.id
 )
   ? "♥ Remove from Wishlist"
   : "♡ Add to Wishlist"}
</button>

<h3>
 Available Sizes
</h3>

<div className="size-list">
 {selectedProduct.sizes.map(
  (size) => (
   <button
     type="button"
     className={
       size.stock >
       0
        ? selectedSize ===
          size.size
          ? "size-box selected-size"
          : "size-box"
        : "size-box out-of-stock"
     }
     key={
       size.size
     }
         onClick={() =>
           handleSizeSelect(
             size
           )
         }
         disabled={
           size.stock <=
           0
         }
        >
         <strong>
           {size.size}
         </strong>

         <span>
          {size.stock >
          0
           ? size.stock +
             " available"
           : "Out of stock"}
         </span>
        </button>
       )
      )}
     </div>

       <button
      className="add-cart-button"
      disabled={
        !selectedSize
      }
      onClick={
        addToCart
      }
     >
      Add to Cart
     </button>
    </div>
   </div>
 )}

 {/* Related Products */}

 {!productLoading && relatedProducts.length > 0 && (
  <section style={{ marginTop: "50px" }}>
   <h2 style={{ marginBottom: "20px" }}>
    You May Also Like
   </h2>

   <div
    style={{
     display: "grid",
     gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
     gap: "24px",
    }}
   >
    {relatedProducts.map((product) => (
     <div
      className="product-card"
      key={product.id}
      onClick={() => {
       openProductDetails(product.id);
       window.scrollTo({ top: 0, behavior: "smooth" });
      }}
     >
      <img
       src={"/images/" + product.image}
       alt={product.name}
       className="product-image"
      />

      <h3>{product.name}</h3>

      <p className="price">₹{product.price}</p>

      <button
       className="view-product-button"
       onClick={(event) => {
        event.stopPropagation();
        openProductDetails(product.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
       }}
      >
       View Product
      </button>
     </div>
    ))}
   </div>
  </section>
 )}
</main>
):(
 <>
  {/* Hero */}

  <section className="hero">
   <div className="hero-content">
    <h1>
     Style That Defines You
    </h1>

    <p>
     Discover the latest
   fashion for men and
   women.
  </p>

  <div className="hero-buttons">
   <button
    onClick={
      showMenProducts
    }
   >
    Shop Men
   </button>

   <button
    onClick={
      showWomenProducts
    }
   >
    Shop Women
   </button>
  </div>
 </div>
</section>

{/* Categories */}

{selectedGender && (
 <section className="category-section">
  <h2>
    {
      selectedGender
    }
    's Categories
  </h2>

  <div className="category-buttons">
   {filteredCategories.map(
     (category) => (
      <button
        key={
          category.id
        }
        onClick={() =>
          showCategoryProducts(
            category
          )
        }
        className={
          selectedCategory ===
          category.name
            ? "active-category"
            : ""
        }
     >
      {
        category.name
      }
     </button>
     )
    )}
   </div>
 </section>
)}

{/* Products */}

<main>
 <div className="products-heading-row">
  <h2>
   {searchText.trim()
    ? 'Search Results for "' +
      searchText +
      '"'
    : selectedCategory
    ? selectedCategory
    : selectedGender
    ? selectedGender +
      "'s Collection"
    : "Our Products"}
  </h2>

   <div
   style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
   }}
  >
      {[
    { value: "", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name-az", label: "A to Z" },
    { value: "newest", label: "Newest" },
   ].map((option) => (
    <button
     key={option.value}
     type="button"
     onClick={() => setSortOption(option.value)}
     style={{
      padding: "9px 14px",
      border: "1px solid #ddd",
      borderRadius: "20px",
      background:
       sortOption === option.value ? "#111" : "#fff",
      color:
       sortOption === option.value ? "#fff" : "#111",
      fontSize: "13px",
      cursor: "pointer",
     }}
    >
     {option.label}
    </button>
   ))}

   <button
    type="button"
    className="filter-toggle-button"
    onClick={() =>
      setShowFilters(
        (current) =>
         !current
      )
    }
   >
    {showFilters
      ? "Hide Filters"
      : "Filters"}
   </button>
  </div>
  </div>

 {showFilters && (
  <div className="filter-panel">
   <div className="filter-group">
    <label>
     Size
    </label>

    <select
     value={
    filterSize
  }
  onChange={(
    event
  ) =>
    setFilterSize(
      event.target
       .value
    )
  }
 >
  <option value="">
    All Sizes
  </option>

  <option value="XS">
   XS
  </option>

  <option value="S">
   S
  </option>

  <option value="M">
   M
  </option>

  <option value="L">
   L
  </option>

  <option value="XL">
   XL
  </option>

  <option value="XXL">
   XXL
  </option>
 </select>
</div>

<div className="filter-group">
 <label>
  Brand
 </label>

 <select
  value={
    filterBrand
  }
  onChange={(
    event
  ) =>
   setFilterBrand(
     event.target
      .value
   )
  }
 >
  <option value="">
    All Brands
  </option>

  {availableBrands.map(
   (brand) => (
     <option
      key={
        brand
      }
      value={
        brand
      }
     >
      {
        brand
      }
     </option>
   )
  )}
 </select>
</div>

<div className="filter-group">
 <label>
  Min Price
 </label>

 <input
  type="number"
  min="0"
  placeholder="₹ Min"
  value={
    filterMinPrice
  }
  onChange={(
    event
  ) =>
    setFilterMinPrice(
      event.target
       .value
    )
  }
 />
</div>

<div className="filter-group">
   <label>
    Max Price
   </label>

   <input
    type="number"
    min="0"
    placeholder="₹ Max"
    value={
      filterMaxPrice
    }
    onChange={(
      event
    ) =>
      setFilterMaxPrice(
        event.target
         .value
      )
    }
   />
  </div>

   <button
    type="button"
    className="clear-filter-button"
    onClick={
      clearFilters
    }
   >
    Clear Filters
   </button>
 </div>
)}

{loading ? (
  <p>
   Loading products...
  </p>
) : filteredProducts.length ===
  0?(
  <div className="no-filter-results">
   <h3>
     No products found
   </h3>

  <p>
   Try changing or
   clearing your filters.
  </p>

  <button
   type="button"
   className="view-product-button"
    onClick={
      clearFilters
    }
  >
    Clear Filters
  </button>
 </div>
):(
 <>
  <p className="filter-result-count">
    Showing{" "}
    {
      filteredProducts.length
    }{" "}
    product
    {filteredProducts.length !==
    1
      ? "s"
      : ""}
  </p>

  <div className="products">
   {sortedProducts.map(
     (product) => (
      <div
        className="product-card"
        key={
          product.id
        }
        style={{
          position:
            "relative",
        }}
        onClick={() =>
          openProductDetails(
            product.id
          )
        }
      >
        {/* Wishlist Heart */}

      <button
       type="button"
       aria-label={
         isInWishlist(
           product.id
         )
           ? "Remove from wishlist"
           : "Add to wishlist"
       }
       onClick={(
         event
       ) => {
  event.stopPropagation();

   toggleWishlist(
     product.id
   );
 }}
 style={{
   position:
     "absolute",
   top: "12px",
   right: "12px",
   width: "38px",
   height: "38px",
   borderRadius:
     "50%",
   border:
     "1px solid #ddd",
   background:
     "#fff",
   color:
     isInWishlist(
       product.id
     )
       ? "#111"
       : "#777",
   fontSize:
     "21px",
   cursor:
     "pointer",
   zIndex: 2,
   display:
     "flex",
   alignItems:
     "center",
   justifyContent:
     "center",
 }}
>
 {isInWishlist(
   product.id
 )
   ? "♥"
   : "♡"}
</button>

<img
 src={
   "/images/" +
   product.image
 }
 alt={
   product.name
 }
 className="product-image"
/>

<h3>
 {
   product.name
 }
</h3>

<p>
 {
   product.description
 }
</p>

<p className="price">
 ₹
 {
   product.price
 }
</p>

<p>
 {
   product.gender
 }{" "}
 |{" "}
 {
   product.category
 }
</p>

<p>
 Brand:{" "}
 {
   product.brand
 }
</p>

<button
 className="view-product-button"
 onClick={(
   event
 ) => {
   event.stopPropagation();

  openProductDetails(
    product.id
  );
 }}
>
 View Product
                </button>
               </div>
               )
              )}
             </div>
           </>
          )}
         </main>
       </>
      )}

      {/* =========================
        Wishlist Page Overlay
      ========================= */}

       {!showAdmin &&
        !showLogin &&
        !showRegister &&
        !showCheckout &&
        !orderSuccess &&
        !showOrders &&
        !showCart &&
        !selectedProduct &&
        wishlistCount > 0 &&
        false && (
          <div>
           {/* Reserved */}
          </div>
        )}
      </div>
    );
}

export default App;
