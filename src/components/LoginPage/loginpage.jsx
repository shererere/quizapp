import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../Header/header.jsx';
import Button from '../Button/button.jsx';
import Footer from '../Footer/footer.jsx';
import styles from './style.css';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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

  loginUser(e) {
    e.preventDefault();

    if (this.state.username === '' && this.state.password === '') {
      toast('Wpisz poprawną nazwę uzytkownika i hasło!', {
        type: 'error',
      });
    } else if (this.state.password === '') {
      toast('Wpisz hasło!', {
        type: 'error',
      });
    } else if (this.state.username === '') {
      toast('Wpisz nazwę użytkownika!', {
        type: 'error',
      });
    }

    if (this.state.username !== '' && this.state.password !== '') {
      axios.post('http://localhost:3000/login', {
        username: this.state.username,
        password: this.state.password,
      }).then((response) => {
        localStorage.setItem('token', response.data.token);

        this.props.history.push('/');
      }).catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              toast('Wpisz poprawną nazwę użytkownika i hasło!', {
                type: 'error',
              });
              break;
            default:
              toast('Wystąpił błąd!', {
                type: 'error',
              });
              break;
          }
        } else {
          toast('Wystąpił błąd!', {
            type: 'error',
          });
        }
      });
    }
  }

  render() {
    return (
      <main className={styles.main}>
        <div className={styles.background}></div>
        <div className={styles.container}>
          <Header center="true" />
          <div className={styles.box}>
            <form className={styles.formcontainer}>
              <input
                className={styles.input}
                type="text"
                placeholder="Nazwa użytkownika"
                onChange={this.handleUsername}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Hasło"
                onChange={this.handlePassword}
              />
              <Button text="Zaloguj!" action={this.loginUser} />
            </form>
          </div>
          <Footer />
        </div>
      </main>
    );
  }
}
