"use client";
import React from "react";
import Image from "next/legacy/image";
import { Button, Box, Typography, Paper, Stack } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/firebase";

interface AdminProductCardProps {
  product: any;
  onEdit: (id: string) => void;
  onDeleteComplete?: () => void;
}

const AdminProductCard = ({ product, onEdit, onDeleteComplete }: AdminProductCardProps) => {
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${product.productName}?`)) return;
    await deleteDoc(doc(db, "products", product.id));
    if (onDeleteComplete) onDeleteComplete();
  };

  return (
    <Paper sx={{ p: 2, m: 1, display: "flex", gap: 2, alignItems: "center" }}>
      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        <Image
          layout="fill"
          src={product.images[0] || "/placeholder.png"}
          alt={product.productName}
          objectFit="cover"
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{product.productName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.collectionName}
        </Typography>
        <Typography variant="body2">{product.price} Rs</Typography>
      </Box>
      <Stack spacing={1}>
        <Button
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => onEdit(product.id)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    </Paper>
  );
};

export default AdminProductCard;
