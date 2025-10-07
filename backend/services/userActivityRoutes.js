const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  getUserAnalytics,
  getUserDetails,
  updateUserStatus,
  sendWelcomeEmail,
  getUserActivityLogs,
  getUserStatistics,
  getRecentUsers,
  searchUsers
} = require("./userActivityController");

const router = express.Router();

// User management routes
router.get("/", protect, admin, getAllUsers);
router.get("/analytics/users", protect, admin, getUserAnalytics);
router.get("/statistics", protect, admin, getUserStatistics);
router.get("/recent", protect, admin, getRecentUsers);
router.get("/search", protect, admin, searchUsers);
router.get("/:userId", protect, admin, getUserDetails);
router.put("/:userId/status", protect, admin, updateUserStatus);
router.post("/emails/welcome/:userId", protect, admin, sendWelcomeEmail);
router.get("/activity/:userId", protect, admin, getUserActivityLogs);

module.exports = router;