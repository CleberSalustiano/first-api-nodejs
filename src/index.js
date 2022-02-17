const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

let users = [];

function checkExistUSerAccount(request, response, next) {
  const { username } = request.body;

  let existUsername = false;

  users.map((user) => {
    if (user.username === username) {
      existUsername = true;
      next();
    }
  });

  if (existUsername === false) {
    return response.status(404).json({ error: "Usuário não existente" });
  }
}

app.use(cors());
app.use(express.json());

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const user = {
    id: uuid(),
    name: name,
    username: username,
    todos: [],
  };

  let existUsername;

  users.map((userF) => {
    const { username } = userF;
    existUsername = user.username === username ? true : false;
  });

  if (existUsername) {
    return response.status(400).json({ error: "Usuário ja existente" });
  } else {
    users.push(user);
    console.log(users);
    return response.json(user);
  }
});

app.get("/todos", checkExistUSerAccount, (request, response) => {
  const { username } = request.body;

  users.map((user) => {
    if (user.username === username) {
      return response.json(user.todos);
    }
  });
});

app.post("/todos", checkExistUSerAccount, (request, response) => {
  const { username, title, deadline } = request.body;

  users.map((user) => {
    if (user.username === username) {
      user.todos.push({
        id: uuid(),
        title: title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date(),
      });
      return response.json(user.todos);
    }
  });
});

app.put("/todos/:id", checkExistUSerAccount, (request, response) => {
  const { id } = request.params;
  const { username, title, deadline } = request.body;

  users.map((user) => {
    if (user.username === username) {
      user.todos.map((todo) => {
        if (todo.id === id) {
          todo.title = title;
          todo.deadline = new Date(deadline);
          console.log(todo);
          return response.json(todo);
        }
      });
    }
  });
});

app.patch("/todos/:id/done", checkExistUSerAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.body;
  let isTodosExist = false;

  users.map((user) => {
    if (user.username === username) {
      user.todos.map((todo) => {
        if (todo.id === id) {
          isTodosExist = true;
          todo.done = true;
          return response.json(todo);
        }
      });
    }
    if (isTodosExist === false) {
      return response.status(404).json({ error: "Todos Inexistente" });
    }
  });
});

app.delete("/todos/:id", checkExistUSerAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.body;
  let isTodosExist = false;
  users.map((user) => {
    if (user.username === username) {
      for (let i = 0; i < user.todos.length; i++) {
        const element = user.todos[i];
        if (element.id === id) {
          user.todos.splice(i, 1);
          isTodosExist = true;
          return response.status(204);
        }
      }
    }
    if (isTodosExist === false) {
      return response.status(404).json({ error: "Todos Inexistente" });
    }
  });
});

app.listen(3333, () => {
  console.log("🚀Back-end started!");
});
