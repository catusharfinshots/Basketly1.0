import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';

import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import BasketDetail from './pages/BasketDetail';
import MutualFunds from './pages/MutualFunds';
import FixedDepositsPage from './pages/FixedDepositsPage';
import CollectionsPage from './pages/CollectionsPage';
import StocksPage from './pages/StocksPage';
import ManagersPage from './pages/ManagersPage';
import ManagerDetail from './pages/ManagerDetail';
import Calculators from './pages/Calculators';
import SIPCalculator from './pages/SIPCalculator';
import LearnPage from './pages/LearnPage';
import LearnPost from './pages/LearnPost';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import { PortfolioProvider } from './context/PortfolioContext';

function App() {
  return (
    <div className="App">
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}> 
              <Route path="/" element={<Home />} />
              <Route path="/explore/smallcases" element={<Explore />} />
              <Route path="/discover/all" element={<Explore />} />
              <Route path="/smallcase/:id" element={<BasketDetail />} />
              <Route path="/mutual-funds" element={<MutualFunds />} />
              <Route path="/mutual-funds/:category" element={<MutualFunds />} />
              <Route path="/fixed-deposits" element={<FixedDepositsPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:slug" element={<CollectionsPage />} />
              <Route path="/stocks" element={<StocksPage />} />
              <Route path="/managers" element={<ManagersPage />} />
              <Route path="/manager/:id" element={<ManagerDetail />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculators/sip" element={<SIPCalculator />} />
              <Route path="/learn" element={<LearnPage />} />
              <Route path="/learn/:slug" element={<LearnPost />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/business" element={<BusinessPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;
