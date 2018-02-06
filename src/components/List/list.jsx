import React from 'react';
import styles from './style.css';

const List = props =>
    <ul>
      <h2 className={styles.title}>{props.header}</h2>
      {props.children}
    </ul>;

export default List;
