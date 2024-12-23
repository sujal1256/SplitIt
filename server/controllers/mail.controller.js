import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendContactEmail } from "../utils/mailer.js";

async function handleSendEmail(req, res) {    
  const { name, email, message } = req.body;
  if (!name && !email && !message) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Missing required fields while sending contact email")
      );
  }

  try {
    await sendContactEmail(name, email, message);
    return res
      .status(200)
      .json(new ApiResponse(200, "Email sent successfully"));
  } catch (error) {
    console.error("An error occurred while sending the contact email", error);
  }
}

export { handleSendEmail };
