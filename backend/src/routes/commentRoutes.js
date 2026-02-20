const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  getTicketWithComments
} = require("../controllers/commentController");

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post("/", addComment);
router.get("/", getTicketWithComments);

module.exports = router;