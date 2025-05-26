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

export default function EmailVerificationMail({
  verificationCode = "596853",
}: SupaAuthVerifyEmailProp) {
  return (
    <Html>
      <Head />
      <Preview>Edublog Email Verification</Preview>
      <Body style={bodyStyles}>
        <Container style={containerStyles}>
          <Section>
            <Text style={logoTextStyles}>Edublog</Text>
            <Section>
              <Heading style={h1Styles}>Verify your email address</Heading>
              <Text style={mainTextStyles}>
                Thanks for starting the new Edublog account creation process. We
                want to make sure it&apos;s really you. Please enter the
                following verification code when prompted. If you don&apos;t
                want to create an account, you can ignore this message.
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
