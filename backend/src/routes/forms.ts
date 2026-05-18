import path from "path";
import { Router, type RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { z } from "zod";
import { AppError } from "../lib/errors";
import { validate } from "../lib/validate";
import { sendFormMail, type MailAttachment } from "../services/mailService";

const router = Router();

const allowedExtensions = new Set([".pdf", ".doc", ".docx"]);
const allowedMimeTypes = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);
const optionalMimeTypes = new Set(["", "application/octet-stream"]);
const maxAttachmentSizeBytes = 10 * 1024 * 1024;
const namePattern = /^[A-Za-z\u0590-\u05FF]+(?:[ -][A-Za-z\u0590-\u05FF]+)*$/;

const privacyConsentSchema = z
  .union([z.literal(true), z.literal("true"), z.literal("on")])
  .transform(() => true);

const baseFormSchema = z.object({
  userName: z.string().trim().min(2).regex(namePattern, "Invalid name"),
  userEmail: z.string().trim().email(),
  userPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{6,19}$/, "Invalid phone number")
    .refine((value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(1),
  privacyConsent: privacyConsentSchema
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxAttachmentSizeBytes,
    files: 1
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const mimeType = file.mimetype.toLowerCase();
    const hasAllowedExtension = allowedExtensions.has(extension);
    const hasAllowedMimeType =
      allowedMimeTypes.has(mimeType) || optionalMimeTypes.has(mimeType);

    if (hasAllowedExtension && hasAllowedMimeType) {
      callback(null, true);
      return;
    }

    callback(new AppError(400, "BAD_REQUEST", "Only PDF, DOC, and DOCX files are allowed"));
  }
});

const formsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next, options) => {
    next(
      new AppError(
        options.statusCode,
        "TOO_MANY_REQUESTS",
        "Too many form submissions. Please try again later."
      )
    );
  }
});

router.use(formsRateLimit);

const normalizeOptionalPhone = (phone?: string) => phone?.trim() || "";

const toMailBody = ({
  formType,
  userName,
  userEmail,
  userPhone,
  message,
  privacyConsent,
  attachmentName
}: z.infer<typeof baseFormSchema> & { formType: string; attachmentName?: string }) =>
  [
    `Form type: ${formType}`,
    `Name: ${userName}`,
    `Email: ${userEmail}`,
    `Phone: ${normalizeOptionalPhone(userPhone) || "Not provided"}`,
    `Privacy consent: ${privacyConsent ? "Yes" : "No"}`,
    `Attachment: ${attachmentName || "None"}`,
    "",
    "Message:",
    message
  ].join("\n");

const handleUploadError: RequestHandler = (req, _res, next) => {
  upload.single("cv")(req, _res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          new AppError(
            413,
            "PAYLOAD_TOO_LARGE",
            "Attachment is too large. Maximum allowed size is 10MB."
          )
        );
        return;
      }

      next(new AppError(400, "BAD_REQUEST", "Invalid file upload"));
      return;
    }

    next(error);
  });
};

const getAttachment = (file?: Express.Multer.File): MailAttachment[] => {
  if (!file) {
    return [];
  }

  return [
    {
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }
  ];
};

router.post("/contact", async (req, res, next) => {
  try {
    const payload = validate(baseFormSchema, req.body);

    await sendFormMail({
      subject: "New contact form submission - Job4You",
      text: toMailBody({ ...payload, formType: "Contact us" }),
      replyTo: payload.userEmail
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/apply", handleUploadError, async (req, res, next) => {
  try {
    const payload = validate(baseFormSchema, req.body);
    const attachmentName = req.file?.originalname;

    await sendFormMail({
      subject: "New job application - Job4You",
      text: toMailBody({ ...payload, formType: "Job application", attachmentName }),
      replyTo: payload.userEmail,
      attachments: getAttachment(req.file)
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/request-cv", handleUploadError, async (req, res, next) => {
  try {
    const payload = validate(baseFormSchema, req.body);
    const attachmentName = req.file?.originalname;

    await sendFormMail({
      subject: "New CV request - Job4You",
      text: toMailBody({ ...payload, formType: "CV request", attachmentName }),
      replyTo: payload.userEmail,
      attachments: getAttachment(req.file)
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
