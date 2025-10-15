// src/app/admin/components/Product/AdminProduct.tsx

"use client";

import Image from "next/legacy/image";
import React from "react";
import styles from "./adminProduct.module.css";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

interface AdminProductProps {
  product: {
    id: string;
    collectionName: string;
    productName: string;
    price: number;
    images: string[];
  };
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}

const AdminProductCard = ({ product, onEdit, onDelete }: AdminProductProps) => {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${product.productName}?`)) return;
    await deleteDoc(doc(db, "products", product.id));
    if (onDelete) onDelete();
  };

  return (
    <div className={styles.product}>
      <div className={styles.image_container}>
        <Image
          layout="fill"
          src={product.images[0] || "/landing_image.svg"}
          alt={product.productName}
          objectFit="contain"
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
          startIcon={<EditIcon />}
          sx={{ color: "black" }}
          onClick={() => onEdit?.(product.id)}
        >
          Edit
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminProductCard;
