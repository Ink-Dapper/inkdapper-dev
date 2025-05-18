import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'

const LatestCollection = () => {

    const { products, scrollToTop } = useContext(ShopContext)
    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 8))
    }, [products])

    return (
        <div className='my-2 md:my-10'>
            <div className="flex flex-col items-center justify-center text-center py-8 text-2xl md:text-3xl">
                <Title text1={'LATEST'} text2={'COLLECTION'} />
                <p className='w-full md:w-3/4 mx-4 text-xs sm:text-sm md:text-base text-gray-600'>
                    <span className='font-medium'>Elevate Your Everyday :</span> Step into style with Ink Dapper's latest collection – a blend of bold designs and effortless comfort. From custom prints to oversized essentials, we've got everything to match your vibe.
                </p>
            </div>

            {/* {Rendering Products} */}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6">
                {
                    latestProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            beforePrice={item.beforePrice}
                            soldout={item.soldout}
                            subCategory={item.subCategory}
                        />
                    ))
                }
            </div>
            <div className='flex justify-center mt-8'>
                <Link to='/collection' onClick={scrollToTop}>
                    <p className='bg-gray-800 text-white py-2 px-5'>Load More...</p>
                </Link>
            </div>
        </div>
    )
}

export default LatestCollection