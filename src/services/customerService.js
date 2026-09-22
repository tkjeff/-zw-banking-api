const prisma = require("../config/prisma");

const createCustomer = async ({
  firstName,
  lastName,
  email,
  phone,
}) => {
  return prisma.customer.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
    },
  });
};

const getCustomers = async () => {
  return prisma.customer.findMany({
    include: {
      accounts: true,
    },
  });
};

const getCustomerById = async (id) => {
  return prisma.customer.findUnique({
    where: {
      id,
    },
    include: {
      accounts: true,
    },
  });
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
};