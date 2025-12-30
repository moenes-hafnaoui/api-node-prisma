
const mariadb = require("mariadb");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("./generated/prisma/client");

const pool = mariadb.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "dbcommerce",
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
