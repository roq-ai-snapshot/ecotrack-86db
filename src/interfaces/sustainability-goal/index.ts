import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface SustainabilityGoalInterface {
  id?: string;
  business_organization_id: string;
  goal_name: string;
  target_value: number;
  current_value: number;
  created_at?: Date;
  updated_at?: Date;

  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
