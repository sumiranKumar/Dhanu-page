import { useState } from "react";
import styles from "./sales.module.css";
import { salesDBManager } from "../db/dbManager";

const Sales = () => {
  const [date, setDate] = useState("");
  const [filterType, setFilterType] = useState("date");
  const [salesData, setSalesData] = useState([]);

  const fetchSales = async () => {
    return await salesDBManager.getAll();
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilterType(value);

    if (value === "date") return;

    let days = 0;
    if (value === "week") days = 7;
    if (value === "month") days = 30;
    if (value === "year") days = 365;

    const allSales = await fetchSales();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = allSales.filter((sale) => {
      const saleDate = new Date(sale.date);
      saleDate.setHours(0, 0, 0, 0);

      const diffDays = (today - saleDate) / (1000 * 60 * 60 * 24);

      return diffDays >= 0 && diffDays <= days;
    });

    setSalesData(filtered);
  };

  const handleSearchByDate = async () => {
    if (!date) return;

    const allSales = await fetchSales();

    const filtered = allSales.filter((sale) => {
      return sale.date === date;
    });

    setSalesData(filtered);
  };

  const calculateTotals = () => {
    let totalQuantity = 0;
    let totalAmount = 0;

    salesData.forEach((sale) => {
      sale.items.forEach((item) => {
        totalQuantity += item.quantity;
        totalAmount += item.quantity * item.price;
      });
    });

    return { totalQuantity, totalAmount };
  };

  const { totalQuantity, totalAmount } = calculateTotals();

  return (
    <>
      <h1 className={styles.DataStoreHeader}>Sales</h1>

      <div className={styles.inputRow}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={filterType !== "date"}
        />

        <select
          value={filterType}
          onChange={handleFilterChange}
          className={styles.filterDropdown}
        >
          <option value="date">Select by Date</option>
          <option value="week">Last 1 Week</option>
          <option value="month">Last 1 Month</option>
          <option value="year">Last 1 Year</option>
        </select>

        <button
          className={styles.searchBtn}
          onClick={handleSearchByDate}
          disabled={filterType !== "date"}
        >
          Search
        </button>
      </div>

      <div className={styles.salesContainer}>
        {salesData.length === 0 ? (
          <p>No sales found.</p>
        ) : (
          <>
            {salesData.map((sale, index) => {
              return (
                <div key={index} className={styles.salesCard}>
                  <h3>Date: {sale.date}</h3>

                  {sale.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <p>
                        <strong>{item.name}</strong>
                      </p>
                      <p>Color: {item.selectedColor}</p>
                      <p>Size: {item.selectedSize}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs {item.price}</p>
                    </div>
                  ))}
                </div>
              );
            })}

            <div className={styles.totalDayBox}>
              <h3>Total Summary</h3>
              <p>
                <strong>Total Items Sold:</strong> {totalQuantity}
              </p>
              <p>
                <strong>Total Amount Collected:</strong> Rs {totalAmount}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sales;
