import * as Yup from "yup";

export default Yup.object({
  username: Yup.string().label("Username").required().min(3).max(256),
  password: Yup.string()
    .label("Password")
    .required()
    .min(8)
    .max(20)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_]).*$/,
      "Password must include uppercase, lowercase, 4 digits, and a special character"
    ),
  confirmPassword: Yup.string()
    .label("Confirm Password")
    .required()
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
