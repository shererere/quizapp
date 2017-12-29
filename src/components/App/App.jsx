import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from '../LoginPage/loginpage.jsx';
import IndexPage from '../IndexPage/indexpage.jsx';
import QuizPage from '../QuizPage/quizpage.jsx';
import AdminPage from '../AdminPage/adminpage.jsx';
import styles from './style.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.app}>
          <Route exact path="/" component={IndexPage} history={this.context.history} />
          <Route path="/login" component={LoginPage} history={this.context.history} />
          <Route path="/quiz/:id" component={QuizPage} history={this.context.history} />
          <Route exact path="/admin" component={AdminPage} history={this.context.history} />
          <ToastContainer autoClose={false} />
        </div>
      </Router>
    );
  }
}
