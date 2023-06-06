import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getWasteManagements, deleteWasteManagementById } from 'apiSdk/waste-managements';
import { WasteManagementInterface } from 'interfaces/waste-management';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function WasteManagementListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<WasteManagementInterface[]>(
    () => '/waste-managements',
    () =>
      getWasteManagements({
        relations: ['business_organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteWasteManagementById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Waste Management
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('waste_management', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/waste-managements/create`}>
            <Button colorScheme="blue" mr="4">
              Create
            </Button>
          </Link>
        )}
        {error && <Error error={error} />}
        {deleteError && <Error error={deleteError} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>waste_type</Th>
                  <Th>waste_amount</Th>
                  <Th>created_at</Th>
                  <Th>updated_at</Th>
                  {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>business_organization</Th>
                  )}

                  {hasAccess('waste_management', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('waste_management', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('waste_management', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.waste_type}</Td>
                    <Td>{record.waste_amount}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>{record.updated_at as unknown as string}</Td>
                    {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/business-organizations/view/${record.business_organization?.id}`}>
                          {record.business_organization?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('waste_management', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/waste-managements/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('waste_management', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/waste-managements/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('waste_management', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Button onClick={() => handleDelete(record.id)}>Delete</Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'waste_management',
  operation: AccessOperationEnum.READ,
})(WasteManagementListPage);
