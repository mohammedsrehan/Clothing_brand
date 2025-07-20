"use client";
import React, { useState } from "react";
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
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductDetails = () => {
  const [size, setSize] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSize(event.target.value);
  };
  return (
    <div className={styles.product_details}>
      <div className={styles.image_container}>
        <div className={styles.image_list}>
          <div className={styles.image_item}>
            <Image
              fill
              objectFit="cover"
              src="/landing_image.svg"
              alt="Landing image"
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.image_item}>
            <Image
              fill
              objectFit="cover"
              src="/landing_image.svg"
              alt="Landing image"
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.image_item}>
            <Image
              fill
              objectFit="cover"
              src="/landing_image.svg"
              alt="Landing image"
              className={styles.brandLogo}
            />
          </div>
        </div>
        <div className={styles.image_main}>
          <Image
            fill
            objectFit="cover"
            src="/landing_image.svg"
            alt="Landing image"
            className={styles.brandLogo}
          />
        </div>
      </div>
      <div className={styles.product_details_content}>
        <p>Name of the collection</p>
        <h1>Product Name</h1>
        <p className={styles.price}>$39.99</p>
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
        <Button variant="outlined" startIcon={<AddShoppingCartIcon />} sx={{color: "black"}}>
          Add to Cart
        </Button>{" "}
        <div className={styles.description}>
          <h3>Product Details</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            dolores explicabo non earum architecto totam asperiores, quos
            dolorem? Fuga, iste.
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
