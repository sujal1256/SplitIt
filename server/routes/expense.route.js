import express from "express";
import {
  handleAddExpense,
  handleGetAllExpenses,
} from "../controllers/expense.controller.js";

const expenseRouter = express.Router();

expenseRouter.route("/create-expense").post(handleAddExpense);
expenseRouter.route("/get-all-expenses").get(handleGetAllExpenses);

export { expenseRouter };
