import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Button, Link } from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getCarbonFootprints, deleteCarbonFootprintById } from 'apiSdk/carbon-footprints';
import { CarbonFootprintInterface } from 'interfaces/carbon-footprint';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function CarbonFootprintListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<CarbonFootprintInterface[]>(
    () => '/carbon-footprints',
    () =>
      getCarbonFootprints({
        relations: ['business_organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCarbonFootprintById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Carbon Footprint
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('carbon_footprint', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Link href={`/carbon-footprints/create`}>
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
                  <Th>emission_source</Th>
                  <Th>emission_value</Th>
                  <Th>created_at</Th>
                  <Th>updated_at</Th>
                  {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>business_organization</Th>
                  )}

                  {hasAccess('carbon_footprint', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                    <Th>Edit</Th>
                  )}
                  {hasAccess('carbon_footprint', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>View</Th>}
                  {hasAccess('carbon_footprint', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                    <Th>Delete</Th>
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr key={record.id}>
                    <Td>{record.emission_source}</Td>
                    <Td>{record.emission_value}</Td>
                    <Td>{record.created_at as unknown as string}</Td>
                    <Td>{record.updated_at as unknown as string}</Td>
                    {hasAccess('business_organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/business-organizations/view/${record.business_organization?.id}`}>
                          {record.business_organization?.name}
                        </Link>
                      </Td>
                    )}

                    {hasAccess('carbon_footprint', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/carbon-footprints/edit/${record.id}`} passHref legacyBehavior>
                          <Button as="a">Edit</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('carbon_footprint', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <NextLink href={`/carbon-footprints/view/${record.id}`} passHref legacyBehavior>
                          <Button as="a">View</Button>
                        </NextLink>
                      </Td>
                    )}
                    {hasAccess('carbon_footprint', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
  entity: 'carbon_footprint',
  operation: AccessOperationEnum.READ,
})(CarbonFootprintListPage);
