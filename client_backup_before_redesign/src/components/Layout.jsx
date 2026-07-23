import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ bodyClass = '' }) => {
  // We can apply bodyClass to a wrapper div if needed, since React can't easily change body class without side effects
  // But for better compatibility with existing CSS, we can use an effect
  React.useEffect(() => {
    if (bodyClass) {
      document.body.className = bodyClass;
    } else {
      document.body.className = '';
    }
  }, [bodyClass]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
