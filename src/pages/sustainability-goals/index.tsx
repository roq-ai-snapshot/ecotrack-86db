import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getSustainabilityGoals, deleteSustainabilityGoalById } from 'apiSdk/sustainability-goals';
import { SustainabilityGoalInterface } from 'interfaces/sustainability-goal';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function SustainabilityGoalListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<SustainabilityGoalInterface[]>(
    () => '/sustainability-goals',
    () =>
      getSustainabilityGoals({
        relations: ['business_organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteSustainabilityGoalById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Sustainability Goal
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('sustainability_goal', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/sustainability-goals/create`}>
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
                  <Th>goal_name</Th>
                  <Th>target_value</Th>
                  <Th>current_value</Th>
                  <Th>created_at</Th>
                  <Th>updated_at</Th>
                  {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>business_organization</Th>
                  )}

                  {hasAccess('sustainability_goal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('sustainability_goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>View</Th>
                  )}
                  {hasAccess('sustainability_goal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.goal_name}</Td>
                    <Td>{record.target_value}</Td>
                    <Td>{record.current_value}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>{record.updated_at as unknown as string}</Td>
                    {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/business-organizations/view/${record.business_organization?.id}`}>
                          {record.business_organization?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('sustainability_goal', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/sustainability-goals/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('sustainability_goal', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/sustainability-goals/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('sustainability_goal', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'sustainability_goal',
  operation: AccessOperationEnum.READ,
})(SustainabilityGoalListPage);
