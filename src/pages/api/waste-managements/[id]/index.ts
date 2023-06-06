import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { wasteManagementValidationSchema } from 'validationSchema/waste-managements';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.waste_management
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getWasteManagementById();
    case 'PUT':
      return updateWasteManagementById();
    case 'DELETE':
      return deleteWasteManagementById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getWasteManagementById() {
    const data = await prisma.waste_management.findFirst(convertQueryToPrismaUtil(req.query, 'waste_management'));
    return res.status(200).json(data);
  }

  async function updateWasteManagementById() {
    await wasteManagementValidationSchema.validate(req.body);
    const data = await prisma.waste_management.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteWasteManagementById() {
    const data = await prisma.waste_management.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
