import { useEffect, useState } from 'react';
import api from '../api/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Obtenemos usuarios del endpoint GET /api/auth/ que creamos en el backend
    const fetchUsers = async () => {
      try {
        const res = await api.get('/auth/'); 
        setUsers(res.data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      }
    };
    fetchUsers();
  }, []);

  // Lógica de filtrado
  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', margin: '20px 0' }}>
      <h3>👥 Lista de Usuarios</h3>
      <input 
        type="text" 
        placeholder="Buscar por nombre..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user._id}>
            <strong>{user.nombre}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;