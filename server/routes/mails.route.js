import express from "express";
import {
  handleSendContactEmail,
  handleSendNewsletterEmail,
} from "../controllers/mail.controller.js";

const mailRouter = express.Router();

mailRouter.route("/contact-us").post(handleSendContactEmail);
mailRouter.route("/subscription").post(handleSendNewsletterEmail);

export { mailRouter };
