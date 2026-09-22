const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const accountRoutes = require("./routes/accountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const { authenticate } = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/roleMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ZW Banking API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use(
  "/api/customers",
  authenticate,
  authorizeRoles("TELLER", "MANAGER", "ADMIN"),
  customerRoutes
);

app.use(
  "/api/accounts",
  authenticate,
  authorizeRoles("TELLER", "MANAGER", "ADMIN"),
  accountRoutes
);

app.use(
  "/api/transactions",
  authenticate,
  authorizeRoles("TELLER", "MANAGER", "ADMIN"),
  transactionRoutes
);

app.use(
  "/api/admin",
  authenticate,
  authorizeRoles("ADMIN"),
  adminRoutes
);

module.exports = app;