const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");
const Ticket = require("./models/Ticket");
const Comment = require("./models/Comment");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data...");

    // Create users
    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin"
    });

    const agent = await User.create({
      name: "Agent User",
      email: "agent@test.com",
      password: hashedPassword,
      role: "agent"
    });

    const customer = await User.create({
      name: "Customer User",
      email: "customer@test.com",
      password: hashedPassword,
      role: "customer"
    });

    console.log("Users created...");

    // Create tickets
    const ticket1 = await Ticket.create({
      title: "Cannot login to my account",
      description: "I have been trying to login but keep getting invalid credentials error",
      priority: "high",
      status: "open",
      createdBy: customer._id,
      tags: ["login", "account"]
    });

    const ticket2 = await Ticket.create({
      title: "Payment not processing correctly",
      description: "When I try to make a payment it keeps failing at the checkout stage",
      priority: "high",
      status: "in_progress",
      createdBy: customer._id,
      assignedTo: agent._id,
      tags: ["payment", "billing"]
    });

    const ticket3 = await Ticket.create({
      title: "Need to update my email address",
      description: "I would like to change the email address associated with my account",
      priority: "low",
      status: "open",
      createdBy: customer._id,
      tags: ["account", "email"]
    });

    console.log("Tickets created...");

    // Create comments
    await Comment.create({
      ticketId: ticket1._id,
      body: "I am having this issue since yesterday",
      type: "public",
      createdBy: customer._id
    });

    await Comment.create({
      ticketId: ticket1._id,
      body: "Checking the account logs now",
      type: "internal",
      createdBy: agent._id
    });

    await Comment.create({
      ticketId: ticket2._id,
      body: "We are looking into the payment issue",
      type: "public",
      createdBy: agent._id
    });

    await Comment.create({
      ticketId: ticket2._id,
      body: "Payment gateway logs show timeout errors",
      type: "internal",
      createdBy: admin._id
    });

    await Comment.create({
      ticketId: ticket3._id,
      body: "Please provide your current email and new email",
      type: "public",
      createdBy: agent._id
    });

    console.log("Comments created...");

    console.log("✅ Seed completed successfully!");
    console.log("Admin: admin@test.com / 123456");
    console.log("Agent: agent@test.com / 123456");
    console.log("Customer: customer@test.com / 123456");

    process.exit(0);

  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedDB();