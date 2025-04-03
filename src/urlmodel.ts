import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true, index: true }, // Short URL identifier
  longUrl: { type: String, required: true, unique: true, index: true }, // Original long URL
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 }, // Track URL usage
});

// TTL Index: Auto-delete URLs after 1 year (optional)
urlSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const URL = mongoose.model("URL", urlSchema);
export default URL;
