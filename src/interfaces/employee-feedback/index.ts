import { UserInterface } from 'interfaces/user';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface EmployeeFeedbackInterface {
  id?: string;
  user_id: string;
  business_organization_id: string;
  feedback: string;
  created_at?: Date;
  updated_at?: Date;

  user?: UserInterface;
  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
