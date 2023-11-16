const themesPropertiesController = require('../../controller/themes_properties/themes_properties.controller')

module.exports = function(app){
    app.get("/themes_properties/list", themesPropertiesController.listar);
    app.get("/themes_properties/buscarPorCodigo/:filtro", themesPropertiesController.busquedaPorCodigo);
    app.get("/themes_properties/buscarPorTema/:filtro", themesPropertiesController.consultarPorCodigoTheme);
    app.post("/themes_properties/update", themesPropertiesController.actualizar);
    app.delete("/themes_properties/delete/:filtro", themesPropertiesController.eliminar);

    app.post("/themes_properties/insertar", themesPropertiesController.insertar);

    //recuperar contraseña
    app.post("/themes_properties/enviaremail",
        //authMiddleware.auth,
        themesPropertiesController.enviarEmail
    );
}