import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import logoSavia from 'figma:asset/e6586f9eafb686170ce2c11ae52fcf10db69c0a4.png';

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validar que el email contenga @
    if (!email.includes('@')) {
      setEmailError('Incluye un "@" en la dirección de correo.');
      return;
    }

    // Simulación de validación de credenciales
    // En una aplicación real, aquí se haría una llamada al servidor
    if (email === 'admin@example.com' && password === 'admin') {
      // Login exitoso
      navigate('/home');
    } else {
      // Credenciales incorrectas
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos decorativos - Esquina superior izquierda */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-[#FFF4EC]" />
        <div className="absolute w-[75%] h-[75%] top-[12.5%] left-[12.5%] rounded-full bg-[#FFD4B3]" />
        <div className="absolute w-[50%] h-[50%] top-[25%] left-[25%] rounded-full bg-[#FF9966]" />
      </div>

      {/* Esquina superior derecha */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-[#FFF4EC]" />
        <div className="absolute w-[75%] h-[75%] top-[12.5%] left-[12.5%] rounded-full bg-[#FFD4B3]" />
        <div className="absolute w-[50%] h-[50%] top-[25%] left-[25%] rounded-full bg-[#FF9966]" />
      </div>

      {/* Esquina inferior izquierda */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] -translate-x-1/2 translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-[#FFF4EC]" />
        <div className="absolute w-[75%] h-[75%] top-[12.5%] left-[12.5%] rounded-full bg-[#FFD4B3]" />
        <div className="absolute w-[50%] h-[50%] top-[25%] left-[25%] rounded-full bg-[#FF9966]" />
      </div>

      {/* Esquina inferior derecha */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] translate-x-1/2 translate-y-1/2">
        <div className="absolute w-full h-full rounded-full bg-[#FFF4EC]" />
        <div className="absolute w-[75%] h-[75%] top-[12.5%] left-[12.5%] rounded-full bg-[#FFD4B3]" />
        <div className="absolute w-[50%] h-[50%] top-[25%] left-[25%] rounded-full bg-[#FF9966]" />
      </div>

      {/* Tarjeta de login */}
      <div className="bg-white rounded-3xl shadow-xl p-12 w-full max-w-md relative z-10">
        {/* Logo SAVIA */}
        <div className="flex justify-center mb-10">
          <img src={logoSavia} alt="SAVIA" className="h-12" />
        </div>

        {/* Título */}
        <h1 className="text-2xl text-center mb-8">Iniciar sesión</h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Campo Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Limpiar error al escribir
                setEmailError(''); // Limpiar error de email al escribir
              }}
              placeholder="Ingresar Dirección de Email"
              className={`w-full px-4 py-3 rounded-lg border ${
                emailError ? 'border-orange-500 border-2' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              required
            />
            {emailError && (
              <div className="mt-2 bg-white border border-gray-300 rounded-lg px-3 py-2 flex items-center gap-2 shadow-md">
                <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className="text-gray-700 text-sm">{emailError}</span>
              </div>
            )}
          </div>

          {/* Campo Contraseña */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // Limpiar error al escribir
              }}
              placeholder="Ingresar Contraseña"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Mensaje de Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-300 rounded-lg px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <svg 
                className="w-5 h-5 text-red-500 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="9" />
                <path 
                  fill="white" 
                  d="M10 6a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Botón Ingresar */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors mb-4"
          >
            Ingresar
          </button>

          {/* Link de contraseña olvidada */}
          <div className="text-center">
            <a href="#" className="text-orange-500 text-sm hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}