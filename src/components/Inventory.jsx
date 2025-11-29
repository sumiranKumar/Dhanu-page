import { useState } from "react";
import styles from "./inventory.module.css";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { inventoryDBManager } from "../db/dbManager";

const Inventory = ({ addItems, item, delteItem }) => {
  const [inventory, setinventory] = useState([
    {
      color: "",
      priceXS: "",
      priceS: "",
      priceM: "",
      priceL: "",
      priceXL: "",
      priceXxl: "",
      quantityXs: "",
      quantityS: "",
      quantityM: "",
      quantityL: "",
      quantityXl: "",
      quantityXxl: "",
    },
  ]);

  const [ClothName, setClothName] = useState("");
  const [desc, setdesc] = useState("");
  const [images, setImages] = useState([]);

  const handleByColorChange = (index, field, value) => {
    const updatedinventory = [...inventory];
    updatedinventory[index][field] = value;
    setinventory(updatedinventory);
  };

  const handleAddColor = () => {
    setinventory([
      ...inventory,
      {
        color: "",
        priceXS: "",
        priceS: "",
        priceM: "",
        priceL: "",
        priceXL: "",
        priceXxl: "",
        quantityXs: "",
        quantityS: "",
        quantityM: "",
        quantityL: "",
        quantityXl: "",
        quantityXxl: "",
      },
    ]);
  };

  const handleRemoveColor = (index) => {
    const updatedinventory = inventory.filter((_, i) => i !== index);
    setinventory(updatedinventory);
  };

  const handelImage = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handelItems = async (e) => {
    e.preventDefault();
    const inventorySizeTemplate = {};

    inventory.forEach((c) => {
      if (c.color) {
        inventorySizeTemplate[c.color] = {
          XS: { quantity: c.quantityXs, price: c.priceXS },
          S: { quantity: c.quantityS, price: c.priceS },
          M: { quantity: c.quantityM, price: c.priceM },
          L: { quantity: c.quantityL, price: c.priceL },
          XL: { quantity: c.quantityXl, price: c.priceXL },
          XXL: { quantity: c.quantityXxl, price: c.priceXxl },
        };
      }
    });

    const newProduct = {
      name: ClothName,
      desc,
      images,
      color: inventorySizeTemplate,
    };

    await inventoryDBManager.add(newProduct);
    addItems(newProduct);

    setClothName("");
    setinventory([{}]);
    setdesc("");
    setImages([]);
  };

  return (
    <>
      <div className={styles.formContainer}>
        <h1 className={styles.formHeader}>Add Inventory Item</h1>

        <form className={styles.form} onSubmit={handelItems}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Name</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Enter Item Name"
              value={ClothName}
              onChange={(e) => setClothName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Enter Description"
              value={desc}
              onChange={(e) => setdesc(e.target.value)}
            />
          </div>

          <div>
            <label className={styles.label}>Images</label>
            <input
              type="file"
              className={styles.inputField}
              accept="image/*"
              multiple
              onChange={handelImage}
            />
          </div>

          {inventory.map((colorBlock, index) => (
            <div key={index} className={styles.colorBlock}>
              <h3>Color {index + 1}</h3>
              <div className={styles.colorInputGroup}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Color</label>
                  <input
                    type="text"
                    className={styles.inputField}
                    placeholder="Enter Color"
                    value={colorBlock.color}
                    onChange={(e) =>
                      handleByColorChange(index, "color", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.FixedSize}>
                <label className={styles.label}>Sizes</label>
                <button type="button">XS</button>
                <button type="button">S</button>
                <button type="button">M</button>
                <button type="button">L</button>
                <button type="button">XL</button>
                <button type="button">XXL</button>
              </div>

              <div className={styles.priceGroup}>
                <label className={styles.label}>Price</label>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of XS"
                  value={colorBlock.priceXS}
                  onChange={(e) =>
                    handleByColorChange(index, "priceXS", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of S"
                  value={colorBlock.priceS}
                  onChange={(e) =>
                    handleByColorChange(index, "priceS", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of M"
                  value={colorBlock.priceM}
                  onChange={(e) =>
                    handleByColorChange(index, "priceM", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of L"
                  value={colorBlock.priceL}
                  onChange={(e) =>
                    handleByColorChange(index, "priceL", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of XL"
                  value={colorBlock.priceXL}
                  onChange={(e) =>
                    handleByColorChange(index, "priceXL", e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Price of XXL"
                  value={colorBlock.priceXxl}
                  onChange={(e) =>
                    handleByColorChange(index, "priceXxl", e.target.value)
                  }
                />
              </div>

              <div className={styles.quantityGroup}>
                <label className={styles.label}>Quantity</label>
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity XS"
                  value={colorBlock.quantityXs}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityXs", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity S"
                  value={colorBlock.quantityS}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityS", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity M"
                  value={colorBlock.quantityM}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityM", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity L"
                  value={colorBlock.quantityL}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityL", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity XL"
                  value={colorBlock.quantityXl}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityXl", e.target.value)
                  }
                />
                <input
                  type="number"
                  className={styles.inputField}
                  placeholder="Quantity XXL"
                  value={colorBlock.quantityXxl}
                  onChange={(e) =>
                    handleByColorChange(index, "quantityXxl", e.target.value)
                  }
                />
              </div>

              <hr style={{ margin: "20px 0" }} />

              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddColor}
              >
                <FaPlus />
              </button>

              {index > 0 && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveColor(index)}
                >
                  <MdDelete />
                </button>
              )}
            </div>
          ))}

          <button type="submit" className={styles.submitButton}>
            Add Item
          </button>
        </form>
      </div>

      <div className={styles.itemCard}>
        {item.map((data) =>
          Object.entries(data.color || {}).map(([colorName, sizes]) => (
            <div
              className="card cards"
              style={{
                width: "18rem",
                margin: "10px",
                background: "black",
                color: "white",
              }}
              key={data.id}
            >
              {data.images && data.images.length > 0 && (
                <div style={{ display: "flex", overflowX: "auto" }}>
                  {data.images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        marginRight: "5px",
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="card-body">
                <h5>{data.name}</h5>
                <h6>Color: {colorName}</h6>
                <p>{data.desc}</p>

                {Object.entries(sizes).map(([size, info]) => (
                  <p key={size}>
                    <strong>{size}</strong> — Qty: {info.quantity} | Price: ₹
                    {info.price}
                  </p>
                ))}

                <button
                  className={`btn btn-danger ${styles.btn}`}
                  onClick={() => delteItem(data.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Inventory;
