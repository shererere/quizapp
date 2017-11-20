import React, { Component } from 'react';
import styles from './style.css';

export default class LoginForm extends Component {
  render() {
    return (
      <form className={styles.container}>
        <input className={styles.input} type="text" placeholder="Nazwa użytkownika" />
        <input className={styles.input} type="password" placeholder="Hasło" />
        <div className={styles.button}>Zaloguj!</div>
      </form>
    );
  }
}
