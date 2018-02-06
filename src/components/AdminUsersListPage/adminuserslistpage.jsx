import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import adminPage from '../AdminPage/adminpage.jsx';
import List from '../List/list.jsx';
import ListItem from '../ListItem/listitem.jsx';
import Button from '../Button/button.jsx';
import Icon from '../Icon/icon.jsx';
import styles from './style.css';

class AdminUsersListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };

    this.axiosConfig = {
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };

    this.openSingleUserPage = this.openSingleUserPage.bind(this);
  }

  async callAPIEndpoints() {
    const users = await axios.get('/user', this.axiosConfig);
    this.setState({
      users: users.data,
    });
  }

  componentWillMount() {
    this.callAPIEndpoints();
  }

  openSingleUserPage(id) {
    this.props.history.push(`/admin/user/single/${id}`);
  }

  render() {
    let listItems = null;

    if (this.state.users.length > 0) {
      this.state.users.sort((a, b) => {
        if (a.division < b.division) return -1;
        if (a.division > b.division) return 1;
        return 0;
      });
      listItems = this.state.users.map((item, key) =>
        <ListItem key={item.id}>
          <Button icon="true" text={<Icon icon="trash" width="19" height="19" />} title="Usuń użytkownika" action={async () => {
            const confirm = window.confirm('Czy na pewno chcesz wykonać tą akcje?');
            if (confirm === true) {
              try {
                const config = Object.assign(this.axiosConfig, { data: { userid: item.id } });
                const res = await axios.delete('/user', config);

                if (res.status === 200) {
                  toast('Użytkownik został usunięty!', {
                    type: 'success',
                  });
                  const { users } = this.state;
                  users.splice(key, 1);
                  this.setState({ users });
                }
              } catch (error) {
                console.error(error); // eslint-disable-line
                toast('Wystąpił błąd!', {
                  type: 'error',
                });
              }
            }
          }} />
          <h3
            className={styles.username}
            onClick={() => { this.openSingleUserPage(item.id); }}
          >
            {item.username}
          </h3>
          <span className={styles.division}>{item.division}</span>
        </ListItem>);
    }

    return (
      <div>
        <List header="Lista użytkowników">
          {listItems}
        </List>
      </div>
    );
  }
}

export default adminPage(AdminUsersListPage);
