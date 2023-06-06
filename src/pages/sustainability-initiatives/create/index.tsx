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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createSustainabilityInitiative } from 'apiSdk/sustainability-initiatives';
import { Error } from 'components/error';
import { sustainabilityInitiativeValidationSchema } from 'validationSchema/sustainability-initiatives';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { SustainabilityInitiativeInterface } from 'interfaces/sustainability-initiative';

function SustainabilityInitiativeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SustainabilityInitiativeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSustainabilityInitiative(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SustainabilityInitiativeInterface>({
    initialValues: {
      initiative_name: '',
      description: '',
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      business_organization_id: (router.query.business_organization_id as string) ?? null,
    },
    validationSchema: sustainabilityInitiativeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Sustainability Initiative
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'sustainability_initiative',
  operation: AccessOperationEnum.CREATE,
})(SustainabilityInitiativeCreatePage);
