import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from 'react-bootstrap';
import './Addtobucket.css'

const Addtobucket = () => {
  const [bucketItems, setBucketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [confirmation,setconfirmation] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKENDURL}/api/bucket/${userId}`)
      .then((response) => {
        setBucketItems(response.data);

        const total = response.data.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
        setTotalPrice(total);
      })
      .catch((error) => {
        console.error("There was an error fetching the bucket items!", error);
      });
  }, []);

  const handleRemoveFromBucket = (itemId) => {
    const userId = localStorage.getItem('userId');

    axios
      .delete(`${import.meta.env.VITE_BACKENDURL}/api/bucket/${userId}/${itemId}`)
      .then((response) => {
        const updatedItems = bucketItems.filter(item => item._id !== itemId);
        setBucketItems(updatedItems);

        const newTotal = updatedItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
        setTotalPrice(newTotal);
      })
      .catch((error) => {
        console.error("There was an error removing the item from the bucket!", error);
      });
  };

  const handleOrderNow = () => {
    setShowModal(true);
  };

  const handlePayment = () => {
    const userId = localStorage.getItem('userId');
    const itemIds = bucketItems.map(item => item._id); // Get item IDs from bucket items
    
    axios.post(`${import.meta.env.VITE_BACKENDURL}/api/payment/order`, {
      userId,
      address,
      amount: totalPrice * 100, // Razorpay expects the amount in paise
      items: itemIds // Send item IDs
    })
    .then((response) => {
      const { amount, id: order_id, currency } = response.data;
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order_id,
        handler: function (response) {
          // On payment success, update the payment status
          axios.post(`${import.meta.env.VITE_BACKENDURL}/api/payment/success`, {
            orderId: order_id,
            paymentId: response.razorpay_payment_id,
            status: 'paid',
          })
          .then(() => {
            // Clear the bucket items
            axios.delete(`${import.meta.env.VITE_BACKENDURL}/api/bucket/${userId}`)
              .then(() => {
                alert('Payment successful and bucket cleared!');
                setBucketItems([]);
                setTotalPrice(0);
                setShowModal(false);

              })
              .catch((error) => {
                console.error('Error clearing the bucket', error);
              });
          })
          .catch((error) => {
            console.error('Error updating payment status', error);
          });
        },
        prefill: {
          name: "Your Name",
          email: "your.email@example.com",
          contact: "9999999999"
        },
        notes: {
          address: address, // Include address from the form
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const paymentObject = new window.Razorpay(options); // Use Razorpay from window
      paymentObject.open();
    })
    .catch((error) => {
      console.error("There was an error creating the Razorpay order!", error);
    });
  };
  

  return (
    <div className="container-list-vary">
    <div className="bucket-list">
      {bucketItems.map((item, index) => (
        <div className="bucket-item" key={index}>
          <img src={item.item.image} alt={item.item.title} className="bucket-image" />
          <div className="flex-box">
          <h3 className="bucket-title">{item.item.title}</h3>
          <p className="bucket-quantity">Quantity: {item.quantity}</p>
          <p className="bucket-price">Price: ₹{item.item.price * item.quantity}</p>
          <button className="remove-from-bucket-btn" onClick={() => handleRemoveFromBucket(item._id)}>
            Remove from Bucket
          </button>
          </div>
        </div>
      ))}
        </div>
     
      <div className="total-price">

        <h2>Total Price: ₹{totalPrice}</h2>
     
      <button onClick={handleOrderNow}>ORDER NOW</button>
      </div>
      {/* Address Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    
      
    </div>
  );
};

export default Addtobucket;
