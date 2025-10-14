import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Home, Building2, Calculator } from 'lucide-react'
import Dashboard from './components/Dashboard'
import TenantManagement from './components/TenantManagement'
import BuildingManagement from './components/BuildingManagement'
import LandlordFinances from './components/LandlordFinances'

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-primary-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">House</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/gebaeude" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/gebaeude') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gebäude
            </Link>
            <Link 
              to="/mieter" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/mieter') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mieter
            </Link>
            <Link 
              to="/vermieter" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/vermieter') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Vermieter-Finanzen
            </Link>
            <Link 
              to="/rechnungen" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/rechnungen') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rechnungen
            </Link>
            <Link 
              to="/wartung" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/wartung') ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Wartung
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gebaeude" element={<BuildingManagement />} />
          <Route path="/mieter" element={<TenantManagement />} />
          <Route path="/vermieter" element={<LandlordFinances />} />
          <Route path="/rechnungen" element={<div className="p-8"><h1>Rechnungsverwaltung</h1><p>Hier werden bald die Rechnungen verwaltet.</p></div>} />
          <Route path="/wartung" element={<div className="p-8"><h1>Wartung & Reparaturen</h1><p>Hier werden bald Wartungen geplant.</p></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App