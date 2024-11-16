import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pizza.css";

const Pizza = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKENDURL}/api/pizzas`)
      .then((response) => {
        setPizzas(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the pizza data!", error);
      });
  }, []);

  const addToBucket = (pizzaId) => {
    const userId = localStorage.getItem('userId'); // Get user ID from local storage

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKENDURL}/api/bucket`, { itemId: pizzaId, itemType: 'Pizza', userId })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error adding the pizza to the bucket!", error);
      });
  };

  return (
    <div className="pizza-list">
      {pizzas.map((pizza, index) => (
        <div className="pizza-card" key={index}>
          <img src={pizza.image} alt={pizza.title} className="pizza-image" />
          <h3 className="pizza-title">{pizza.title}</h3>
          <p className="pizza-description">{pizza.description}</p>
          <p className="pizza-calories">{pizza.calories} Calories</p>
          <p className="pizza-price">₹{pizza.price}</p>
          <button className="add-to-bucket-btn" onClick={() => addToBucket(pizza._id)}>
            Add to Bucket
          </button>
        </div>
      ))}
    </div>
  );
};

export default Pizza;
