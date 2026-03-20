import React, { useContext, useEffect, useState, useMemo } from 'react'
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
  DollarSign,
  Users,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { toast } from 'react-toastify'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const { orders } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    returned: 0,
    revenue: 0,
    averageOrderValue: 0
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
        setShowStatusDropdown(false);
      }
      if (showDateDropdown && !event.target.closest('.date-dropdown')) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStatusDropdown, showDateDropdown]);

  // ─── Helpers to skip cancelled / returned orders ──────────────
  const isValidOrder = (order) =>
    order.status !== 'Cancelled' &&
    order.returnOrderStatus !== 'Return Confirmed';

  // ─── Monthly revenue line-chart data (current year, real orders) ──
  const monthlyRevenueData = useMemo(() => {
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const currentYear = new Date().getFullYear();
    const data = MONTHS.map((month) => ({ month, revenue: 0, orders: 0 }));
    (orders || []).forEach((order) => {
      if (!isValidOrder(order)) return;
      const d = new Date(order.date || order.createdAt);
      if (d.getFullYear() !== currentYear) return;
      const idx = d.getMonth();
      data[idx].revenue += Number(order.totalAmount || order.amount || 0);
      data[idx].orders += 1;
    });
    return data;
  }, [orders]);

  // ─── Product distribution pie-chart (by subCategory from order items) ──
  const productDetailsData = useMemo(() => {
    const COLORS = ['#f97316','#3B82F6','#10B981','#8B5CF6','#EC4899','#F59E0B','#EF4444','#06B6D4'];
    const counts = {};
    (orders || []).forEach((order) => {
      if (!isValidOrder(order)) return;
      (order.items || []).forEach((item) => {
        const cat = item.subCategory || item.category || 'Other';
        counts[cat] = (counts[cat] || 0) + (Number(item.quantity) || 1);
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total === 0) return [{ name: 'No sales yet', value: 100, color: '#e5e7eb' }];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count], i) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
        color: COLORS[i % COLORS.length],
      }));
  }, [orders]);

  // ─── Top selling products (aggregated from order items) ──────────
  const topProductsData = useMemo(() => {
    const map = {};
    (orders || []).forEach((order) => {
      if (!isValidOrder(order)) return;
      (order.items || []).forEach((item) => {
        const key = item.name || item.productId || 'Unknown Product';
        if (!map[key]) map[key] = { name: key, sales: 0, revenue: 0 };
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
        map[key].sales += qty;
        map[key].revenue += qty * price;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders]);

  useEffect(() => {
    if (orders) {
      try {
        const validOrders = orders.filter(order =>
          order.returnOrderStatus !== "Return Confirmed" &&
          order.status !== "Cancelled"
        );

        const totalRevenue = validOrders.reduce((acc, order) => {
          const orderAmount = order.totalAmount || order.amount || 0;
          return acc + Number(orderAmount);
        }, 0);

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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Packing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, isLoading, percentage, trend, trendValue }) => (
    <div className='bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className='w-4 h-4' /> : <ArrowDownRight className='w-4 h-4' />}
            <span className='font-medium'>{trendValue}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className='text-gray-500 text-sm font-medium mb-1'>{title}</h3>
        {isLoading ? (
          <div className='h-8 bg-gray-200 animate-pulse rounded-lg'></div>
        ) : (
          <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
        )}
        {percentage !== undefined && (
          <div className='flex items-center gap-2'>
            <div className='w-16 h-16'>
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  rotation: 0.25,
                  strokeLinecap: 'round',
                  textSize: '12px',
                  pathColor: color.replace('text-', ''),
                  textColor: color.replace('text-', ''),
                  trailColor: '#f3f4f6',
                })}
              />
            </div>
            <span className='text-xs text-gray-500'>Completion rate</span>
          </div>
        )}
      </div>
    </div>
  );

  const handleNewOrder = () => {
    navigate('/orders');
    toast.info('Redirecting to Orders page');
  };

  const handleViewReports = () => {
    try {
      const reportData = {
        totalOrders: orderStats.total,
        pendingOrders: orderStats.pending,
        deliveredOrders: orderStats.delivered,
        returnedOrders: orderStats.returned,
        totalRevenue: orderStats.revenue,
        averageOrderValue: orderStats.averageOrderValue,
        date: new Date().toLocaleDateString(),
        orders: orders?.slice(0, 10)
      };

      const csvContent = [
        ['Dashboard Report', new Date().toLocaleDateString()],
        [],
        ['Total Orders', orderStats.total],
        ['Pending Orders', orderStats.pending],
        ['Delivered Orders', orderStats.delivered],
        ['Returned Orders', orderStats.returned],
        ['Total Revenue', formatCurrency(orderStats.revenue)],
        ['Average Order Value', formatCurrency(orderStats.averageOrderValue)],
        [],
        ['Recent Orders'],
        ['Order ID', 'Date', 'Status', 'Amount'],
        ...orders?.slice(0, 10).map(order => [
          order._id.slice(-6),
          new Date(order.createdAt).toLocaleDateString(),
          order.status,
          formatCurrency(order.totalAmount)
        ])
      ].map(row => row.join(',')).join('\n');

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
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard Overview</h1>
            <p className='text-gray-600'>Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <button
              onClick={handleNewOrder}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md'
            >
              <Eye className='w-4 h-4' />
              <span>View Orders</span>
            </button>
            <button
              onClick={handleViewReports}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-sm hover:shadow-md'
            >
              <Download className='w-4 h-4' />
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title="Total Orders"
          value={orderStats.total}
          icon={ShoppingBag}
          color="text-blue-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.delivered / orderStats.total) * 100) : 0}
          trend="up"
          trendValue={12}
        />
        <StatCard
          title="Pending Orders"
          value={orderStats.pending}
          icon={Clock}
          color="text-amber-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.pending / orderStats.total) * 100) : 0}
          trend="down"
          trendValue={8}
        />
        <StatCard
          title="Delivered Orders"
          value={orderStats.delivered}
          icon={CheckCircle2}
          color="text-emerald-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.delivered / orderStats.total) * 100) : 0}
          trend="up"
          trendValue={15}
        />
        <StatCard
          title="Returned Orders"
          value={orderStats.returned}
          icon={RotateCcw}
          color="text-red-600"
          isLoading={isLoading}
          percentage={orderStats.total > 0 ? Math.round((orderStats.returned / orderStats.total) * 100) : 0}
          trend="down"
          trendValue={5}
        />
      </div>

      {/* Revenue & Performance Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
        {/* Revenue Overview */}
        <div className='lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-1'>Revenue Overview</h3>
              <p className='text-sm text-gray-600'>Monthly revenue — {new Date().getFullYear()}</p>
            </div>
            {(() => {
              const now = new Date();
              const thisM = monthlyRevenueData[now.getMonth()]?.revenue || 0;
              const prevM = monthlyRevenueData[Math.max(0, now.getMonth() - 1)]?.revenue || 0;
              if (prevM === 0) return null;
              const pct = Math.round(((thisM - prevM) / prevM) * 100);
              return (
                <div className={`flex items-center gap-1.5 text-sm font-medium ${pct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pct >= 0 ? <ArrowUpRight className='w-4 h-4' /> : <ArrowDownRight className='w-4 h-4' />}
                  <span>{pct >= 0 ? '+' : ''}{pct}% vs last month</span>
                </div>
              );
            })()}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Stats */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-gray-500 text-sm font-medium'>Total Revenue</h3>
              <IndianRupee className='w-5 h-5 text-emerald-600' />
            </div>
            {isLoading ? (
              <div className='h-8 bg-gray-200 animate-pulse rounded-lg'></div>
            ) : (
              <div>
                <p className='text-3xl font-bold text-emerald-600 mb-2'>{formatCurrency(orderStats.revenue)}</p>
                <p className='text-xs text-gray-500'>Excluding returned and cancelled orders</p>
              </div>
            )}
          </div>

          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-gray-500 text-sm font-medium'>Average Order Value</h3>
              <TrendingUp className='w-5 h-5 text-blue-600' />
            </div>
            {isLoading ? (
              <div className='h-8 bg-gray-200 animate-pulse rounded-lg'></div>
            ) : (
              <div>
                <p className='text-3xl font-bold text-blue-600 mb-2'>{formatCurrency(orderStats.averageOrderValue)}</p>
                <p className='text-xs text-gray-500'>Based on {orderStats.total - orderStats.returned} valid orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Product Distribution */}
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>Product Distribution</h3>
          <p className='text-sm text-gray-600 mb-6'>Units sold by product type (from orders)</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDetailsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {productDetailsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className='grid grid-cols-2 gap-3 mt-6'>
            {productDetailsData.map((entry, index) => (
              <div key={`legend-${index}`} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <span className='w-3 h-3 rounded-full shrink-0' style={{ backgroundColor: entry.color }}></span>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>{entry.name}</p>
                  <p className='text-xs text-gray-500'>
                    {entry.value}%{entry.count != null ? ` · ${entry.count} sold` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <h3 className='text-lg font-semibold text-gray-900 mb-1'>Top Selling Products</h3>
          <p className='text-sm text-gray-600 mb-6'>Best performers based on delivered orders</p>
          {topProductsData.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-gray-400'>
              <Package className='w-10 h-10 mb-3 opacity-40' />
              <p className='text-sm font-medium'>No sales data yet</p>
              <p className='text-xs mt-1'>Sales will appear here once orders are delivered</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {topProductsData.map((product, index) => {
                const maxSales = topProductsData[0]?.sales || 1;
                const barWidth = Math.round((product.sales / maxSales) * 100);
                const rankColors = ['bg-yellow-500','bg-gray-400','bg-amber-600','bg-gray-400','bg-gray-400'];
                return (
                  <div key={index} className='p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3 min-w-0'>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${rankColors[index] || 'bg-gray-400'}`}>
                          #{index + 1}
                        </div>
                        <p className='font-medium text-gray-900 text-sm truncate'>{product.name}</p>
                      </div>
                      <div className='text-right shrink-0 ml-3'>
                        <p className='font-semibold text-gray-900 text-sm'>{formatCurrency(product.revenue)}</p>
                        <p className='text-xs text-gray-500'>{product.sales} sold</p>
                      </div>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-1.5'>
                      <div
                        className='bg-orange-400 h-1.5 rounded-full transition-all duration-500'
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Activity className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>Recent Activity</h3>
              <p className='text-sm text-gray-600'>Latest order updates</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'
          >
            View All Orders →
          </button>
        </div>
        <div className='space-y-4'>
          {orders?.slice(0, 5).map((order, index) => (
            <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-200'>
              <div className='flex items-center gap-4'>
                <div className='bg-white p-3 rounded-full shadow-sm border border-gray-200'>
                  <ShoppingBag className='w-5 h-5 text-gray-600' />
                </div>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <p className='font-semibold text-gray-900'>Order #{order._id.slice(-6)}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className='flex items-center gap-6 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <span>{formatDate(order.date)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Package className='w-4 h-4' />
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  <p className='text-sm text-gray-600 mb-1'>Total Amount</p>
                  <p className='font-bold text-lg text-gray-900'>
                    {formatCurrency(order.totalAmount || order.amount)}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/orders?orderId=${order._id}`)}
                  className='p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300'
                >
                  <FileText className='w-5 h-5' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Management Section - Redesigned */}
      <div className='space-y-6'>
        {/* Order Management Header */}
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
            <div className='flex items-center gap-3'>
              <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl'>
                <ShoppingBag className='w-6 h-6 text-white' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-900'>Order Management</h3>
                <p className='text-sm text-gray-600'>Manage and track all customer orders</p>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={() => navigate('/orders')}
                className='flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm font-medium'
              >
                <Eye className='w-4 h-4' />
                View All Orders
              </button>
              <button
                onClick={() => navigate('/add')}
                className='flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-300 text-sm font-medium'
              >
                <Package className='w-4 h-4' />
                Add Product
              </button>
            </div>
          </div>

          {/* Order Status Cards */}
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6'>
            <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200'>
              <div className='flex items-center justify-between mb-2'>
                <Clock className='w-5 h-5 text-blue-600' />
                <span className='text-xs text-blue-600 font-medium'>Pending</span>
              </div>
              <p className='text-2xl font-bold text-blue-900'>{orderStats.pending}</p>
              <p className='text-xs text-blue-700'>Awaiting processing</p>
            </div>

            <div className='bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200'>
              <div className='flex items-center justify-between mb-2'>
                <Package className='w-5 h-5 text-purple-600' />
                <span className='text-xs text-purple-600 font-medium'>Packing</span>
              </div>
              <p className='text-2xl font-bold text-purple-900'>
                {orders?.filter(order => order.status === "Packing").length || 0}
              </p>
              <p className='text-xs text-purple-700'>Being prepared</p>
            </div>

            <div className='bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200'>
              <div className='flex items-center justify-between mb-2'>
                <Activity className='w-5 h-5 text-orange-600' />
                <span className='text-xs text-orange-600 font-medium'>Shipped</span>
              </div>
              <p className='text-2xl font-bold text-orange-900'>
                {orders?.filter(order => order.status === "Shipped").length || 0}
              </p>
              <p className='text-xs text-orange-700'>In transit</p>
            </div>

            <div className='bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200'>
              <div className='flex items-center justify-between mb-2'>
                <AlertCircle className='w-5 h-5 text-yellow-600' />
                <span className='text-xs text-yellow-600 font-medium'>Out for Delivery</span>
              </div>
              <p className='text-2xl font-bold text-yellow-900'>
                {orders?.filter(order => order.status === "Out for delivery").length || 0}
              </p>
              <p className='text-xs text-yellow-700'>On the way</p>
            </div>

            <div className='bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200'>
              <div className='flex items-center justify-between mb-2'>
                <CheckCircle2 className='w-5 h-5 text-emerald-600' />
                <span className='text-xs text-emerald-600 font-medium'>Delivered</span>
              </div>
              <p className='text-2xl font-bold text-emerald-900'>{orderStats.delivered}</p>
              <p className='text-xs text-emerald-700'>Successfully delivered</p>
            </div>

            <div className='bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200'>
              <div className='flex items-center justify-between mb-2'>
                <RotateCcw className='w-5 h-5 text-red-600' />
                <span className='text-xs text-red-600 font-medium'>Returns</span>
              </div>
              <p className='text-2xl font-bold text-red-900'>{orderStats.returned}</p>
              <p className='text-xs text-red-700'>Returned orders</p>
            </div>
          </div>

          {/* Enhanced Filter Section */}
          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            <div className='flex flex-col lg:flex-row lg:items-end gap-4'>
              <div className='flex-1'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Search Orders</label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search by order ID, customer name, or email...'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                  <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <div className="relative status-dropdown">
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Status Filter</label>
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-700">All Orders</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="py-1">
                        {[
                          { value: 'all', label: 'All Orders', color: 'bg-blue-500' },
                          { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
                          { value: 'packing', label: 'Packing', color: 'bg-orange-500' },
                          { value: 'shipped', label: 'Shipped', color: 'bg-purple-500' },
                          { value: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-indigo-500' },
                          { value: 'delivered', label: 'Delivered', color: 'bg-green-500' },
                          { value: 'returned', label: 'Returned', color: 'bg-red-500' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setShowStatusDropdown(false)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 text-gray-700"
                          >
                            <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                            <span className="font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative date-dropdown">
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Date Range</label>
                  <button
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">This Month</span>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showDateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDateDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      <div className="py-1">
                        {[
                          { value: 'today', label: 'Today', color: 'bg-green-500' },
                          { value: 'week', label: 'This Week', color: 'bg-blue-500' },
                          { value: 'month', label: 'This Month', color: 'bg-purple-500' },
                          { value: 'quarter', label: 'This Quarter', color: 'bg-orange-500' },
                          { value: 'year', label: 'This Year', color: 'bg-indigo-500' },
                          { value: 'custom', label: 'Custom Range', color: 'bg-gray-500' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setShowDateDropdown(false)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 flex items-center gap-3 text-gray-700"
                          >
                            <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                            <span className="font-medium">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className='bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 mb-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Activity className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <h4 className='text-lg font-semibold text-gray-900'>Quick Actions</h4>
                <p className='text-sm text-gray-600'>Manage your orders efficiently</p>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              <button
                onClick={handleViewReports}
                className='group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 text-left'
              >
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
                    <Download className='w-5 h-5 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                    <h5 className='font-semibold text-gray-900 mb-1'>Export Orders</h5>
                    <p className='text-xs text-gray-600 mb-2'>Download order data in CSV format</p>
                    <div className='flex items-center gap-1 text-xs text-blue-600 font-medium'>
                      <span>Download</span>
                      <ArrowUpRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                </div>
              </button>

              <button className='group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 text-left'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
                    <CheckCircle2 className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <h5 className='font-semibold text-gray-900 mb-1'>Bulk Update</h5>
                    <p className='text-xs text-gray-600 mb-2'>Update multiple order statuses</p>
                    <div className='flex items-center gap-1 text-xs text-green-600 font-medium'>
                      <span>Update</span>
                      <ArrowUpRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                </div>
              </button>

              <button className='group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-left'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors'>
                    <FileText className='w-5 h-5 text-purple-600' />
                  </div>
                  <div className='flex-1'>
                    <h5 className='font-semibold text-gray-900 mb-1'>Generate Reports</h5>
                    <p className='text-xs text-gray-600 mb-2'>Create detailed analytics reports</p>
                    <div className='flex items-center gap-1 text-xs text-purple-600 font-medium'>
                      <span>Generate</span>
                      <ArrowUpRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                </div>
              </button>

              <button className='group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 text-left'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                    <AlertCircle className='w-5 h-5 text-orange-600' />
                  </div>
                  <div className='flex-1'>
                    <h5 className='font-semibold text-gray-900 mb-1'>View Issues</h5>
                    <p className='text-xs text-gray-600 mb-2'>Monitor order problems & returns</p>
                    <div className='flex items-center gap-1 text-xs text-orange-600 font-medium'>
                      <span>Monitor</span>
                      <ArrowUpRight className='w-3 h-3' />
                    </div>
                  </div>
                </div>
                <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                </div>
              </button>
            </div>

            {/* Additional Action Buttons */}
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex flex-wrap gap-3'>
                <button className='flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'>
                  <Users className='w-4 h-4' />
                  Customer Support
                </button>
                <button className='flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'>
                  <Calendar className='w-4 h-4' />
                  Schedule Delivery
                </button>
                <button className='flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'>
                  <TrendingUp className='w-4 h-4' />
                  Analytics
                </button>
                <button className='flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium'>
                  <DollarSign className='w-4 h-4' />
                  Payment Status
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Order Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-lg font-semibold text-gray-900'>Recent Orders</h4>
                <p className='text-sm text-gray-600'>Latest {orders?.slice(0, 10).length || 0} orders</p>
              </div>
              <div className='flex items-center gap-2 text-sm text-gray-500'>
                <span>Showing</span>
                <span className='font-medium'>{orders?.slice(0, 10).length || 0}</span>
                <span>of</span>
                <span className='font-medium'>{orders?.length || 0}</span>
                <span>orders</span>
              </div>
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Order ID</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Customer</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Items</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {orders?.slice(0, 10).map((order, index) => (
                  <tr key={order._id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
                            <span className='text-sm font-medium text-blue-600'>#{order._id.slice(-6)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>{order.address?.firstName} {order.address?.lastName}</div>
                        <div className='text-sm text-gray-500'>{order.address?.email}</div>
                        <div className='text-sm text-gray-500'>{order.address?.phone}</div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{formatDate(order.date)}</div>
                      <div className='text-sm text-gray-500'>{new Date(order.date).toLocaleTimeString()}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{order.items?.length || 0} items</div>
                      <div className='text-sm text-gray-500'>
                        {order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} total qty
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatCurrency(order.totalAmount || order.amount)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center gap-2'>
                        <button
                          onClick={() => navigate(`/orders?orderId=${order._id}`)}
                          className='group relative flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200 text-xs font-medium'
                          title='View Details'
                        >
                          <Eye className='w-3 h-3' />
                          <span className='hidden sm:inline'>View</span>
                          <div className='absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                        </button>
                        <button
                          className='group relative flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200 text-xs font-medium'
                          title='Update Status'
                        >
                          <CheckCircle2 className='w-3 h-3' />
                          <span className='hidden sm:inline'>Update</span>
                          <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                        </button>
                        <button
                          className='group relative flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200 text-xs font-medium'
                          title='Print Invoice'
                        >
                          <FileText className='w-3 h-3' />
                          <span className='hidden sm:inline'>Print</span>
                          <div className='absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='bg-gray-50 px-6 py-3 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-700'>
                <span className='font-medium'>Total Revenue:</span>
                <span className='ml-2 text-lg font-bold text-emerald-600'>
                  {formatCurrency(orders?.slice(0, 10).reduce((acc, order) => acc + (order.totalAmount || order.amount), 0) || 0)}
                </span>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className='text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors'
              >
                View All Orders →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard