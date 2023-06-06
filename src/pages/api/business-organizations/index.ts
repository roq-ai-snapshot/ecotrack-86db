import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { businessOrganizationValidationSchema } from 'validationSchema/business-organizations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBusinessOrganizations();
    case 'POST':
      return createBusinessOrganization();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBusinessOrganizations() {
    const data = await prisma.business_organization
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'business_organization'));
    return res.status(200).json(data);
  }

  async function createBusinessOrganization() {
    await businessOrganizationValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.carbon_footprint?.length > 0) {
      const create_carbon_footprint = body.carbon_footprint;
      body.carbon_footprint = {
        create: create_carbon_footprint,
      };
    } else {
      delete body.carbon_footprint;
    }
    if (body?.employee_feedback?.length > 0) {
      const create_employee_feedback = body.employee_feedback;
      body.employee_feedback = {
        create: create_employee_feedback,
      };
    } else {
      delete body.employee_feedback;
    }
    if (body?.sustainability_goal?.length > 0) {
      const create_sustainability_goal = body.sustainability_goal;
      body.sustainability_goal = {
        create: create_sustainability_goal,
      };
    } else {
      delete body.sustainability_goal;
    }
    if (body?.sustainability_initiative?.length > 0) {
      const create_sustainability_initiative = body.sustainability_initiative;
      body.sustainability_initiative = {
        create: create_sustainability_initiative,
      };
    } else {
      delete body.sustainability_initiative;
    }
    if (body?.waste_management?.length > 0) {
      const create_waste_management = body.waste_management;
      body.waste_management = {
        create: create_waste_management,
      };
    } else {
      delete body.waste_management;
    }
    const data = await prisma.business_organization.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
