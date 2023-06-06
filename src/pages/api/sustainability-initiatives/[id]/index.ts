import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { sustainabilityInitiativeValidationSchema } from 'validationSchema/sustainability-initiatives';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.sustainability_initiative
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSustainabilityInitiativeById();
    case 'PUT':
      return updateSustainabilityInitiativeById();
    case 'DELETE':
      return deleteSustainabilityInitiativeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSustainabilityInitiativeById() {
    const data = await prisma.sustainability_initiative.findFirst(
      convertQueryToPrismaUtil(req.query, 'sustainability_initiative'),
    );
    return res.status(200).json(data);
  }

  async function updateSustainabilityInitiativeById() {
    await sustainabilityInitiativeValidationSchema.validate(req.body);
    const data = await prisma.sustainability_initiative.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteSustainabilityInitiativeById() {
    const data = await prisma.sustainability_initiative.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
