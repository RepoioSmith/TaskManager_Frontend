import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice';
import api from '../api/axios';

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState('all'); // Filtro de estado
  const [editingId, setEditingId] = useState(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/');
        dispatch(setTasks(res.data));
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    };
    fetchTasks();
  }, [dispatch]);

  // Manejar Crear o Actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Actualizar
        const res = await api.put(`/tasks/${editingId}`, { title, description: desc });
        // Flask a veces devuelve solo msg, así que construimos el objeto localmente o recargamos
        dispatch(updateTask({ _id: editingId, title, description: desc, status: 'pending' })); // Simplificado
        setEditingId(null);
      } else {
        // Crear
        const res = await api.post('/tasks/', { title, description: desc });
        // Añadimos al estado de Redux
        dispatch(addTask({ _id: res.data.task_id, title, description: desc, status: 'pending' }));
      }
      setTitle('');
      setDesc('');
    } catch (error) {
      alert("Error guardando tarea");
    }
  };

  // Manejar Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Borrar tarea?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      dispatch(deleteTask(id));
    } catch (error) {
      alert("Error eliminando");
    }
  };

  // Manejar cambio de estado (Pendiente <-> Completada)
  const toggleStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
      dispatch(updateTask({ ...task, status: newStatus }));
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  // Lógica de Filtrado (Punto 3)
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Task Manager</h2>
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#f9f9f9', padding: '15px' }}>
        <input 
          placeholder="Título" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ marginRight: '10px' }}
        />
        <input 
          placeholder="Descripción" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          style={{ marginRight: '10px' }}
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDesc('') }}>Cancelar</button>}
      </form>

      {/* Filtros */}
      <div style={{ marginBottom: '15px' }}>
        <label>Filtrar por estado: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todas</option>
          <option value="pending">Pendientes</option>
          <option value="in_progress">En Progreso</option>
          <option value="completed">Completadas</option>
        </select>
      </div>

      {/* Lista */}
      <div>
        {filteredTasks.map(task => (
          <div key={task._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: 0, textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                {task.title}
              </h4>
              <p style={{ margin: '5px 0' }}>{task.description}</p>
              <small>Estado: <strong>{task.status}</strong></small>
            </div>
            <div>
              <button onClick={() => toggleStatus(task)}>
                {task.status === 'completed' ? '⏮️' : '✅'}
              </button>
              <button onClick={() => { setEditingId(task._id); setTitle(task.title); setDesc(task.description); }}>✏️</button>
              <button onClick={() => handleDelete(task._id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;