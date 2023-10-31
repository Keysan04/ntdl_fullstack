import express from "express";
import { connectMongo } from "./src/config/dbConfig.js";

import {
  deleteManyTask,
  deleteTask,
  getAllTasks,
  insertTask,
  switchTask,
} from "./src/model/TaskModel.js";
import cors from "cors";
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

let fakeDb = [];
connectMongo();

app.get("/api/v2/task", async (req, res) => {
  const taskList = await getAllTasks();
  res.json({
    status: "success",
    message: "Here are the task list",
    taskList,
  });
});

app.post("/api/v2/task", async (req, res) => {
  const result = await insertTask(req.body);

  result?._id
    ? res.json({
        status: "success",
        message: "New task has been added!",
      })
    : res.json({
        status: "error",
        message: "Error, unable to add the task, try again later",
      });
});

app.patch("/api/v2/task", async (req, res) => {
  const { _id, type } = req.body;
  const result = await switchTask(_id, { type });

  result?._id
    ? res.json({
        status: "success",
        message: "The task has been updated!",
      })
    : res.json({
        status: "error",
        message: "Error, unable to update the task, try again later",
      });
});

// app.delete("/api/v2/task/:_id", async (req, res) => {
app.delete("/api/v2/task/", async (req, res) => {
  const { ids } = req.body;
  console.log(ids);

  // const result = await deleteTask(_id);
  const result = await deleteManyTask(ids);
  console.log(result);
  result?.deletedCount
    ? res.json({
        status: "success",
        message: "All selected tasks has been deleted successfully!",
      })
    : res.json({
        status: "success",
        message: "Nothing to delete, try again later",
      });
});

app.get("/", (req, res) => {
  res.json({
    message: "server is running normal",
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log("Your server is running at http://localhost:" + PORT);
});
