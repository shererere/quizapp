import React from 'react';
import styles from './style.css';

const Menu = (props) => {
  const wrapperClasses = props.align === 'right' ? `${styles.wrapper_right}` : null;
  const itemClasses = props.vertical === 'true'
    ? `${styles.item} ${styles.item_vertical}`
    : `${styles.item} ${styles.item_horizontal}`;

  const items = props.items.map((item, index) =>
    <li key={index} className={itemClasses} onClick={item.action}>
      <span className={styles.text}>{item.label}</span>
    </li>);

  return <ul className={wrapperClasses}>{items}</ul>;
};

export default Menu;
