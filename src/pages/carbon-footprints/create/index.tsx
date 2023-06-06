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
import { createCarbonFootprint } from 'apiSdk/carbon-footprints';
import { Error } from 'components/error';
import { carbonFootprintValidationSchema } from 'validationSchema/carbon-footprints';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { CarbonFootprintInterface } from 'interfaces/carbon-footprint';

function CarbonFootprintCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CarbonFootprintInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCarbonFootprint(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CarbonFootprintInterface>({
    initialValues: {
      emission_source: '',
      emission_value: 0,
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      business_organization_id: (router.query.business_organization_id as string) ?? null,
    },
    validationSchema: carbonFootprintValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Carbon Footprint
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="emission_source" mb="4" isInvalid={!!formik.errors?.emission_source}>
            <FormLabel>Emission Source</FormLabel>
            <Input
              type="text"
              name="emission_source"
              value={formik.values?.emission_source}
              onChange={formik.handleChange}
            />
            {formik.errors.emission_source && <FormErrorMessage>{formik.errors?.emission_source}</FormErrorMessage>}
          </FormControl>
          <FormControl id="emission_value" mb="4" isInvalid={!!formik.errors?.emission_value}>
            <FormLabel>Emission Value</FormLabel>
            <NumberInput
              name="emission_value"
              value={formik.values?.emission_value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('emission_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.emission_value && <FormErrorMessage>{formik.errors?.emission_value}</FormErrorMessage>}
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
  entity: 'carbon_footprint',
  operation: AccessOperationEnum.CREATE,
})(CarbonFootprintCreatePage);
