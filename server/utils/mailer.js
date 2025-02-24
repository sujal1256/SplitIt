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
      process.env.FRONTEND_URL
    }/invite?q=${encodeURIComponent(group._id)}&email=${encodeURIComponent(member.email)}`;

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

async function sendContactEmail(name, email, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      pool: true, // Necessary to permanently make a connection
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailSent = await transporter.sendMail({
      from: `"Contact Form" <${name}>`, // Your email as the sender
      to: process.env.EMAIL_USER, // Your email as the recipient
      replyTo: email, // This sets the reply-to address to the user's email
      subject: `Contact Form Submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    console.log("✅ Message sent: %s", mailSent.messageId);
  } catch (error) {
    console.log("❌ Error in sending the email", error);
  }
}

async function sendNewsletterEmail(email) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      pool: true, // Necessary to permanently make a connection
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailSent = await transporter.sendMail({
      from: `"Newsletter">`, // Your email as the sender
      to: email, // Your email as the recipient
      subject: `Newsletter Subscription`,
      html: `
        <p> This is a newsletter email</p>
      `,
    });

    console.log("✅ Message sent: %s", mailSent.messageId);
  } catch (error) {
    console.log("❌ Error in sending the email", error);
  }
}

async function sendOTPEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      pool: true, // Necessary to permanently make a connection
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailSent = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for password reset",
      html: `
        <p>Your OTP for password reset is <strong>${otp}</strong></p>
      `,
    });

    console.log("✅ Message sent: %s", mailSent.messageId);
  } catch (error) {
    console.log("❌ Error in sending the email", error);
  }
  
}
export {
  sendInviteEmail,
  sendEmailToNewUserWithPassword,
  sendContactEmail,
  sendNewsletterEmail,
  sendOTPEmail
};
