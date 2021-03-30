import * as yup from 'yup';

export const userAccountSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required(),
  confirm: yup.string().oneOf([yup.ref('password'), null], "password must match")
})
