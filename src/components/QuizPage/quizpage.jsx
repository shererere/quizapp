import React, { Component } from 'react';
import Header from '../Header/header.jsx';
import Menu from '../Menu/menu.jsx';
import Footer from '../Footer/footer.jsx';
import QuestionBox from '../QuestionBox/questionbox.jsx';
import styles from './style.css';

export default class QuizPage extends Component {
  render() {
    const menuItems = [
      { name: 'test', link: '#' },
      { name: 'omfg', link: '#' },
      { name: 'xd', link: '#' },
    ];
    const menuComponent = <Menu display='horizontal' items={menuItems} />;

    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <Header menu={menuComponent}/>

          <div className={styles.wrapper}>
            <h2 className={styles.quizTitle}>Rozwiązujesz test: {this.props.quizTitle}</h2>
            <ul className={styles.questionList}>
              <QuestionBox
                question='xdxdxd'
                answer1='asdasdsa'
                answer2='shgduhgds'
                answer3='oigoidsoigjsdjg'
                answer4='oijgoiwjoigjsdlkfjif qoij'
              />
              <QuestionBox
                question='xdxdxd'
                answer1='asdasdsa'
                answer2='shgduhgds'
                answer3='oigoidsoigjsdjg'
                answer4='oijgoiwjoigjsdlkfjif qoij'
              />
              <QuestionBox
                question='xdxdxd'
                answer1='asdasdsa'
                answer2='shgduhgds'
                answer3='oigoidsoigjsdjg'
                answer4='oijgoiwjoigjsdlkfjif qoij'
              />
            </ul>
          </div>

          <Footer />
        </div>
      </main>
    );
  }
}
