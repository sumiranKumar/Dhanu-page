import "./App.css";
import Nav from "./components/Nav";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Inventory from "./components/Inventory";
import Carts from "./components/Cart";

import { useCallback, useEffect, useState } from "react";
import { inventoryDBManager } from "./db/dbManager";
import Sales from "./components/sales";

let timer;
const debounce = (func, delay) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    func();
  }, delay);
};

const PAGE_SIZE = 3;

function App() {
  const [item, setItem] = useState([]);
  const [page, setPage] = useState(1);
  const [loadedItems, setLoadedItems] = useState(1);

  const addItems = (newItems) => {
    setItem([...item, newItems]);
  };

  const getData = () => {
    inventoryDBManager.getAll(page, PAGE_SIZE).then((res) => {
      setItem((prev) => [...prev, ...res]);
      setLoadedItems(page);
    });
  };

  // useEffect((page) => {
  //   getData(page);

  // }, []);

  useEffect(() => {
    debounce(getData, 30);
  }, [page]);

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const viewHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;

    if (
      loadedItems + 1 > page &&
      scrollTop + viewHeight >= scrollHeight - 300
    ) {
      setPage((page) => page + 1);
    }
  });

  const delteItem = async (id) => {
    await inventoryDBManager.removeById(id);
    setItem((prev) => prev.filter((product) => product.id !== id));
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Nav />
          <Home item={item}></Home>
        </>
      ),
    },
    {
      path: "/Carts",
      element: (
        <>
          <Nav />
          <Carts></Carts>
        </>
      ),
    },
    {
      path: "/Inventory",
      element: (
        <>
          <Nav />
          <Inventory
            addItems={addItems}
            delteItem={delteItem}
            item={item}
          ></Inventory>
        </>
      ),
    },
    {
      path: "/customers",
      element: (
        <>
          <Nav />
          <Sales></Sales>
        </>
      ),
    },
  ]);

  return (
    <div className="Body" onScroll={handleScroll}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
