import productModel from "../models/productModel.js";
import AddBannerModel from "../models/addBannerModel.js";
import { uploadFile, deleteFile } from "../services/storageService.js";

// Helper function to generate slug from product name
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      beforePrice,
      price,
      code,
      category,
      subCategory,
      sizes,
      colors,
      bestseller,
      comboPrices,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    // Build structured folder: products/{code}/{primaryColor}/
    const parsedColors = colors ? JSON.parse(colors) : [];
    const primaryColor = parsedColors[0]
      ? parsedColors[0].toLowerCase().replace(/\s+/g, '-')
      : 'default';
    const safeCode = (code || '').replace(/[^a-zA-Z0-9\-_]/g, '') || 'unknown';
    const productFolder = `products/${safeCode}/${primaryColor}`;

    const imagesUrl = await Promise.all(
      images.map((item) =>
        uploadFile(item.buffer, item.originalname, item.mimetype, productFolder)
      )
    );

    const reviewImage1 = req.files.reviewImage1 && req.files.reviewImage1[0];
    const reviewImage2 = req.files.reviewImage2 && req.files.reviewImage2[0];
    const reviewImage3 = req.files.reviewImage3 && req.files.reviewImage3[0];

    const reviewImages = [reviewImage1, reviewImage2, reviewImage3].filter(Boolean);

    const reviewImagesUrl = await Promise.all(
      reviewImages.map((item) =>
        uploadFile(item.buffer, item.originalname, item.mimetype, `products/${safeCode}/reviews`)
      )
    );

    const productData = {
      name,
      description,
      category,
      beforePrice: Number(beforePrice),
      price: Number(price),
      code,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      colors: colors ? JSON.parse(colors) : [],
      image: imagesUrl,
      reviewImage: reviewImagesUrl,
      date: Date.now(),
      slug: slugify(name),
      comboPrices: comboPrices ? JSON.parse(comboPrices) : [],
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function for add banner
const addBanner = async (req, res) => {
  try {
    const imageBanner = req.file;

    if (!imageBanner) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const imageUrl = await uploadFile(
      imageBanner.buffer,
      imageBanner.originalname,
      imageBanner.mimetype,
      'banners'
    );

    const bannerData = { imageBanner: [imageUrl], colorLabel: req.body.colorLabel || '' };

    const banner = new AddBannerModel(bannerData);
    await banner.save();

    res.json({ success: true, message: "Banner Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// function for update banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await AddBannerModel.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.file) {
      // Delete the old image from MinIO before replacing
      if (banner.imageBanner && banner.imageBanner[0]) {
        await deleteFile(banner.imageBanner[0]);
      }

      const imageUrl = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'banners'
      );
      banner.imageBanner = [imageUrl];
    }

    if (req.body.colorLabel !== undefined) {
      banner.colorLabel = req.body.colorLabel;
    }

    await banner.save();
    res.json({ success: true, message: 'Banner updated successfully', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// function for list products
const listProducts = async (_req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, message: "Products Listed", products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list Banner
const listBanner = async (_req, res) => {
  try {
    const banners = await AddBannerModel.find({});
    res.json({ success: true, message: "Banner Listed", banners });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing multiple products
const removeMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "No product IDs provided" });
    }
    await productModel.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} product(s) removed` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single products
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, message: "Product Listed", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, beforePrice, price, code, category, subCategory, sizes, colors, bestseller, comboPrices } = req.body;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let productData = {
      name,
      description,
      category,
      beforePrice: Number(beforePrice),
      price: Number(price),
      code,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      colors: colors ? JSON.parse(colors) : existingProduct.colors || [],
      image: [...existingProduct.image],
      reviewImage: [...existingProduct.reviewImage],
      slug: slugify(name),
      comboPrices: comboPrices ? JSON.parse(comboPrices) : existingProduct.comboPrices || [],
    };

    // Build structured folder: products/{code}/{primaryColor}/
    const editParsedColors = productData.colors;
    const editPrimaryColor = editParsedColors[0]
      ? editParsedColors[0].toLowerCase().replace(/\s+/g, '-')
      : 'default';
    const editSafeCode = (productData.code || '').replace(/[^a-zA-Z0-9\-_]/g, '') || 'unknown';
    const editProductFolder = `products/${editSafeCode}/${editPrimaryColor}`;
    const editReviewFolder = `products/${editSafeCode}/reviews`;

    // Upload any newly provided images and replace the corresponding slot
    const imageFields = ['image1', 'image2', 'image3', 'image4', 'reviewImage1', 'reviewImage2', 'reviewImage3'];
    for (const field of imageFields) {
      if (req.files[field]) {
        const file = req.files[field][0];
        const isReview = field.startsWith('reviewImage');
        const url = await uploadFile(file.buffer, file.originalname, file.mimetype, isReview ? editReviewFolder : editProductFolder);

        if (isReview) {
          const index = parseInt(field.replace('reviewImage', '')) - 1;
          productData.reviewImage[index] = url;
        } else {
          const index = parseInt(field.replace('image', '')) - 1;
          productData.image[index] = url;
        }
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, productData, { new: true });
    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await AddBannerModel.findByIdAndDelete(id);
    console.log(id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Clean up the file from MinIO as well
    if (banner.imageBanner && banner.imageBanner[0]) {
      await deleteFile(banner.imageBanner[0]);
    }

    res.json({ success: true, message: "Banner Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const toggleSoldout = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.soldout = !product.soldout;
    await product.save();

    res.json({ success: true, message: "Product soldout status updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for getting all products (for sitemap)
const getProducts = async () => {
  try {
    const products = await productModel.find({}, '_id updatedAt createdAt');
    return products;
  } catch (error) {
    console.error('Error getting products for sitemap:', error);
    throw error;
  }
};

export {
  addProduct,
  addBanner,
  listProducts,
  removeProduct,
  removeMultipleProducts,
  singleProduct,
  editProduct,
  listBanner,
  deleteBanner,
  updateBanner,
  toggleSoldout,
  getProducts,
};
