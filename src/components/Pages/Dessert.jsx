import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pizza.css";

const Dessert = () => {
  const [desserts, setDesserts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKENDURL}/api/desserts`)
      .then((response) => {
        setDesserts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the dessert data!", error);
      });
  }, []);

  const addToBucket = (dessertId) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKENDURL}/api/bucket`, { itemId: dessertId, itemType: 'Dessert', userId })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error adding the dessert to the bucket!", error);
      });
  };

  return (
    <div className="dessert-list">
      {desserts.map((dessert, index) => (
        <div className="dessert-card" key={index}>
          <img src={dessert.image} alt={dessert.title} className="dessert-image" />
          <h3 className="dessert-title">{dessert.title}</h3>
          <p className="dessert-description">{dessert.description}</p>
          <p className="dessert-price">₹{dessert.price}</p>
          <button className="add-to-bucket-btn" onClick={() => addToBucket(dessert._id)}>
            Add to Bucket
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dessert;
