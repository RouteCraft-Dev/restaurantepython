import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
//  Importamos la instancia configurada con el puerto 5000
import { api } from '../api/client'; 

interface AuthPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLogin(false);
    else setIsLogin(true);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const userData = { email, password };

    try {
      if (!isLogin) {
        // --- REGISTRO MOCK (Puerto 5000) ---
        const response = await api.post('/register', userData);
        localStorage.setItem('gentleman-user', JSON.stringify(response.data));
        alert("¡CUENTA CREADA EXITOSAMENTE!");
        navigate('/');
        window.location.reload(); 
      } else {
        // Usamos la función centralizada que pasamos desde App.tsx si existe
        if (onLogin) {
          await onLogin(email, password);
        } else {
          // --- LOGIN EN CASO DE RESPALDO (Puerto 5000) ---
          const response = await api.post('/token', {
              username: email,
              password: password
          });
          
          localStorage.setItem('gentleman-user', JSON.stringify({
              token: response.data.access,
              email: email,
              is_admin: true
          }));
          
          alert("¡BIENVENIDO DE VUELTA!");
          navigate('/');
          window.location.reload(); 
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Error en las credenciales";
      alert("ERROR: " + msg);
    }
  };

  return (
    <div className="auth-container" style={{ 
      paddingTop: '140px', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0d0221 0%, #050110 100%)'
    }}>
      <div className="auth-card glass" style={{
        padding: '40px', 
        width: '400px', 
        borderRadius: '15px',
        border: '1px solid #00d2ff',
        boxShadow: '0 0 20px rgba(0, 210, 255, 0.1)',
        height: 'fit-content'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#00d2ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'white', letterSpacing: '2px' }}>
          {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#00d2ff' }}>
              EMAIL
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" 
              required
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0, 210, 255, 0.3)', color: 'white', borderRadius: '4px' }} 
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#00d2ff' }}>
              CONTRASEÑA
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              required
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0, 210, 255, 0.3)', color: 'white', borderRadius: '4px' }} 
            />
          </div>

          <button type="submit" style={{ 
            width: '100%', padding: '15px', background: '#00d2ff', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}>
            {isLogin ? 'ENTRAR' : 'CREAR CUENTA'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <p 
            style={{ cursor: 'pointer', fontSize: '13px', color: '#ff0055', textDecoration: 'underline' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Loguéate'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;