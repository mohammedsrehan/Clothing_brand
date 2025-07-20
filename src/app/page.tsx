import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "./components/Navbar/navbar";
import Product from "./components/Product/product";

export default function Home() {
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
              Bismillah Collection Presents the latest trends in fashion with Quality, Comfort, and
              Confidence.
            </p>
            <a href="#shop" className={styles.shop_button}>
              Shop Now
            </a>
          </div>
        </section>
        <section id="shop" className={styles.featured}>
          <h2>Featured Products</h2>
          <div className={styles.featured_products}>
            <Product />
            <Product/>
            <Product/>
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
