const prisma = require("../config/prisma");

const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        accounts: true,
      },
    });

    res.json(customers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        accounts: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
};