"use client"
import React, { useState } from 'react';
interface Product {
    name: string;
    price: number;
    description: string;
    image: string;
}

const AddProduct = () => {
    const [product, setProduct] = useState<Product>({
        name: '',
        price: 0,
        description: '',
        image: '',
    });

    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the product to your backend API
        setMessage('Product added successfully!');
        setProduct({
            name: '',
            price: 0,
            description: '',
            image: '',
        });
    };

    return (
        <div>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        name="price"
                        type="number"
                        value={product.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        name="image"
                        value={product.image}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddProduct;