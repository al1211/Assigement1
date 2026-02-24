import express from "express"
import { createTaks, deleteTask, getAllTask, updateTask } from "../controllers/Task.controller.js";
import validate from "../middleware/Validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../Schema/task.Scheme.js";
const TaskRoute=express.Router();

TaskRoute.post("/create",validate(createTaskSchema), createTaks)
TaskRoute.get("/get",getAllTask)
TaskRoute.put("/:id",validate(updateTaskSchema),updateTask)
TaskRoute.delete("/:id",deleteTask)


export default TaskRoute;