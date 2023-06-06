import { BusinessOrganizationInterface } from 'interfaces/business-organization';

export interface SustainabilityInitiativeInterface {
  id?: string;
  business_organization_id: string;
  initiative_name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;

  business_organization?: BusinessOrganizationInterface;
  _count?: {};
}
