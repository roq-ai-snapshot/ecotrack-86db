import * as yup from 'yup';

export const sustainabilityInitiativeValidationSchema = yup.object().shape({
  initiative_name: yup.string().required(),
  description: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  business_organization_id: yup.string().nullable().required(),
});
