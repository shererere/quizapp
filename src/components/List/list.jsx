import React from 'react';

const List = props =>
    <ul>
      <h2>{props.header}</h2>
      {props.children}
    </ul>;

export default List;
