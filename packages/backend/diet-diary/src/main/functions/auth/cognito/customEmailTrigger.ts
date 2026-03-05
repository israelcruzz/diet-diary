import { CustomMessageTriggerEvent } from "aws-lambda";
import { render } from '@react-email/render';
import ForgotPassword from "@infra/emails/templates/forgotPassword/ForgotPassword";

export const handler = async (event: CustomMessageTriggerEvent) => {
  const { triggerSource } = event
  const { codeParameter } = event.request

  if (triggerSource === "CustomMessage_ForgotPassword") {
    const message = await render(ForgotPassword({ codeParameter }))

    event.response.emailSubject = "🧃 Diet Diary | Recupere sua conta"
    event.response.emailMessage = message
  }

  return event
}
