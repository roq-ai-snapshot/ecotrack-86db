import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getSustainabilityInitiativeById, updateSustainabilityInitiativeById } from 'apiSdk/sustainability-initiatives';
import { Error } from 'components/error';
import { sustainabilityInitiativeValidationSchema } from 'validationSchema/sustainability-initiatives';
import { SustainabilityInitiativeInterface } from 'interfaces/sustainability-initiative';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';

function SustainabilityInitiativeEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SustainabilityInitiativeInterface>(
    () => (id ? `/sustainability-initiatives/${id}` : null),
    () => getSustainabilityInitiativeById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SustainabilityInitiativeInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSustainabilityInitiativeById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SustainabilityInitiativeInterface>({
    initialValues: data,
    validationSchema: sustainabilityInitiativeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Sustainability Initiative
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="initiative_name" mb="4" isInvalid={!!formik.errors?.initiative_name}>
              <FormLabel>Initiative Name</FormLabel>
              <Input
                type="text"
                name="initiative_name"
                value={formik.values?.initiative_name}
                onChange={formik.handleChange}
              />
              {formik.errors.initiative_name && <FormErrorMessage>{formik.errors?.initiative_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="created_at" mb="4">
              <FormLabel>Created At</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.created_at}
                onChange={(value: Date) => formik.setFieldValue('created_at', value)}
              />
            </FormControl>
            <FormControl id="updated_at" mb="4">
              <FormLabel>Updated At</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.updated_at}
                onChange={(value: Date) => formik.setFieldValue('updated_at', value)}
              />
            </FormControl>
            <AsyncSelect<BusinessOrganizationInterface>
              formik={formik}
              name={'business_organization_id'}
              label={'Select Business Organization'}
              placeholder={'Select Business Organization'}
              fetcher={getBusinessOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'sustainability_initiative',
  operation: AccessOperationEnum.UPDATE,
})(SustainabilityInitiativeEditPage);
