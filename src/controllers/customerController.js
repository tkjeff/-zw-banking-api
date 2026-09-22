const {
  createCustomer: createCustomerService,
  getCustomers: getCustomersService,
  getCustomerById: getCustomerByIdService,
} = require("../services/customerService");

const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "First name, last name and email are required",
      });
    }

    const customer = await createCustomerService({
      firstName,
      lastName,
      email,
      phone,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Customer email already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await getCustomersService();

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
    const customer = await getCustomerByIdService(
      Number(req.params.id)
    );

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