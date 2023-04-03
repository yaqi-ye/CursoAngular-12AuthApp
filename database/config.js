const mongoose = require('mongoose');


const dbConnection = async() => {
    mongoose.connect( process.env.DB_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('Conexión a la base de datos establecida');
    })
    .catch((error) => {
        console.error('Error al conectar a la base de datos:', error);
    });
}

module.exports = {
    dbConnection
}