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
import { getWasteManagementById, updateWasteManagementById } from 'apiSdk/waste-managements';
import { Error } from 'components/error';
import { wasteManagementValidationSchema } from 'validationSchema/waste-managements';
import { WasteManagementInterface } from 'interfaces/waste-management';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { BusinessOrganizationInterface } from 'interfaces/business-organization';
import { getBusinessOrganizations } from 'apiSdk/business-organizations';

function WasteManagementEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<WasteManagementInterface>(
    () => (id ? `/waste-managements/${id}` : null),
    () => getWasteManagementById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: WasteManagementInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateWasteManagementById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<WasteManagementInterface>({
    initialValues: data,
    validationSchema: wasteManagementValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Waste Management
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="waste_type" mb="4" isInvalid={!!formik.errors?.waste_type}>
              <FormLabel>Waste Type</FormLabel>
              <Input type="text" name="waste_type" value={formik.values?.waste_type} onChange={formik.handleChange} />
              {formik.errors.waste_type && <FormErrorMessage>{formik.errors?.waste_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="waste_amount" mb="4" isInvalid={!!formik.errors?.waste_amount}>
              <FormLabel>Waste Amount</FormLabel>
              <NumberInput
                name="waste_amount"
                value={formik.values?.waste_amount}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('waste_amount', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.waste_amount && <FormErrorMessage>{formik.errors?.waste_amount}</FormErrorMessage>}
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
  entity: 'waste_management',
  operation: AccessOperationEnum.UPDATE,
})(WasteManagementEditPage);
