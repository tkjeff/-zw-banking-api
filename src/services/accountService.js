const crypto = require("crypto");
const prisma = require("../config/prisma");

const generateAccountNumber = () => {
  return crypto.randomInt(1000000000, 9999999999).toString();
};

const createAccount = async ({
  customerId,
  accountType = "CHECKING",
}) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  let accountNumber;

  while (true) {
    accountNumber = generateAccountNumber();

    const existingAccount = await prisma.account.findUnique({
      where: {
        accountNumber,
      },
    });

    if (!existingAccount) {
      break;
    }
  }

  return prisma.account.create({
    data: {
      accountNumber,
      accountType,
      customerId,
    },
  });
};

module.exports = {
  createAccount,
};