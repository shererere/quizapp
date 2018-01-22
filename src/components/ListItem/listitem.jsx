import React from 'react';
import styles from './style.css';

const ListItem = (props) => {
  let classes = `${styles.item} `;
  if (props.color === 'red') {
    classes = `${styles.red} ${styles.item}`;
  } else if (props.color === 'green') {
    classes = `${styles.green} ${styles.item}`;
  }

  return (<li
    onClick={props.action}
    className={classes}
  >
    {props.children}
  </li>);
};

export default ListItem;
