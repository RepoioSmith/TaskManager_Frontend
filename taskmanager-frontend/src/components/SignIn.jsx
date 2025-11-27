import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import api from '../api/axios';

const SignIn = () => {
  const dispatch = useDispatch();
  const [isRegistering, setIsRegistering] = useState(false); // Toggle entre Login y Registro
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '' // Solo para registro
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        // Registro: /api/auth/register
        await api.post('/auth/register', {
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password
        });
        alert("¡Cuenta creada! Ahora inicia sesión.");
        setIsRegistering(false); // Cambiar a vista de login
      } else {
        // Login: /api/auth/login
        const res = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        // Despachamos al Redux (token y nombre)
        dispatch(loginSuccess({ token: res.data.access_token, user: res.data.nombre }));
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Ocurrió un error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        
        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" name="nombre" 
                placeholder="Tu nombre"
                value={formData.nombre} onChange={handleChange} 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" name="email" 
              placeholder="ejemplo@correo.com"
              value={formData.email} onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" name="password" 
              placeholder="******"
              value={formData.password} onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary">
            {isRegistering ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            type="button" 
            className="btn-link"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;