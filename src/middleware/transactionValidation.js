const { z } = require("zod");

const positiveMoney = z.coerce
  .number()
  .finite()
  .positive();

const positiveInteger = z.coerce
  .number()
  .int()
  .positive();

const depositSchema = z.object({
  accountId: positiveInteger,
  amount: positiveMoney,
  description: z.string().trim().max(255).optional(),
});

const withdrawalSchema = z.object({
  accountId: positiveInteger,
  amount: positiveMoney,
  description: z.string().trim().max(255).optional(),
});

const transferSchema = z.object({
  fromAccountId: positiveInteger,
  toAccountId: positiveInteger,
  amount: positiveMoney,
  description: z.string().trim().max(255).optional(),
});

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
};

module.exports = {
  depositSchema,
  withdrawalSchema,
  transferSchema,
  validate,
};