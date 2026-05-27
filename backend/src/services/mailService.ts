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
  const user = process.env.MAIL_USER?.trim() || "";
  const pass = process.env.MAIL_PASS?.trim() || "";

  if (!host || !from) {
    throw new AppError(500, "INTERNAL", "Mail transport is not configured");
  }

  return {
    host,
    port: parseMailPort(),
    from,
    user,
    pass
  };
};

const getFormMailRecipient = () => {
  const to = process.env.MAIL_TO?.trim();

  if (!to) {
    throw new AppError(500, "INTERNAL", "Mail transport is not configured");
  }

  return to;
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
    to: getFormMailRecipient(),
    replyTo,
    attachmentCount: attachments.length,
    attachments: attachmentNames
  });

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: getFormMailRecipient(),
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

export const sendPasswordResetMail = async ({
  to,
  resetUrl
}: {
  to: string;
  resetUrl: string;
}) => {
  const transporter = createTransporter();
  const config = getMailConfig();
  const subject = "Reset your Job4You password";
  const text = [
    "We received a request to reset your Job4You password.",
    "",
    "Open the link below to choose a new password:",
    resetUrl,
    "",
    "If you did not request this change, you can ignore this email."
  ].join("\n");

  console.log("Sending password reset email", { to });

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text
    });

    console.log("Password reset email sent", {
      to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });
  } catch (error) {
    console.error("Failed to send password reset mail", error);
    throw new AppError(500, "INTERNAL", "Failed to send email");
  }
};
