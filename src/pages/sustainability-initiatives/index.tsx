import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getSustainabilityInitiatives, deleteSustainabilityInitiativeById } from 'apiSdk/sustainability-initiatives';
import { SustainabilityInitiativeInterface } from 'interfaces/sustainability-initiative';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function SustainabilityInitiativeListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<SustainabilityInitiativeInterface[]>(
    () => '/sustainability-initiatives',
    () =>
      getSustainabilityInitiatives({
        relations: ['business_organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSustainabilityInitiativeById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Sustainability Initiative
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('sustainability_initiative', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/sustainability-initiatives/create`}>
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
                  <Th>initiative_name</Th>
                  <Th>description</Th>
                  <Th>created_at</Th>
                  <Th>updated_at</Th>
                  {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>business_organization</Th>
                  )}

                  {hasAccess('sustainability_initiative', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('sustainability_initiative', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>View</Th>
                  )}
                  {hasAccess('sustainability_initiative', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.initiative_name}</Td>
                    <Td>{record.description}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>{record.updated_at as unknown as string}</Td>
                    {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/business-organizations/view/${record.business_organization?.id}`}>
                          {record.business_organization?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('sustainability_initiative', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/sustainability-initiatives/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('sustainability_initiative', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/sustainability-initiatives/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('sustainability_initiative', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'sustainability_initiative',
  operation: AccessOperationEnum.READ,
})(SustainabilityInitiativeListPage);
