import express from "express"
import { createTaks, deleteTask, getAllTask, updateTask } from "../controllers/Task.controller.js";
import validate from "../middleware/Validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../SchemaValidation/task.Scheme.js";
import { authMiddleware } from "../middleware/Authmiddleware.js";
const TaskRoute=express.Router();

TaskRoute.post("/create",authMiddleware,  validate(createTaskSchema), createTaks)
TaskRoute.get("/get",authMiddleware,getAllTask)
TaskRoute.put("/:id",authMiddleware,validate(updateTaskSchema),updateTask)
TaskRoute.delete("/:id",authMiddleware,deleteTask)


export default TaskRoute;