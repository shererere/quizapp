import React, { Component } from 'react';

export default class AdminQuizPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizid: this.props.quizid,
    };
  }

  render() {
    return (
      <h1>asd: {this.state.quizid} </h1>
    );
  }
}
