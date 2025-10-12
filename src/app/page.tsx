"use client";
import Image from "next/legacy/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import Product from "./components/Product/product";
import Navbar from "./components/Navbar/navbar";
// import { FaShoppingCart, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

const collections = [
  {
    name: "Pakistani Dresses",
    image: "/pakistani_dress.png",
  },
  {
    name: "Indian Dresses",
    image: "/indian_dress.png",
  },
  {
    name: "Sarees",
    image: "/saree_dress.png",
  },
];

export default function LandingPage() {
  const [data, setData] = useState<any[]>([]);
  const getProducts = async () => {
    // This function would typically fetch products from your database
    const querySnapshot = await getDocs(collection(db, "products"));
    const fetchedData: any[] = [];
    querySnapshot.forEach((doc) => {
      // setData =
      fetchedData.push({ id: doc.id, ...doc.data() });
    });
    setData(fetchedData);
    console.log(fetchedData);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Elevate Your Style!</h1>
          <p>
            Bismillah Collection Presents the latest trends in fashion with
            Quality, Comfort, and Confidence.
          </p>
          <button className={styles.shopNowButton}>Shop Now</button>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/landing_image.png"
            alt="Model"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>
      </section>

      {/* Our Collections Section */}
      <section className={styles.collectionsSection}>
        <h2 className={styles.sectionTitle}>Our Collections</h2>
        <div className={styles.collectionsGrid}>
          {collections.map((collection, index) => (
            <div key={index} className={styles.collectionCard}>
              <div className={styles.collectionImage}>
                <Image
                  src={collection.image}
                  alt={collection.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <h3>{collection.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.featuredProductsSection}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {data.length === 0 ? (
            <p>No products found</p>
          ) : (
            data.map((product) => (
              <Product key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>©2025 Bismillah Collection. All rights reserved.</p>
      </footer>
    </div>
  );
}
