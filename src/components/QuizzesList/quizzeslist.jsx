import React, { Component } from 'react';
import axios from 'axios';
import styles from './style.css';

export default class QuizzesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quizzes: [],
    };

    this.onClickHandler = this.onClickHandler.bind(this);
  }

  async getQuizzes() {
    const quizzes = await axios.get('http://localhost:3000/api/v1/quiz');
    this.setState({
      quizzes: quizzes.data,
    });
  }

  onClickHandler(id) {
    this.props.changeId(id);
  }

  componentDidMount() {
    this.getQuizzes();
  }

  render() {
    let quizzesComponent = null;
    if (this.state.quizzes.length > 0) {
      quizzesComponent = this.state.quizzes.map(quiz =>
        <li key={quiz.id} className={styles.item} onClick={() => { this.onClickHandler(quiz.id); }}>
          {quiz.name}
        </li>);
    }

    return (
      <ul>
        {quizzesComponent}
      </ul>
    );
  }
}
