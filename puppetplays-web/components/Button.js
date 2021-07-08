import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Button = ({ children, type, icon, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
};

Button.defaultProps = {
  icon: null,
  type: 'button',
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Button;
