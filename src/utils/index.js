import * as Yup from "yup";

const regexPhoneNumber = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

export const loginPhoneValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required()
    .matches(regexPhoneNumber, "Phone number invalid")
    .label("Phone"),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});

export const signupValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm Password must match password.")
    .required("Confirm Password is required."),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required("Please enter a registered email")
    .label("Email")
    .email("Enter a valid email"),
});
