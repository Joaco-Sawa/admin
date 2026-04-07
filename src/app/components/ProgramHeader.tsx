import { Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';

export function ProgramHeader() {
  const navigate = useNavigate();
  const { programId } = useParams();
  const { programs, getProgram } = usePrograms();
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const program = getProgram(programId || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSuperAdmin = () => {
    navigate('/home');
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Limpiar estados al desmontar el componente
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
    };
  }, []);

  if (!program) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Contenedor central con selector de programa y botón Super Admin */}
      <div className="flex-1 flex items-center gap-4">
        {/* Selector de programa */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
          >
            <span className="text-gray-900">{program.name}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 mt-2 min-w-[240px] bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  handleSuperAdmin();
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-900">Super Admin</span>
              </button>
              
              {programs.length > 0 && (
                <>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
                    Programas
                  </div>
                  {programs.map(prog => (
                    <button
                      key={prog.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate(`/programa/${prog.id}`);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        prog.id === programId 
                          ? 'bg-gray-100 text-gray-900 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{prog.name}</div>
                      <div className="text-xs text-gray-500">Código: {prog.code}</div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Botón Super Admin */}
        <button 
          onClick={handleSuperAdmin}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          <span>Super Admin</span>
        </button>
      </div>

      {/* Usuario con menú desplegable */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <div className="text-right">
            <div className="text-sm text-gray-900">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.role}</div>
          </div>
          <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center font-semibold text-white">
            {currentUser.initials}
          </div>
        </button>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/mi-cuenta');
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Cuenta
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}