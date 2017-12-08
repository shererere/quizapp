import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './style.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      align: this.props.align,
      menu: this.props.menu,
      link: this.props.link,
    };
  }

  render() {
    let classes = null;
    let menuComponent = null;
    let headerContent = null;

    if (this.state.align === 'center') {
      classes = `${styles.header} ${styles.header_center}`;
    } else {
      classes = `${styles.header}`;
    }

    if (!this.state.menu) {
      menuComponent = '';
    } else {
      menuComponent = this.state.menu;
    }

    if (this.state.link === 'true') {
      headerContent = <Link className={styles.logo} to="/">Quiz-app</Link>;
    } else {
      headerContent = <h1 className={styles.logo}>Quiz-app</h1>;
    }

    return (
      <header className={classes}>
        {headerContent}
        {menuComponent}
      </header>
    );
  }
}
