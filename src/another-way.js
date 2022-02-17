const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

let users = [];

function checkExistUSerAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = user;
  return next();
}

app.use(cors());
app.use(express.json());

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userExist = users.find((user) => user.username === username);

  if (userExist) {
    return response.status(400).json({ erro: "Username exist" });
  }

  const user = {
    id: uuid(),
    name,
    username,
    todos: [],
  };

  return response.status(201).json(user);
});

app.get("/todos", checkExistUSerAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checkExistUSerAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checkExistUSerAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("/todos/:id/done", checkExistUSerAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }

  todo.done = true;

  return response.json(todo);
});

app.delete("/todos/:id", checkExistUSerAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found" });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

app.listen(3333, () => {
  console.log("🚀Back-end started!");
});
