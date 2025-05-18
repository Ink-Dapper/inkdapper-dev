import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      const filteredProducts = products.filter(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item._id !== currentProductId // Exclude the current product
      );
      setRelated(filteredProducts.slice(0, 4)); // Limit to 4 products
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="my-8 md:my-12 lg:my-24">
      <div className="text-center text-xl md:text-2xl lg:text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-col-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
            soldout={item.soldout}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;