import React, { Component } from 'react';
import Answer from '../Answer/answer.jsx';
import styles from './style.css';

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      selected: null,
      answers: [
        {
          content: this.props.answer1,
          selected: false,
          correct: false,
        },
        {
          content: this.props.answer2,
          selected: false,
          correct: false,
        },
        {
          content: this.props.answer3,
          selected: false,
          correct: false,
        },
        {
          content: this.props.answer4,
          selected: false,
          correct: false,
        },
      ],
    };

    this.changeSelection = this.changeSelection.bind(this);
  }
  changeSelection(selection) {
    const stateCopy = Object.assign({}, this.state);
    for (let i = 0; i < 4; i += 1) {
      stateCopy.answers[i].selected = false;
    }
    stateCopy.answers[selection].selected = true;
    stateCopy.selected = selection;
    this.setState(stateCopy);

    console.log(this.state);
  }
  render() {
    return (
      <li className={styles.question}>
        <span className={styles.question__content}>
          {this.props.question}
        </span>
        <ul>
          <Answer
            value={this.state.answers[0].content}
            selected={this.state.answers[0].selected}
            id='asdsadasd'
            order='0'
            changeSelection={this.changeSelection} />
          <Answer
            value={this.state.answers[1].content}
            selected={this.state.answers[1].selected}
            id='asdsadasd'
            order='1'
            changeSelection={this.changeSelection} />
          <Answer
            value={this.state.answers[2].content}
            selected={this.state.answers[2].selected}
            id='asdsadasd'
            order='2'
            changeSelection={this.changeSelection} />
          <Answer
            value={this.state.answers[3].content}
            selected={this.state.answers[3].selected}
            id='asdsadasd'
            order='3'
            changeSelection={this.changeSelection} />
        </ul>
      </li>
    );
  }
}
