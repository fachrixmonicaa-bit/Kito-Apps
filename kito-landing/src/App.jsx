import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PropertyProvider } from './context/PropertyContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import PropertyListPage from './pages/PropertyListPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import SellPropertyPage from './pages/SellPropertyPage';
import NewsPage from './pages/NewsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import JoinUsPage from './pages/JoinUsPage';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import PropertyManagement from './pages/admin/PropertyManagement';
import PropertyForm from './pages/admin/PropertyForm';
import ValuationCalculator from './pages/admin/ValuationCalculator';
import TransactionCalculator from './pages/admin/TransactionCalculator';
import Settings from './pages/admin/Settings';
import PlaceholderPage from './pages/admin/PlaceholderPage';
import ListingManagement from './pages/admin/ListingManagement';
import ListingForm from './pages/admin/ListingForm';
import ArticleForm from './pages/admin/news/ArticleForm';
import NewsManagement from './pages/admin/news/NewsManagement';
import GoalsManagement from './pages/admin/GoalsManagement';

// CRM Pages
import LeadManagement from './pages/admin/crm/LeadManagement';
import SurveyManagement from './pages/admin/crm/SurveyManagement';
import OfferManagement from './pages/admin/crm/OfferManagement';
import VendorReport from './pages/admin/crm/VendorReport';
import AdLauncher from './pages/admin/AdLauncher';
import CRMHub from './pages/admin/CRMHub';
import AgentMonitor from './pages/admin/AgentMonitor';
import FinanceDashboard from './pages/admin/FinanceDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/properties" element={<PropertyListPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sell" element={<SellPropertyPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<ArticleDetailPage />} />
            <Route path="/join" element={<JoinUsPage />} />
            
            {/* Internal Dashboard Routes (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="monitor" element={<AgentMonitor />} />
              <Route path="goals" element={<GoalsManagement />} />
              <Route path="finance" element={<FinanceDashboard />} />
              
              {/* Phase 1: Database Properti */}
              <Route path="properties" element={<PropertyManagement />} />
              <Route path="properties/add" element={<PropertyForm />} />
              <Route path="properties/edit/:id" element={<PropertyForm />} />

              {/* Phase 2 & 3: Listing & Leads */}
              <Route path="listings/add" element={<ListingForm defaultType="" />} />
              <Route path="listings/manage" element={<ListingManagement />} />
              <Route path="listings/edit/:id" element={<ListingForm />} />
              <Route path="leads" element={<LeadManagement />} />
              <Route path="surveys" element={<SurveyManagement />} />
              <Route path="offers" element={<OfferManagement />} />
              <Route path="reports/leads" element={<VendorReport />} />
              <Route path="ads" element={<AdLauncher />} />
              <Route path="crm" element={<CRMHub />} />
              <Route path="news/write" element={<ArticleForm />} />
              <Route path="news/manage" element={<NewsManagement />} />
              <Route path="news/edit/:id" element={<ArticleForm />} />

              {/* Phase 4 & 5: Valuasi & Transaksi */}
              <Route path="valuation" element={<ValuationCalculator />} />
              <Route path="transaction" element={<TransactionCalculator />} />
              <Route path="reports/valuation" element={<PlaceholderPage title="Laporan Valuasi" phase="5" />} />

              {/* Phase 6: Pengaturan */}
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
