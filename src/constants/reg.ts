export const EMAIL_REG =
  /^[a-zA-Z0-9._%+-]+@(icloud\.com|gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
export const FULL_NAME_REG = /^[\p{L}\-']+(?:\s[\p{L}\-']+)*$/u;
export const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/;
export const PIN_REG = /^\d{6}$/;
export const TITLE_REG = /^\S[\S ]*\S$|^\S$/;
export const SLUG_REG = /^[a-z0-9-]+$/;
export const CATEGORY_REG = /^(?! )[a-zA-Z0-9& ]*(?<! )$/;
