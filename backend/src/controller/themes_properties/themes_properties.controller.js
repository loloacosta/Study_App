const { sequelize } = require("../../connection");
const { ThemesPropertiesModel } = require("../../model/themes_properties.model");
const themesPropertiesService = require("../../service/themes_properties.service");

const listar = async function (req, res) {
  console.log("listar propiedades de temas controller");
  try {
    const themes_properties = await themesPropertiesService.listar(
      req.query.filtro || ""
    );
    if (themes_properties && themes_properties.length > 0) {
      res.json({
        success: true,
        themes_properties: themes_properties,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const consultarPorCodigo = async function (req, res) {
  console.log("consultar 1 propiedad de tema por codigo controller");
  try {
    const themesPropertiesModelResult =
      await themesPropertiesService.consultarPorCodigo(req.params.filtro || "");
    if (themesPropertiesModelResult) {
      res.json({
        success: true,
        themes_properties: themesPropertiesModelResult,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const consultarPorCodigoTheme = async function (req, res) {
  console.log("consultar 1 propiedad de tema por codigo del tema controller");
  try {
    const themesPropertiesModelResult =
      await themesPropertiesService.consultarPorCodigoTheme(req.params.filtro || "");
    if (themesPropertiesModelResult && themesPropertiesModelResult.length > 0) {
      res.json({
        success: true,
        themes_properties: themesPropertiesModelResult,
      });
    } else {
      res.json({
        success: true,
        themes_properties: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const actualizar = async function (req, res) {
  console.log("actualizar propiedad de tema controller");
  let themesPropertiesReturn = null;
  try {
    // Verifica si req.body.id existe
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        error: 'ID es requerido para la actualización.',
      });
    }

    themesPropertiesReturn = await themesPropertiesService.actualizar(
      req.body.id,
      req.body.theme_id,
      req.body.property_name,
      req.body.property_value
    );
    res.json({
      success: true,
      themes_properties: themesPropertiesReturn,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const eliminar = async function (req, res) {
  console.log("eliminar propiedad de tema controller");
  try {
    await themesPropertiesService.eliminar(req.params.filtro || "");
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error: error.message,
    });
  }
};

const insertar = async (req, res) => {
  console.log("Insertar propiedad de tema controller");
  try {
    const { theme_id, property_name, property_value } = req.body;

    const propiedadInsertada = await themesPropertiesService.insertar(
      theme_id,
      property_name,
      property_value
    );

    res.status(201).json({
      success: true,
      themeProperty: propiedadInsertada,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Error al insertar la propiedad de tema',
    });
  }
};

module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  consultarPorCodigoTheme,
  insertar
};
