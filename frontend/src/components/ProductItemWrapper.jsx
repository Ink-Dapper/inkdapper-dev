import React, { memo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ProductItem from './ProductItem';

const ProductItemWrapper = (props) => {
  return (
    <ErrorBoundary>
      <ProductItem {...props} />
    </ErrorBoundary>
  );
};

export default memo(ProductItemWrapper);
