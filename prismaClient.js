
const mariadb = require("mariadb");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("./generated/prisma/client");

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dbcommerce",
  connectionLimit: 10,
});

const adapter = new PrismaMariaDb(pool);

let prisma;
if (process.env.NODE_ENV === "development") {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient({ adapter });
}

module.exports = prisma;
