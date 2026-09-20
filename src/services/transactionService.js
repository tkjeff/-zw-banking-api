const crypto = require("crypto");
const prisma = require("../config/prisma");
const { Prisma } = require("@prisma/client");

const generateReference = () => {
  return `TXN-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

const toMoney = (value) => {
  return new Prisma.Decimal(value);
};

const deposit = async (accountId, amount, description) => {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (account.status !== "ACTIVE") {
      throw new Error("Account is not active");
    }

    const depositAmount = toMoney(amount);

    if (!depositAmount.isFinite() || depositAmount.lte(0)) {
      throw new Error("Amount must be greater than zero");
    }

    const newBalance = account.balance.add(depositAmount);

    const updatedAccount = await tx.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: "DEPOSIT",
        amount: depositAmount,
        description: description || "Account deposit",
        reference: generateReference(),
        balanceAfter: newBalance,
        accountId,
      },
    });

    return {
      account: updatedAccount,
      transaction,
    };
  });
};

const withdraw = async (accountId, amount, description) => {
  return prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (account.status !== "ACTIVE") {
      throw new Error("Account is not active");
    }

    const withdrawalAmount = toMoney(amount);

    if (!withdrawalAmount.isFinite() || withdrawalAmount.lte(0)) {
      throw new Error("Amount must be greater than zero");
    }

    if (account.balance.lt(withdrawalAmount)) {
      throw new Error("Insufficient funds");
    }

    const newBalance = account.balance.sub(withdrawalAmount);

    const updatedAccount = await tx.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        type: "WITHDRAWAL",
        amount: withdrawalAmount,
        description: description || "Account withdrawal",
        reference: generateReference(),
        balanceAfter: newBalance,
        accountId,
      },
    });

    return {
      account: updatedAccount,
      transaction,
    };
  });
};

const transfer = async (
  fromAccountId,
  toAccountId,
  amount,
  description
) => {
  return prisma.$transaction(async (tx) => {
    if (fromAccountId === toAccountId) {
      throw new Error("Cannot transfer to the same account");
    }

    const transferAmount = toMoney(amount);

    if (!transferAmount.isFinite() || transferAmount.lte(0)) {
      throw new Error("Amount must be greater than zero");
    }

    const fromAccount = await tx.account.findUnique({
      where: { id: fromAccountId },
    });

    if (!fromAccount) {
      throw new Error("Source account not found");
    }

    if (fromAccount.status !== "ACTIVE") {
      throw new Error("Source account is not active");
    }

    const toAccount = await tx.account.findUnique({
      where: { id: toAccountId },
    });

    if (!toAccount) {
      throw new Error("Destination account not found");
    }

    if (toAccount.status !== "ACTIVE") {
      throw new Error("Destination account is not active");
    }

    if (fromAccount.balance.lt(transferAmount)) {
      throw new Error("Insufficient funds");
    }

    const newSourceBalance =
      fromAccount.balance.sub(transferAmount);

    const newDestinationBalance =
      toAccount.balance.add(transferAmount);

    const updatedSourceAccount = await tx.account.update({
      where: { id: fromAccountId },
      data: {
        balance: newSourceBalance,
      },
    });

    const updatedDestinationAccount = await tx.account.update({
      where: { id: toAccountId },
      data: {
        balance: newDestinationBalance,
      },
    });

    const outgoingTransaction = await tx.transaction.create({
      data: {
        type: "TRANSFER_OUT",
        amount: transferAmount,
        description:
          description ||
          `Transfer to account ${toAccount.accountNumber}`,
        reference: generateReference(),
        balanceAfter: newSourceBalance,
        accountId: fromAccountId,
      },
    });

    const incomingTransaction = await tx.transaction.create({
      data: {
        type: "TRANSFER_IN",
        amount: transferAmount,
        description:
          description ||
          `Transfer from account ${fromAccount.accountNumber}`,
        reference: generateReference(),
        balanceAfter: newDestinationBalance,
        accountId: toAccountId,
      },
    });

    return {
      fromAccount: updatedSourceAccount,
      toAccount: updatedDestinationAccount,
      outgoingTransaction,
      incomingTransaction,
    };
  });
};

module.exports = {
  deposit,
  withdraw,
  transfer,
};