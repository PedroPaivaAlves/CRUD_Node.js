const express = require("express");

const server = express();

//explicitando para o express que ele deve ler json
server.use(express.json());

//Array de teste
const users = ["Pedro", "Diego", "Brian"];

//req: todos os dados da requisição
//res: todas as informações para retornar uma resposta para o front

//aplicando middleware
server.use((req, res, next) => {
  //realizando o log da aplicação para cada execução
  console.log(`Método: ${req.method}; URl: ${req.url}`);
  return next();
});

//middleware para checar se o paranmetro de nome é adicionado corretamente
function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User not found on request body" });
  }
  return next();
}

//middleware para checar se o usuário para seleção, deleção ou remoção existe
function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User does not exist" });
  }
  return next();
}

//Exemplo Route params = /users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  return res.json({ user: users[index] });
});

//listagem de todos os usuários
server.get("/users", (req, res) => {
  return res.json(users);
});

//adição de novo usuário via json
server.post("/users", checkUserExist, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

//edição de um usuário
server.put("/users/:index", checkUserInArray, checkUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//deleção de um usuário
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);

  return res.json(users);
});

//servidor instaciado na porta 3000
//localhost:3000/teste
server.listen(3000);
