import React, { Component } from 'react';
import axios from 'axios';
import Header from '../Header/header.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  handleUsername(event) {
    this.setState({ username: event.target.value });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  loginUser() {
    axios.post('http://localhost:3000/login', {
      username: this.state.username,
      password: this.state.password,
    }).then((response) => {
      localStorage.setItem('token', response.data.token);

      this.props.history.push('/panel');
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <main className={styles.main}>
        <div className={styles.background}></div>
        <div className={styles.container}>
          <Header align='center' />
          <div className={styles.box}>
            <form className={styles.formcontainer}>
              <input className={styles.input} type="text" placeholder="Nazwa użytkownika" onChange={this.handleUsername} />
              <input className={styles.input} type="password" placeholder="Hasło" onChange={this.handlePassword} />
              <div className={styles.button} onClick={this.loginUser}>Zaloguj!</div>
            </form>
          </div>
          <Footer />
        </div>
      </main>
    );
  }
}
