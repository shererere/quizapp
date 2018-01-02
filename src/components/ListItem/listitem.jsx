import React from 'react';
import styles from './style.css';

const ListItem = (props) => {
  const a = Object.keys(props.data).map((item, key) =>
    <td className={styles.col}key={key}>{props.data[item]}</td>);

  return <tr className={styles.row}>{a}</tr>;
};

export default ListItem;
