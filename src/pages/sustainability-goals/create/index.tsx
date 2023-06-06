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
import { createSustainabilityGoal } from 'apiSdk/sustainability-goals';
import { Error } from 'components/error';
import { sustainabilityGoalValidationSchema } from 'validationSchema/sustainability-goals';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';
import { SustainabilityGoalInterface } from 'interfaces/sustainability-goal';

function SustainabilityGoalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SustainabilityGoalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSustainabilityGoal(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SustainabilityGoalInterface>({
    initialValues: {
      goal_name: '',
      target_value: 0,
      current_value: 0,
      created_at: new Date(new Date().toDateString()),
      updated_at: new Date(new Date().toDateString()),
      business_organization_id: (router.query.business_organization_id as string) ?? null,
    },
    validationSchema: sustainabilityGoalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Sustainability Goal
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="goal_name" mb="4" isInvalid={!!formik.errors?.goal_name}>
            <FormLabel>Goal Name</FormLabel>
            <Input type="text" name="goal_name" value={formik.values?.goal_name} onChange={formik.handleChange} />
            {formik.errors.goal_name && <FormErrorMessage>{formik.errors?.goal_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="target_value" mb="4" isInvalid={!!formik.errors?.target_value}>
            <FormLabel>Target Value</FormLabel>
            <NumberInput
              name="target_value"
              value={formik.values?.target_value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('target_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.target_value && <FormErrorMessage>{formik.errors?.target_value}</FormErrorMessage>}
          </FormControl>
          <FormControl id="current_value" mb="4" isInvalid={!!formik.errors?.current_value}>
            <FormLabel>Current Value</FormLabel>
            <NumberInput
              name="current_value"
              value={formik.values?.current_value}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('current_value', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.current_value && <FormErrorMessage>{formik.errors?.current_value}</FormErrorMessage>}
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
  entity: 'sustainability_goal',
  operation: AccessOperationEnum.CREATE,
})(SustainabilityGoalCreatePage);
