import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import AddBannerModel from "../models/addBannerModel.js";

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
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const reviewImage1 = req.files.reviewImage1 && req.files.reviewImage1[0];
    const reviewImage2 = req.files.reviewImage2 && req.files.reviewImage2[0];
    const reviewImage3 = req.files.reviewImage3 && req.files.reviewImage3[0];

    const reviewImages = [reviewImage1, reviewImage2, reviewImage3].filter(
      (item) => item !== undefined
    );

    let reviewImagesUrl = await Promise.all(
      reviewImages.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
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
      image: imagesUrl,
      reviewImage: reviewImagesUrl,
      date: Date.now(),
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

    let result = await cloudinary.uploader.upload(imageBanner.path, {
      resource_type: "image",
    });

    const bannerData = {
      imageBanner: [result.secure_url],
    };

    console.log(bannerData);

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
      let result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      banner.imageBanner = [result.secure_url];
    }

    await banner.save();
    res.json({ success: true, message: 'Banner updated successfully', banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// function for list products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, message: "Products Listed", products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list Banner
const listBanner = async (req, res) => {
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
    const { name, description, beforePrice, price, code, category, subCategory, sizes, bestseller } = req.body;

    // Find the existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Prepare the updated product data
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
      image: existingProduct.image, // Start with existing images
      reviewImage: existingProduct.reviewImage // Start with existing review images
    };

    // Handle image updates
    const imageFields = ['image1', 'image2', 'image3', 'image4', 'reviewImage1', 'reviewImage2', 'reviewImage3'];
    for (let field of imageFields) {
      if (req.files[field]) {
        let result = await cloudinary.uploader.upload(req.files[field][0].path, { resource_type: 'image' });
        if (field.startsWith('reviewImage')) {
          const index = parseInt(field.replace('reviewImage', '')) - 1;
          productData.reviewImage[index] = result.secure_url;
        } else {
          const index = parseInt(field.replace('image', '')) - 1;
          productData.image[index] = result.secure_url;
        }
      }
    }

    // Update the product in the database
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
    res.json({ success: true, message: "Banner Deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, editProduct, addBanner, listBanner, deleteBanner, updateBanner };