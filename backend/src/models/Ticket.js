const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Ticket", ticketSchema);