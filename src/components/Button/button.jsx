import React from 'react';
import styles from './style.css';

const Button = (props) => {
  let classes = '';

  classes += !props.icon ? `${styles.button} ` : `${styles.blank} `;
  classes += props.center === 'true' ? `${styles.buttonCenter} ` : '';
  classes += props.small === 'true' ? `${styles.buttonSmall} ` : '';

  const button = <button
    className={classes}
    onClick={props.action ? props.action : null}
    title={props.title}
    >
      {props.text}
    </button>;

  return button;
};

export default Button;
