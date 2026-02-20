const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const { createCommentSchema } = require("../validations/commentValidation");

const addComment = async (req, res, next) => {
  try {
    const { error } = createCommentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.details[0].message
      });
    }

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Ticket not found"
      });
    }

    if (
      req.user.role === "customer" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        data: null,
        error: "Access denied"
      });
    }

    if (req.user.role === "customer" && req.body.type === "internal") {
      return res.status(403).json({
        success: false,
        data: null,
        error: "Customers cannot create internal notes"
      });
    }

    const comment = await Comment.create({
      ticketId: ticket._id,
      body: req.body.body,
      type: req.body.type,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: comment,
      error: null
    });

  } catch (err) {
    next(err);
  }
};

const getTicketWithComments = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Ticket not found"
      });
    }

    if (
      req.user.role === "customer" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        data: null,
        error: "Access denied"
      });
    }

    let commentFilter = { ticketId: ticket._id };

    if (req.user.role === "customer") {
      commentFilter.type = "public";
    }

    const comments = await Comment.find(commentFilter)
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ticket,
        comments
      },
      error: null
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  addComment,
  getTicketWithComments
};