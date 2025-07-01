import React, { useEffect, useState } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:6001/fetch-categories');
        setAvailableCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCheckBox = (e) => {
    const { value, checked } = e.target;
    setProductSizes((prev) =>
      checked ? [...prev, value] : prev.filter((size) => size !== value)
    );
  };

  const handleNewProduct = async () => {
    try {
      const payload = {
        productName,
        productDescription,
        productMainImg,
        productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3],
        productSizes,
        productGender,
        productCategory,
        productNewCategory,
        productPrice,
        productDiscount,
      };

      await axios.post('http://localhost:6001/add-new-product', payload);
      alert('Product added successfully');

      // Reset form
      setProductName('');
      setProductDescription('');
      setProductMainImg('');
      setProductCarouselImg1('');
      setProductCarouselImg2('');
      setProductCarouselImg3('');
      setProductSizes([]);
      setProductGender('');
      setProductCategory('');
      setProductNewCategory('');
      setProductPrice(0);
      setProductDiscount(0);

      navigate('/all-products');
    } catch (err) {
      alert('Failed to add product');
      console.error(err);
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>New Product</h3>

        <div className="new-product-body">
          {/* Basic Info */}
          <span>
            <div className="form-floating mb-3 span-21">
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <label htmlFor="productName">Product Name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input
                type="text"
                className="form-control"
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              <label htmlFor="productDescription">Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="mainImg"
              value={productMainImg}
              onChange={(e) => setProductMainImg(e.target.value)}
            />
            <label htmlFor="mainImg">Thumbnail Image URL</label>
          </div>

          {/* Carousel Images */}
          <span>
            {[productCarouselImg1, productCarouselImg2, productCarouselImg3].map((img, i) => (
              <div className="form-floating mb-3 span-3" key={i}>
                <input
                  type="text"
                  className="form-control"
                  id={`carouselImg${i}`}
                  value={img}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (i === 0) setProductCarouselImg1(value);
                    if (i === 1) setProductCarouselImg2(value);
                    if (i === 2) setProductCarouselImg3(value);
                  }}
                />
                <label htmlFor={`carouselImg${i}`}>Add-on Img {i + 1} URL</label>
              </div>
            ))}
          </span>

          {/* Sizes */}
          <section>
            <h4>Available Sizes</h4>
            <span>
              {['S', 'M', 'L', 'XL'].map((size) => (
                <div className="form-check" key={size}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={size}
                    id={`size-${size}`}
                    checked={productSizes.includes(size)}
                    onChange={handleCheckBox}
                  />
                  <label className="form-check-label" htmlFor={`size-${size}`}>
                    {size}
                  </label>
                </div>
              ))}
            </span>
          </section>

          {/* Gender */}
          <section>
            <h4>Gender</h4>
            <span>
              {['Men', 'Women', 'Unisex'].map((gender) => (
                <div className="form-check" key={gender}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="productGender"
                    value={gender}
                    id={`gender-${gender}`}
                    checked={productGender === gender}
                    onChange={(e) => setProductGender(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`gender-${gender}`}>
                    {gender}
                  </label>
                </div>
              ))}
            </span>
          </section>

          {/* Category, Price, Discount */}
          <span>
            <div className="form-floating mb-3 span-3">
              <select
                className="form-select"
                id="productCategory"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="">Choose Product Category</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new category">New Category</option>
              </select>
              <label htmlFor="productCategory">Category</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <label htmlFor="productPrice">Price</label>
            </div>

            <div className="form-floating mb-3 span-3">
              <input
                type="number"
                className="form-control"
                id="productDiscount"
                value={productDiscount}
                onChange={(e) => setProductDiscount(e.target.value)}
              />
              <label htmlFor="productDiscount">Discount (%)</label>
            </div>
          </span>

          {/* New Category Input */}
          {productCategory === 'new category' && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="newCategory"
                value={productNewCategory}
                onChange={(e) => setProductNewCategory(e.target.value)}
              />
              <label htmlFor="newCategory">New Category</label>
            </div>
          )}
        </div>

        <button className="btn btn-primary" onClick={handleNewProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
