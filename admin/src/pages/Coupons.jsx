import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaSearch, FaDownload, FaUsers, FaHistory, FaTicketAlt, FaChartLine, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaEllipsisV, FaCheckSquare, FaSquare } from 'react-icons/fa';
import axios from 'axios';
import { backendUrl } from '../App';

// Use relative URLs to leverage Vite proxy in development
const localBackendUrl = import.meta.env.DEV ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');

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
  const [showActionDropdown, setShowActionDropdown] = useState({});
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
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
        // Remove from selected coupons if it was selected
        setSelectedCoupons(prev => prev.filter(id => id !== couponId));
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCoupons.length === 0) {
      toast.error('Please select coupons to delete');
      return;
    }

    try {
      const response = await axios.delete(
        `${localBackendUrl}/api/coupon/bulk`,
        {
          data: { couponIds: selectedCoupons },
          headers: { token }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchCoupons();
        fetchStats();
        setSelectedCoupons([]);
        setSelectAll(false);
        setShowBulkDeleteModal(false);
      } else {
        toast.error(response.data.message || 'Failed to delete coupons');
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete coupons';
      toast.error(errorMessage);
    }
  };

  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons(prev => {
      if (prev.includes(couponId)) {
        return prev.filter(id => id !== couponId);
      } else {
        return [...prev, couponId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCoupons([]);
      setSelectAll(false);
    } else {
      setSelectedCoupons(coupons.map(coupon => coupon._id));
      setSelectAll(true);
    }
  };

  // Reset selection when coupons change
  useEffect(() => {
    setSelectedCoupons([]);
    setSelectAll(false);
  }, [coupons]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleActionDropdown = (couponId) => {
    setShowActionDropdown(prev => ({
      ...prev,
      [couponId]: !prev[couponId]
    }));
  };

  const closeAllDropdowns = () => {
    setShowActionDropdown({});
  };

  const getStatusBadge = (coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <FaTimesCircle className="w-3 h-3 mr-1" />
          Inactive
        </span>
      );
    }

    if (now < validFrom) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FaClock className="w-3 h-3 mr-1" />
          Upcoming
        </span>
      );
    }

    if (now > validUntil) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaExclamationTriangle className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaCheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
            <p className="text-gray-600">Create, manage, and track your promotional coupons</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <FaPlus className="w-4 h-4" />
            Create Coupons
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Coupons</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCoupons}</p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Coupons</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeCoupons}</p>
              <p className="text-xs text-gray-500 mt-1">Currently running</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Expired Coupons</p>
              <p className="text-3xl font-bold text-red-600">{stats.expiredCoupons}</p>
              <p className="text-xs text-gray-500 mt-1">Past campaigns</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <FaClock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Usage</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsage}</p>
              <p className="text-xs text-gray-500 mt-1">Redeemed times</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Coupons */}
      {stats.mostUsedCoupons && stats.mostUsedCoupons.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaUsers className="w-4 h-4 text-white" />
            </div>
            Most Used Coupons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.mostUsedCoupons.slice(0, 6).map((coupon, index) => (
              <div key={coupon._id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold text-gray-900 text-sm">{coupon.code}</div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                    {coupon.usedCount} uses
                  </span>
                </div>
                <div className="text-sm text-gray-700 font-medium mb-2">
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}% off`
                    : `₹${coupon.discountValue} off`
                  }
                </div>
                <div className="flex justify-center">
                  {getStatusBadge(coupon)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search coupon codes, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCoupons.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">
                {selectedCoupons.length} coupon(s) selected
              </span>
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
              >
                <FaTrash className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {selectAll ? (
                        <FaCheckSquare className="w-4 h-4 text-orange-600" />
                      ) : (
                        <FaSquare className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    Select All
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
                      <p className="text-gray-500">Loading coupons...</p>
                    </div>
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FaTicketAlt className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No coupons found</p>
                      <p className="text-gray-400 text-sm">Create your first coupon to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSelectCoupon(coupon._id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {selectedCoupons.includes(coupon._id) ? (
                          <FaCheckSquare className="w-4 h-4 text-orange-600" />
                        ) : (
                          <FaSquare className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 font-mono">{coupon.code}</div>
                        {coupon.description && (
                          <div className="text-sm text-gray-500 mt-1">{coupon.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% off`
                          : `₹${coupon.discountValue} off`
                        }
                      </div>
                      {coupon.minOrderAmount > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Min: ₹{coupon.minOrderAmount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatDate(coupon.validFrom)}</div>
                        <div className="text-gray-500">to {formatDate(coupon.validUntil)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-lg">{coupon.usedCount}</span>
                          {coupon.usageLimit && (
                            <span className="text-gray-500">/ {coupon.usageLimit}</span>
                          )}
                        </div>
                        {coupon.usageLimit && coupon.usedCount > 0 && (
                          <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
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
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 font-medium hover:underline"
                          >
                            <FaHistory className="w-3 h-3" />
                            View Details
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => toggleActionDropdown(coupon._id)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <FaEllipsisV className="w-4 h-4" />
                        </button>

                        {showActionDropdown[coupon._id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                            <div className="py-1">
                              {coupon.usedCount > 0 && (
                                <button
                                  onClick={() => {
                                    fetchCouponUsageDetails(coupon._id);
                                    closeAllDropdowns();
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                >
                                  <FaHistory className="w-4 h-4" />
                                  View Usage Details
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleToggleStatus(coupon._id);
                                  closeAllDropdowns();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                              >
                                {coupon.isActive ? (
                                  <>
                                    <FaToggleOff className="w-4 h-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <FaToggleOn className="w-4 h-4" />
                                    Activate
                                  </>
                                )}
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => {
                                  handleDeleteCoupon(coupon._id);
                                  closeAllDropdowns();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                              >
                                <FaTrash className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
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
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150 font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-150 font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Coupon Batch</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Coupons
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.count}
                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Maximum Discount (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="No limit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usage Limit (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="No limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid From
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valid Until
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="Enter coupon description"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Coupon Usage Details</h2>
              <button
                onClick={() => {
                  setShowUsageModal(false);
                  setCouponUsageDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimesCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-mono">{couponUsageDetails.code}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Discount:</span>
                    <div className="font-bold text-lg text-gray-900 mt-1">
                      {couponUsageDetails.discountType === 'percentage'
                        ? `${couponUsageDetails.discountValue}% off`
                        : `₹${couponUsageDetails.discountValue} off`
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Total Usage:</span>
                    <div className="font-bold text-lg text-gray-900 mt-1">{couponUsageDetails.usedCount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Usage Limit:</span>
                    <div className="font-bold text-lg text-gray-900 mt-1">
                      {couponUsageDetails.usageLimit || 'No limit'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Status:</span>
                    <div className="mt-1">
                      {getStatusBadge(couponUsageDetails)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {couponUsageDetails.usedBy && couponUsageDetails.usedBy.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Usage History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-l-lg">
                          User
                        </th>
                        <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Used At
                        </th>
                        <th className="border border-gray-200 px-6 py-4 text-left text-sm font-semibold text-gray-700 rounded-r-lg">
                          Order ID
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {couponUsageDetails.usedBy.map((usage, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="border border-gray-200 px-6 py-4 text-sm">
                            <div>
                              <div className="font-semibold text-gray-900">
                                {usage.userId?.name || 'Unknown User'}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {usage.userId?.email || 'No email'}
                              </div>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-6 py-4 text-sm text-gray-900">
                            {formatDate(usage.usedAt)}
                          </td>
                          <td className="border border-gray-200 px-6 py-4 text-sm">
                            <span className="font-mono text-xs bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
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
              <div className="text-center py-12 text-gray-500">
                <FaUsers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No usage history available</p>
                <p className="text-sm">This coupon hasn't been used yet.</p>
              </div>
            )}

            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  setShowUsageModal(false);
                  setCouponUsageDetails(null);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Delete Coupons</h2>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-bold text-red-600">{selectedCoupons.length}</span> selected coupon(s)?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This will permanently delete the selected coupons and all associated data.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                Delete {selectedCoupons.length} Coupon(s)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {Object.values(showActionDropdown).some(Boolean) && (
        <div
          className="fixed inset-0 z-10"
          onClick={closeAllDropdowns}
        />
      )}
    </div>
  );
};

export default Coupons;

