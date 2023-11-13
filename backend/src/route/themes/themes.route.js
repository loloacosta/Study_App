// route.js
const themesController = require("../../controller/themes/themes.controller");
const authMiddleware = require("../../middleware/auth.controller");

module.exports = function (app) {
  app.get("/themes/list", authMiddleware.auth, themesController.listar);
  app.get(
    "/themes/buscarPorCodigo/:filtro",
    authMiddleware.auth,
    themesController.busquedaPorCodigo
  );
  app.post("/themes/update", authMiddleware.auth, themesController.actualizar);
  app.delete(
    "/themes/delete/:filtro",
    authMiddleware.auth,
    themesController.eliminar
  );
  // Corregir el nombre del método a "guardarCambios"
  app.post("/themes/guardarCambios", authMiddleware.auth, themesController.guardarCambios);
};
