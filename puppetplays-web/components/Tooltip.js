import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import styles from './tooltip.module.scss';

function Tooltip({ content, children, ...props }) {
  return (
    <Tippy
      className={styles.container}
      content={content}
      theme="default"
      {...props}
    >
      {children}
    </Tippy>
  );
}

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
