import mongoose from 'mongoose';

const addBannerSchema = new mongoose.Schema({
  imageBanner: { type: Array, required: true },
  colorLabel: { type: String, default: '' }
});

const AddBannerModel = mongoose.models.addBanner || mongoose.model('addBanner', addBannerSchema);

export default AddBannerModel;
