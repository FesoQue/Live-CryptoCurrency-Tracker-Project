import React from 'react';

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <div
      className={`${selected ? 'chartBtn active' : 'chartBtn'}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default SelectButton;
