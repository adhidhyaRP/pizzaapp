import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pizza.css";

const Drink = () => {
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKENDURL}/api/drinks`)
      .then((response) => {
        setDrinks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the drink data!", error);
      });
  }, []);

  const addToBucket = (drinkId) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKENDURL}/api/bucket`, { itemId: drinkId, itemType: 'Drink', userId })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error adding the drink to the bucket!", error);
      });
  };

  return (
    <div className="drink-list">
      {drinks.map((drink, index) => (
        <div className="drink-card" key={index}>
          <img src={drink.image} alt={drink.title} className="drink-image" />
          <h3 className="drink-title">{drink.title}</h3>
          <p className="drink-description">{drink.description}</p>
          <p className="drink-price">₹{drink.price}</p>
          <button className="add-to-bucket-btn" onClick={() => addToBucket(drink._id)}>
            Add to Bucket
          </button>
        </div>
      ))}
    </div>
  );
};

export default Drink;
