import { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { cartDBManager, salesDBManager } from "../db/dbManager";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await cartDBManager.getAll();
      setCartItems(items);
    };
    fetchCartItems();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleBuyButton = async () => {
    if (cartItems.length === 0) return;

    const currentDate = new Date().toISOString().split("T")[0];
    const salesList = await cartDBManager.getAll();
    const finalSalesDbManager = [currentDate, ...salesList];

    await salesDBManager.add(finalSalesDbManager);
    await cartDBManager.removeAll("CARTS");
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
                <img
                  src={item.image || "/default-image.png"}
                  alt={item.name}
                  className={styles.cartImage}
                />
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
            <button className={styles.checkoutBtn} onClick={handleBuyButton}>
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carts;
