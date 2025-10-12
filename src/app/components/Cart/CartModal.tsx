"use client";

import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { removeFromCart, clearCart, CartItem } from '@/app/store/cartSlice';
import {
  Drawer,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// PDF dependencies (html2canvas, jsPDF) removed as the file attachment is not supported
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Phone number where orders will be confirmed (Example: +919876543210 for India)
// Replace with your actual WhatsApp business number, including the country code without '+'
const WHATSAPP_NUMBER = "918686821897"; 

// Utility function to format the order details into a clean text message
const formatOrderForWhatsapp = (items: CartItem[], total: number): string => {
    let message = "Hi Bismillah Collection, I would like to place an order with the following details:\n\n";

    items.forEach((item, index) => {
        message += `${index + 1}. ${item.productName} (Qty: ${item.quantity})\n`;
        message += `   - Price: Rs ${item.price} each\n`;
        // Include selected options if available
        if (item.size && item.size !== "N/A") {
            message += `   - Size: ${item.size}\n`;
        }
        if (item.color && item.color !== "N/A") {
            message += `   - Color: ${item.color}\n`;
        }
    });

    message += `\n*Total Order Value: Rs ${total}*\n\n`;
    message += "Please confirm availability and the final amount including shipping. Thank you!";

    // URL encode the message content
    return encodeURIComponent(message);
}


const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  // cartRef is no longer needed since we aren't generating a PDF
  // const cartRef = useRef<HTMLDivElement>(null); 

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (id: string, size: string | null, color: string | null) => {
    dispatch(removeFromCart({ id, size, color }));
  };

  // Renamed function to reflect its new sole purpose: initiating WhatsApp chat
  const confirmOrderViaWhatsapp = async () => {
    if (cartItems.length === 0) return;
    
    // NOTE: Direct file attachment is not possible via the wa.me link. 
    // We send a structured text summary instead.
    
    // 1. Format the order message
    const whatsappMessage = formatOrderForWhatsapp(cartItems, totalAmount);

    // 2. Construct the WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    // 3. Open the chat in a new tab/window
    window.open(whatsappUrl, '_blank');
    
    // Close the cart modal after submission
    onClose();
  };

  return (
    <Drawer 
      anchor="right" 
      open={isOpen} 
      onClose={onClose}
      // Set the width for responsive design
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450, md: 500 },
          boxSizing: 'border-box',
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Your Cart
        </Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <Container maxWidth="md" sx={{ p: 0 }}>
        {/* Removed ref={cartRef} since PDF generation is removed */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}> 
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Order Summary
          </Typography>

          {cartItems.length === 0 ? (
            <Alert severity="info">Your cart is empty. Add some beautiful clothes!</Alert>
          ) : (
            <List sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {cartItems.map((item, index) => (
                <React.Fragment key={`${item.id}-${item.size}-${item.color}-${index}`}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Rs {item.price * item.quantity}
                        </Typography>
                        <IconButton 
                          aria-label="delete" 
                          color="error"
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                          size="small"
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </Box>
                    }
                    sx={{ alignItems: 'flex-start' }}
                  >
                    <Box sx={{ mr: 2, position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
                        {/* Placeholder for Next.js Image component logic if needed, using simple img tag for simplicity here */}
                        <img 
                            src={item.image} 
                            alt={item.productName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </Box>
                    <ListItemText
                      primary={`${item.productName} (x${item.quantity})`}
                      secondary={
                        <Box component="span">
                            <Typography component="div" variant="body2" color="text.secondary">
                                Collection: {item.collectionName}
                            </Typography>
                            <Typography component="div" variant="body2" color="text.secondary">
                                Options: Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}
                            </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, py: 1, borderTop: '1px solid #eee' }}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Total: Rs {totalAmount}
            </Typography>
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color="success"
            sx={{ py: 1.5, fontSize: '1rem', bgcolor: '#25D366', '&:hover': { bgcolor: '#128C7E' } }}
            // Updated onClick handler to use the new function name
            onClick={confirmOrderViaWhatsapp}
            disabled={cartItems.length === 0}
            startIcon={<WhatsAppIcon />}
          >
            Confirm Order & Share via WhatsApp
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => dispatch(clearCart())}
            disabled={cartItems.length === 0}
          >
            Clear Cart
          </Button>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          *A WhatsApp chat will open with your complete order details for quick confirmation with our team.
        </Typography>
      </Container>
    </Drawer>
  );
};

export default CartModal;
