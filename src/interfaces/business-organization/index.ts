import { CarbonFootprintInterface } from 'interfaces/carbon-footprint';
import { EmployeeFeedbackInterface } from 'interfaces/employee-feedback';
import { SustainabilityGoalInterface } from 'interfaces/sustainability-goal';
import { SustainabilityInitiativeInterface } from 'interfaces/sustainability-initiative';
import { WasteManagementInterface } from 'interfaces/waste-management';
import { UserInterface } from 'interfaces/user';

export interface BusinessOrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  carbon_footprint?: CarbonFootprintInterface[];
  employee_feedback?: EmployeeFeedbackInterface[];
  sustainability_goal?: SustainabilityGoalInterface[];
  sustainability_initiative?: SustainabilityInitiativeInterface[];
  waste_management?: WasteManagementInterface[];
  user?: UserInterface;
  _count?: {
    carbon_footprint?: number;
    employee_feedback?: number;
    sustainability_goal?: number;
    sustainability_initiative?: number;
    waste_management?: number;
  };
}
