import * as yup from 'yup';
import { carbonFootprintValidationSchema } from 'validationSchema/carbon-footprints';
import { employeeFeedbackValidationSchema } from 'validationSchema/employee-feedbacks';
import { sustainabilityGoalValidationSchema } from 'validationSchema/sustainability-goals';
import { sustainabilityInitiativeValidationSchema } from 'validationSchema/sustainability-initiatives';
import { wasteManagementValidationSchema } from 'validationSchema/waste-managements';

export const businessOrganizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  created_at: yup.date().required(),
  updated_at: yup.date().required(),
  user_id: yup.string().nullable().required(),
  carbon_footprint: yup.array().of(carbonFootprintValidationSchema),
  employee_feedback: yup.array().of(employeeFeedbackValidationSchema),
  sustainability_goal: yup.array().of(sustainabilityGoalValidationSchema),
  sustainability_initiative: yup.array().of(sustainabilityInitiativeValidationSchema),
  waste_management: yup.array().of(wasteManagementValidationSchema),
});
