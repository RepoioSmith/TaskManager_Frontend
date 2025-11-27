import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from './redux/authSlice';
import api from './api/axios';
import UserList from './components/userList';
import TaskManager from './components/taskManager';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      // El backend devuelve { access_token, nombre }
      dispatch(loginSuccess({ token: res.data.access_token, user: res.data.nombre }));
    } catch (error) {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', padding: '10px 0' }}>
        <h1>🚀 Mi Proyecto Web</h1>
        {isAuthenticated && (
          <button onClick={() => dispatch(logout())} style={{ background: 'red', color: 'white' }}>
            Cerrar Sesión ({user})
          </button>
        )}
      </header>

      {!isAuthenticated ? (
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} onChange={e => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} onChange={e => setPassword(e.target.value)} 
            />
            <button type="submit">Entrar</button>
          </form>
          <p>Usa un usuario que hayas creado en Postman.</p>
        </div>
      ) : (
        <main>
          {/* Aquí se muestran los dos requerimientos */}
          <UserList />   {/* Punto 2 */}
          <hr />
          <TaskManager /> {/* Punto 3 */}
        </main>
      )}
    </div>
  );
}

export default App;