import { DataTypes } from "sequelize";
import sequelize from "../CONFIG/database.js";

const Livro = sequelize.define("Livro", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Livro;
