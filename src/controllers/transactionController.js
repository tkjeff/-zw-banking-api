const prisma = require("../config/prisma");

const {
  deposit,
  withdraw,
  transfer,
} = require("../services/transactionService");

const makeDeposit = async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;

    if (!accountId || amount === undefined) {
      return res.status(400).json({
        message: "accountId and amount are required",
      });
    }

    const result = await deposit(
      Number(accountId),
      amount,
      description
    );

    res.status(201).json({
      message: "Deposit successful",
      ...result,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Account not found" ||
      error.message === "Account is not active"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

const makeWithdrawal = async (req, res) => {
  try {
    const { accountId, amount, description } = req.body;

    if (!accountId || amount === undefined) {
      return res.status(400).json({
        message: "accountId and amount are required",
      });
    }

    const result = await withdraw(
      Number(accountId),
      amount,
      description
    );

    res.status(201).json({
      message: "Withdrawal successful",
      ...result,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Account not found" ||
      error.message === "Account is not active"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

const makeTransfer = async (req, res) => {
  try {
    const {
      fromAccountId,
      toAccountId,
      amount,
      description,
    } = req.body;

    if (
      !fromAccountId ||
      !toAccountId ||
      amount === undefined
    ) {
      return res.status(400).json({
        message:
          "fromAccountId, toAccountId and amount are required",
      });
    }

    const result = await transfer(
      Number(fromAccountId),
      Number(toAccountId),
      amount,
      description
    );

    res.status(201).json({
      message: "Transfer successful",
      ...result,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Source account not found" ||
      error.message === "Destination account not found" ||
      error.message === "Source account is not active" ||
      error.message === "Destination account is not active"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
};

const getAccountTransactions = async (req, res) => {
  try {
    const accountId = Number(req.params.accountId);

    const transactions = await prisma.transaction.findMany({
      where: {
        accountId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};

module.exports = {
  makeDeposit,
  makeWithdrawal,
  makeTransfer,
  getAccountTransactions,
};