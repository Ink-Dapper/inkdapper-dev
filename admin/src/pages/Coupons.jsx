import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaSearch, FaDownload, FaUsers, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import { backendUrl } from '../App';

// Override backend URL to use local development server
const localBackendUrl = 'http://localhost:4000';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponUsageDetails, setCouponUsageDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
    mostUsedCoupons: []
  });

  // Form state for creating coupons
  const [formData, setFormData] = useState({
    count: 10,
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    validFrom: '',
    validUntil: '',
    usageLimit: '',
    description: '',
    applicableProducts: [],
    applicableCategories: []
  });

  const token = localStorage.getItem('token');



  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [currentPage, searchTerm]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${localBackendUrl}/api/coupon/all?page=${currentPage}&limit=10&search=${searchTerm}`,
        { headers: { token } }
      );

      if (response.data.success) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${localBackendUrl}/api/coupon/stats`, {
        headers: { token }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCouponUsageDetails = async (couponId) => {
    try {
      const response = await axios.get(`${localBackendUrl}/api/coupon/${couponId}`, {
        headers: { token }
      });

      if (response.data.success) {
        setCouponUsageDetails(response.data.coupon);
        setShowUsageModal(true);
      }
    } catch (error) {
      console.error('Error fetching coupon usage details:', error);
      toast.error('Failed to fetch usage details');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.discountValue || !formData.validFrom || !formData.validUntil) {
      toast.error('Please fill in all required fields (Discount Value, Valid From, Valid Until)');
      return;
    }

    // Validate discount value
    if (formData.discountType === 'percentage' && (formData.discountValue < 0 || formData.discountValue > 100)) {
      toast.error('Percentage discount must be between 0 and 100');
      return;
    }

    if (formData.discountType === 'fixed' && formData.discountValue < 0) {
      toast.error('Fixed discount amount cannot be negative');
      return;
    }

    // Validate dates
    const validFrom = new Date(formData.validFrom);
    const validUntil = new Date(formData.validUntil);
    const now = new Date();

    if (validUntil <= validFrom) {
      toast.error('Valid Until date must be after Valid From date');
      return;
    }

    if (validFrom < now) {
      toast.error('Valid From date cannot be in the past');
      return;
    }

    try {
      // Prepare data for backend
      const couponData = {
        count: parseInt(formData.count),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        description: formData.description || '',
        applicableProducts: formData.applicableProducts || [],
        applicableCategories: formData.applicableCategories || []
      };



      const response = await axios.post(
        `${localBackendUrl}/api/coupon/create-batch`,
        couponData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setShowCreateModal(false);
        setFormData({
          count: 10,
          discountType: 'percentage',
          discountValue: '',
          minOrderAmount: '',
          maxDiscount: '',
          validFrom: '',
          validUntil: '',
          usageLimit: '',
          description: '',
          applicableProducts: [],
          applicableCategories: []
        });
        fetchCoupons();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating coupons:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create coupons';
      toast.error(errorMessage);
    }
  };

  const handleToggleStatus = async (couponId) => {
    try {
      const response = await axios.patch(
        `${localBackendUrl}/api/coupon/${couponId}/toggle`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to toggle coupon status';
      toast.error(errorMessage);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${localBackendUrl}/api/coupon/${couponId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Coupon deleted successfully');
        fetchCoupons();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Inactive</span>;
    }

    if (now < validFrom) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Upcoming</span>;
    }

    if (now > validUntil) {
      return <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">Expired</span>;
    }

    return <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">Active</span>;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Create Coupons
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCoupons}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">🎫</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeCoupons}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expired Coupons</p>
              <p className="text-2xl font-bold text-red-600">{stats.expiredCoupons}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Coupons */}
      {stats.mostUsedCoupons && stats.mostUsedCoupons.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUsers className="text-purple-600" />
            Most Used Coupons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.mostUsedCoupons.slice(0, 6).map((coupon, index) => (
              <div key={coupon._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm">{coupon.code}</div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    {coupon.usedCount} uses
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue} off`
                  }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getStatusBadge(coupon)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow border mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupon codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No coupons found
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                        <div className="text-sm text-gray-500">{coupon.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% off`
                          : `₹${coupon.discountValue} off`
                        }
                      </div>
                      {coupon.minOrderAmount > 0 && (
                        <div className="text-xs text-gray-500">
                          Min: ₹{coupon.minOrderAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{coupon.usedCount}</span>
                          {coupon.usageLimit && (
                            <span className="text-gray-500">/ {coupon.usageLimit}</span>
                          )}
                        </div>
                        {coupon.usageLimit && coupon.usedCount > 0 && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round((coupon.usedCount / coupon.usageLimit) * 100)}% used
                            </div>
                          </div>
                        )}
                        {coupon.usedCount > 0 && (
                          <button
                            onClick={() => fetchCouponUsageDetails(coupon._id)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                          >
                            <FaHistory className="w-3 h-3" />
                            View Details
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(coupon._id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title={coupon.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.isActive ? <FaToggleOn className="w-6 h-6" /> : <FaToggleOff className="w-6 h-6" />}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FaTrash className="w-6 h-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create Coupon Batch</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Coupons
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Discount (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="No limit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="No limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Until
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter coupon description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Create Coupons
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Usage Details Modal */}
      {showUsageModal && couponUsageDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Coupon Usage Details</h2>
              <button
                onClick={() => {
                  setShowUsageModal(false);
                  setCouponUsageDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{couponUsageDetails.code}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Discount:</span>
                    <div className="font-medium">
                      {couponUsageDetails.discountType === 'percentage'
                        ? `${couponUsageDetails.discountValue}% off`
                        : `₹${couponUsageDetails.discountValue} off`
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Usage:</span>
                    <div className="font-medium">{couponUsageDetails.usedCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Usage Limit:</span>
                    <div className="font-medium">
                      {couponUsageDetails.usageLimit || 'No limit'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className="font-medium">
                      {getStatusBadge(couponUsageDetails)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {couponUsageDetails.usedBy && couponUsageDetails.usedBy.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Usage History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                          User
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Used At
                        </th>
                        <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Order ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {couponUsageDetails.usedBy.map((usage, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            <div>
                              <div className="font-medium">
                                {usage.userId?.name || 'Unknown User'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {usage.userId?.email || 'No email'}
                              </div>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            {formatDate(usage.usedAt)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-sm">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              {usage.orderId || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No usage history available for this coupon.</p>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowUsageModal(false);
                  setCouponUsageDetails(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;

