const express = require("express");

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.json({
    message: "Admin dashboard access granted",
    user: req.user,
  });
});

module.exports = router;