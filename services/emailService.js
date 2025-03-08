import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use your email service provider
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ID, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or App Password
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to send emails");
  }
});

export const sendTaskAssignmentEmail = async (email, taskTitle, assignedBy) => {
  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: "New Task Assigned",
    text: `Hello,

You have been assigned a new task: "${taskTitle}" by ${assignedBy}.

Please check your task dashboard for details.

Best,
Task Management System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Task assignment email sent successfully to:", email);
  } catch (error) {
    console.error("Error sending task assignment email:", error);
  }
};

export const sendTaskStatusUpdateEmail = async (email, taskTitle, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Task Status Updated",
    text: `Hello,

The status of your task "${taskTitle}" has been updated to: ${status}.

Please check your task dashboard for details.

Best,
Task Management System`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Task status update email sent to:", email);
  } catch (error) {
    console.error("Error sending task status update email:", error);
  }
};
