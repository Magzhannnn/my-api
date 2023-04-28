const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();
const port = 5000;

app.use(express.static(__dirname + "/public"));
const filePath = "users.json";

app.get("/api/users", (req, res) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(content);
  res.send(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const content = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(content);

  users.forEach((userItem) => {
    if (userItem.id === +id) res.send(userItem);
  });

  res.status(404).send();
});

app.post("/api/users", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(404);

  const uName = req.body.name;
  const uAge = req.body.age;
  let user = { name: uName, age: uAge };

  const data = fs.readFileSync(filePath, "utf-8");
  let users = JSON.parse(data);

  const id = Math.max.apply(
    Math,
    users.map(function (o) {
      return o.id;
    })
  );
  console.log("Post id:", Boolean(id))
  if (id === -Infinity) user.id = 1;
  else user.id = id + 1;

  users.push(user);

  fs.writeFileSync("users.json", JSON.stringify(users));
  res.send(user);
});

app.delete("/api/users/:id", (req, res) => {
  const id = +req.params.id;
  console.log(id);
  const data = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(data);
  const changeUsers = users.filter((user) => user.id !== +id);

  if (changeUsers.length === users.length) {
    res.sendStatus(404);
  } else {
    fs.writeFileSync("users.json", JSON.stringify(changeUsers));
    window.location.reload();
    res.send(changeUsers);
  }
});



app.put("/api/users", jsonParser, (req, res) => {
  if (!req.body) return res.sendStatus(400);
  const uId = +req.query.id;
  const uName = req.body.name;
  const uAge = req.body.age;
  console.log(uId);

  const data = fs.readFileSync(filePath, "utf-8");
  const users = JSON.parse(data);
  const updateUsers = users.map((user) =>
    user.id === uId ? { ...user, name: uName, age: uAge } : user
  );

  if (JSON.stringify(users) === JSON.stringify(updateUsers)) {
    fs.writeFileSync("users.json", JSON.stringify(updateUsers));
    window.location.reload();
    res.send({ id: uId, name: uName, age: uAge });
  } else {
    res.status(404).send({ id: uId, name: uName, age: uAge });
  }
});

app.listen(port, () => {
  console.log(`Started server in: ${port} port`);
});
