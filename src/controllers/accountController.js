const prisma = require("../config/prisma");
const { createAccount } = require("../services/accountService");

const createBankAccount = async (req, res) => {
  try {
    const { customerId, accountType } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "customerId is required",
      });
    }

    const account = await createAccount({
      customerId: Number(customerId),
      accountType,
    });

    res.status(201).json({
      message: "Bank account created successfully",
      account,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Customer not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to create bank account",
    });
  }
};

const getAccounts = async (req, res) => {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        customer: true,
      },
    });

    res.json(accounts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch accounts",
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        customer: true,
        transactions: true,
      },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    res.json(account);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch account",
    });
  }
};

module.exports = {
  createBankAccount,
  getAccounts,
  getAccountById,
};