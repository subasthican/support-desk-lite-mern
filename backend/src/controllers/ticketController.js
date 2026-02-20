const Ticket = require("../models/Ticket");
const { createTicketSchema, updateStatusSchema } = require("../validations/ticketValidation");
const { isValidStatusTransition } = require("../utils/statusTransition");

// create ticket
const createTicket = async (req, res, next) => {
  try {
    const { error } = createTicketSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.details[0].message
      });
    }

    const { title, description, priority, tags } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      tags,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: ticket,
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// get all tickets with pagination, filter, search
const getTickets = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      tag,
      search,
      from,
      to
    } = req.query;

    const parsedLimit = Math.min(parseInt(limit), 50);
    const parsedPage = parseInt(page);

    const query = {};

    // Role-based filtering
    if (req.user.role === "customer") {
      query.createdBy = req.user._id;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Priority filter
    if (priority) {
      query.priority = priority;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Date range filter
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const tickets = await Ticket.find(query)
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    const total = await Ticket.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        tickets,
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit)
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// get ticket by id
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

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

    return res.status(200).json({
      success: true,
      data: ticket,
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// change ticket status
const changeTicketStatus = async (req, res, next) => {
  try {
    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        data: null,
        error: error.details[0].message
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Ticket not found"
      });
    }

    if (!isValidStatusTransition(ticket.status, req.body.status)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: `Invalid status transition from ${ticket.status} to ${req.body.status}`
      });
    }

    ticket.status = req.body.status;
    await ticket.save();

    return res.status(200).json({
      success: true,
      data: ticket,
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// assign ticket
const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "Ticket not found"
      });
    }

    ticket.assignedTo = assignedTo;
    await ticket.save();

    return res.status(200).json({
      success: true,
      data: ticket,
      error: null
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  changeTicketStatus,
  assignTicket
};
