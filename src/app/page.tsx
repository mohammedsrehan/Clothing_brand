"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/navbar";
import Product from "./components/Product/product";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
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
    <div className={styles.page}>
      <main className={styles.main}>
        <Navbar />
        <section className={styles.hero}>
          <div className={styles.hero_image}>
            <Image
              fill
              objectFit="cover"
              src="/landing_image.svg"
              alt="Landing image"
              // sizes="(max-width: 768px) 70vw, (max-width: 1200px) 50vw, 33vw"
              // width={200}
              // height={200}
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.hero_content}>
            <h1 className={styles.title}>Elevate Your Style</h1>
            <p className={styles.tagline}>
              Bismillah Collection Presents the latest trends in fashion with
              Quality, Comfort, and Confidence.
            </p>
            <a href="#shop" className={styles.shop_button}>
              Shop Now
            </a>
          </div>
        </section>
        <section id="shop" className={styles.featured}>
          <h2>Featured Products</h2>
          <div className={styles.featured_products}>
            {data.length === 0 ? (
              <p>No products found</p>
            ) : (
              data.map((product) => (
                <Product key={product.id} product={product} />
              ))
            )}
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Your Clothing Brand. All rights
        reserved.
      </footer>
    </div>
  );
}
