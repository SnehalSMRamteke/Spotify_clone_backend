const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "song",
    required: true
  }
}, { timestamps: true });

// prevent duplicate favourite
favouriteSchema.index({ userId: 1, songId: 1 }, { unique: true });

module.exports = mongoose.model("favourite", favouriteSchema);
