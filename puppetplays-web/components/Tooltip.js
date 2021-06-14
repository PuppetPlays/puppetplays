import React from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import styles from './tooltip.module.scss';
import isNil from 'lodash/isNil';

function Tooltip({ content, children, ...props }) {
  return (
    <Tippy
      className={styles.container}
      content={content}
      disabled={isNil(content)}
      theme="default"
      {...props}
    >
      {children}
    </Tippy>
  );
}

Tooltip.defaultProps = {
  content: null,
};

Tooltip.propTypes = {
  content: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
