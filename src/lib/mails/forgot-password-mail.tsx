import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  bodyStyles,
  cautionTextStyles,
  codeTextStyles,
  containerStyles,
  h1Styles,
  logoTextStyles,
  mainTextStyles,
  validityTextStyles,
  verificationSectionStyles,
  verifyTextStyles,
} from "./styles";

interface SupaAuthVerifyEmailProp {
  verificationCode?: string;
}

export default function ForgotPasswordMail({
  verificationCode = "596853",
}: SupaAuthVerifyEmailProp) {
  return (
    <Html>
      <Head />
      <Preview>Edublog Password Reset</Preview>
      <Body style={bodyStyles}>
        <Container style={containerStyles}>
          <Section>
            <Text style={logoTextStyles}>Edublog</Text>
            <Section>
              <Heading style={h1Styles}>Reset Your Password</Heading>
              <Text style={mainTextStyles}>
                We received a request to reset your Edublog account password. If
                you made this request, please use the verification code below to
                proceed. If you didn&apos;t request a password reset, you can
                ignore this message.
              </Text>
              <Section style={verificationSectionStyles}>
                <Text style={verifyTextStyles}>Verification code</Text>
                <Text style={codeTextStyles}>{verificationCode}</Text>
                <Text style={validityTextStyles}>
                  (This code is valid for 1 hour)
                </Text>
              </Section>
            </Section>
            <Hr />
            <Text style={cautionTextStyles}>
              Edublog Services will never email you and ask you to disclose or
              verify your password, credit card, or banking account number.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
