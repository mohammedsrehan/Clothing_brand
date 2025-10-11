import Image from "next/legacy/image";
import React from "react";
import styles from "./product.module.css";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";

interface ProductProps {
  product: {
    id: string;
    collectionName: string;
    productName: string;
    price: number;
    images: string[];
  };
}

const Product = ({ product }: ProductProps) => {
  return (
    <Link href={`/products/${product.id}`} passHref>
      <div className={styles.product}>
        <div className={styles.image_container}>
          <Image
            layout="fill"
            src={product.images[0] || "/landing_image.svg"}
            alt="Classic Shirt"
            objectFit="cover"
            // width={180}
            // height={220}
          />
        </div>
        <div className={styles.product_details}>
          <p>{product.collectionName}</p>
          <h3>{product.productName}</h3>
          <p>{product.price} Rs</p>
        </div>
        <div className={styles.product_actions}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddShoppingCartIcon />}
            sx={{ color: "black" }}
          >
            Add to Cart
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddShoppingCartIcon />}
            sx={{ color: "#fff", backgroundColor: "#4A9782" }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default Product;
