import Image from "next/image";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Image src="/globe.svg" alt="Brand Logo" width={50} height={50} />
        <h1>Clothing Brand</h1>
      </div>
      <div className={styles.navbar_links}>
        <a href="#cart">Featured</a>
        <a href="#shop">Shop</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
