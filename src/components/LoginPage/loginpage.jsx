import React, { Component } from 'react';
import Header from '../Header/header.jsx';
import LoginForm from '../LoginForm/loginform.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default class MainPage extends Component {
  render() {
    return (
      <main className={styles.main}>
        <div className={styles.background}></div>
        <div className={styles.container}>
          <Header align='center' />
          <div className={styles.box}>
            <LoginForm />
          </div>
          <Footer />
        </div>
      </main>
    );
  }
}
