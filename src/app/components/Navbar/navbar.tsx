"use client";

import Image from "next/legacy/image";
import styles from "./navbar.module.css";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";

interface NavbarProps {
  onOpenCart: () => void;
}

const Navbar = ({ onOpenCart }: NavbarProps) => {
  const cartItemCount = useSelector((state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Image src="/logo.png" alt="Brand Logo" width={200} height={100} />
      </div>
      <div className={styles.navbar_links}>
        <a href="#shop">Featured</a>
        <a href="#shop">Shop</a>
        <a href="/about">About</a>
        <a href="/about">Contact</a>
      </div>
      <div>
        <IconButton onClick={onOpenCart} sx={{ p: 0 }}>
          <Badge
            badgeContent={cartItemCount} // Use the dynamic cart count
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              ".MuiBadge-badge": {
                top: 5,
                right: 5,
                padding: "0 4px",
                height: 18,
                minWidth: 18,
                fontSize: "0.75rem",
              },
            }}
          >
            <ShoppingCartIcon fontSize="medium" sx={{ color: "#000" }} />
          </Badge>
        </IconButton>
      </div>
    </nav>
  );
};

export default Navbar;
