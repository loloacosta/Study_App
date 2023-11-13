const { sequelize } = require("../../connection");
const { ThemesModel } = require("../../model/themes.model");
const themesService = require('../../service/themes.service');


const listar = async function (req, res) {
  console.log("listar temas controller");
  try {
    const themes = await themesService.listar(req.query.filtro || "");
    res.json({
      success: true,
      temas: themes || [],
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const consultarPorCodigo = async function (req, res) {
  console.log("consultar 1 tema por codigo controller");
  try {
    const themesModelResult = await themesService.busquedaPorCodigo(req.params.filtro || "");
    res.json({
      success: true,
      theme: themesModelResult || [],
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const actualizar = async function (req, res) {
  console.log("actualizar temas controller");
  try {
    const themesReturn = await themesService.actualizar(
      req.body.id,
      req.body.create_date,
      req.body.name,
      req.body.description,
      req.body.keywords,
      req.body.owner_user_id
    );
    res.json({
      success: true,
      theme: themesReturn,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const eliminar = async function (req, res) {
  console.log("eliminar temas controller");
  try {
    await themesService.eliminar(req.params.filtro || "");
    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const guardarCambios = async function (req, res) {
  console.log("guardar cambios temas controller");
  try {
    const temasGuardados = await themesService.guardarCambios(req.body);
    console.log("Temas guardados en el controlador:", temasGuardados);
    res.json({
      success: true,
      temas: temasGuardados || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error al guardar cambios en temas',
    });
  }
};

module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  guardarCambios
};
