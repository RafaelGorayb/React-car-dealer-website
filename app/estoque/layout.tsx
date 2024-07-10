import React from 'react';


type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '8px' }}>
      <header>
        <h1>Estoque de Carros</h1>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>© 2024 WebsiteCarros</p>
      </footer>
    </div>
  );
};

export default Layout;
