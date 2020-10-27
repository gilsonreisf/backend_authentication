const express = require ('express');

const bodyParser = require('body-parser');

const app = express();

//Entende requisições em json que sao enviadas a api
app.use(bodyParser.json());

//Entende e decodifica parametros url passados a api
app.use(bodyParser.urlencoded({ extended: false }));


require('./app/controllers/index')(app);

app.listen(27017);
