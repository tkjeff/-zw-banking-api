const {
  registerUser,
  loginUser,
} = require("../services/authService");

const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const user = await registerUser({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Username or email already exists") {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to register user",
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      username,
      password,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const result = await loginUser({
      username,
      password,
    });

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Invalid username or password" ||
      error.message === "User account is inactive"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to login",
    });
  }
};

module.exports = {
  register,
  login,
};