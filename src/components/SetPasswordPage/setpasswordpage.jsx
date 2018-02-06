import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from '../Input/input.jsx';
import Button from '../Button/button.jsx';
import page from '../Page/page.jsx';
import styles from './style.css';

class SetPasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordConfirm: '',
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleConfirmPasswordChange(e) {
    this.setState({
      passwordConfirm: e.target.value,
    });
  }

  async changePassword(e) {
    e.preventDefault();

    if (this.state.password === '' || this.state.passwordConfirm === '') {
      toast('Uzupełnij wszystkie pola', {
        type: 'error',
      });
    } else if (this.state.password !== this.state.passwordConfirm) {
      toast('Wpisane hasła nie są takie same', {
        type: 'error',
      });
    } else {
      try {
        const res = await axios.post('/user/password/change', {
          userid: this.props.userid,
          password: this.state.password,
        }, this.axiosConfig);

        if (res.status === 200) {
          toast('Zmieniono hasło', {
            type: 'success',
          });
          this.props.history.push('/');
        }
      } catch (error) {
        console.error(error); // eslint-disable-line
        toast('Wystąpił błąd', {
          type: 'error',
        });
      }
    }
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Ustaw hasło</h2>
        <form>
          <Input type="password" placeholder="Wpisz hasło" onChange={this.handlePasswordChange} border="true" />
          <Input type="password" placeholder="Potwierdź hasło" onChange={this.handleConfirmPasswordChange} border="true" />
          <Button text="Zmień hasło" center="true" action={this.changePassword}/>
        </form>
      </div>
    );
  }
}

export default page(SetPasswordPage);
