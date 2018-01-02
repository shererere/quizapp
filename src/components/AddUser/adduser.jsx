import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from '../Input/input.jsx';
import Button from '../Button/button.jsx';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      division: '',
    };

    this.handleRegisterUsername = this.handleRegisterUsername.bind(this);
    this.handleRegisterPassword = this.handleRegisterPassword.bind(this);
    this.handleRegisterDivision = this.handleRegisterDivision.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  handleRegisterUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleRegisterPassword(event) {
    this.setState({ password: event.target.value });
  }

  handleRegisterDivision(event) {
    this.setState({ division: event.target.value });
  }

  registerUser(e) {
    e.preventDefault();

    if (this.state.register_username === '' && this.state.register_password === '' && this.state.register_division === '') {
      toast('Uzupełnij wszystkie pola!', {
        type: 'error',
      });
    }

    if (this.state.register_username !== '' && this.state.register_password !== '' && this.state.register_division !== '') {
      axios.post('http://localhost:3000/api/v1/user/register', {
        username: this.state.register_username,
        password: this.state.register_password,
        division: this.state.register_division,
        role: 'user',
      }).then(() => {
        // TODO: refresh site and clear inputs
        toast('Użytkownik został zarejestrowany!', {
          type: 'success',
        });
      }).catch((error) => {
        toast(`Wystąpił błąd!: ${error}`, {
          type: 'error',
        });
      });
    }
  }

  render() {
    return (
      <form>
        <Input
          border="true"
          type="text"
          placeholder="Nazwa użytkownika"
          onChange={this.handleRegisterUsername}
        />
        <Input
          border="true"
          type="password"
          placeholder="Hasło"
          onChange={this.handleRegisterPassword}
        />
        <Input
          border="true"
          type="text"
          placeholder="Klasa"
          onChange={this.handleRegisterDivision}
        />
        <Button text="Zarejestruj!" action={this.registerUser} />
      </form>
    );
  }
}
