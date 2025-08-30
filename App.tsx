import React from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuditFormProvider } from './contexts/AuditFormContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuditForm from './pages/AuditForm';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { Stethoscope, ClipboardList, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

const AuthenticatedLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen font-sans text-dark-gray">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-brand-blue" />
              <h1 className="ml-3 text-xl font-bold text-gray-800">Hand Hygiene Auditor</h1>
            </div>
            <div className="flex items-center space-x-4">
               <span className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-1"/> {currentUser?.name}
              </span>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                Audit Form
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <LayoutDashboard className="h-5 w-5 mr-2" />
                Dashboard
              </NavLink>
              <button onClick={logout} className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<AuditForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t mt-8 py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Hand Hygiene Compliance Auditor. Based on WHO Guidelines.</p>
        </div>
      </footer>
    </div>
  );
};

const UnauthenticatedRoutes: React.FC = () => (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
);


const AppContent: React.FC = () => {
    const { currentUser } = useAuth();
    return (
        <HashRouter>
            {currentUser ? <AuthenticatedLayout /> : <UnauthenticatedRoutes />}
        </HashRouter>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
        <AuditFormProvider>
            <AppContent />
        </AuditFormProvider>
    </AuthProvider>
  );
};

export default App;
