import mongoose, { Schema, model, models } from "mongoose";

const UrlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

UrlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Url = models.Url || model("Url", UrlSchema);

export default Url;
