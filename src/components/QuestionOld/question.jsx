import React, { Component } from 'react';
import Answer from '../Answer/answer.jsx';
import styles from './style.css';

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'gfc',
      question: this.props.question,
      answer1: this.props.answer1,
      answer2: this.props.answer2,
      answer3: this.props.answer3,
      answer4: this.props.answer4,
      selected: null,
    };
  }

  render() {
    const onClickHandler = (e) => {
      // NOTE: it works
      const inputElement = e.target.previousSibling;
      inputElement.checked = true;

      this.setState({
        a: 'xd',
      });
    };

    return (
      <section className={styles.wrapper}>
        <li className={styles.question}>{this.props.question}</li>
        <ul>
          <li className={styles.answer} onClick={onClickHandler}>
            <input type='radio' name={this.state.id} value={this.state.answer1} />
            <span>{this.props.answer1}</span>
          </li>
          <li className={styles.answer} onClick={onClickHandler}>
            <input type='radio' name={this.state.id} value={this.state.answer2} />
            <span>{this.props.answer2}</span>
          </li>
          <li className={styles.answer} onClick={onClickHandler}>
            <input type='radio' name={this.state.id} value={this.state.answer3} />
            <span>{this.props.answer3}</span>
          </li>
          <li className={styles.answer} onClick={onClickHandler}>
            <input type='radio' name={this.state.id} value={this.state.answer4} />
            <span>{this.props.answer4}</span>
          </li>
        </ul>
      </section>
    );
  }
}
