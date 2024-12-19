// import { transporter } from "./constants.js";
import nodemailer from "nodemailer";

async function sendInviteEmail(member, group) {
  try {
    // Validate member and group
    if (!member || !member.name || !member.email) {
      throw new Error("Invalid member details. Name and email are required.");
    }
    if (!group || !group._id || !group.groupName) {
      throw new Error("Invalid group details. ID and group name are required.");
    }

    // Construct the invite email URL with proper encoding
    const inviteEmail = `${
      process.env.BACKEND_URL
    }/invite?q=${encodeURIComponent(group._id)}&name=${encodeURIComponent(
      member.name
    )}&email=${encodeURIComponent(member.email)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      pool: true, // this is neccessfully to permanently make a connection
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailSent = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: member.email,
      subject: "Join Our Group on SplitIt!",
      html: `
        <p>You're invited to join <strong>${group.groupName}</strong>!</p>
        <p><a href="${inviteEmail}">Click here to accept the invitation.</a></p>
      `,
    });

    console.log("✅ Message sent: %s", mailSent.messageId);
  } catch (error) {
    console.log("❌ Error in sending the email", error);
  }
}

async function sendEmailToNewUserWithPassword(newUser, group) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      pool: true, // this is neccessfully to permanently make a connection
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailSent = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.userEmail,
      subject: `Join ${group?.groupName} using this password`,
      html: `Use this password for email
      Email: ${newUser?.userEmail}
      Password: ${newUser?.password}`,
    });

    console.log("✅ Message sent: %s", mailSent.messageId);
  } catch (error) {
    console.log("❌ Error in sending the email", error.message);
  }
}

export { sendInviteEmail, sendEmailToNewUserWithPassword };
