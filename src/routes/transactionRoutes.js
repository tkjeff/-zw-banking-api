const express = require("express");

const {
  makeDeposit,
  makeWithdrawal,
  makeTransfer,
  getAccountTransactions,
} = require("../controllers/transactionController");

const {
  depositSchema,
  withdrawalSchema,
  transferSchema,
  validate,
} = require("../middleware/transactionValidation");

const router = express.Router();

router.post(
  "/deposit",
  validate(depositSchema),
  makeDeposit
);

router.post(
  "/withdraw",
  validate(withdrawalSchema),
  makeWithdrawal
);

router.post(
  "/transfer",
  validate(transferSchema),
  makeTransfer
);

router.get(
  "/account/:accountId",
  getAccountTransactions
);

module.exports = router;