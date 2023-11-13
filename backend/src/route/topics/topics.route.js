const topicsController = require("../../controller/topics/topics.controller");
const authMiddleware = require("../../middleware/auth.controller");

module.exports = function (app) {
  app.get(
    "/topics/list",
    authMiddleware.auth,
    topicsController.listar
  );
  app.get(
    "/topics/buscarPorCodigo/:filtro",
    authMiddleware.auth,
    topicsController.busquedaPorCodigo
  );
  app.post(
    "/topics/update",
    authMiddleware.auth,
    topicsController.actualizar
  );
  app.delete(
    "/topics/delete/:filtro",
    authMiddleware.auth,
    topicsController.eliminar
  );
  app.get(
    "/topic-details/:topic_id",
    authMiddleware.auth,
    topicsController.listarComentarios
  );
  app.post(
    "/topics-details/comment",
    authMiddleware.auth,
    topicsController.comentarTopicoController
  );
  app.post(
    "/topics-shared",
    authMiddleware.auth,
    topicsController.compartirUsuariosController
  );
  app.get(
    "/topics/shared_me/:id",
    authMiddleware.auth,
    topicsController.listarSharedMeController
  );

   //ordenar por seleccion
   app.post("/topics/update-order",
   authMiddleware.auth,
   topicsController.actualizarOrden
 );

};
