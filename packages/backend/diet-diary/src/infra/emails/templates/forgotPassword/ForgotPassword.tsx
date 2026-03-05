import React from "react"
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  TailwindConfig,
  Text,
} from '@react-email/components';

interface ForgotPasswordProps {
  codeParameter?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const tailwindConfig: TailwindConfig = {}

export const ForgotPassword = ({
  codeParameter,
}: ForgotPasswordProps) => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="bg-white font-slack mx-auto my-0">
        <Preview>🧃 Diet Diary | Recupere sua conta</Preview>
        <Container className="mx-auto my-0 py-0 px-5">
          <Heading className="text-[#1d1c1d] text-4xl font-bold my-[30px] mx-0 p-0 leading-[42px]">
            🧃 Recupere sua conta
          </Heading>
          <Text className="text-xl mb-7.5">
            Utilize o código abaixo para recuperar a sua conta.
          </Text>

          <Section className="bg-[rgb(245,244,245)] rounded mb-[30px] py-10 px-[10px]">
            <Text className="text-3xl leading-[24px] text-center align-middle">
              {codeParameter}
            </Text>
          </Section>

          <Text className="text-black text-sm leading-6">
            Se você não solicitou este e-mail, não precisa se preocupar;
            pode ignorá-lo sem problemas.
          </Text>

          <Section>
            <Text className="text-xs leading-[15px] text-left mb-[50px] text-[#b7b7b7]">
              ©2022 Diet Diary, LLC, a Salesforce company. <br />
              500 Howard Street, San Francisco, CA 94105, USA <br />
              <br />
              Todos os direitos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

ForgotPassword.PreviewProps = {
  codeParameter: 'DJZ-TLX',
} as ForgotPasswordProps;

export default ForgotPassword;
