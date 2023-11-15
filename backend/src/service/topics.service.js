const { sequelize } = require("../connection");
const { TopicsModel } = require("../model/topics.model");
const { Comments } = require('../model/comments.model');
const { SharedTopicsModel } = require("../model/shared_topics");



const listar = async function (textoBuscar) {
  console.log("listar topicos");
  try {
    const topics = await sequelize.query(`SELECT * 
      FROM topics
      WHERE 1=1
        AND UPPER(name) LIKE UPPER('%${textoBuscar}%')
      ORDER BY order_index ASC`);
    if (topics && topics[0]) {
      return topics[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 topico por codigo");
  try {
    const topicsModelResult = await TopicsModel.findByPk(codigo);
    if (topicsModelResult) {
      return topicsModelResult;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const actualizar = async function (
  id,
  create_date,
  name,
  topic_id,
  order,
  priority,
  color,
  owner_user_id
) {
  console.log("actualizar topicos");

  let topicsReturn = null;
  const data = {
    id,
    create_date,
    name,
    topic_id,
    order,
    priority,
    color,
    owner_user_id,
  };

  try {
    let topicsExist = null;
    if (id) {
      topicsExist = await TopicsModel.findByPk(id);
    }
    if (topicsExist) {
      topicsReturn = await TopicsModel.update(data, { where: { id: id } });
      topicsReturn = data;
    } else {
      topicsReturn = await TopicsModel.create(data);
    }
    return topicsReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const eliminar = async function (codigo) {
  try {
    await TopicsModel.destroy({ where: { id: codigo } });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new Error('No se puede eliminar el tópico porque tiene comentarios asociados.');
    }
    throw error;
  }
};




const listarComentarios = async function (textoBuscar) {
  console.log("listar comentarios topicos service");
  try {
    const comentarios = await sequelize.query(
      'SELECT c.id, c.text, c.topic_id, c.user_id, c.created_at, u.name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.topic_id = :topicId',
      {
        replacements: { topicId: textoBuscar },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (comentarios && comentarios.length > 0) {
      return comentarios;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const comentarTopicoService = async function (comentarioData) {
  try {
    const { text, topic_id, user_id } = comentarioData;

    // Utilizar el modelo de Sequelize para insertar un comentario
    const newComment = await Comments.create({
      text,
      topic_id,
      user_id,
    });

    // `newComment` contendrá la instancia del comentario recién creado

    return newComment; // Puedes retornar el comentario insertado si es necesario
  } catch (error) {
    throw new Error("Error al guardar el comentario en la base de datos");
  }
};

const compartirUsuariosService = async function (dataSharedTopics) {
  try {
    const { user_shared_id, topic_id, user_destination_ids } = dataSharedTopics;

    const insertQueries = user_destination_ids.map(user_destination_id => {
      return `INSERT INTO shared_topics (user_shared_id, topic_id, user_destination_id) VALUES (${user_shared_id}, ${topic_id}, ${user_destination_id})`;
    });

    const insertQuery = insertQueries.join('; '); // Unir las consultas separadas por punto y coma

    await sequelize.query(insertQuery);

    return "Datos insertados correctamente";
  } catch (error) {
    throw new Error("Error al insertar los datos en la base de datos en el servicio 810");
  }
};

const listarSharedMeService = async function (userId) {
  console.log("listar topicos");
  
  try {
    const topics = await sequelize.query(`
      SELECT Distinct t.*, st.id as id_compartido, u.name as nombre, u.last_name as apellido
      FROM shared_topics st
      INNER JOIN topics t ON st.topic_id = t.id
      INNER JOIN users u ON u.id = st.user_shared_id
      WHERE st.user_destination_id = :userId
      ORDER BY t.id`, {
      replacements: { userId: userId },
      type: sequelize.QueryTypes.SELECT
    });

    return topics;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const actualizarOrden = async function (orderData) {
  const transaction = await sequelize.transaction();
  try {
    console.log(orderData);
    for (const item of orderData) {
      await TopicsModel.update({ order_index: item.order_index }, {
        where: { id: item.id },
        transaction
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const eliminarComentario = async function (commentId) {
  try {
    await Comments.destroy({ where: { id: commentId } });
  } catch (error) {
    throw error;
  }
};



// const eliminarTopicoCompartido = async function (sharedTopicId) {
//   try {
//     await SharedTopicsModel.destroy({ where: { id: sharedTopicId } });
//   } catch (error) {
//     throw error;
//   }
// };

const eliminarTopicoComparidoConmigo = async function (codigo) {
  console.log("kasjhasd");
  try {
    await sequelize.query(`
      DELETE FROM shared_topics
      WHERE id = :codigo
    `, {
      replacements: { codigo: codigo },
      type: sequelize.QueryTypes.DELETE
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};



module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  listarComentarios,
  comentarTopicoService,
  compartirUsuariosService,
  listarSharedMeService,
  actualizarOrden,
  eliminarComentario,
  eliminarTopicoComparidoConmigo
};
