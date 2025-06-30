const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  originalName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
