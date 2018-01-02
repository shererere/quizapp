import React from 'react';
import styles from './style.css';

const Menu = (props) => {
  const wrapperClasses = props.align === 'right' ? `${styles.wrapper_right}` : null;
  const itemClasses = props.vertical === 'true'
    ? `${styles.item} ${styles.item_vertical}`
    : `${styles.item} ${styles.item_horizontal}`;

  const items = props.items.map((item, index) => {
    let submenuItems = null;
    if (typeof item.submenu !== 'undefined') {
      submenuItems = item.submenu.map((subitem, index1) =>
        <li key={index1} className={itemClasses} onClick={() => {
          if (typeof subitem.action !== 'undefined') {
            subitem.action();
          }
        }}>{subitem.label}</li>);
    }

    let submenuComponent = null;
    if (submenuItems !== null) {
      submenuComponent = <ul className={styles.submenu}>
        {submenuItems}
      </ul>;
    }

    return <li key={index} className={itemClasses} onClick={() => {
      if (typeof item.action !== 'undefined') {
        item.action();
      }
    }}>
      <span className={styles.text}>{item.label}</span>
      {submenuComponent}
    </li>;
  });

  return <ul className={wrapperClasses}>{items}</ul>;
};

export default Menu;
