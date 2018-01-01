import React, { Component } from 'react';
import QuizzesList from '../QuizzesList/quizzeslist.jsx';

export default class AdminQuizzesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      a: null,
    };
  }

  render() {
    return (
      <div>
        <QuizzesList quizid={this.state.quizid} division={this.state.division} />
      </div>
    );
  }
}
