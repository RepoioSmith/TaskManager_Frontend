import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTask, deleteTask } from '../redux/taskSlice';
import api from '../api/axios';

const TaskManager = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState('all');
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
        // Encontrar la tarea actual para no perder su status al editar texto
        const currentTask = tasks.find(t => t._id === editingId);
        const currentStatus = currentTask ? currentTask.status : 'pending';

        // Actualizar en Backend
        await api.put(`/tasks/${editingId}`, { title, description: desc });
        
        // Actualizar en Redux (mantenemos el status que tenía)
        dispatch(updateTask({ 
            _id: editingId, 
            title, 
            description: desc, 
            status: currentStatus 
        }));
        setEditingId(null);
      } else {
        // Crear nueva
        const res = await api.post('/tasks/', { title, description: desc });
        dispatch(addTask({ 
            _id: res.data.task_id, 
            title, 
            description: desc, 
            status: 'pending' 
        }));
      }
      // Limpiar formulario
      setTitle('');
      setDesc('');
    } catch (error) {
      console.error(error);
      alert("Error al guardar la tarea");
    }
  };

  // Manejar Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de borrar esta tarea?")) return;
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

  // Lógica de Filtrado
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div>
      <h2 style={{ color: '#4a90e2', marginBottom: '20px' }}>📋 Mis Tareas</h2>
      
      {/* Formulario Estilizado */}
      <form onSubmit={handleSubmit} className="task-form">
        <input 
          placeholder="Título de la tarea" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ flex: 2 }} // El título ocupa más espacio
        />
        <input 
          placeholder="Descripción (opcional)" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          style={{ flex: 3 }}
        />
        
        <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
            <button type="submit" className="btn-primary">
                {editingId ? 'Guardar' : 'Agregar'}
            </button>
            
            {editingId && (
                <button 
                    type="button" 
                    className="btn-danger" 
                    onClick={() => { setEditingId(null); setTitle(''); setDesc('') }}
                >
                    Cancelar
                </button>
            )}
        </div>
      </form>

      {}
      <div style={{ marginBottom: '20px', maxWidth: '250px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            Filtrar por estado:
        </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">📝 Todas</option>
          <option value="pending">⏳ Pendientes</option>
          <option value="completed">✅ Completadas</option>
        </select>
      </div>

      {/* Lista de Tareas */}
      <div>
        {filteredTasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888' }}>No hay tareas en esta categoría.</p>
        ) : (
            filteredTasks.map(task => (
            <div key={task._id} className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}>
                <div style={{ flex: 1 }}>
                <h4 style={{ 
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? '#888' : '#333'
                }}>
                    {task.title}
                </h4>
                <p style={{ margin: '5px 0', color: '#666' }}>{task.description}</p>
                <span style={{ 
                    fontSize: '0.8rem', 
                    background: '#eee', 
                    padding: '2px 8px', 
                    borderRadius: '10px' 
                }}>
                    {/* Lógica de etiqueta simplificada */}
                    {task.status === 'completed' ? 'Completada' : 'Pendiente'}
                </span>
                </div>
                
                <div className="task-actions">
                <button onClick={() => toggleStatus(task)} title={task.status === 'completed' ? "Marcar pendiente" : "Marcar completada"}>
                    {task.status === 'completed' ? '↩️' : '✅'}
                </button>
                <button onClick={() => { setEditingId(task._id); setTitle(task.title); setDesc(task.description); }} title="Editar tarea">
                    ✏️
                </button>
                <button onClick={() => handleDelete(task._id)} title="Eliminar tarea">
                    🗑️
                </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;