import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface CarbonFootprintInterface {
  id?: string;
  business_organization_id: string;
  emission_source: string;
  emission_value: number;
  created_at?: Date;
  updated_at?: Date;

  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
