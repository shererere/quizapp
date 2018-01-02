import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Input from '../Input/input.jsx';
import Button from '../Button/button.jsx';

export default class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      size: null,
    };

    this.handleName = this.handleName.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.addQuiz = this.addQuiz.bind(this);
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleSize(e) {
    this.setState({ size: e.target.value });
  }

  addQuiz(e) {
    e.preventDefault();

    if (this.state.name === '' && this.state.size === '') {
      toast('Uzupełnij wszystkie pola!', {
        type: 'error',
      });
    }

    if (this.state.name !== '' && this.state.size !== '') {
      axios.post('http://localhost:3000/api/v1/quiz', {
        name: this.state.name,
        size: this.state.size,
      }).then(() => {
        // TODO: refresh site and clear inputs
        toast('Test został dodany!', {
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
          type="text"
          placeholder="Nazwa"
          onChange={this.handleName}
          border="true"
        />
        <Input
          type="number"
          placeholder="Ilość losowanych pytań"
          onChange={this.handleSize}
          border="true"
          min="1"
        />
        <Button text="Dodaj!" action={this.addQuiz} />
      </form>
    );
  }
}
