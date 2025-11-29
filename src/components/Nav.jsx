import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import styles from "./Nav.module.css";
import logo from "./Screenshot_2025-02-05_101645-removebg-preview.png";

const Nav = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    navigate(`/?search=${encodeURIComponent(e.target.value)}`);
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.NavLogo}>
          <img src={logo} alt="Logo" />
        </div>

        <div className={styles.NavSearch}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search..."
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <button className={styles.NavToggle} onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`${styles.NavBar} ${isOpen ? styles.active : ""}`}>
          <li>
            <NavLink
              to="/"
              style={({ isActive }) => ({ color: isActive ? "red" : "" })}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Inventory"
              style={({ isActive }) => ({ color: isActive ? "red" : "" })}
            >
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customers"
              style={({ isActive }) => ({ color: isActive ? "red" : "" })}
            >
              My Sales
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Carts"
              style={({ isActive }) => ({ color: isActive ? "red" : "" })}
            >
              Carts
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
