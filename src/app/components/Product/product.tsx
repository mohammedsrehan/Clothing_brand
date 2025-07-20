import Image from "next/image";
import React from "react";
import styles from "./product.module.css";
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
    </div>
  );
};

export default Product;
