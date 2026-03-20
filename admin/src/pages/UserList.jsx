import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaSearch, FaFilter, FaSort, FaEye, FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaCoins, FaUndo, FaTimes, FaDownload, FaPrint } from 'react-icons/fa';

const UserList = () => {
  const { userList } = useContext(ShopContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (Array.isArray(userList)) {
      let filtered = [...userList];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
        );
      }

      // Apply category filter
      if (selectedFilter !== 'all') {
        switch (selectedFilter) {
          case 'highCredit':
            filtered = filtered.filter(user => user.creditPoints > 100);
            break;
          case 'lowCredit':
            filtered = filtered.filter(user => user.creditPoints <= 100);
            break;
          case 'returnOrders':
            filtered = filtered.filter(user => user.returnOrderCount > 0);
            break;
          case 'cancelOrders':
            filtered = filtered.filter(user => user.cancelOrderCount > 0);
            break;
          default:
            break;
        }
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[sortBy] || 0;
        let bValue = b[sortBy] || 0;

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setFilteredUsers(filtered);
    }
  }, [userList, searchTerm, sortBy, sortOrder, selectedFilter]);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  const getStatusColor = (creditPoints) => {
    if (creditPoints > 200) return 'text-green-600 bg-green-100 border-green-200';
    if (creditPoints > 100) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (creditPoints > 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getOrderStatusColor = (count) => {
    if (count === 0) return 'text-green-600 bg-green-100 border-green-200';
    if (count <= 2) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const exportData = () => {
    // Implementation for data export
    console.log('Exporting data...');
  };

  const printData = () => {
    // Implementation for printing
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600 text-sm lg:text-base">Manage and monitor your customer base with detailed insights</p>
          </div>
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="text-center lg:text-right">
              <p className="text-xl lg:text-2xl font-bold text-blue-600">{userList?.length || 0}</p>
              <p className="text-xs lg:text-sm text-gray-600">Total Users</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaDownload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={printData}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <FaPrint className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="text-blue-600 w-4 h-4" />
              </div>
              <div className="ml-3">
                <p className="text-xs lg:text-sm text-gray-600">Active Users</p>
                <p className="text-lg lg:text-xl font-semibold text-gray-900">{userList?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCoins className="text-green-600 w-4 h-4" />
              </div>
              <div className="ml-3">
                <p className="text-xs lg:text-sm text-gray-600">High Credit</p>
                <p className="text-lg lg:text-xl font-semibold text-gray-900">
                  {userList?.filter(user => user.creditPoints > 100).length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaUndo className="text-yellow-600 w-4 h-4" />
              </div>
              <div className="ml-3">
                <p className="text-xs lg:text-sm text-gray-600">Returns</p>
                <p className="text-lg lg:text-xl font-semibold text-gray-900">
                  {userList?.reduce((sum, user) => sum + (user.returnOrderCount || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTimes className="text-red-600 w-4 h-4" />
              </div>
              <div className="ml-3">
                <p className="text-xs lg:text-sm text-gray-600">Cancellations</p>
                <p className="text-lg lg:text-xl font-semibold text-gray-900">
                  {userList?.reduce((sum, user) => sum + (user.cancelOrderCount || 0), 0) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaFilter className="w-4 h-4" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="appearance-none bg-white pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium text-gray-700 hover:border-gray-400 cursor-pointer w-full sm:w-auto min-w-[180px]"
                >
                  <option value="all" className="py-2">All Users</option>
                  <option value="highCredit" className="py-2">High Credit Users</option>
                  <option value="lowCredit" className="py-2">Low Credit Users</option>
                  <option value="returnOrders" className="py-2">Users with Returns</option>
                  <option value="cancelOrders" className="py-2">Users with Cancellations</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {currentUsers.length > 0 ? (
          <>
            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                          <button
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaUser className="text-sm" />
                            <span className="hidden sm:inline">Name</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                          <button
                            onClick={() => handleSort('email')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaEnvelope className="text-sm" />
                            <span className="hidden sm:inline">Email</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                          <button
                            onClick={() => handleSort('phone')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaPhone className="text-sm" />
                            <span className="hidden sm:inline">Phone</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                          <button
                            onClick={() => handleSort('creditPoints')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaCoins className="text-sm" />
                            <span className="hidden sm:inline">Credits</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                          <button
                            onClick={() => handleSort('returnOrderCount')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaUndo className="text-sm" />
                            <span className="hidden sm:inline">Returns</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                          <button
                            onClick={() => handleSort('cancelOrderCount')}
                            className="flex items-center gap-1 hover:text-gray-700 transition-colors focus:outline-none"
                          >
                            <FaTimes className="text-sm" />
                            <span className="hidden sm:inline">Cancels</span>
                            <FaSort className="text-xs" />
                          </button>
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] lg:min-w-[140px] sticky right-0 bg-gray-50 z-10">
                          <div className="flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                            <span className="hidden sm:inline">Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap sticky left-0 bg-white hover:bg-gray-50 z-10">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                                <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <FaUser className="text-blue-600 w-3 h-3 lg:w-4 lg:h-4" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-[120px] lg:max-w-[150px]">
                                  {user.name || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 truncate max-w-[180px] lg:max-w-[200px]" title={user.email || 'N/A'}>
                              {user.email || 'N/A'}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone || 'N/A'}</div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(user.creditPoints || 0)}`}>
                              {user.creditPoints || 0} pts
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getOrderStatusColor(user.returnOrderCount || 0)}`}>
                              {user.returnOrderCount || 0}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getOrderStatusColor(user.cancelOrderCount || 0)}`}>
                              {user.cancelOrderCount || 0}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white hover:bg-gray-50 z-10">
                            <div className="flex items-center justify-center gap-1 lg:gap-2">
                              <button
                                className="group relative inline-flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                title="View User Details"
                                onClick={() => console.log('View user:', user.name)}
                              >
                                <FaEye className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                  View Details
                                </span>
                              </button>

                              <button
                                className="group relative inline-flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 text-green-600 hover:text-white bg-green-50 hover:bg-green-600 border border-green-200 hover:border-green-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                title="Edit User Information"
                                onClick={() => console.log('Edit user:', user.name)}
                              >
                                <FaEdit className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                  Edit User
                                </span>
                              </button>

                              <button
                                className="group relative inline-flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                title="Delete User Account"
                                onClick={() => console.log('Delete user:', user.name)}
                              >
                                <FaTrash className="w-3 h-3 lg:w-4 lg:h-4" />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                  Delete User
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 lg:px-6 py-3 lg:py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <FaUser className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || selectedFilter !== 'all'
                ? 'Try adjusting your search or filter criteria to find the users you\'re looking for.'
                : 'No users are currently available in the system.'}
            </p>
            {(searchTerm || selectedFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;