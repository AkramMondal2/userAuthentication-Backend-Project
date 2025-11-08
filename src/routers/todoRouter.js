import express from "express";
import { hasToken } from "../middleware/hasToken.js";
import { addTodo, deleteTodo, getAllTodo, updateTodo } from "../controllers/todoController.js";

const todoRouter = express.Router();

todoRouter.post("/addTodo", hasToken, addTodo);
todoRouter.get("/getAllTodo", hasToken, getAllTodo);
todoRouter.delete("/deleteTodo/:id", hasToken, deleteTodo);
todoRouter.put("/updateTodo/:id", hasToken, updateTodo);

export default todoRouter;
