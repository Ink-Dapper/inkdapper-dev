import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    // Reference the correct Mongoose model name for orders
    ref: 'order'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification; 