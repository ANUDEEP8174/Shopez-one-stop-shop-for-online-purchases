import React from 'react';
import '../styles/Footer.css';

const Footer = () => (
  <footer className="Footer">
    <h4>@ShopEZ - One Destination for all your needs...</h4>
    <div className="footer-body">
      {[
        ['Home', 'Categories', 'All products'],
        ['Cart', 'Profile', 'Orders'],
        ['Electronics', 'Mobiles', 'Laptops'],
        ['Fashion', 'Grocery', 'Sports'],
      ].map((group, idx) => (
        <ul key={idx}>
          {group.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
    <div className="footer-bottom">
      <p>@ ShopEZ.com - All rights reserved</p>
    </div>
  </footer>
);

export default Footer;
