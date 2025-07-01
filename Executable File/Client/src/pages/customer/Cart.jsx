import React, { useEffect, useState } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!userId) return;
    try {
      const res = await axios.get('http://localhost:6001/fetch-cart');
      const userItems = res.data.filter(item => item.userId === userId).reverse();
      setCartItems(userItems);
    } catch (err) {
      console.error('Failed to fetch cart items:', err);
    }
  };

  const increaseCartQuantity = async (id) => {
    try {
      await axios.put('http://localhost:6001/increase-cart-quantity', { id });
      fetchCart();
    } catch (err) {
      console.error('Failed to increase quantity');
    }
  };

  const decreaseCartQuantity = async (id, quantity) => {
    if (quantity <= 1) return;
    try {
      await axios.put('http://localhost:6001/decrease-cart-quantity', { id });
      fetchCart();
    } catch (err) {
      console.error('Failed to decrease quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.put('http://localhost:6001/remove-item', { id });
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item');
    }
  };

  const calculateTotalPrice = () => {
    const price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount) / 100) * item.quantity, 0);

    setTotalPrice(price);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(price > 1000 || cartItems.length === 0 ? 0 : 50);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const placeOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      await axios.post('http://localhost:6001/place-cart-order', {
        userId,
        name,
        mobile,
        email,
        address,
        pincode,
        paymentMethod,
        orderDate: new Date()
      });
      alert('Order placed!');
      navigate('/profile');
      setName('');
      setMobile('');
      setEmail('');
      setAddress('');
      setPincode('');
      setPaymentMethod('');
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  return (
    <div className="cartPage">
      <div className="cartContents">
        {cartItems.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20vh' }}>Cart is empty...</p>
        ) : (
          cartItems.map((item) => (
            <div className="cartItem" key={item._id}>
              <img src={item.mainImg} alt={item.title} />
              <div className="cartItem-data">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div className="cartItem-inputs">
                  <span><p><strong>Size:</strong> {item.size}</p></span>
                  <span><p><strong>Quantity:</strong> {item.quantity}</p></span>
                </div>
                <span>
                  <h5>
                    <strong>Price:</strong> ₹{parseInt(item.price - (item.price * item.discount) / 100) * item.quantity}
                  </h5>
                </span>
                <div className="cartItem-actions">
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => increaseCartQuantity(item._id)}>+</button>
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => decreaseCartQuantity(item._id, item.quantity)}>-</button>
                  <button className="btn btn-sm btn-danger" onClick={() => removeItem(item._id)}>Remove</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pricing */}
      <div className="cartPriceBody">
        <h4>Price Details</h4>
        <span><strong>Total MRP:</strong> <p>₹{totalPrice}</p></span>
        <span><strong>Discount:</strong> <p style={{ color: 'green' }}>- ₹{totalDiscount}</p></span>
        <span><strong>Delivery Charges:</strong> <p style={{ color: 'red' }}>+ ₹{deliveryCharges}</p></span>
        <hr />
        <h5><strong>Final Price:</strong> ₹{totalPrice - totalDiscount + deliveryCharges}</h5>
        <button data-bs-toggle="modal" data-bs-target="#checkoutModal">Place order</button>
      </div>

      {/* Modal */}
      <div className="modal fade" id="checkoutModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="checkoutModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="checkoutModalLabel">Checkout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="checkout-address">
                <h4>Checkout Details</h4>

                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} />
                  <label htmlFor="nameInput">Name</label>
                </div>

                <section>
                  <div className="form-floating mb-3 span-child-2">
                    <input type="text" className="form-control" id="mobileInput" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    <label htmlFor="mobileInput">Mobile</label>
                  </div>
                  <div className="form-floating mb-3 span-child-1">
                    <input type="text" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="emailInput">Email</label>
                  </div>
                </section>

                <section>
                  <div className="form-floating mb-3 span-child-1">
                    <input type="text" className="form-control" id="addressInput" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <label htmlFor="addressInput">Address</label>
                  </div>
                  <div className="form-floating mb-3 span-child-2">
                    <input type="text" className="form-control" id="pincodeInput" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                    <label htmlFor="pincodeInput">Pincode</label>
                  </div>
                </section>
              </div>

              <div className="checkout-payment-method">
                <h4>Payment Method</h4>
                <div className="form-floating mb-3">
                  <select className="form-select" id="paymentSelect" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="">Choose payment method</option>
                    <option value="netbanking">Netbanking</option>
                    <option value="card">Card Payments</option>
                    <option value="upi">UPI</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                  <label htmlFor="paymentSelect">Payment Method</label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={placeOrder}>Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
