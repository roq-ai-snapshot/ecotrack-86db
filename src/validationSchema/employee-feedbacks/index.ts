import * as yup from 'yup';

export const employeeFeedbackValidationSchema = yup.object().shape({
  feedback: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  business_organization_id: yup.string().nullable().required(),
});
