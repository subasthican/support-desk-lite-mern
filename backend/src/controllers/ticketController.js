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

// get all tickets
const getTickets = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "customer") {
      filter.createdBy = req.user._id;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
      error: null
    });
  } catch (err) {
    next(err);
  }
};

// get ticket by iD
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

// assign Ticket
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
