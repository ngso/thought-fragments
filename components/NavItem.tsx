import React from 'react';

interface Props {
  onClick: () => void;
}

const NavItem: React.FC<Props> = ({ children, onClick }) => {
  return (
    <span className="mr-4 text-blue-700 cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

export default NavItem;
