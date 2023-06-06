import * as yup from 'yup';

export const carbonFootprintValidationSchema = yup.object().shape({
  emission_source: yup.string().required(),
  emission_value: yup.number().integer().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  business_organization_id: yup.string().nullable().required(),
});
