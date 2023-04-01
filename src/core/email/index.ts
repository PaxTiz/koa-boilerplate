import {
  SendSmtpEmail,
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@sendinblue/client";
import { readFileSync } from "fs";
import render from "just-template";
import { join } from "path";
import config from "../../config";
import { SendEmailInterface } from "./types";

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, config.sibApiKey);

export const send = (data: SendEmailInterface) => {
  if (!config.enableGlobalEmails) {
    return;
  }

  const email = new SendSmtpEmail();
  email.subject = data.subject;
  email.sender = data.from ?? { email: config.defaultFromEmail };
  email.to = data.to;
  email.cc = data.cc;
  email.replyTo = data.replyTo;
  email.headers = {
    "Content-Type": "text/html; charset=UTF-8",
  };

  if (data.template) {
    const textTemplate = readFileSync(
      join(__dirname, "templates", `${data.template}.text.template`),
      "utf-8"
    );
    const htmlTemplate = readFileSync(
      join(__dirname, "templates", `${data.template}.html.template`),
      "utf-8"
    );

    const renderedTextTemplate = render(textTemplate, data.data ?? {});
    const renderedHtmlTemplate = render(htmlTemplate, data.data ?? {});
    email.textContent = renderedTextTemplate;
    email.htmlContent = renderedHtmlTemplate;
  } else {
    email.textContent = data.text;
    email.htmlContent = data.html;
  }

  return apiInstance.sendTransacEmail(email);
};
