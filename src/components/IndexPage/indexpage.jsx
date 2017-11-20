import React, { Component } from 'react';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default class IndexPage extends Component {
  render() {
    const menuItems = [
      { name: 'test', link: '#' },
      { name: 'omfg', link: '#' },
      { name: 'xd', link: '#' },
    ];
    const menuComponent = <Menu display='horizontal' items={menuItems} />;

    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <Header menu={menuComponent}/>
          <Footer />
        </div>
      </main>
    );
  }
}
