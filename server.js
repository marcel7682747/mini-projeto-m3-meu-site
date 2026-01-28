import express from "express";
import { Op } from "sequelize";
import sequelize from "./CONFIG/database.js";
import Livro from "./models/Livro.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));


app.get("/livros", async (req, res) => {
  const { titulo } = req.query;

  if (titulo) {
    const livros = await Livro.findAll({
      where: {
        titulo: {
          [Op.like]: `%${titulo}%`
        }
      }
    });
    return res.json(livros);
  }

  const livros = await Livro.findAll();
  res.json(livros);
});


app.post("/livros", async (req, res) => {
  const { titulo, autor } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: "O título é obrigatório" });
  }

  const livro = await Livro.create({ titulo, autor: autor || "" });
  res.status(201).json(livro);
});


app.put("/livros/:id", async (req, res) => {
  const { titulo, autor } = req.body;

  const livro = await Livro.findByPk(req.params.id);
  if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });

  if (titulo) livro.titulo = titulo;
  livro.autor = autor || livro.autor;

  await livro.save();
  res.json(livro);
});


app.delete("/livros/:id", async (req, res) => {
  const livro = await Livro.findByPk(req.params.id);
  if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });

  await livro.destroy();
  res.sendStatus(204);
});


async function startServer() {
  try {
    await sequelize.sync();
    console.log("📦 Banco sincronizado");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
}

startServer();
