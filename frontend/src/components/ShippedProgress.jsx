import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { assets } from '../assets/assets'

const ShippedProgress = () => {

  const { backendUrl, token, currency } = useContext(ShopContext)

  const [orderDataOne, setOrderDataOne] = useState([])

  const [orderLoadingOne, setOrderLoadingOne] = useState(20)
  const [orderLoadingTwo] = useState(40)
  const [orderLoadingThree] = useState(60)
  const [orderLoadingFour] = useState(80)
  const [orderLoadingFive] = useState(100)

  const loadOrderDataOne = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/user-orders',{},{headers:{token}})
      console.log(response.data)
      if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map ((item, index) => {
          allOrdersItem.push(item)
        })
        setOrderDataOne(allOrdersItem)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    loadOrderDataOne()
  },[])

  return (
    <div>
      <h3>Shipped</h3>
      {
        orderDataOne.map((item, index) => (
          <div key={index}>
            <div className="h-1 w-80 bg-neutral-200 dark:bg-slate-300 top-4">
              <div className=' relative'>
                <span className='absolute top-[-30px] -left-4'><img src={assets.shopping_icon} alt="" className='w-6' /></span>
                <span className={`absolute top-[-30px] left-[52px] `}><img src={assets.order_placed} alt="" className='w-6' /></span>
                <span className={`absolute top-[-30px] left-[115px] `}><img src={assets.packing_icon} alt="" className='w-6' /></span>
                <span className={`absolute top-[-30px] left-[180px] `}><img src={assets.shipped_icon} alt="" className='w-6' /></span>
                <span className={`absolute top-[-30px] left-[242px] `}><img src={assets.out_for_delivery_icon} alt="" className='w-6' /></span>
                <span className={`absolute top-[-30px] right-[-10px] `}><img src={assets.delivered_icon} alt="" className='w-6' /></span>
              </div>
              <div className="h-1 bg-orange-600" style={{
                width: `${item.status === 'Order placed' ? orderLoadingOne :
                    item.status === 'Packing' ? orderLoadingTwo :
                      item.status === 'Shipped' ? orderLoadingThree :
                        item.status === 'Out for delivery' ? orderLoadingFour :
                          item.status === 'Delivered' ? orderLoadingFive : orderLoadingOne
                  }%`
              }}>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ShippedProgress