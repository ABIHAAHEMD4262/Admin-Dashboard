"use client";

import { client } from "@/sanity/lib/client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { FaUserCircle, FaTrashAlt, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image"; // Import the Image component

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  total: number;
  orderDate: string;
  status: string;
  city: string;
  cartItems: {
    product: {
      _id: string;
      name: string;
      image: {
        asset: {
          _ref: string;
        };
      };
    };
    quantity: number;
    price: number;
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
 

  // Fetch orders from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"] {
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          zipCode,
          total,
          city,
          orderDate,
          status,
          cartItems[] {
            product->{
              _id,
              name,
              image
            },
            quantity,
            price
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("Error fetching orders:", error));
  }, []);

  // Toggle order details visibility
  const handleOrderClick = (orderId: string) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  // Check user authentication and role
  useEffect(() => {
    if (isSignedIn && user) {
      setIsUserLoaded(true);
      if (user.primaryEmailAddress?.emailAddress === "abihaahmed413@gmail.com") {
        setIsAuthorized(true); // User is authorized
      } else {
        setIsAuthorized(false); // User is not authorized
      }
    }
  }, [isSignedIn, user]);

  // Redirect unauthorized users
  useEffect(() => {
    if (isUserLoaded && !isAuthorized) {
      router.replace("/");
    }
  }, [isUserLoaded, isAuthorized, router]);

  // Filter orders based on status
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  // Delete an order
  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error); // Log the error
      Swal.fire("Error", "Failed to delete the order.", "error");
    }
  };

  // Update order status
  const handleStatus = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire(
        "Updated!",
        `Order status changed to ${newStatus}.`,
        "success"
      );
    } catch (error) {
      console.error("Error updating order status:", error); // Log the error
      Swal.fire("Error", "Failed to update order status.", "error");
    }
  };

  // Mock data for graph
  const graphData = [
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length },
    { name: "Success", value: orders.filter((o) => o.status === "success").length },
    { name: "Dispatched", value: orders.filter((o) => o.status === "dispatch").length },
  ];

  if (!isUserLoaded) return <p>Loading...</p>;
  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <FaUserCircle className="mr-2" /> Admin Dashboard
        </h2>
        <div className="flex space-x-4">
          {["All", "pending", "success", "dispatch"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === status
                  ? "bg-white text-red-600 font-bold"
                  : "text-white hover:bg-red-700"
              }`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <SignedIn>
            <SignOutButton />
          </SignedIn>
        </div>
      </nav>

      {/* Graph */}
      <div className="p-1">
        <h3 className="text-xl font-bold mb-4">Order Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={graphData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Table */}
      <div className="flex-1 p-6 overflow-y-auto text-red-600">
        <h2 className="text-2xl font-bold text-center mb-6">Orders</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-red-600">ID</th>
                <th className="px-6 py-3 text-left text-red-600">Customer</th>
                <th className="px-6 py-3 text-left text-red-600">Total</th>
                <th className="px-6 py-3 text-left text-red-600">Status</th>
                <th className="px-6 py-3 text-left text-red-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50 transition-all cursor-pointer" onClick={() => handleOrderClick(order._id)}>
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatus(order._id, e.target.value)
                        }
                        className="bg-gray-100 p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="success">Success</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <FaCheckCircle
                        className="text-green-600 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleStatus(order._id, "success")}
                      />
                      <FaTrashAlt
                        className="text-red-600 cursor-pointer hover:scale-110 transition"
                        onClick={() => handleDelete(order._id)}
                      />
                      <span>
                        {selectedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </td>
                  </tr>
                  {selectedOrder === order._id && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 p-4">
                        <h3 className="font-bold mb-2">Order Details</h3>
                        <p>
                          Phone: <strong>{order.phone}</strong>
                        </p>
                        <p>
                          Email: <strong>{order.email}</strong>
                        </p>
                        <p>
                          City: <strong>{order.city}</strong>
                        </p>
                        <p>
                          Address: <strong>{order.address}</strong>
                        </p>
                        <h4 className="font-bold mt-4">Cart Items:</h4>
                        <ul>
                          {order.cartItems.map((item) => (
                            <li key={item.product._id} className="mt-2">
                              <div className="flex items-center space-x-4">
                                {/* Product Image */}
                                {item.product.image && (
                                  <Image
                                    src={urlFor(item.product.image).url()} // Generate image URL
                                    alt={item.product.name}
                                    width={64} // Set width
                                    height={64} // Set height
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />

                                )}
        

                                <div>
                                  <p>Product: {item.product.name}</p>
                                  <p>Quantity: {item.quantity}</p>
                                  <p>Price: ${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}