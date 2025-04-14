import Tippy from '@tippyjs/react';
import PropTypes from 'prop-types';
import React from 'react';

import 'tippy.js/dist/tippy.css';
import styles from './tooltip.module.scss';

import isNil from 'lodash/isNil';

function Tooltip({ content = null, children, ...props }) {
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

Tooltip.propTypes = {
  content: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
