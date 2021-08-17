import React from 'react';
import { Select, Option } from '@strapi/parts/Select';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import useLocales from '../../hooks/useLocales';
import useDefaultLocales from '../../hooks/useDefaultLocales';
import { getTrad } from '../../utils';

/**
 * The component is memoized and needs a useCallback over the onLocaleChange and
 * onClear props to prevent the Select from re-rendering N times when typing on a specific
 * key in a formik form
 */
const LocaleSelect = React.memo(({ value, onLocaleChange, error, onClear }) => {
  const { formatMessage } = useIntl();
  const { defaultLocales, isLoading } = useDefaultLocales();
  const { locales } = useLocales();

  const options = (defaultLocales || [])
    .map(locale => ({
      label: locale.code,
      value: locale.name,
    }))
    .filter(({ label }) => {
      const foundLocale = locales.find(({ code }) => code === label);

      return !foundLocale;
    });

  const defaultOption = options[0];

  return (
    <Select
      label={formatMessage({
        id: getTrad('Settings.locales.modal.locales.label'),
      })}
      onClear={onClear}
      clearLabel={formatMessage({
        id: getTrad('Settings.locales.modal.base.clearLabel'),
      })}
      error={error}
      value={value || defaultOption}
      onChange={selectedLocaleKey => {
        const selectedLocale = options.find(locale => locale.label === selectedLocaleKey);

        if (selectedLocale) {
          onLocaleChange({ code: selectedLocale.label, displayName: selectedLocale.value });
        }
      }}
    >
      {isLoading
        ? null
        : options.map(option => (
            <Option value={option.label} key={option.label}>
              {option.value}
            </Option>
          ))}
    </Select>
  );
});

LocaleSelect.defaultProps = {
  error: undefined,
  value: undefined,
  onClear: () => undefined,
};

LocaleSelect.propTypes = {
  error: PropTypes.string,
  onClear: PropTypes.func,
  onLocaleChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default LocaleSelect;
