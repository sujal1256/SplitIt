import nodemailer from "nodemailer";

async function sendEmail(recipentEmail, group) {
 try {
     const inviteEmail = process.env.BACKEND_URL + "/invite?q=" + group._id;
     const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
       },
     });
   
     const mailSent = await transporter.sendMail({
       from: process.env.EMAIL_USER, // sender address
       to: recipentEmail, // list of receivers
       subject: "Join Our Group on SplitIt!", // Subject line
       html: `
             <p>You're invited to join <strong>${group.groupName}</strong>!</p>
             <p><a href=${inviteEmail}>Click here to accept the invitation.</a></p>
           `,
     });
   
     console.log("✅ Message sent: %s", mailSent.messageId);   
 } catch (error) {
    console.log("❌ Error in sending the email", error.message);
    
 }
}

export { sendEmail };
