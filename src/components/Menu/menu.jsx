import React, { Component } from 'react';
import styles from './style.css';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: this.props.display,
    };
  }

  render() {
    let classes = null;
    const menuItems = this.props.items;

    if (this.state.display === 'horizontal') {
      classes = `${styles.menu} ${styles.menu_horizontal}`;
    } else if (this.state.display === 'vertical') {
      classes = `${styles.menu} ${styles.menu_vertical}`;
    } else {
      classes = `${styles.menu}`;
    }

    const menuItemsElement = menuItems.map((item, index) =>
      <li className={styles.menuitem} key={index}>
        <a href={item.link}>
          {item.name}
        </a>
      </li>);

    // TODO: WTF JUST HAPPENED ABOVE THIS LINE.
    // FUCKING PARENTHESIS CHAR HAVE TO BE IN THE SAME LINE AS END OF THIS SHITTY ELEMENT.
    // FUCK ESLINT, SERIOUSLY

    return (
      <nav className={classes}>
        <ul>
          {menuItemsElement}
        </ul>
      </nav>
    );
  }
}
