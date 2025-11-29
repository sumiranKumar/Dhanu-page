import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styles from "./Home.module.css";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { inventoryDBManager, cartDBManager } from "./db/dbManager";

const Home = () => {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedItemData, setSelectedItemData] = useState({});
  const [currentSlide, setCurrentSlide] = useState({});

  // Fullscreen modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItemId, setModalItemId] = useState(null);
  const [modalSlide, setModalSlide] = useState(0);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const inventoryData = async () => {
      const allItems = await inventoryDBManager.getAll();
      const filtered = allItems.map(({ id, name, desc, images, color }) => ({
        id,
        name,
        desc,
        images: images || [],
        color,
      }));
      setItems(filtered);

      const allCart = await cartDBManager.getAll();
      setCartItems(allCart);
    };
    inventoryData();
  }, []);

  const refreshCartData = async () => {
    const allCart = await cartDBManager.getAll();
    setCartItems(allCart);
  };

  const handleColorChange = (itemId, color) => {
    setSelectedColor((prev) => ({ ...prev, [itemId]: color }));
    const size = selectedSize[itemId];
    const item = items.find((it) => it.id === itemId);
    if (size && item?.color[color]?.[size]) {
      const { price, quantity } = item.color[color][size];
      setSelectedItemData((prev) => ({
        ...prev,
        [itemId]: { price, quantity },
      }));
    }
  };

  const handleSizeChange = (itemId, size) => {
    setSelectedSize((prev) => ({ ...prev, [itemId]: size }));
    const color = selectedColor[itemId];
    const item = items.find((it) => it.id === itemId);
    if (color && item?.color[color]?.[size]) {
      const { price, quantity } = item.color[color][size];
      setSelectedItemData((prev) => ({
        ...prev,
        [itemId]: { price, quantity },
      }));
    }
  };

  const handleOnClick = async (id) => {
    const color = selectedColor[id];
    const size = selectedSize[id];
    if (!color || !size) return;
    const selectedItem = await inventoryDBManager.get(id);
    if (!selectedItem) return;

    const existing = (await cartDBManager.getAll()).find(
      (i) =>
        i.productId === id &&
        i.selectedColor === color &&
        i.selectedSize === size
    );

    if (existing) {
      await cartDBManager.update({
        ...existing,
        quantity: existing.quantity + 1,
      });
    } else {
      const newItem = {
        productId: selectedItem.id,
        name: selectedItem.name,
        desc: selectedItem.desc,
        quantity: 1,
        selectedColor: color,
        selectedSize: size,
        price: selectedItemData[id]?.price,
      };
      await cartDBManager.add(newItem);
    }
    await refreshCartData();
    alert("Item added to cart");
  };

  const handleCartQuntityIncrease = async (id, color, size) => {
    const existing = cartItems.find(
      (i) =>
        i.productId === id &&
        i.selectedColor === color &&
        i.selectedSize === size
    );
    if (existing) {
      await cartDBManager.update({
        ...existing,
        quantity: existing.quantity + 1,
      });
      await refreshCartData();
    }
  };

  const handleCartQuntityDecrease = async (id, color, size) => {
    const existing = cartItems.find(
      (i) =>
        i.productId === id &&
        i.selectedColor === color &&
        i.selectedSize === size
    );
    if (existing && existing.quantity > 1) {
      await cartDBManager.update({
        ...existing,
        quantity: existing.quantity - 1,
      });
    } else if (existing && existing.quantity === 1) {
      await cartDBManager.delete(existing.id);
    }
    await refreshCartData();
  };

  const getCartQuantity = (id, color, size) => {
    const found = cartItems.find(
      (i) =>
        i.productId === id &&
        i.selectedColor === color &&
        i.selectedSize === size
    );
    return found ? found.quantity : 0;
  };

  const prevSlide = (itemId) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [itemId]:
        (prev[itemId] || 0) - 1 < 0
          ? (items.find((it) => it.id === itemId)?.images?.length || 1) - 1
          : (prev[itemId] || 0) - 1,
    }));
  };

  const nextSlide = (itemId) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [itemId]:
        (prev[itemId] || 0) + 1 >=
        (items.find((it) => it.id === itemId)?.images?.length || 1)
          ? 0
          : (prev[itemId] || 0) + 1,
    }));
  };

  const openModal = (itemId, index) => {
    setModalItemId(itemId);
    setModalSlide(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const modalPrev = () => {
    const images = items.find((i) => i.id === modalItemId)?.images || [];
    setModalSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const modalNext = () => {
    const images = items.find((i) => i.id === modalItemId)?.images || [];
    setModalSlide((prev) => (prev + 1) % images.length);
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <hr />
      <div className={styles.allCards}>
        {filteredItems.map((item) => {
          const imageCount = item.images?.length || 0;
          return (
            <div key={item.id} className={styles.Cards}>
              <div className={styles.sliderContainer}>
                {/* Show buttons only if more than 1 image */}
                {imageCount > 1 && (
                  <button onClick={() => prevSlide(item.id)}>❮</button>
                )}

                <img
                  src={
                    imageCount > 0
                      ? item.images[currentSlide[item.id] || 0] instanceof File
                        ? URL.createObjectURL(
                            item.images[currentSlide[item.id] || 0]
                          )
                        : item.images[currentSlide[item.id] || 0]
                      : "/placeholder.png"
                  }
                  alt={item.name}
                  className={styles.sliderImage}
                  onClick={() => openModal(item.id, currentSlide[item.id] || 0)}
                />

                {imageCount > 1 && (
                  <button onClick={() => nextSlide(item.id)}>❯</button>
                )}

                <p className={styles.indicator}>
                  {imageCount > 0 ? (currentSlide[item.id] || 0) + 1 : 0}/
                  {imageCount}
                </p>
              </div>

              <div className={styles.description}>
                <h1>{item.name}</h1>
                <h3>{item.desc}</h3>

                <p>
                  Color:{" "}
                  {Object.keys(item.color).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(item.id, color)}
                      className={`${styles.colorButton} ${
                        selectedColor[item.id] === color
                          ? styles.selectedButton
                          : ""
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </p>

                <p>
                  Size:{" "}
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(item.id, size)}
                      className={`${styles.sizeButton} ${
                        selectedSize[item.id] === size
                          ? styles.selectedButton
                          : ""
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </p>

                {selectedColor[item.id] && selectedSize[item.id] && (
                  <p>Price: Rs {selectedItemData[item.id]?.price || "00"}</p>
                )}

                <button
                  className={styles.BTN}
                  onClick={() => handleOnClick(item.id)}
                  disabled={!selectedColor[item.id] || !selectedSize[item.id]}
                >
                  <MdOutlineShoppingCartCheckout /> Add To Cart
                </button>

                {selectedColor[item.id] && selectedSize[item.id] && (
                  <>
                    <button
                      onClick={() =>
                        handleCartQuntityDecrease(
                          item.id,
                          selectedColor[item.id],
                          selectedSize[item.id]
                        )
                      }
                    >
                      -
                    </button>

                    <span>
                      {getCartQuantity(
                        item.id,
                        selectedColor[item.id],
                        selectedSize[item.id]
                      )}
                    </span>

                    <button
                      onClick={() =>
                        handleCartQuntityIncrease(
                          item.id,
                          selectedColor[item.id],
                          selectedSize[item.id]
                        )
                      }
                    >
                      +
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for fullscreen slider */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalPrev} onClick={modalPrev}>
              ❮
            </button>
            <img
              src={
                items.find((i) => i.id === modalItemId)?.images[
                  modalSlide
                ] instanceof File
                  ? URL.createObjectURL(
                      items.find((i) => i.id === modalItemId)?.images[
                        modalSlide
                      ]
                    )
                  : items.find((i) => i.id === modalItemId)?.images[modalSlide]
              }
              alt="Fullscreen"
              className={styles.modalImage}
            />
            <button className={styles.modalNext} onClick={modalNext}>
              ❯
            </button>
            <span className={styles.modalClose} onClick={closeModal}>
              ×
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
