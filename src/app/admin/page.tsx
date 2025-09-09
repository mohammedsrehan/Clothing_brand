import React from "react";
import AddProduct from "../components/AddProduct/addProduct";

const AdminPage = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome to the admin panel. Manage your clothing brand here.</p>
            <AddProduct />
        </div>
    );
};

export default AdminPage;