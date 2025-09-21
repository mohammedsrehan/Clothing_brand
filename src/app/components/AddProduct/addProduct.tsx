"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  MenuItem,
} from "@mui/material";
import styles from "./addProduct.module.css";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/app/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid'; // v4 is for creating unique IDs

interface Product {
  collectionName: string;
  productName: string;
  price: number;
  size: string;
  description: string;
  top: string;
  bottom: string;
  dupatta: string;
  images: string[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const addProductToDB = async (data: Omit<Product, "images">, files: File[]) => {
  try {
     // 1. Upload images to Cloudinary via the API route
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const result = await response.json();
    const imageUrls = result.urls;
    // 2. Save product data along with image URLs to Firestore
    const docRef = await addDoc(collection(db, "products"), {
      ...data,
      images: imageUrls,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const AddProduct = () => {
  const [product, setProduct] = useState<Product>({
    collectionName: "",
    productName: "",
    price: 0,
    size: "",
    description: "",
    top: "",
    bottom: "",
    dupatta: "",
    images: [],
  });

  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: ["price"].includes(name) ? Number(value) : value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }
    setMessage("Uploading...");
    try {
      await addProductToDB(product, files);
      console.log("Product data:", product);
      setMessage("Product added successfully!");
      setProduct({
        collectionName: "",
        productName: "",
        price: 0,
        size: "",
        description: "",
        top: "",
        bottom: "",
        dupatta: "",
        images: [],
      });
      setFiles([]);
    } catch (error) {
      console.error("Error adding product: ", error);
      setMessage("Error adding product. Please try again.");
    }
  };

  return (
    <Container className={styles.container} maxWidth="sm">
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Add New Product
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Collection Name"
            name="collectionName"
            value={product.collectionName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
            inputProps={{ min: "0", step: "0.01" }}
          />
          <TextField
            fullWidth
            margin="normal"
            select
            label="Size"
            name="size"
            value={product.size}
            onChange={handleChange}
            required
          >
            {sizes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Description of Product Details"
            name="description"
            multiline
            rows={4}
            value={product.description}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Top Fabric Details"
            name="top"
            value={product.top}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Fabric Details"
            name="bottom"
            value={product.bottom}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Dupatta Fabric Details"
            name="dupatta"
            value={product.dupatta}
            onChange={handleChange}
            required
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Product Images
            </Typography>
            <input type="file" multiple onChange={handleFileChange} />         
            {files.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected {files.length} file(s).
              </Typography>
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Product
          </Button>
          {message && (
            <Typography variant="body1" align="center" color="success.main">
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;
