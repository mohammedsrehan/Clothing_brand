"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./productDetails.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, IconButton } from "@mui/material";
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
  size: string[];
  colorOptions: string[];
}

// Utility function to map color names to simple hex codes for display.
const getColorCode = (colorName: string): string => {
  const lowerName = colorName.toLowerCase();

  // HIGHLIGHT: Simplified mapping logic to handle partial matches more robustly.
  // This allows "bright red" to match "red", for example.
  if (lowerName.includes("red")) return "#EF4444";
  if (lowerName.includes("blue")) return "#3B82F6";
  if (lowerName.includes("green")) return "#10B981";
  if (lowerName.includes("teal")) return "#008080"; // Added mapping for 'teal'
  if (lowerName.includes("yellow")) return "#F59E0B";
  if (lowerName.includes("black")) return "#000000";
  if (lowerName.includes("white")) return "#F3F4F6";
  if (lowerName.includes("pink")) return "#EC4899";

  // HIGHLIGHT: Default color for unrecognized names (e.g., 'purple', 'neon green')
  return "#6B7280"; // Returns a neutral gray as a fallback
};

const ProductDetails = () => {
  const params = useParams();
  const productId = params.id;

  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [product, setProduct] = useState<ProductDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    if (productId) {
      const getProduct = async () => {
        const docRef = doc(db, "products", productId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data() as ProductDetailsProps;
          setProduct(productData);
          // Set the first image as the main image
          if (productData.images && productData.images.length > 0) {
            setMainImage(productData.images[0]);
          }
          console.log("Product data:", productData);
        } else {
          console.log("No such document!");
          setProduct(null);
        }
        setLoading(false);
      };
      getProduct();
    }
  }, [productId]);

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    console.log("Selected Color:", selectedColor);
  };

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
    <div className={styles.product_details_container}>
      <div className={styles.product_image_gallery}>
        <div className={styles.image_thumbnails}>
          {product.images.map((image, index) => (
            <div
              key={index}
              className={styles.thumbnail_item}
              onClick={() => setMainImage(image)}
            >
              <Image
                fill
                objectFit="contain"
                src={image}
                alt={`${product.productName} thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <div className={styles.main_image}>
          <Image
            fill
            objectFit="cover"
            src={mainImage}
            alt={product.productName}
          />
        </div>
      </div>
      <div className={styles.product_info}>
        <div className={styles.product_header}>
          <p className={styles.collection_name}>{product.collectionName}</p>
          <h1 className={styles.product_name}>{product.productName}</h1>
          <p className={styles.price}>Rs {product.price}</p>
        </div>

        <div className={styles.options_section}>
          <div className={styles.option_item}>
            {/* <p>Color: <span className={styles.option_value}>Red</span></p> */}
            <Typography
              variant="subtitle1"
              component="p"
              sx={{ mb: 1, fontWeight: 500 }}
            >
              Color:
              <Box
                component="span"
                sx={{ fontWeight: 700, ml: 1, textTransform: "capitalize" }}
              >
                {color || "Select Color"}
              </Box>
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {product.colorOptions.map((optionColor) => {
                const colorCode = getColorCode(optionColor);
                const isSelected = optionColor === color;

                return (
                  <Box key={optionColor} sx={{ textAlign: "center" }}>
                    <IconButton
                      onClick={() => handleColorSelect(optionColor)}
                      sx={{
                        width: 32, // Square width
                        height: 32, // Square height
                        borderRadius: "4px", // Square shape with rounded corners
                        // HIGHLIGHT: Simple border for selection
                        border: isSelected
                          ? `2px solid #000`
                          : "1px solid #ccc",
                        padding: 0.5,
                        backgroundColor: "transparent",
                        transition: "border 0.2s",
                        "&:hover": {
                          backgroundColor: "transparent",
                          border: isSelected
                            ? `2px solid #000`
                            : `1px solid ${colorCode}`, // Subtle hover effect
                        },
                      }}
                    >
                      {/* The colored swatch inside the button */}
                      <Box
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "2px", // Match outer corner radius
                          backgroundColor: colorCode,
                          // Optionally add a subtle inner ring for white colors against white background
                          border:
                            colorCode === "#F3F4F6" ? "1px solid #ccc" : "none",
                        }}
                      />
                    </IconButton>
                    {/* Display the color name below the swatch (optional) */}
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textTransform: "capitalize",
                        fontSize: "0.65rem",
                        mt: 0.5,
                        color: isSelected ? "#000" : "#666",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {optionColor}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </div>
          <div className={styles.option_item}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="size-select-label">Size</InputLabel>
              <Select
                labelId="size-select-label"
                id="size-select"
                value={size}
                label="Size"
                onChange={handleChange}
              >
                {product.size.map((availableSizes) => (
                  <MenuItem key={availableSizes} value={availableSizes}>
                    {availableSizes}
                  </MenuItem>
                ))}
                {/* <MenuItem value={"Small"}>Small</MenuItem>
                                <MenuItem value={"Medium"}>Medium</MenuItem>
                                <MenuItem value={"Large"}>Large</MenuItem> */}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.action_buttons}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "black",
              "&:hover": { backgroundColor: "#333" },
            }}
            startIcon={<AddShoppingCartIcon />}
          >
            Add to Cart
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              borderColor: "black",
              "&:hover": { borderColor: "#333" },
            }}
          >
            Buy Now
          </Button>
        </div>

        <div className={styles.description}>
          <h3>Product Details</h3>
          <p>{product.description}</p>
          <ul>
            <li>
              <b>Top:</b> {product.top}
            </li>
            <li>
              <b>Bottom:</b> {product.bottom}
            </li>
            <li>
              <b>Dupatta:</b> {product.dupatta}
            </li>
          </ul>
        </div>

        <Accordion className={styles.info_accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="shipping-panel-content"
            id="shipping-panel-header"
          >
            <Typography>Shipping & Returns</Typography>
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
