import React, { Component } from 'react';
import styles from './style.css';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      align: this.props.align,
      menu: this.props.menu,
    };
  }

  render() {
    let classes = null;
    let menuComponent = null;

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

    return (
      <header className={classes}>
        <h1 className={styles.logo}>Quiz-app</h1>
        {/* TODO: render <nav> element only when menu is rendered */}        {menuComponent}
      </header>
    );
  }
}
