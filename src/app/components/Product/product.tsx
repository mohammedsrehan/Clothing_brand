import Image from "next/image";
import React from "react";
import styles from "./product.module.css";
import { Button } from "@mui/material";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const Product = () => {
  return (
    <div className={styles.product}>
      <div className={styles.image_container}>
        <Image
          fill
          src="/landing_image.svg"
          alt="Classic Shirt"
          objectFit="cover"
          // width={180}
          // height={220}
        />
      </div>
      <div className={styles.product_details}>
        <p>Name of the Collection</p>
        <h3>Classic Shirt</h3>
        <p>$39.99</p>
      </div>
      <div className={styles.product_actions}>
        <Button size="small" variant="outlined" startIcon={<AddShoppingCartIcon />} sx={{color: "black"}}>
          Add to Cart
        </Button>
        <Button size="small" variant="contained" startIcon={<AddShoppingCartIcon />} sx={{color: "#fff", backgroundColor: "#4A9782"}}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default Product;
