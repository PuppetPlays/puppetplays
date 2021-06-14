export const styles = {
  container: (provided) => ({
    ...provided,
    margin: '2px 0 8px',
    zIndex: 10,
  }),
  control: (provided) => ({
    ...provided,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    color: 'white',
    ':hover': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    ':focus': {
      borderColor: 'white',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.3)',
  }),
  input: (provided) => ({
    ...provided,
    color: 'white',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.8)',
    ':hover': {
      color: 'white',
    },
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.8)',
    ':hover': {
      color: 'white',
    },
  }),
  menu: (provided) => ({
    ...provided,
    margin: '2px 0 0',
  }),
  menuList: (provided) => ({
    ...provided,
    color: 'var(--color-text)',
  }),
  option: (provided) => ({
    ...provided,
    borderBottom: '1px solid var(--color-bg-depth-2)',
    fontSize: '15px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white',
    padding: '0 3px 0 6px',
  }),
  multiValue: (provided) => ({
    ...provided,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '0 3px 0 6px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '14px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    ':hover': {
      color: 'white',
      backgroundColor: 'transparent',
    },
  }),
};

export const components = { IndicatorSeparator: null };

export const getTheme = (theme) => {
  return {
    ...theme,
    spacing: {
      ...theme.spacing,
      controlHeight: 34,
    },
    colors: {
      ...theme.colors,
      primary25: 'var(--color-scale-1)',
      primary50: 'var(--color-scale-4)',
      primary75: 'var(--color-brand-light)',
      primary: 'var(--color-brand)',
    },
  };
};
