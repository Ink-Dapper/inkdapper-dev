import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import {
  Star,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Settings,
  Grid,
  List as ListIcon,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const HighlightedProducts = ({ token }) => {
  const [highlightedProducts, setHighlightedProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [viewMode, setViewMode] = useState('table')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')

  // Form states for add/edit
  const [formData, setFormData] = useState({
    productId: '',
    title: '',
    description: '',
    displayOrder: 0
  })

  useEffect(() => {
    fetchHighlightedProducts()
    fetchAllProducts()
  }, [])

  const fetchHighlightedProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/highlighted-products/admin/all', {
        headers: { token }
      })
      if (response.data.success) {
        setHighlightedProducts(response.data.highlightedProducts)
      }
    } catch (error) {
      console.error('Error fetching highlighted products:', error)
      toast.error('Failed to fetch highlighted products')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token }
      })
      if (response.data.success) {
        setAllProducts(response.data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(backendUrl + '/api/highlighted-products/add', formData, {
        headers: { token }
      })
      if (response.data.success) {
        toast.success('Product highlighted successfully')
        setShowAddModal(false)
        setFormData({ productId: '', title: '', description: '', displayOrder: 0 })
        fetchHighlightedProducts()
      } else {
        toast.error(response.data.message || 'Failed to highlight product')
      }
    } catch (error) {
      console.error('Error adding highlighted product:', error)
      toast.error(error.response?.data?.message || 'Failed to highlight product')
    }
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(
        backendUrl + `/api/highlighted-products/update/${editingProduct._id}`,
        formData,
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Highlighted product updated successfully')
        setShowEditModal(false)
        setEditingProduct(null)
        setFormData({ productId: '', title: '', description: '', displayOrder: 0 })
        fetchHighlightedProducts()
      } else {
        toast.error(response.data.message || 'Failed to update highlighted product')
      }
    } catch (error) {
      console.error('Error updating highlighted product:', error)
      toast.error(error.response?.data?.message || 'Failed to update highlighted product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this highlighted product?')) {
      try {
        const response = await axios.delete(backendUrl + `/api/highlighted-products/delete/${id}`, {
          headers: { token }
        })
        if (response.data.success) {
          toast.success('Highlighted product deleted successfully')
          fetchHighlightedProducts()
        } else {
          toast.error(response.data.message || 'Failed to delete highlighted product')
        }
      } catch (error) {
        console.error('Error deleting highlighted product:', error)
        toast.error(error.response?.data?.message || 'Failed to delete highlighted product')
      }
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.patch(backendUrl + `/api/highlighted-products/toggle/${id}`, {}, {
        headers: { token }
      })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchHighlightedProducts()
      } else {
        toast.error(response.data.message || 'Failed to toggle status')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error(error.response?.data?.message || 'Failed to toggle status')
    }
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      productId: product.productId._id,
      title: product.title,
      description: product.description || '',
      displayOrder: product.displayOrder
    })
    setShowEditModal(true)
  }

  const openAddModal = () => {
    setFormData({ productId: '', title: '', description: '', displayOrder: 0 })
    setShowAddModal(true)
  }

  // Filter products that are not already highlighted
  const availableProducts = allProducts.filter(product =>
    !highlightedProducts.some(hp => hp.productId._id === product._id)
  )

  // Filter highlighted products based on search and status
  const filteredProducts = highlightedProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive)
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: highlightedProducts.length,
    active: highlightedProducts.filter(p => p.isActive).length,
    inactive: highlightedProducts.filter(p => !p.isActive).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Highlighted Products</h1>
        <p className="text-gray-600">Manage featured products that appear prominently on your website</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Highlighted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search highlighted products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {filterStatus === 'all' ? 'All' : filterStatus === 'active' ? 'Active' : 'Inactive'}
                </span>
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setFilterStatus('all')
                        setShowFilterDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                    >
                      All Products
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus('active')
                        setShowFilterDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'active' ? 'bg-blue-50 text-blue-700' : ''}`}
                    >
                      Active Only
                    </button>
                    <button
                      onClick={() => {
                        setFilterStatus('inactive')
                        setShowFilterDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${filterStatus === 'inactive' ? 'bg-blue-50 text-blue-700' : ''}`}
                    >
                      Inactive Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>

            {/* Refresh Button */}
            <button
              onClick={fetchHighlightedProducts}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No highlighted products found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding some products to highlight'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.productId.image[0]}
                            alt={product.productId.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{product.productId.name}</p>
                            <p className="text-sm text-gray-500">{product.productId.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.title}</p>
                          {product.description && (
                            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          #{product.displayOrder}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(product._id)}
                            className={`p-2 rounded-lg transition-colors ${product.isActive
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-green-600 hover:bg-green-50'
                              }`}
                            title={product.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={product.productId.image[0]}
                        alt={product.productId.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-500">{product.productId.name}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Order: #{product.displayOrder}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(product._id)}
                          className={`p-2 rounded-lg transition-colors ${product.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                            }`}
                        >
                          {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Highlighted Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a product</option>
                    {availableProducts.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter highlight title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Highlighted Product</h3>
            <form onSubmit={handleEditProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {editingProduct.productId.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default HighlightedProducts
