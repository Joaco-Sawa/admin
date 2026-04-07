import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import '../../styles/tiptap-custom.css';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';
import { Home, Users, Settings, Bold, Italic, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, ChevronDown } from 'lucide-react';
import { usePrograms } from '../context/ProgramsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function Configuracion() {
  const navigate = useNavigate();
  const { programs } = usePrograms();
  const { currentUser, logout } = useAuth();
  const { showSuccess } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('N/A');
  const [hasChanges, setHasChanges] = useState(false);
  const [catalogoOpen, setCatalogoOpen] = useState(false);
  const [comunicacionesTransversalesOpen, setComunicacionesTransversalesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef<string>('');

  // Configurar el editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      // Detectar si hay cambios comparando con el contenido inicial
      const currentContent = editor.getHTML();
      setHasChanges(currentContent !== initialContentRef.current);
    },
  });

  // Cerrar el menú al hacer click fuera
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
      setCatalogoOpen(false);
      setComunicacionesTransversalesOpen(false);
    };
  }, []);

  // Cargar contenido guardado desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('termsAndConditions');
    const savedDate = localStorage.getItem('termsAndConditionsDate');
    if (saved && editor) {
      editor.commands.setContent(saved);
      initialContentRef.current = saved;
    }
    if (savedDate) {
      setLastUpdate(savedDate);
    }
  }, [editor]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    if (editor) {
      const content = editor.getHTML();
      localStorage.setItem('termsAndConditions', content);
      const now = new Date().toLocaleString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      localStorage.setItem('termsAndConditionsDate', now);
      setLastUpdate(now);
      // Actualizar el contenido inicial después de guardar
      initialContentRef.current = content;
      setHasChanges(false);
      // Mostrar notificación de éxito
      showSuccess('Cambios guardados con éxito');
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo SAWA */}
        <div className="p-4 border-b border-gray-200">
          <img src={logoSavia} alt="SAVIA" className="h-8 w-auto object-contain" />
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1">
          {/* Programas */}
          <button 
            onClick={() => navigate('/home')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Programas</span>
          </button>

          {/* Participantes */}
          <button 
            onClick={() => navigate('/participantes')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Participantes</span>
          </button>

          {/* Administradores */}
          <button 
            onClick={() => navigate('/administradores')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Administradores</span>
          </button>

          {/* Configuración */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-500 text-white rounded transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </button>

          {/* Catálogo */}
          <div>
            <button 
              onClick={() => setCatalogoOpen(!catalogoOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="flex-1 text-left">Catálogo</span>
              <svg 
                className={`w-4 h-4 transition-transform ${catalogoOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Submenú */}
            {catalogoOpen && (
              <div className="mt-1 ml-6 space-y-1">
                <button 
                  onClick={() => navigate('/catalogo')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Categorías
                </button>
                <button 
                  onClick={() => navigate('/banners')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Banners
                </button>
              </div>
            )}
          </div>

          {/* Comunicaciones Transversales */}
          <div>
            <button 
              onClick={() => setComunicacionesTransversalesOpen(!comunicacionesTransversalesOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span className="flex-1 text-left">Comunicaciones Transversales</span>
              <svg 
                className={`w-4 h-4 transition-transform ${comunicacionesTransversalesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Submenú de comunicaciones transversales */}
            {comunicacionesTransversalesOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <button 
                  onClick={() => navigate('/comunicaciones-transversales/muro')}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Muro
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Notificaciones Push
                </button>
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Emails
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          {/* Contenedor central con buscador */}
          <div className="flex-1 flex items-center gap-4">
            {/* Buscador con dropdown de programas */}
            <div className="flex-1 max-w-md relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors bg-white"
              >
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="text-gray-500">Buscar programa...</span>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de programas */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate('/home');
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
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium">{prog.name}</div>
                          <div className="text-xs text-gray-500">Código: {prog.code}</div>
                        </button>
                      ))}
                    </>
                  )}

                  {programs.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No hay programas disponibles
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Usuario */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
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

        {/* Contenido principal */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl">Términos y Condiciones</h1>
          </div>

          {/* Editor Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg mb-1">Editar Términos y Condiciones Globales</h2>
                <p className="text-sm text-gray-500">Última actualización: {lastUpdate}</p>
              </div>
              <button
                onClick={handleSave}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  hasChanges 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-gray-400 hover:bg-gray-500 opacity-75'
                }`}
              >
                Guardar cambios
              </button>
            </div>

            {/* Toolbar */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-300 p-3 flex items-center gap-1 flex-wrap">
                {/* Bold */}
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive('bold') ? 'bg-blue-100' : ''
                  }`}
                  title="Negrita"
                >
                  <Bold className="w-5 h-5" />
                </button>

                {/* Italic */}
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive('italic') ? 'bg-blue-100' : ''
                  }`}
                  title="Cursiva"
                >
                  <Italic className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Align Left */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100' : ''
                  }`}
                  title="Alinear a la izquierda"
                >
                  <AlignLeft className="w-5 h-5" />
                </button>

                {/* Align Center */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100' : ''
                  }`}
                  title="Centrar"
                >
                  <AlignCenter className="w-5 h-5" />
                </button>

                {/* Align Right */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100' : ''
                  }`}
                  title="Alinear a la derecha"
                >
                  <AlignRight className="w-5 h-5" />
                </button>

                {/* Align Justify */}
                <button
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100' : ''
                  }`}
                  title="Justificar"
                >
                  <AlignJustify className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Bullet List */}
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive('bulletList') ? 'bg-blue-100' : ''
                  }`}
                  title="Lista con viñetas"
                >
                  <List className="w-5 h-5" />
                </button>

                {/* Ordered List */}
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    editor.isActive('orderedList') ? 'bg-blue-100' : ''
                  }`}
                  title="Lista numerada"
                >
                  <ListOrdered className="w-5 h-5" />
                </button>
              </div>

              {/* Editor Content */}
              <div className="bg-white min-h-[400px]">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}