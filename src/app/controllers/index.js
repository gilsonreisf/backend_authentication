const fs = require('fs');
const path = require('path');

// fs trabalha com o file system do node e o path trabalha com cainhos de pastas

//filtra arquivos que não começam com ponto (não são arquivos de configuração) e que não são index.js
//O objetivo é simplificar a importação dos controllers no index.js principal, de modo que todos os controllers criados sejam automaticamente adicionados ao projeto
module.exports = app => {
    fs 
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file!== "index.js")))
        .forEach(file => require(path.resolve(__dirname, file))(app));
} 