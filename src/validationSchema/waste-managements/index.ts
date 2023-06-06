import * as yup from 'yup';

export const wasteManagementValidationSchema = yup.object().shape({
  waste_type: yup.string().required(),
  waste_amount: yup.number().integer().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  business_organization_id: yup.string().nullable().required(),
});
