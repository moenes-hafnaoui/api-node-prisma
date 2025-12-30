const express = require("express");
const router = express.Router();

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../generated/prisma/client");
const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "dbcommerce",
  connectionLimit: 10,
});
const prisma = new PrismaClient({ adapter });

// --- ROUTES ---

// Ajout
router.post("/", async (req, res) => {
  const {
    designation,
    marque,
    reference,
    qtestock,
    prix,
    imageart,
    scategorieID,
  } = req.body;
  try {
    const article = await prisma.articles.create({
      data: {
        designation,
        marque,
        reference,
        qtestock,
        prix,
        imageart,
        scategorieID,
      },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Liste standard avec pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || undefined;
    const skip = limit ? (page - 1) * limit : undefined;

    const articles = await prisma.articles.findMany({
      skip,
      take: limit,
      include: {
        scategories: { include: { categories: true } },
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Pagination
router.get("/art/pagination", async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const articles = await prisma.articles.findMany({
      skip,
      take: limit,
      include: { scategories: { include: { categories: true } } },
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Par Catégorie

// Liste des articles pour une catégorie
router.get("/cat/:idCateg", async (req, res) => {
  try {
    const idCateg = Number(req.params.idCateg);
    const articles = await prisma.articles.findMany({
      where: {
        scategories: {
          categorieID: idCateg
        }
      },
      include: {
        scategories: { include: { categories: true } },
      },
    });
    res.status(200).json(articles);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Unique
router.get("/:id", async (req, res) => {
  try {
    const article = await prisma.articles.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modif
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const article = await prisma.articles.update({
      data: req.body,
      where: { id: Number(id) },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.articles.delete({ where: { id: Number(id) } });
    res
      .status(200)
      .json({ message: "article " + id + " deleted successfully." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
