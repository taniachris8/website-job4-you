import nodemailer from "nodemailer";
import { AppError } from "../lib/errors";

const parseMailPort = () => {
  const rawPort = process.env.MAIL_PORT || "587";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new AppError(500, "INTERNAL", "Mail transport is not configured");
  }

  return port;
};

const getMailConfig = () => {
  const host = process.env.MAIL_HOST?.trim();
  const from = process.env.MAIL_FROM?.trim();
  const to = process.env.MAIL_TO?.trim();
  const user = process.env.MAIL_USER?.trim() || "";
  const pass = process.env.MAIL_PASS?.trim() || "";

  if (!host || !from || !to) {
    throw new AppError(500, "INTERNAL", "Mail transport is not configured");
  }

  return {
    host,
    port: parseMailPort(),
    from,
    to,
    user,
    pass
  };
};

const createTransporter = () => {
  const config = getMailConfig();

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: false,
    auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined
  });
};

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

interface SendMailOptions {
  subject: string;
  text: string;
  replyTo: string;
  attachments?: MailAttachment[];
}

export const sendFormMail = async ({
  subject,
  text,
  replyTo,
  attachments = []
}: SendMailOptions) => {
  const transporter = createTransporter();
  const config = getMailConfig();
  const attachmentNames = attachments.map((attachment) => attachment.filename);

  console.log("Sending form email", {
    subject,
    to: config.to,
    replyTo,
    attachmentCount: attachments.length,
    attachments: attachmentNames
  });

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.to,
      subject,
      text,
      replyTo,
      attachments
    });

    console.log("Form email sent", {
      subject,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      attachmentCount: attachments.length,
      attachments: attachmentNames
    });
  } catch (error) {
    console.error("Failed to send form mail", error);
    throw new AppError(500, "INTERNAL", "Failed to send email");
  }
};
