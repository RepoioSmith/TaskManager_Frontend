import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, logout } from './redux/authSlice';
import api from './api/axios';
import UserList from './components/userList';
import TaskManager from './components/taskManager';
import SignIn from './components/SignIn';
import './style.css';

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      {!isAuthenticated ? (
        // Si no logueado mostramos el componente de Login/Registro
        <SignIn />
      ) : (
        //Si esta logueado, mostramos la aplicación principal con estilos
        <div className="app-container">
          <header>
            <h1>🚀 Mi Proyecto Web</h1>
            <div className="user-info">
              <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                Hola, {user}
              </span>
              <button 
                className="btn-logout" 
                onClick={() => dispatch(logout())}
              >
                Cerrar Sesión
              </button>
            </div>
          </header>

          <main>
            {/* Lista de Usuarios */}
            <UserList />
            
            {}
            <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #ddd' }} />
            
            {/* Gestor de Tareas */}
            <TaskManager />
          </main>
        </div>
      )}
    </>
  );
}

export default App;