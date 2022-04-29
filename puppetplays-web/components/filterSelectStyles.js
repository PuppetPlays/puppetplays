export const styles = {
  container: (provided) => ({
    ...provided,
    margin: '2px 0 8px',
    zIndex: 10,
  }),
  control: (provided, state) => ({
    ...provided,
    minHeight: 32,
    borderColor: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)',
    backgroundColor: 'transparent',
    color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
    ':hover': {
      borderColor: state.selectProps.inverse
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(0, 0, 0, 0.5)',
    },
    ':focus': {
      borderColor: state.selectProps.inverse
        ? 'white'
        : 'var(--color-text-subtle)',
    },
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.3)',
  }),
  input: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: 5,
    color: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(0, 0, 0, 0.8)',
    ':hover': {
      color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(0, 0, 0, 0.8)',
    ':hover': {
      color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
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
  singleValue: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
    padding: '0 3px 0 6px',
  }),
  multiValue: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
    backgroundColor: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    padding: '0 3px 0 6px',
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
    fontSize: '14px',
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: state.selectProps.inverse
      ? 'rgba(255, 255, 255, 0.8)'
      : 'rgba(0, 0, 0, 0.8)',
    cursor: 'pointer',
    ':hover': {
      color: state.selectProps.inverse ? 'white' : 'var(--color-text-subtle)',
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
