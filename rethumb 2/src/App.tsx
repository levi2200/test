import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { GeneratePage } from './pages/GeneratePage';
import { PricingPage } from './pages/PricingPage';
import { AuthPage } from './pages/AuthPage';
import { AdminPage } from './pages/AdminPage';

type Page = 'home' | 'generate' | 'pricing' | 'login' | 'signup' | 'admin';

const FREE_USES_MAX = 3;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [freeUsesLeft, setFreeUsesLeft] = useState(FREE_USES_MAX);

  const handleNavigate = (page: string) => {
    // Guard admin page
    if (page === 'admin' && userRole !== 'admin') return;
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuth = (role: string, email: string) => {
    setUserRole(role);
    setUserEmail(email);
    setFreeUsesLeft(FREE_USES_MAX);
  };

  const handleUsed = () => {
    if (userRole === 'free') {
      setFreeUsesLeft(prev => Math.max(0, prev - 1));
    }
  };


  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={userRole}
        freeUsesLeft={freeUsesLeft}
      />

      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'generate' && (
        <GeneratePage
          userRole={userRole}
          freeUsesLeft={freeUsesLeft}
          onUsed={handleUsed}
          onNavigate={handleNavigate}
        />
      )}

      {currentPage === 'pricing' && (
        <PricingPage
          onNavigate={handleNavigate}
          userRole={userRole}
        />
      )}

      {currentPage === 'login' && (
        <AuthPage
          mode="login"
          onNavigate={handleNavigate}
          onAuth={handleAuth}
        />
      )}

      {currentPage === 'signup' && (
        <AuthPage
          mode="signup"
          onNavigate={handleNavigate}
          onAuth={handleAuth}
        />
      )}

      {currentPage === 'admin' && userRole === 'admin' && (
        <AdminPage
          onNavigate={handleNavigate}
          userEmail={userEmail}
        />
      )}
    </div>
  );
}
