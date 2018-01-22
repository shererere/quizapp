import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.css';

const Header = (props) => {
  let headerContent = null;
  let classes = null;

  if (props.link === 'true') {
    headerContent = <Link className={styles.logo} to="/">Quiz-app</Link>;
  } else {
    headerContent = <h1 className={styles.logo}>Quiz-app</h1>;
  }

  if (props.center === 'true') {
    classes = `${styles.header} ${styles.header_center}`;
  } else {
    classes = `${styles.header}`;
  }

  return (
    <header className={classes}>
      {headerContent}
      {props.menu}
    </header>
  );
};

export default Header;
