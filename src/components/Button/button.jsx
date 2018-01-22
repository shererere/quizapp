import React from 'react';
import styles from './style.css';

const Button = (props) => {
  const classes = props.center === 'true' ? `${styles.button} ${styles.button_center}` : `${styles.button}`;
  let button = <button className={classes}>{props.text}</button>;

  if (props.action) {
    button = <button className={classes} onClick={props.action}>{props.text}</button>;
  }

  return button;
};

export default Button;
