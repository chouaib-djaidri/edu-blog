export const bodyStyles = {
  backgroundColor: "#ffffff",
  color: "#031721",
};

export const containerStyles = {
  display: "flex",
  margin: "0 auto",
  backgroundColor: "#F3F4F6",
};

export const logoTextStyles = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "bold",
  margin: "0 auto",
  textAlign: "center" as const,
  backgroundColor: "#031721",
  padding: "20px 0",
};

export const h1Styles = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "24px",
  padding: "0 24px",
  textAlign: "center" as const,
};

const text = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "0",
  padding: "0 24px",
};

export const mainTextStyles = {
  ...text,
  lineHeight: "1.3",
  marginTop: "12px",
  textAlign: "center" as const,
};

export const verifyTextStyles = {
  ...text,
  fontWeight: "bold",
  textAlign: "center" as const,
};

export const codeTextStyles = {
  ...text,
  fontWeight: "bold",
  fontSize: "28px",
  padding: "12px 24px",
  textAlign: "center" as const,
};

export const validityTextStyles = {
  ...text,
  textAlign: "center" as const,
  margin: "0 0 24px 0",
};

export const verificationSectionStyles = { marginTop: "24px" };

export const cautionTextStyles = {
  ...text,
  padding: "24px",
  textAlign: "center" as const,
  lineHeight: "1.3",
};
