import React, { useEffect, useState } from 'react';
import '../../styles/NewProducts.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    mainImg: '',
    carouselImgs: ['', '', ''],
    sizes: [],
    gender: '',
    category: '',
    newCategory: '',
    price: 0,
    discount: 0
  });

  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:6001/fetch-product-details/${id}`);
      setProduct({
        name: data.title,
        description: data.description,
        mainImg: data.mainImg,
        carouselImgs: data.carousel,
        sizes: data.sizes,
        gender: data.gender,
        category: data.category,
        price: data.price,
        discount: data.discount
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  // Fetch available categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:6001/fetch-categories');
      setAvailableCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  // Handle checkbox changes for sizes
  const handleSizeChange = (size) => {
    setProduct((prevProduct) => {
      const sizes = prevProduct.sizes.includes(size)
        ? prevProduct.sizes.filter((s) => s !== size)
        : [...prevProduct.sizes, size];
      return { ...prevProduct, sizes };
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  // Handle updating product
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:6001/update-product/${id}`, {
        title: product.name,
        description: product.description,
        mainImg: product.mainImg,
        carousel: product.carouselImgs,
        sizes: product.sizes,
        gender: product.gender,
        category: product.category,
        newCategory: product.newCategory,
        price: product.price,
        discount: product.discount
      });
      alert('Product updated successfully!');
      navigate('/all-products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>Update Product</h3>
        <div className="new-product-body">
          {/* Product Name and Description */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            <label>Product Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
            <label>Product Description</label>
          </div>

          {/* Main Image */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              name="mainImg"
              value={product.mainImg}
              onChange={handleChange}
            />
            <label>Thumbnail Img URL</label>
          </div>

          {/* Carousel Images */}
          {['carouselImgs[0]', 'carouselImgs[1]', 'carouselImgs[2]'].map((img, index) => (
            <div key={index} className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name={img}
                value={product.carouselImgs[index]}
                onChange={handleChange}
              />
              <label>{`Add-on Image ${index + 1} URL`}</label>
            </div>
          ))}

          {/* Available Sizes */}
          <section>
            <h4>Available Sizes</h4>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <div className="form-check" key={size}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={size}
                  checked={product.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                <label className="form-check-label">{size}</label>
              </div>
            ))}
          </section>

          {/* Gender */}
          <section>
            <h4>Gender</h4>
            {['Men', 'Women', 'Unisex'].map((gender) => (
              <div className="form-check" key={gender}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={product.gender === gender}
                  onChange={handleChange}
                />
                <label className="form-check-label">{gender}</label>
              </div>
            ))}
          </section>

          {/* Category */}
          <div className="form-floating mb-3">
            <select
              className="form-select"
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="">Choose Product Category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new category">New Category</option>
            </select>
            <label>Category</label>
          </div>

          {/* New Category */}
          {product.category === 'new category' && (
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="newCategory"
                value={product.newCategory}
                onChange={handleChange}
              />
              <label>New Category</label>
            </div>
          )}

          {/* Price and Discount */}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
            <label>Price</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control"
              name="discount"
              value={product.discount}
              onChange={handleChange}
            />
            <label>Discount (%)</label>
          </div>

          {/* Update Button */}
          <button className="btn btn-primary" onClick={handleUpdateProduct}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
