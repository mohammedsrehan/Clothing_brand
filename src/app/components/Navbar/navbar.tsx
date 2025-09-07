import Image from "next/image";
import styles from "./navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Image src="/brand_logo.png" alt="Brand Logo" width={250} height={120} />
      </div>
      <div className={styles.navbar_links}>
        <a href="#cart">Featured</a>
        <a href="#shop">Shop</a>
        <a href="/about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
