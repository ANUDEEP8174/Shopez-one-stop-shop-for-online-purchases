import React, { useContext, useEffect, useState } from 'react';
import '../../styles/IndividualProduct.css';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const IndividualProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const { fetchCartCount } = useContext(GeneralContext);

  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    mainImg: '',
    carouselImgs: ['', '', ''],
    sizes: [],
    price: 0,
    discount: 0,
  });

  const [productQuantity, setProductQuantity] = useState(1);
  const [size, setSize] = useState('');
  const [checkoutDetails, setCheckoutDetails] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    pincode: '',
    paymentMethod: '',
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:6001/fetch-product-details/${id}`);
      setProductDetails({
        name: data.title,
        description: data.description,
        mainImg: data.mainImg,
        carouselImgs: data.carousel,
        sizes: data.sizes,
        price: data.price,
        discount: data.discount,
      });
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  };

  const buyNow = async () => {
    try {
      const response = await axios.post('http://localhost:6001/buy-product', {
        userId,
        ...checkoutDetails,
        title: productDetails.name,
        description: productDetails.description,
        mainImg: productDetails.mainImg,
        size,
        quantity: productQuantity,
        price: productDetails.price,
        discount: productDetails.discount,
        orderDate: new Date(),
      });
      alert('Order placed!');
      navigate('/profile');
    } catch (err) {
      alert("Order failed!!");
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post('http://localhost:6001/add-to-cart', {
        userId,
        title: productDetails.name,
        description: productDetails.description,
        mainImg: productDetails.mainImg,
        size,
        quantity: productQuantity,
        price: productDetails.price,
        discount: productDetails.discount,
      });
      alert("Product added to cart!");
      navigate('/cart');
    } catch (err) {
      alert("Operation failed!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (checkoutDetails.hasOwnProperty(name)) {
      setCheckoutDetails((prev) => ({ ...prev, [name]: value }));
    } else {
      setProductDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="IndividualProduct-page">
      <span onClick={() => navigate('')}>
        <HiOutlineArrowSmLeft />
        <p>Back</p>
      </span>

      <div className="IndividualProduct-body">
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {productDetails.carouselImgs.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner">
            {productDetails.carouselImgs.map((img, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img src={img} className="d-block w-100" alt={`carousel-img-${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="IndividualProduct-data">
          <h3>{productDetails.name}</h3>
          <p>{productDetails.description}</p>

          <span>
            <label htmlFor="productSize">Choose size</label>
            <select name="productSize" id="productSize" value={size} onChange={handleChange}>
              <option value="">Select size</option>
              {productDetails.sizes.map((sizeOption) => (
                <option key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </option>
              ))}
            </select>
          </span>

          <span>
            <label htmlFor="productQuantity">Quantity</label>
            <select
              name="productQuantity"
              id="productQuantity"
              value={productQuantity}
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6].map((qty) => (
                <option key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>
          </span>

          <span>
            <h5><b>Price: </b>&#8377; {parseInt(productDetails.price - (productDetails.price * productDetails.discount) / 100)}</h5>
            <s>{productDetails.price}</s>
            <p>({productDetails.discount}% off)</p>
          </span>

          <h6><b>Rating:</b> 3.4/5</h6>
          <p className="delivery-date">Free delivery in 5 days</p>

          <div className="productBuyingButtons">
            <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
              Buy now
            </button>
            <button onClick={handleAddToCart}>Add to cart</button>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Checkout</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="checkout-address">
                <h4>Details</h4>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput1"
                    value={checkoutDetails.name}
                    name="name"
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInput1">Name</label>
                </div>

                <section>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput3"
                      value={checkoutDetails.mobile}
                      name="mobile"
                      onChange={handleChange}
                    />
                    <label htmlFor="floatingInput3">Mobile</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput2"
                      value={checkoutDetails.email}
                      name="email"
                      onChange={handleChange}
                    />
                    <label htmlFor="floatingInput2">Email</label>
                  </div>
                </section>

                <section>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput6"
                      value={checkoutDetails.address}
                      name="address"
                      onChange={handleChange}
                    />
                    <label htmlFor="floatingInput6">Address</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInput7"
                      value={checkoutDetails.pincode}
                      name="pincode"
                      onChange={handleChange}
                    />
                    <label htmlFor="floatingInput7">Pincode</label>
                  </div>
                </section>
              </div>

              <div className="checkout-payment-method">
                <h4>Payment method</h4>
                <div className="form-floating mb-3">
                  <select
                    className="form-select form-select-md mb-3"
                    id="floatingInput8"
                    value={checkoutDetails.paymentMethod}
                    name="paymentMethod"
                    onChange={handleChange}
                  >
                    <option value="">Choose Payment method</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="card">Card Payments</option>
                    <option value="upi">UPI</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={buyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualProduct;
