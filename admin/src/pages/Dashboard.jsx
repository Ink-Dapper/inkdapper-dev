import React, { useContext, useEffect, useState } from 'react'
import OrderTable from '../components/OrderTable'
import { ShopContext } from '../context/ShopContext'

const Dashboard = ({ token }) => {
  const { orders } = useContext(ShopContext);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    returned: 0
  });

  useEffect(() => {
    if (orders) {
      const stats = {
        total: orders.length,
        pending: orders.filter(order => order.status !== "Delivered" && order.returnOrderStatus === "Order Placed").length,
        delivered: orders.filter(order => order.status === "Delivered").length,
        returned: orders.filter(order => order.returnOrderStatus === "Return Confirmed").length
      };
      setOrderStats(stats);
    }
  }, [orders]);

  return (
    <div className='relative'>
      <h1 className='font-semibold mt-3 text-2xl mb-3'>Dashboard</h1>

      {/* Order Statistics Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <h3 className='text-gray-500 text-sm'>Total Orders</h3>
          <p className='text-2xl font-bold text-gray-800'>{orderStats.total}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <h3 className='text-gray-500 text-sm'>Pending Orders</h3>
          <p className='text-2xl font-bold text-yellow-600'>{orderStats.pending}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <h3 className='text-gray-500 text-sm'>Delivered Orders</h3>
          <p className='text-2xl font-bold text-green-600'>{orderStats.delivered}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <h3 className='text-gray-500 text-sm'>Returned Orders</h3>
          <p className='text-2xl font-bold text-red-600'>{orderStats.returned}</p>
        </div>
      </div>

      <div className='inline-flex gap-2 items-center mb-3'>
        <h2 className='font-medium text-lg'>Order Details</h2>
        <p className='w-10 sm:w-14 h-[1px] sm:h-[2px] bg-gray-700'></p>
      </div>
      <OrderTable token={token} />
    </div>
  )
}

export default Dashboard