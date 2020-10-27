const mongoose = require('mongoose');
//mongoose vai conectar o node com o MongoDB

//conecta com o banco de dados
mongoose.connect("mongodb://localhost/noderest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});
//indica a classe de Promise que o mongoose vai utilizar
mongoose.Promise = global.Promise;

module.exports = mongoose;