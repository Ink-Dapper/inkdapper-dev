import express from "express";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  editProduct,
  addBanner,
  listBanner,
  deleteBanner,
  updateBanner,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

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
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProducts);
productRouter.get("/banner-list", listBanner);
productRouter.delete("/delete-banner/:id", adminAuth, deleteBanner);
productRouter.put('/update-banner/:id', upload.single('imageBanner'), updateBanner);
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

export default productRouter;
