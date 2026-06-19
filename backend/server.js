const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      res.status(500).seqnd(err);
    } else {
      res.json(results);
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/tasks", (req, res) => {
 const {
  title,
  description,
  due_date,
  status,
  priority,
  category
} = req.body;

  const sql =
    "INSERT INTO tasks (title, description, due_date, status, priority,category) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [title, description, due_date, status, priority, category],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          message: "Task added successfully"
        });
      }
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          message: "Task deleted"
        });
      }
    }
  );
});

app.put("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  db.query(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({
          message: "Status updated"
        });
      }
    }
  );
});