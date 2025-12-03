import { useEffect, useState } from "react";
import {
  cartDBManager,
  inventoryDBManager,
  salesDBManager,
} from "../db/dbManager";
import styles from "./Cart.module.css";
const Carts = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const items = await cartDBManager.getAll();
      setCartItems(items);
    };
    fetchCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleBuy = async () => {
    if (!cartItems.length) return;
    const salesList = [...cartItems];
    for (const cartItem of cartItems) {
      const product = await inventoryDBManager.get(cartItem.productId);
      if (!product) continue;
      const color = cartItem.selectedColor;
      const size = cartItem.selectedSize;
      const currentQty = Number(product.color[color][size].quantity) || 0;
      const purchaseQty = Number(cartItem.quantity) || 1;
      product.color[color][size].quantity = Math.max(
        currentQty - purchaseQty,
        0
      );
      await inventoryDBManager.update(product);
    }
    const currentDate = new Date().toISOString().split("T")[0];
    await salesDBManager.add({ date: currentDate, items: salesList });
    await cartDBManager.removeAll();
    setCartItems([]);
  };

  return (
    <div className={styles.cartPage}>
      <h1>My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className={styles.cartContainer}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartCard}>
                <div className={styles.cartDetails}>
                  <h2>{item.name}</h2>
                  <p>Color: {item.selectedColor}</p>
                  <p>Size: {item.selectedSize}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: Rs{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.totalSection}>
            <h2>Total: Rs{total}</h2>
            <button className={styles.checkoutBtn} onClick={handleBuy}>
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carts;
