import React from 'react';
import styles from './style.css';

const Button = (props) => {
  const classes = props.center === 'true' ? `${styles.button} ${styles.button_center}` : `${styles.button}`;
  const button = props.action
    ? <button className={classes} onClick={props.action}>{props.text}</button>
    : <button className={classes}>{props.text}</button>;

  return button;
};

export default Button;
