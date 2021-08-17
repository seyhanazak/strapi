import React from 'react';
import { useFormikContext } from 'formik';
import { useIntl } from 'react-intl';
import { Checkbox } from '@strapi/parts/Checkbox';
import { getTrad } from '../../utils';

const AdvancedForm = () => {
  const { values, setFieldValue } = useFormikContext();
  const { formatMessage } = useIntl();

  return (
    <Checkbox
      hint={formatMessage({
        id: getTrad('Settings.locales.modal.advanced.setAsDefault.hint'),
      })}
      onChange={() => setFieldValue('isDefault', !values.isDefault)}
      value={values.isDefault}
    >
      {formatMessage({
        id: getTrad('Settings.locales.modal.advanced.setAsDefault'),
      })}
    </Checkbox>
  );
};

export default AdvancedForm;
