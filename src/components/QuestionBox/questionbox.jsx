import React, { Component } from 'react';
import styles from './style.css';

export default class QuestionBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
            {/* TODO: name in radio has to be unique */}
            <input type='radio' name='xd' value='{this.props.answer1}'/>
            <span>{this.props.answer1}</span>
          </li>
          <li className={styles.answer} onClick={onClickHandler}>
            {/* TODO: name in radio has to be unique */}
            <input type='radio' name='xd' value='{this.props.answer2}'/>
            <span>{this.props.answer2}</span>
          </li>
          <li className={styles.answer} onClick={onClickHandler}>
            {/* TODO: name in radio has to be unique */}
            <input type='radio' name='xd' value='{this.props.answer3}'/>
            <span>{this.props.answer3}</span></li>
          <li className={styles.answer} onClick={onClickHandler}>
            {/* TODO: name in radio has to be unique */}
            <input type='radio' name='xd' value='{this.props.answer4}'/>
            <span>{this.props.answer4}</span>
          </li>
        </ul>
      </section>
    );
  }
}
