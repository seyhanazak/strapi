import React from 'react';
import PropTypes from 'prop-types';
import { useRBACProvider, Form } from '@strapi/helper-plugin';
import { ModalLayout, ModalHeader, ModalBody, ModalFooter } from '@strapi/parts/ModalLayout';
import { TabGroup, Tabs, Tab, TabPanels, TabPanel } from '@strapi/parts/Tabs';
import { Button } from '@strapi/parts/Button';
import { TextButton, H2 } from '@strapi/parts/Text';
import { Divider } from '@strapi/parts/Divider';
import { Box } from '@strapi/parts/Box';
import { Row } from '@strapi/parts/Row';
import CheckIcon from '@strapi/icons/CheckIcon';
import { useIntl } from 'react-intl';
import { Formik } from 'formik';
import localeFormSchema from '../../schemas';
import { getTrad } from '../../utils';
import useAddLocale from '../../hooks/useAddLocale';
import BaseForm from './BaseForm';
import AdvancedForm from './AdvancedForm';

const initialFormValues = {
  code: '',
  displayName: '',
  isDefault: false,
};

const ModalCreate = ({ onClose }) => {
  const { isAdding, addLocale } = useAddLocale();
  const { formatMessage } = useIntl();
  const { refetchPermissions } = useRBACProvider();

  const handleLocaleAdd = async values => {
    await addLocale({
      code: values.code,
      name: values.displayName,
      isDefault: values.isDefault,
    });

    await refetchPermissions();

    onClose();
  };

  return (
    <ModalLayout onClose={onClose} labelledBy="add-locale-title">
      <Formik
        initialValues={initialFormValues}
        onSubmit={handleLocaleAdd}
        validationSchema={localeFormSchema}
        validateOnChange={false}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalHeader>
              <TextButton textColor="neutral800" as="h2" id="add-locale-title">
                {formatMessage({ id: getTrad('Settings.list.actions.add') })}
              </TextButton>
            </ModalHeader>
            <ModalBody>
              <TabGroup label="Some stuff for the label" id="tabs" variant="simple">
                <Row justifyContent="space-between">
                  <H2>
                    {formatMessage({
                      id: getTrad('Settings.locales.modal.title'),
                    })}
                  </H2>
                  <Tabs>
                    <Tab>
                      {formatMessage({
                        id: getTrad('Settings.locales.modal.base'),
                      })}
                    </Tab>
                    <Tab>
                      {formatMessage({
                        id: getTrad('Settings.locales.modal.advanced'),
                      })}
                    </Tab>
                  </Tabs>
                </Row>

                <Divider />

                <Box paddingTop={7} paddingBottom={7}>
                  <TabPanels>
                    <TabPanel>
                      <BaseForm />
                    </TabPanel>
                    <TabPanel>
                      <AdvancedForm />
                    </TabPanel>
                  </TabPanels>
                </Box>
              </TabGroup>
            </ModalBody>
            <ModalFooter
              startActions={
                <Button variant="tertiary" onClick={onClose}>
                  {formatMessage({ id: 'app.components.Button.cancel' })}
                </Button>
              }
              endActions={
                <Button type="submit" startIcon={<CheckIcon />} disabled={isAdding}>
                  {formatMessage({ id: getTrad('Settings.locales.modal.create.confirmation') })}
                </Button>
              }
            />
          </Form>
        )}
      </Formik>
    </ModalLayout>
  );
};

ModalCreate.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ModalCreate;
