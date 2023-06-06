import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface WasteManagementInterface {
  id?: string;
  business_organization_id: string;
  waste_type: string;
  waste_amount: number;
  created_at?: Date;
  updated_at?: Date;

  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
