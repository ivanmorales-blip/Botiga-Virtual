/**
 * =========================
 * CART API HELPERS (Laravel session-based)
 * =========================
 */

const CSRF_TOKEN = () =>
  document.querySelector('meta[name="csrf-token"]')?.content;

/**
 * ADD PRODUCT TO CART
 */
export const addToCart = (productId, quantity = 1, isPack = false) => {
  try {
    console.log(productId);
    console.log(quantity);
    const existingCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const index = existingCart.findIndex(
      item => item.id === productId && item.isPack === isPack
    );

    if (index !== -1) {
      existingCart[index].quantity += quantity;
    } else {
      existingCart.push({
        id: productId,
        quantity,
        isPack
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(existingCart));

    return existingCart;
  } catch (err) {
    console.error("Error adding to cart:", err);
    return null;
  }
};

/**
 * GET CART CONTENT (sessionStorage)
 */
export const getCart = () => {
  try {
    const cart = JSON.parse(sessionStorage.getItem("cart"));
    return Array.isArray(cart) ? cart : [];
  } catch (err) {
    console.error("getCart error:", err);
    return [];
  }
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCart = (id) => {
  try {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const updatedCart = cart.filter(item => item.id !== id);

    sessionStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;

  } catch (err) {
    console.error("removeFromCart error:", err);
    return [];
  }
};

/**
 * UPDATE ITEM QUANTITY
 */
export const updateCart = (id, quantity) => {
  try {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const updatedCart = cart.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: quantity < 1 ? 1 : quantity
        };
      }
      return item;
    });

    sessionStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart;

  } catch (err) {
    console.error("updateCart error:", err);
    return [];
  }
};