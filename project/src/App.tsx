import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserManager } from './components/UserManager';
import { ProductManager } from './components/ProductManager';
import { dataService } from './services/dataService';

function App() {
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Initialize sample data on first load
    dataService.initializeData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManager />;
      case 'products':
        return <ProductManager />;
      default:
        return <UserManager />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;