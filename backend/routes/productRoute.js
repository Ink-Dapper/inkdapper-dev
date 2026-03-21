import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  removeMultipleProducts,
  singleProduct,
  editProduct,
  addBanner,
  listBanner,
  deleteBanner,
  updateBanner,
  toggleSoldout,
  getProducts,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import path from 'path';
import { fileURLToPath } from 'url';

const productRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

productRouter.post("/add",adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "reviewImage1", maxCount: 1 },
    { name: "reviewImage2", maxCount: 1 },
    { name: "reviewImage3", maxCount: 1 },
  ]),addProduct
);
productRouter.post("/add-banner",adminAuth,
  upload.single('imageBanner'), addBanner);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/remove-multiple", adminAuth, removeMultipleProducts);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);
productRouter.get("/banner-list", listBanner);
productRouter.delete("/delete-banner/:id", adminAuth, deleteBanner);
productRouter.put('/update-banner/:id', adminAuth, upload.single('imageBanner'), updateBanner);
productRouter.put("/edit/:id",adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "reviewImage1", maxCount: 1 },
    { name: "reviewImage2", maxCount: 1 },
    { name: "reviewImage3", maxCount: 1 },
  ]),editProduct
);
productRouter.put("/toggle-soldout/:id", adminAuth, toggleSoldout);

// Generate dynamic product sitemap
productRouter.get('/sitemap', async (req, res) => {
    try {
        const products = await getProducts();
        const baseUrl = 'https://www.inkdapper.com';
        
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        products.forEach(product => {
            sitemap += `
  <url>
    <loc>${baseUrl}/product/${product._id}</loc>
    <lastmod>${new Date(product.updatedAt || product.createdAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        sitemap += '\n</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error('Error generating product sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

export default productRouter;
