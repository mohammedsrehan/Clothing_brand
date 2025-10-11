import Image from "next/legacy/image";
import styles from "./navbar.module.css";
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Image
          src="/logo.png"
          alt="Brand Logo"
          width={200}
          height={100}
        />
      </div>
      <div className={styles.navbar_links}>
        <a href="#cart">Featured</a>
        <a href="#shop">Shop</a>
        <a href="/about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <div>
        <IconButton>
          <ShoppingCartIcon fontSize="medium" />
          <Badge sx={{
            top: -12,
            right: -6,
          }} badgeContent={2} color="primary" overlap="circular" />
        </IconButton>
      </div>
    </nav>
  );
};

export default Navbar;
