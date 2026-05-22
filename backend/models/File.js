const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true,
    unique: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  roomId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    default: ''
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    default: 'Anonymous'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

fileSchema.index({ roomId: 1, uploadedAt: -1 });

const File = mongoose.model('File', fileSchema);

module.exports = File;
