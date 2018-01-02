import React from 'react';
import styles from './style.css';

const Input = (props) => {
  const classes = props.border === 'true' ? `${styles.input} ${styles.border}` : `${styles.input} ${styles.border_transparent}`;

  return <input
    className={classes}
    type={props.type}
    placeholder={props.placeholder}
    onChange={props.onChange}
    min={props.min}
  />;
};

export default Input;
