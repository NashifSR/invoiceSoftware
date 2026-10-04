"use client";

import { useState } from "react";
import axios from "axios";

// Toggle between local and production endpoint here:
// const API_URL = "http://localhost:5000/api/payment/init";
const API_URL = "https://myunifiedserver.onrender.com/api/payment/init";

const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initPayment = async ({ items, customer }) => {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Payment items are required.");
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(API_URL, {
        items,
        customer,
      });

      return response.data;
    } catch (err) {
      console.error("INIT PAYMENT ERROR:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initPayment,
    loading,
    error,
  };
};

export default usePayment;