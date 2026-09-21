const prisma = require("../config/prisma");

const createAuditLog = async ({
  action,
  entity,
  entityId,
  details,
  db = prisma,
}) => {
  return db.auditLog.create({
    data: {
      action,
      entity,
      entityId: entityId || null,
      details: details || null,
    },
  });
};

module.exports = {
  createAuditLog,
};