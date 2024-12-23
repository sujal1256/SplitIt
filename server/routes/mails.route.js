import express from 'express';  
import { handleSendEmail } from '../controllers/mail.controller.js';

const mailRouter = express.Router();

mailRouter.route('/contact-us').post(handleSendEmail);

export { mailRouter };