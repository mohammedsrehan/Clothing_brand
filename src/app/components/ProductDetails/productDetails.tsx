"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./productDetails.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

interface ProductDetailsProps {
    collectionName: string;
    productName: string;
    price: number;
    description: string;
    top: string;
    bottom: string;
    dupatta: string;
    images: string[]; 
}

const ProductDetails = () => {
  const params = useParams();
  const productId = params.id;

  const [size, setSize] = useState("");
  const [product, setProduct] = useState<ProductDetailsProps | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (productId) {
      const getProduct = async () => {
        const docRef = doc(db, "products", productId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct(docSnap.data() as ProductDetailsProps);
          console.log("Product data:", docSnap.data());
        } else {
          console.log("No such document!");
          setProduct(null);
        }
        setLoading(false);
      };
      getProduct();
    }
  }, [productId]);

  const handleChange = (event: SelectChangeEvent) => {
    setSize(event.target.value);
  };
  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  if (!product) {
    return <Typography variant="h5">Product not found.</Typography>;
  }
  
  return (
    <div className={styles.product_details}>
      <div className={styles.image_container}>
        <div className={styles.image_list}>
          {product.images.map((image, index) => (
            <div key={index} className={styles.image_item}>
              <Image
                fill
                objectFit="cover"
                src={image}
                alt={`${product.productName} thumbnail ${index + 1}`}
              />
            </div>
          ))}
          
        </div>
        <div className={styles.image_main}>
          <Image
            fill
            objectFit="cover"
            src={product.images[0]}
            alt={product.productName}
            className={styles.brandLogo}
          />
        </div>
      </div>
      <div className={styles.product_details_content}>
        <p>{product.collectionName}</p>
        <h1>{product.productName}</h1>
        <p className={styles.price}>{product.price} Rs</p>
        <p>Color: Red</p>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Size</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={size}
            label="Size"
            onChange={handleChange}
          >
            <MenuItem value={10}>Small</MenuItem>
            <MenuItem value={20}>Medium</MenuItem>
            <MenuItem value={30}>Large</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<AddShoppingCartIcon />}
          sx={{ color: "black" }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddShoppingCartIcon />}
          sx={{ color: "black" }}
        >
          Buy Now
        </Button>
        <div className={styles.description}>
          <h3>Product Details</h3>
          <p>
            {product.description}
          </p>
          <p>
            <b>Top:</b> {product.top}
          </p>
          <p>
            <b>Bottom:</b> {product.bottom}
          </p>
          <p>
            <b>Dupatta:</b> {product.dupatta}
          </p>
        </div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">Shipping & Returns</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductDetails;
