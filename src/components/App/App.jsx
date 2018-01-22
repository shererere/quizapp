import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from '../LoginPage/loginpage.jsx';
import IndexPage from '../IndexPage/indexpage.jsx';
import QuizPage from '../QuizPage/quizpage.jsx';
import AdminMainPage from '../AdminMainPage/adminmainpage.jsx';
import AdminSingleUserPage from '../AdminSingleUserPage/adminsingleuserpage.jsx';
import AdminAddUserPage from '../AdminAddUserPage/adminadduserpage.jsx';
import AdminUsersListPage from '../AdminUsersListPage/adminuserslistpage.jsx';
import AdminSingleQuizPage from '../AdminSingleQuizPage/adminsinglequizpage.jsx';
import AdminAddQuizPage from '../AdminAddQuizPage/adminaddquizpage.jsx';
import AdminQuizzesListPage from '../AdminQuizzesListPage/adminquizzeslistpage.jsx';
import AdminSingleQuizUserResult from '../AdminSingleQuizUserResult/AdminSingleQuizUserResult.jsx';
import styles from './style.css';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div className={styles.app}>
          <Route exact path="/" component={IndexPage} history={this.context.history} />
          <Route path="/login" component={LoginPage} history={this.context.history} />
          <Route path="/quiz/:id" component={QuizPage} history={this.context.history} />

          <Route exact path="/admin" component={AdminMainPage} history={this.context.history} />
          <Route path="/admin/user/single/:id" component={AdminSingleUserPage} history={this.context.history} />
          <Route exact path="/admin/user/add" component={AdminAddUserPage} history={this.context.history} />
          <Route exact path="/admin/user/list" component={AdminUsersListPage} history={this.context.history} />
          <Route path="/admin/quiz/single/:id" component={AdminSingleQuizPage} history={this.context.history} />
          <Route exact path="/admin/quiz/add" component={AdminAddQuizPage} history={this.context.history} />
          <Route exact path="/admin/quiz/list" component={AdminQuizzesListPage} history={this.context.history} />
          <Route exact path="/admin/quiz/:quizid/user/:userid" component={AdminSingleQuizUserResult} history={this.context.history} />
          <ToastContainer autoClose={false} />
        </div>
      </Router>
    );
  }
}
