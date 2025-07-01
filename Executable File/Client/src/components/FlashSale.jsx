import React from 'react';
import '../styles/FlashSale.css';

const FlashSale = () => {
  return (
    <div className="flashSaleContainer">
      <h3>Flash Sale</h3>
      <div className="flashSale-body">
        {Array(6).fill(0).map((_, i) => (
          <div className="flashSaleCard" key={i}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGnbY9YlH663xUNGHOe0lS9n-zSwrLtiEFVw&usqp=CAU"
              alt="Flash Sale Item"
            />
            <div className="flashSaleCard-data">
              <h6>Product title</h6>
              <p>Description about product</p>
              <h5>30% off</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
