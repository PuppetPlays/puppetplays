import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Button = ({ children, type, icon, inverse, onClick }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      type={type}
      data-inverse={inverse}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
};

Button.defaultProps = {
  icon: null,
  type: 'button',
  inverse: false,
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  inverse: PropTypes.bool,
};

export default Button;
