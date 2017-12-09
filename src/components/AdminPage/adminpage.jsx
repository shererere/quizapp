import React, { Component } from 'react';
import styles from './style.css';

/*
* Nie jestem pewny jak to zrobić
* zrobiłem że po kliknięciu w link w menu zmienia się tab
* znaczy prawie się zmienia xDDD
*/
export default class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [
        {
          name: 'jeden',
          icon: '',
          link: '#',
          action: 'users',
        },
        {
          name: 'dwa',
          icon: '',
          link: '#',
          action: 'questions',
        },
        {
          name: 'trzy',
          icon: '',
          link: '#',
          action: 'quizzes',
        },
      ],
    };

    this.switchTab = this.switchTab.bind(this);
  }
  switchTab(tab) {
    console.log(this.state);
    switch(tab) {
      case 'users':
        break;
      case 'questions':
        break;
      case 'quizzes':
        break;
    }
  }
  render() {
    const menuItemsElement = this.state.menuItems.map((item, index) =>
      <li className={styles.menuItem} key={index} onClick={this.switchTab(item.action)}>
        <span className={styles.menuItemTitle}>
          *img*
          {item.name}
        </span>
      </li>);

    return (
      <main className={styles.main}>
        <nav className={styles.nav}>
          <ul className={styles.menu}>
            {menuItemsElement}
          </ul>
        </nav>
      </main>
    );
  }
}
