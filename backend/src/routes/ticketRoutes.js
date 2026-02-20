const express = require("express");
const {
  createTicket,
  getTickets,
  getTicketById,
  changeTicketStatus,
  assignTicket
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);

router.patch("/:id/status", authorize("agent", "admin"), changeTicketStatus);

router.patch("/:id/assign", authorize("agent", "admin"), assignTicket);

module.exports = router;