const { sequelize } = require("../connection");
const { ThemesPropertiesModel } = require("../model/themes_properties.model");
const nodemailer = require('nodemailer');

const listar = async function (textoBuscar) {
  console.log("listar propiedades de temas");
  try {
    const themes_properties = await sequelize.query(
      `SELECT * FROM themes_properties WHERE 1=1 AND UPPER(property_name) LIKE UPPER(:textoBuscar) ORDER BY id`,
      {
        replacements: { textoBuscar: `%${textoBuscar}%` },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return themes_properties || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigo = async function (codigo) {
  console.log("consultar 1 propiedad de tema por codigo");
  try {
    const themesPropertiesModelResult = await ThemesPropertiesModel.findByPk(
      codigo
    );
    return themesPropertiesModelResult || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const consultarPorCodigoTheme = async function (codigo) {
  console.log("consultar 1 propiedad de tema por codigo del tema");
  try {
    const themes_properties = await sequelize.query(
      `SELECT * FROM themes_properties WHERE 1=1 AND theme_id = :codigo ORDER BY id`,
      {
        replacements: { codigo: codigo },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return themes_properties || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// const consultarPorCodigoTheme = async function (codigo) {
  
//   console.log("consultar 1 propiedad de tema por codigo del tema: " + codigo);
//   try {

//     // :codigo linea 46
//     const result = await sequelize.query(
//       `SELECT * FROM themes_properties 
//       WHERE theme_id = ${codigo}
//       ORDER BY id`
//     );
//     const themes_properties = result[0];

//     if (themes_properties.length>0) {
//       return themes_properties;
//     } else {
//       return[];
//     }
    

//   } catch (error) {
//     console.log("Error en consultarPorCodigoTheme",error);
//     throw error;
//   }
// };
const actualizar = async function (id, theme_id, property_name, property_value) {
  console.log("actualizar propiedad de tema");
  let themesPropertiesReturn = null;
  const data = { id, theme_id, property_name, property_value };
  try {
    let themesPropertiesExist = null;
    if (id) {
      themesPropertiesExist = await ThemesPropertiesModel.findByPk(id);
    }
    if (themesPropertiesExist) {
      themesPropertiesReturn = await ThemesPropertiesModel.update(data, {
        where: { id: id },
      });
      themesPropertiesReturn = data;
    } else {
      themesPropertiesReturn = await ThemesPropertiesModel.create(data);
    }
    return themesPropertiesReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminar = async function (codigo) {
  console.log("eliminar propiedad de tema");
  try {
    await ThemesPropertiesModel.destroy(
      { where: { id: codigo } },
      { truncate: false }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertar = async function (theme_id, property_name, property_value) {
  console.log("insertar propiedad de tema");
  try {
    const nuevaPropiedad = await ThemesPropertiesModel.create({
      theme_id,
      property_name,
      property_value,
    });
    return nuevaPropiedad;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sendEmail = async (destinoEmail, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'studyapplpv@gmail.com',
      pass: 'rciw rlnq smiw zkhg'
    }
  });


  let mailOptions = {
    from: 'studyapplpv@gmail.com',
    to: destinoEmail,
    subject: subject,
    text: text
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};


module.exports = {
  listar,
  busquedaPorCodigo: consultarPorCodigo,
  actualizar,
  eliminar,
  consultarPorCodigoTheme,
  insertar,
  sendEmail,
};
