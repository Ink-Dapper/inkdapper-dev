import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

const OrderTable = ({ token }) => {

  const [orders, setOrders] = useState([]);
  const [serialIndex, setSerialIndex] = useState(1);
  const [sliceSection, setSliceSection] = useState([]);
  const [sliceSectionNext, setSliceSectionNext] = useState(10);
  const [filter, setFilter] = useState('All'); // State for filter option
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date


  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      // Handle error
    }
  }

  const tableSlice = () => {
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      const isWithinDateRange = (!startDate || orderDate >= new Date(startDate)) && (!endDate || orderDate <= new Date(endDate));
      return (filter === 'All' || order.status === filter) && isWithinDateRange;
    });

    const start = Math.max(0, sliceSectionNext - 10);
    const end = Math.min(sliceSectionNext, filteredOrders.length);
    setSliceSection(filteredOrders.slice(start, end));
  };

  useEffect(() => {
    tableSlice();
  }, [orders, sliceSectionNext, filter, startDate, endDate]);

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className='order-table-container'>
      {/* Filter Section */}
      <div className='flex mb-4 gap-2'>
        <div className='mb-4 flex flex-col gap-2'>
          <label className='mr-2'>Filter by Status:</label>
          <FormControl sx={{ m: 0, width: 200 }} size="small">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Order Placed">Order Placed</MenuItem>
              <MenuItem value="Packing">Packing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Out for delivery">Out for delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* Date Filter Section */}
        <div className='mb-4 flex flex-col gap-2'>
          <label className='mr-2'>Filter by Start Date:</label>
          <TextField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true, }} sx={{ width: 200 }} />
        </div>
        <div className='mb-4 flex flex-col gap-2'>
          <label className='mr-2'>Filter by End Date:</label>
          <TextField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true, }} sx={{ width: 200 }} />
        </div>
      </div>

      <div className='order-details-table overflow-auto pr-4'>
        <div className='w-[1300px] overflow-hidden'>
          <div className='grid grid-cols-1 sm:grid-cols-[0.2fr_0.6fr_0.8fr_1.5fr_0.8fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] lg:grid-cols-[0.2fr_0.6fr_0.8fr_1.5fr_0.8fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-3 items-start justify-items-center border-2 border-gray-200 p-2 px-4 md:p-2 md:px-4 my-3 md:my-2 text-xs sm:text-sm text-white bg-gray-500'>
            <p className='font-medium'>S.No</p>
            <p className='font-medium'>Image</p>
            <p className='font-medium'>First Name</p>
            <p className='font-medium'>Email Address</p>
            <p className='font-medium'>Phone Number</p>
            <p className='font-medium'>Placed Order</p>
            <p className='font-medium'>Delivered Date</p>
            <p className='font-medium'>Order Quantity</p>
            <p className='font-medium'>Delivery Status</p>
            <p className='font-medium'>Amount</p>
          </div>
          {
            sliceSection.map((order, index) => {
              const firstItem = order.items[0] || {}
              const imgSrc = firstItem.isCustom
                ? (firstItem.reviewImageCustom || firstItem.aiDesignUrl || '')
                : (Array.isArray(firstItem.image) ? firstItem.image[0] : firstItem.image || '')
              return (
                <div key={order._id} className='grid grid-cols-1 sm:grid-cols-[0.2fr_0.6fr_0.8fr_1.5fr_0.8fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] lg:grid-cols-[0.2fr_0.6fr_0.8fr_1.5fr_0.8fr_1fr_0.8fr_0.8fr_0.8fr_0.5fr] gap-3 items-center justify-items-center py-3 px-2 border-2 text-sm mb-2'>
                  <p>{sliceSectionNext - 10 + index + 1}</p>
                  <div>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={firstItem.name || 'Product'}
                        className='w-12 h-12 object-cover rounded-md border border-gray-200'
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className='w-12 h-12 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs'>N/A</div>
                    )}
                  </div>
                  <p>{order.address.firstName}</p>
                  <p><a href={`mailto:${order.address.email}`}>{order.address.email}</a></p>
                  <p><a href={`tel:${order.address.phone}`}>{order.address.phone}</a></p>
                  <p>{new Date(order.date).toDateString()}</p>
                  <p>{new Date(order.deliveryDate ? order.deliveryDate : order.status).toDateString()}</p>
                  <p>{firstItem.quantity}</p>
                  <p>{order.status}</p>
                  <p>{firstItem.price * firstItem.quantity} {currency}</p>
                </div>
              )
            })
          }
        </div>
      </div>

      {/* Summary and Pagination Section */}
      <div className='mt-6 space-y-4'>
        {/* Summary Stats */}
        <div className='w-full border p-4 bg-slate-100 rounded-lg'>
          <div className='font-medium flex gap-8 justify-end'>
            <div className='flex gap-1'>
              <p>Total Quantity : </p>
              <p className='font-semibold'>{orders.reduce((acc, order) => acc + order.items[0].quantity, 0)}</p>
            </div>
            <div className='flex gap-1'>
              <p>Total Amount : </p>
              <p className='font-semibold'><span>{currency}</span> {orders.reduce((acc, order) => acc + order.amount, 0)}</p>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className='flex justify-center items-center gap-4'>
          <button
            onClick={() => setSliceSectionNext(sliceSectionNext - 10)}
            className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors ${sliceSectionNext <= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={sliceSectionNext <= 10}>
            Previous
          </button>

          <span className='text-sm text-gray-600'>
            Page {Math.ceil(sliceSectionNext / 10)} of {Math.ceil(orders.length / 10)}
          </span>

          <button
            onClick={() => setSliceSectionNext(sliceSectionNext + 10)}
            className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors ${sliceSection.length < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={sliceSection.length < 10}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderTable;