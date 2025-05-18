import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

    const {products} = useContext(ShopContext)
    const [bestSeller, setBestSeller] = useState([])

    useEffect(() => {
            const bestProduct = products.filter((items) => items.bestseller);
            setBestSeller(bestProduct.slice(0,4));
    }, [products]);

  return (
    <div className='my-4 md:my-10'>
        <div className="text-center py-8 text-3xl">
            <Title text1={'BEST'} text2={'SELLER'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            <span className='font-medium'>Fan Favorites You Can't Miss : </span>Our best-selling pieces are the proof that style and comfort go hand in hand. From custom creations to everyday essentials, these items have won the hearts of the Ink Dapper community. Check out what everyone's loving!
            </p>
        </div>

        {/* {Rendering Products} */}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6 ">
            {
                bestSeller.map((item, index) =>{
                    return (
                        <ProductItem 
                            key={index}  
                            id={item._id} 
                            image={item.image} 
                            name={item.name} 
                            price={item.price} 
                            beforePrice={item.beforePrice} 
                            bestseller={item.bestSeller}
                            soldout={item.soldout}
                        />
                    )
                })
            }
        </div>
    </div>
  )
}

export default BestSeller