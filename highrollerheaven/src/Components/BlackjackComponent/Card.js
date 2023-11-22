import React from 'react';

const Card = (props) => {
  return (
    <div className="card">
      <div className="card-suit">{props.suit}</div>
      <div className="card-rank">{props.rank}</div>
    </div>
  );
};

export default Card;