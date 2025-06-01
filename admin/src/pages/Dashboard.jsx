import React, { useContext, useEffect, useState } from 'react'
import OrderTable from '../components/OrderTable'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  RotateCcw,
  IndianRupee,
  TrendingUp,
  Package,
  AlertCircle,
  Activity,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react'
import { toast } from 'react-toastify'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const { orders } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    returned: 0,
    revenue: 0,
    averageOrderValue: 0
  });

  // Placeholder data for Product Details (Pie Chart)
  const productDetailsData = [
    { name: 'Category A', value: 400, color: '#4CAF50' }, // Example product categories and values
    { name: 'Category B', value: 300, color: '#2196F3' },
    { name: 'Category C', value: 200, color: '#FF9800' },
    { name: 'Category D', value: 100, color: '#F44336' },
  ];

  // Placeholder data for Selling (Stacked Bar Chart)
  const sellingData = [
    { name: 'Jan', Product1: 20, Product2: 10, Product3: 5 }, // Example product selling data per month
    { name: 'Feb', Product1: 25, Product2: 15, Product3: 8 },
    { name: 'Mar', Product1: 22, Product2: 12, Product3: 10 },
    { name: 'Apr', Product1: 18, Product2: 10, Product3: 7 },
    { name: 'May', Product1: 30, Product2: 20, Product3: 15 },
    { name: 'Jun', Product1: 25, Product2: 18, Product3: 10 },
    { name: 'Jul', Product1: 35, Product2: 25, Product3: 20 },
    { name: 'Aug', Product1: 30, Product2: 20, Product3: 15 },
    { name: 'Sep', Product1: 20, Product2: 15, Product3: 10 },
    { name: 'Oct', Product1: 30, Product2: 20, Product3: 15 },
    { name: 'Nov', Product1: 25, Product2: 18, Product3: 12 },
    { name: 'Dec', Product1: 28, Product2: 20, Product3: 15 },
  ];

  useEffect(() => {
    if (orders) {
      try {
        // Filter out returned orders for revenue calculation
        const validOrders = orders.filter(order =>
          order.returnOrderStatus !== "Return Confirmed" &&
          order.status !== "Cancelled"
        );

        // Calculate total revenue from valid orders
        const totalRevenue = validOrders.reduce((acc, order) => {
          // Ensure we're using the correct amount field
          const orderAmount = order.totalAmount || order.amount || 0;
          return acc + Number(orderAmount);
        }, 0);

        // Calculate average order value only from valid orders
        const averageValue = validOrders.length > 0
          ? totalRevenue / validOrders.length
          : 0;

        const stats = {
          total: orders.length,
          pending: orders.filter(order =>
            order.status !== "Delivered" &&
            order.returnOrderStatus === "Order Placed" &&
            order.status !== "Cancelled"
          ).length,
          delivered: orders.filter(order =>
            order.status === "Delivered" &&
            order.returnOrderStatus !== "Return Confirmed"
          ).length,
          returned: orders.filter(order =>
            order.returnOrderStatus === "Return Confirmed"
          ).length,
          revenue: totalRevenue,
          averageOrderValue: averageValue
        };
        setOrderStats(stats);
      } catch (error) {
        toast.error('Error calculating statistics');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [orders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Packing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, isLoading, percentage }) => (
    <div className='bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 flex items-center gap-4'>
      <div style={{ width: 60, height: 60 }}>
        {isLoading ? (
          <div className='w-full h-full bg-gray-200 animate-pulse rounded-full'></div>
        ) : (
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: 'butt',

              // Text size
              textSize: '16px',

              // Colors
              pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
              textColor: '#000',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        )}
      </div>
      <div>
        <h3 className='text-gray-500 text-sm'>{title}</h3>
        {isLoading ? (
          <div className='h-8 bg-gray-200 animate-pulse rounded mt-1'></div>
        ) : (
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        )}
      </div>
    </div>
  );

  const handleNewOrder = () => {
    navigate('/orders');
    toast.info('Redirecting to Orders page');
  };

  const handleViewReports = () => {
    // Generate and download report
    try {
      const reportData = {
        totalOrders: orderStats.total,
        pendingOrders: orderStats.pending,
        deliveredOrders: orderStats.delivered,
        returnedOrders: orderStats.returned,
        totalRevenue: orderStats.revenue,
        averageOrderValue: orderStats.averageOrderValue,
        date: new Date().toLocaleDateString(),
        orders: orders?.slice(0, 10) // Include last 10 orders in report
      };

      // Create CSV content
      const csvContent = [
        // Header
        ['Dashboard Report', new Date().toLocaleDateString()],
        [],
        // Statistics
        ['Total Orders', orderStats.total],
        ['Pending Orders', orderStats.pending],
        ['Delivered Orders', orderStats.delivered],
        ['Returned Orders', orderStats.returned],
        ['Total Revenue', formatCurrency(orderStats.revenue)],
        ['Average Order Value', formatCurrency(orderStats.averageOrderValue)],
        [],
        // Recent Orders
        ['Recent Orders'],
        ['Order ID', 'Date', 'Status', 'Amount'],
        ...orders?.slice(0, 10).map(order => [
          order._id.slice(-6),
          new Date(order.createdAt).toLocaleDateString(),
          order.status,
          formatCurrency(order.totalAmount)
        ])
      ].map(row => row.join(',')).join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className='relative p-2'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-semibold text-2xl'>Dashboard Overview</h1>
        <div className='flex gap-2'>
          <button
            onClick={handleNewOrder}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Package className='w-4 h-4' />
            <span>View Orders</span>
          </button>
          <button
            onClick={handleViewReports}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
          >
            <FileText className='w-4 h-4' />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Order Statistics Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title="Total Orders"
          value={orderStats.total}
          icon={ShoppingBag}
          color="text-gray-800"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.delivered / orderStats.total) * 100) : 0}
        />
        <StatCard
          title="Pending Orders"
          value={orderStats.pending}
          icon={Clock}
          color="text-yellow-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.pending / orderStats.total) * 100) : 0}
        />
        <StatCard
          title="Delivered Orders"
          value={orderStats.delivered}
          icon={CheckCircle2}
          color="text-green-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.delivered / orderStats.total) * 100) : 0}
        />
        <StatCard
          title="Returned Orders"
          value={orderStats.returned}
          icon={RotateCcw}
          color="text-red-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.returned / orderStats.total) * 100) : 0}
        />
      </div>

      {/* Revenue Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-500 text-sm'>Total Revenue</h3>
            <IndianRupee className='w-5 h-5 text-green-600' />
          </div>
          {isLoading ? (
            <div className='h-8 bg-gray-200 animate-pulse rounded'></div>
          ) : (
            <div>
              <p className='text-2xl font-bold text-green-600'>{formatCurrency(orderStats.revenue)}</p>
              <p className='text-xs text-gray-500 mt-1'>Excluding returned and cancelled orders</p>
            </div>
          )}
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-500 text-sm'>Average Order Value</h3>
            <TrendingUp className='w-5 h-5 text-blue-600' />
          </div>
          {isLoading ? (
            <div className='h-8 bg-gray-200 animate-pulse rounded'></div>
          ) : (
            <div>
              <p className='text-2xl font-bold text-blue-600'>{formatCurrency(orderStats.averageOrderValue)}</p>
              <p className='text-xs text-gray-500 mt-1'>Based on {orderStats.total - orderStats.returned} valid orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Product Details Pie Chart */}
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
          <h2 className='font-medium text-lg mb-4'>Product Details</h2>
          <p className='text-gray-500 text-sm mb-4'>Distribution by category</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDetailsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {productDetailsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {productDetailsData.reduce((sum, entry) => sum + entry.value, 0).toLocaleString()}
              </text>
              <text x="50%" y="calc(50% + 20px)" textAnchor="middle" dominantBaseline="middle" className="text-gray-500 text-sm">
                Total Products
              </text>
            </PieChart>
          </ResponsiveContainer>
          <div className='flex justify-center mt-4 gap-6'>
            {productDetailsData.map((entry, index) => (
              <div key={`legend-${index}`} className='flex items-center gap-1'>
                <span className='inline-block w-3 h-3 rounded-full' style={{ backgroundColor: entry.color }}></span>
                <span className='text-sm text-gray-600'>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selling Stacked Bar Chart */}
        <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
          <h2 className='font-medium text-lg mb-4'>Selling</h2>
          <p className='text-gray-500 text-sm mb-4'>(+XX%) than last year</p> {/* Update percentage */}
          <div className='flex items-center gap-4 mb-4'>
            {/* Update legend items based on your product categories */}
            <div className='flex items-center gap-1'>
              <span className='inline-block w-3 h-3 rounded-full bg-[#4CAF50]'></span> {/* Match color to pie chart or define new */}
              <span className='text-sm text-gray-600'>Product 1</span>
              <span className='text-sm font-semibold ml-1'>XXX</span> {/* Update value */}
            </div>
            <div className='flex items-center gap-1'>
              <span className='inline-block w-3 h-3 rounded-full bg-[#2196F3]'></span> {/* Match color to pie chart or define new */}
              <span className='text-sm text-gray-600'>Product 2</span>
              <span className='text-sm font-semibold ml-1'>XXX</span> {/* Update value */}
            </div>
            <div className='flex items-center gap-1'>
              <span className='inline-block w-3 h-3 rounded-full bg-[#FF9800]'></span> {/* Match color to pie chart or define new */}
              <span className='text-sm text-gray-600'>Product 3</span>
              <span className='text-sm font-semibold ml-1'>XXX</span> {/* Update value */}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={sellingData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Product1" stackId="a" fill="#4CAF50" /> {/* Match color to legend */}
              <Bar dataKey="Product2" stackId="a" fill="#2196F3" /> {/* Match color to legend */}
              <Bar dataKey="Product3" stackId="a" fill="#FF9800" /> {/* Match color to legend */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <Activity className='w-5 h-5 text-gray-700' />
            <h2 className='font-medium text-lg'>Recent Activity</h2>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            View All Orders
          </button>
        </div>
        <div className='space-y-4'>
          {orders?.slice(0, 5).map((order, index) => (
            <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200'>
              <div className='flex items-center gap-4'>
                <div className='bg-white p-2 rounded-full shadow-sm border border-gray-200'>
                  <ShoppingBag className='w-5 h-5 text-gray-600' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <p className='font-medium'>Order #{order._id.slice(-6)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 mt-1 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Package className='w-4 h-4' />
                      <span>{order.items.length} items</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <p className='text-sm text-gray-600'>Total Amount</p>
                  <p className='font-semibold text-lg text-gray-900'>
                    {formatCurrency(order.totalAmount || order.amount)}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/orders?orderId=${order._id}`)}
                  className='p-2 text-gray-600 hover:text-blue-600 transition-colors'
                >
                  <FileText className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Section */}
      <div className='bg-white p-6 rounded-lg shadow-md relative pb-24 border border-gray-200'>
        <div className='flex items-center gap-2 mb-4'>
          <ShoppingBag className='w-5 h-5 text-gray-700' />
          <h2 className='font-medium text-lg'>Order Details</h2>
        </div>
        <OrderTable token={token} />
      </div>
    </div>
  )
}

export default Dashboard