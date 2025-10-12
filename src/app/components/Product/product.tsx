// src/app/components/Product/product.tsx (Modified)

import Image from "next/legacy/image";
import React from "react";
import styles from "./product.module.css";
import { Button, Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";
import { useDispatch } from "react-redux"; // Import useDispatch
import { addToCart } from "@/app/store/cartSlice"; // Adjust path as necessary
import { useState } from "react"; // Import useState

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
  const dispatch = useDispatch();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product details page
    e.stopPropagation(); // Stop propagation of the click event

    dispatch(
      addToCart({
        id: product.id,
        collectionName: product.collectionName,
        productName: product.productName,
        price: product.price,
        image: product.images[0] || "/landing_image.svg",
        size: "N/A", // Default options for quick add from list
        color: "N/A", // Default options for quick add from list
      })
    );
    setOpenSnackbar(true);
  };
  
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Link href={`/products/${product.id}`} passHref>
        <div className={styles.product}>
          <div className={styles.image_container}>
            <Image
              layout="fill"
              src={product.images[0] || "/landing_image.svg"}
              alt="Classic Shirt"
              objectFit="cover"
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
              onClick={handleAddToCart} // Add the handler here
            >
              Add to Cart
            </Button>
            {/* <Button
              size="small"
              variant="contained"
              // Removed duplicate AddShoppingCartIcon from Buy Now, usually it's just a Purchase button
              sx={{ color: "#fff", backgroundColor: "#4A9782" }}
            >
              Buy Now
            </Button> */}
          </div>
        </div>
      </Link>
       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {product.productName} added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Product;