const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  content: { 
    type: String, 
    default: '' 
  },
  version: { 
    type: Number, 
    default: 0 
  },
  lastModified: { 
    type: Date, 
    default: Date.now 
  },
  history: [{
    content: String,
    timestamp: Date,
    version: Number
  }]
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
