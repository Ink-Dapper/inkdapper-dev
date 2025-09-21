import highlightedProductModel from '../models/highlightedProductModel.js'
import productModel from '../models/productModel.js'

// Add highlighted product
const addHighlightedProduct = async (req, res) => {
  try {
    const { productId, title, description, displayOrder } = req.body

    // Check if product exists
    const product = await productModel.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Check if product is already highlighted
    const existingHighlight = await highlightedProductModel.findOne({ productId })
    if (existingHighlight) {
      return res.status(400).json({ success: false, message: 'Product is already highlighted' })
    }

    const highlightedProduct = new highlightedProductModel({
      productId,
      title,
      description,
      displayOrder: displayOrder || 0,
      date: Date.now()
    })

    await highlightedProduct.save()
    res.json({ success: true, message: 'Product highlighted successfully', highlightedProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Get all highlighted products
const getHighlightedProducts = async (req, res) => {
  try {
    const highlightedProducts = await highlightedProductModel
      .find({ isActive: true })
      .populate('productId')
      .sort({ displayOrder: 1, date: -1 })

    // Format boolean values properly
    const formattedProducts = highlightedProducts.map(item => ({
      ...item.toObject(),
      isActive: Boolean(item.isActive),
      productId: {
        ...item.productId.toObject(),
        soldout: Boolean(item.productId.soldout),
        bestseller: Boolean(item.productId.bestseller)
      }
    }))

    res.json({ success: true, highlightedProducts: formattedProducts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Get all highlighted products for admin
const getAllHighlightedProducts = async (req, res) => {
  try {
    const highlightedProducts = await highlightedProductModel
      .find()
      .populate('productId')
      .sort({ displayOrder: 1, date: -1 })

    // Format boolean values properly
    const formattedProducts = highlightedProducts.map(item => ({
      ...item.toObject(),
      isActive: Boolean(item.isActive),
      productId: {
        ...item.productId.toObject(),
        soldout: Boolean(item.productId.soldout),
        bestseller: Boolean(item.productId.bestseller)
      }
    }))

    res.json({ success: true, highlightedProducts: formattedProducts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Update highlighted product
const updateHighlightedProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, displayOrder, isActive } = req.body

    const highlightedProduct = await highlightedProductModel.findByIdAndUpdate(
      id,
      { title, description, displayOrder, isActive },
      { new: true }
    ).populate('productId')

    if (!highlightedProduct) {
      return res.status(404).json({ success: false, message: 'Highlighted product not found' })
    }

    res.json({ success: true, message: 'Highlighted product updated successfully', highlightedProduct })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Delete highlighted product
const deleteHighlightedProduct = async (req, res) => {
  try {
    const { id } = req.params

    const highlightedProduct = await highlightedProductModel.findByIdAndDelete(id)
    if (!highlightedProduct) {
      return res.status(404).json({ success: false, message: 'Highlighted product not found' })
    }

    res.json({ success: true, message: 'Highlighted product deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Toggle highlighted product status
const toggleHighlightedProduct = async (req, res) => {
  try {
    const { id } = req.params

    const highlightedProduct = await highlightedProductModel.findById(id)
    if (!highlightedProduct) {
      return res.status(404).json({ success: false, message: 'Highlighted product not found' })
    }

    highlightedProduct.isActive = !highlightedProduct.isActive
    await highlightedProduct.save()

    res.json({ 
      success: true, 
      message: `Highlighted product ${highlightedProduct.isActive ? 'activated' : 'deactivated'} successfully`,
      highlightedProduct 
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export {
  addHighlightedProduct,
  getHighlightedProducts,
  getAllHighlightedProducts,
  updateHighlightedProduct,
  deleteHighlightedProduct,
  toggleHighlightedProduct
}
