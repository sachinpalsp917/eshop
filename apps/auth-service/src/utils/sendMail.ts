import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import {
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SERVICE,
  SMTP_USER,
} from "../../../../packages/config/env";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// render ejs email template
const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );

  return ejs.renderFile(templatePath, data);
};

// send an email using nodemailer
export const sendMail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, any>
) => {
  try {
    const html = await renderEmailTemplate(templateName, data);
    await transporter
      .sendMail({
        from: `<${SMTP_USER}>`,
        to,
        subject,
        html,
      })
      .then(() => {
        console.log(`Email sent successfully: ${to}`);
      });
  } catch (error) {
    console.log("Error sending mail: ", error);
  }
};
