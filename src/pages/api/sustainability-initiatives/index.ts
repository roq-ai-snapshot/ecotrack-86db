import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { sustainabilityInitiativeValidationSchema } from 'validationSchema/sustainability-initiatives';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSustainabilityInitiatives();
    case 'POST':
      return createSustainabilityInitiative();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSustainabilityInitiatives() {
    const data = await prisma.sustainability_initiative
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'sustainability_initiative'));
    return res.status(200).json(data);
  }

  async function createSustainabilityInitiative() {
    await sustainabilityInitiativeValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.sustainability_initiative.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
