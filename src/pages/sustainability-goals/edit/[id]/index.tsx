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
import { getSustainabilityGoalById, updateSustainabilityGoalById } from 'apiSdk/sustainability-goals';
import { Error } from 'components/error';
import { sustainabilityGoalValidationSchema } from 'validationSchema/sustainability-goals';
import { SustainabilityGoalInterface } from 'interfaces/sustainability-goal';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';

function SustainabilityGoalEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SustainabilityGoalInterface>(
    () => (id ? `/sustainability-goals/${id}` : null),
    () => getSustainabilityGoalById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SustainabilityGoalInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSustainabilityGoalById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SustainabilityGoalInterface>({
    initialValues: data,
    validationSchema: sustainabilityGoalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Sustainability Goal
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'sustainability_goal',
  operation: AccessOperationEnum.UPDATE,
})(SustainabilityGoalEditPage);
