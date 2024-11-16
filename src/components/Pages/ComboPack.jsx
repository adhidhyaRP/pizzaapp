import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Pizza.css";

const ComboPack = () => {
  const [comboPacks, setComboPacks] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKENDURL}/api/comboPacks`)
      .then((response) => {
        setComboPacks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the combo pack data!", error);
      });
  }, []);

  const handleAddToBucket = (comboPackId) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKENDURL}/api/bucket`, { itemId: comboPackId, itemType: 'ComboPack', userId })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error adding the combo pack to the bucket!", error);
      });
  };

  return (
    <div className="combo-pack-list">
      {comboPacks.map((comboPack, index) => (
        <div className="combo-pack-card" key={index}>
          <img src={comboPack.image} alt={comboPack.title} className="combo-pack-image" />
          <h3 className="combo-pack-title">{comboPack.title}</h3>
          <p className="combo-pack-description">{comboPack.description}</p>
          <p className="combo-pack-price">₹{comboPack.price}</p>
          <button 
            className="add-to-bucket-btn"
            onClick={() => handleAddToBucket(comboPack._id)}
          >
            Add to Bucket
          </button>
        </div>
      ))}
    </div>
  );
};

export default ComboPack;
