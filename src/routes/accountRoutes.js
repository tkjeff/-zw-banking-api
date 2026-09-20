const express = require("express");

const {
  createBankAccount,
  getAccounts,
  getAccountById,
} = require("../controllers/accountController");

const router = express.Router();

router.post("/", createBankAccount);
router.get("/", getAccounts);
router.get("/:id", getAccountById);

module.exports = router;