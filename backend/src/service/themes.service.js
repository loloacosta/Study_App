const { sequelize } = require("../connection");
const { ThemesModel } = require("../model/themes.model");

const listar = async function (textoBuscar) {
  console.log("listar temas");
  try {
    const themes = await sequelize.query(`SELECT * 
      FROM themes
      WHERE 1=1
        AND UPPER(name) LIKE UPPER('%${textoBuscar}%')
      ORDER BY order_index ASC`);
    if (themes && themes[0]) {
      return themes[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 tema por codigo");
  try {
    const themesModelResult = await ThemesModel.findByPk(codigo);
    if (themesModelResult) {
      return themesModelResult;
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
  description,
  keywords,
  owner_user_id
) {
  console.log("actualizar temas");
  let themesReturn = null;
  //const data = req.body;
  //const id = req.body.id;
  const data = { id, create_date, name, description, keywords, owner_user_id };
  try {
    let themesExist = null;
    if (id) {
      themesExist = await ThemesModel.findByPk(id);
    }
    if (themesExist) {
      themesReturn = await ThemesModel.update(data, { where: { id: id } });
      themesReturn = data;
    } else {
      themesReturn = await ThemesModel.create(data);
    }
    return themesReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  console.log("eliminar temas");
  try {
    ThemesModel.destroy({ where: { id: codigo } }, { truncate: false });
    // await sequelize.query("UPDATE themes SET deleted=true WHERE id= " + codigo);
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const guardarCambios = async function (temas) {
  console.log("Intentando guardar cambios en temas");
  const transaction = await sequelize.transaction(); // Inicia una nueva transacción
  try {
    for (const tema of temas) {
      // Encuentra o crea el tema en una sola operación atómica
      const [temaExistente, created] = await ThemesModel.upsert(tema, { transaction });
      // 'created' es un booleano que indica si el tema fue creado (true) o actualizado (false)
    }
    await transaction.commit(); // Si todo va bien, confirma los cambios
    return temas;
  } catch (error) {
    await transaction.rollback(); // Si hay un error, revierte todos los cambios
    console.log(error);
    throw new Error('Error al guardar cambios en temas');
  }
};

const actualizarOrden = async function (orderData) {
  const transaction = await sequelize.transaction();
  try {
    //console.log("sdfsfsf",orderData);
    for (const item of orderData) {
      await ThemesModel.update({ order_index: item.order_index }, {
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


module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  guardarCambios,
  actualizarOrden,
};
