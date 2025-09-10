import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import WorkflowBuilder from './pages/WorkflowBuilder';
import DocumentManager from './pages/DocumentManager';
import QueryInterface from './pages/QueryInterface';
import Login from './pages/Login';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Navbar />
      <Content>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workflows" element={<WorkflowBuilder />} />
          <Route path="/documents" element={<DocumentManager />} />
          <Route path="/query" element={<QueryInterface />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;