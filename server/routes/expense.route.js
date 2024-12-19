import express from "express";
import {
  handleAddExpense,
  handleGetAllExpenses,
} from "../controllers/expense.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const expenseRouter = express.Router();

expenseRouter.route("/add-expense").post(verifyJWT, handleAddExpense);
expenseRouter.route("/get-all-expenses").get(verifyJWT, handleGetAllExpenses);

export { expenseRouter };
