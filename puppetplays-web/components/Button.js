import PropTypes from 'prop-types';
import React from 'react';

import styles from './button.module.scss';

const Button = ({
  children,
  type = 'button',
  icon = null,
  inverse = false,
  onClick,
}) => {
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

Button.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  inverse: PropTypes.bool,
};

export default Button;
