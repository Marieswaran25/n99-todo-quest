import * as yup from 'yup';

export const loginSchema=yup.object({
    email:yup.string().email("* Enter Valid Email address").required("* Email address is required"),
    password:yup.string().required("* Password is required")
})
export const registerSchema=yup.object({
    name:yup.string().required("* Username is required"),
    email:yup.string().email("* Enter Valid Email address").required("* Email address is required"),
    password:yup.string().required("* Password is required").min(8,"Password must contain eight Characters").max(8,"Password must contain eight Characters"),
    confirmPassword:yup.string().oneOf([yup.ref("password")],"Password mismatch").required("* Confirm Password is required")
})
export const messageSchema=yup.object({
    email:yup.string().email("* Enter Valid Email address").required("* Email address is required"),
    message:yup.string().required('* Enter the message')
})
