import React, { Component } from 'react';
import Answer from '../Answer/answer.jsx';
import styles from './style.css';

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      selected: null,
      answers: [
        {
          order: 0,
          content: this.props.answer1,
          selected: false,
          correct: false,
        },
        {
          order: 1,
          content: this.props.answer2,
          selected: false,
          correct: false,
        },
        {
          order: 2,
          content: this.props.answer3,
          selected: false,
          correct: false,
        },
        {
          order: 3,
          content: this.props.answer4,
          selected: false,
          correct: false,
        },
      ],
    };

    this.changeSelection = this.changeSelection.bind(this);
  }

  componentDidMount() {
    this.shuffleAnswers();
  }

  changeSelection(selection) {
    const stateCopy = Object.assign({}, this.state);
    for (let i = 0; i < 4; i += 1) {
      stateCopy.answers[i].selected = false;
    }
    const selectedAnswer = stateCopy.answers.findIndex(a => a.order === parseInt(selection, 10));
    stateCopy.answers[selectedAnswer].selected = true;
    stateCopy.selected = selection;
    this.setState(stateCopy);

    this.props.selectAnswer(this.state.id, selection);
  }

  shuffleAnswers() {
    const stateCopy = Object.assign({}, this.state);
    for (let i = stateCopy.answers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = stateCopy.answers[i];
      stateCopy.answers[i] = stateCopy.answers[j];
      stateCopy.answers[j] = temp;
    }
    this.setState(stateCopy);
  }

  render() {
    const answersComponent = this.state.answers.map((q, i) =>
      <Answer
        value={this.state.answers[i].content}
        selected={this.state.answers[i].selected}
        id='asdsadasd'
        key={i}
        order={this.state.answers[i].order}
        changeSelection={this.changeSelection}
      />);

    return (
      <li className={styles.question}>
        <span className={styles.question__content}>
          {this.props.question}
        </span>
        <ul>
          {answersComponent}
        </ul>
      </li>
    );
  }
}
