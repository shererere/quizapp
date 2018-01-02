import React from 'react';
import ListItem from '../ListItem/listitem.jsx';

const List = (props) => {
  let list = [];
  if (props.data) {
    list = props.data.map((item, key) =>
      <ListItem key={key} data={item} />);
  }

  return <table>
    <tbody>
      {list}
    </tbody>
  </table>;
};

export default List;
