import SibApiV3Sdk from "@sendinblue/client";

export type SendEmailInterface = {
  subject: string;
  from: SibApiV3Sdk.SendSmtpEmailSender;
  to: Array<SibApiV3Sdk.SendSmtpEmailTo>;
  cc?: Array<SibApiV3Sdk.SendSmtpEmailTo>;
  replyTo?: SibApiV3Sdk.SendSmtpEmailReplyTo;
  template?: string;
  data?: Record<string, any>;
  text?: string;
  html?: string;
};
