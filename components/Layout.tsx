import React from 'react';
import NavBar from './NavBar';

const Layout: React.FC = ({ children }) => {
  return (
    <div className="bg-gray-200 min-h-screen">
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
