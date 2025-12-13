import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, TextField, Button, Typography, Box, Paper, Grid, 
  IconButton, MenuItem, CircularProgress, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import client from '../api/axios';

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function EditarRutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [rutina, setRutina] = useState({
    nombre: '',
    descripcion: '',
    ejercicios: []
  });

  // 1. Cargar datos
  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await client.get(`/rutinas/${id}`);
        setRutina(response.data);
      } catch (err) {
        setError("Error al cargar la rutina.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchRutina();
  }, [id]);

  // --- FUNCIONES DE MANIPULACIÓN ---
  const agregarEjercicio = () => {
    setRutina({
      ...rutina,
      ejercicios: [
        ...rutina.ejercicios,
        { 
          nombre: '', dia: 'Lunes', series: 3, repeticiones: 10, peso: 0, notas: '',
          orden: rutina.ejercicios.length + 1 
        }
      ]
    });
    setError(null);
  };

  const eliminarEjercicio = (index) => {
    const nuevosEjercicios = rutina.ejercicios.filter((_, i) => i !== index);
    setRutina({ ...rutina, ejercicios: nuevosEjercicios });
  };

  const handleEjercicioChange = (index, campo, valor) => {
    const nuevosEjercicios = [...rutina.ejercicios];
    nuevosEjercicios[index][campo] = valor;
    setRutina({ ...rutina, ejercicios: nuevosEjercicios });
  };

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // 2. VALIDACIÓN: ¿Tiene ejercicios?
    if (!rutina.ejercicios || rutina.ejercicios.length === 0) {
      // Seteamos el error para que salga la alerta roja
      setError("Error: La rutina debe tener al menos un ejercicio. Agrega uno antes de guardar.");
      
      // Hacemos scroll hacia arriba para asegurar que el usuario vea la alerta
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      return; 
    }

    // Si pasa la validación, procedemos
    setSaving(true);
    setError(null);

    try {
      await client.put(`/rutinas/${id}`, rutina);
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError("Error al actualizar la rutina en el servidor.");
      setSaving(false);
    }
  };

  if (loadingData) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* Título Responsivo */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textAlign: { xs: 'center', sm: 'left' } 
        }}
      >
        Editar Rutina
      </Typography>

      {/* --- ALERTA DE ERROR --- */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, border: '1px solid red' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Datos Generales */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ textAlign: { xs: 'center', sm: 'left' } }}
          >
            Datos Generales
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Nombre" value={rutina.nombre}
                onChange={(e) => setRutina({ ...rutina, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Descripción" multiline rows={2} value={rutina.descripcion}
                onChange={(e) => setRutina({ ...rutina, descripcion: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Encabezado Ejercicios */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            gap: 2 
          }}
        >
          <Typography variant="h5">Ejercicios</Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<AddCircleOutlineIcon />} 
            onClick={agregarEjercicio}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Agregar Ejercicio
          </Button>
        </Box>

        {/* Lista de Ejercicios */}
        {rutina.ejercicios.map((ejercicio, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative', borderLeft: '4px solid #7c4dff' }}>
            <IconButton color="error" onClick={() => eliminarEjercicio(index)} sx={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}>
              <DeleteIcon />
            </IconButton>
            
            <Grid container spacing={2} sx={{ pr: { xs: 0, sm: 4 }, pt: { xs: 4, sm: 0 } }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Ejercicio" size="small" value={ejercicio.nombre}
                  onChange={(e) => handleEjercicioChange(index, 'nombre', e.target.value)} required />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField select fullWidth label="Día" size="small" value={ejercicio.dia}
                  onChange={(e) => handleEjercicioChange(index, 'dia', e.target.value)}>
                  {DIAS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                  <TextField fullWidth label="Peso" type="number" size="small" value={ejercicio.peso || ''}
                    onChange={(e) => handleEjercicioChange(index, 'peso', e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Series" type="number" size="small" value={ejercicio.series}
                  onChange={(e) => handleEjercicioChange(index, 'series', parseInt(e.target.value))} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth label="Reps" type="number" size="small" value={ejercicio.repeticiones}
                  onChange={(e) => handleEjercicioChange(index, 'repeticiones', parseInt(e.target.value))} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Notas" size="small" value={ejercicio.notas || ''}
                  onChange={(e) => handleEjercicioChange(index, 'notas', e.target.value)} />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={saving} startIcon={<SaveIcon />} sx={{ mt: 2 }}>
          {saving ? 'Guardando Cambios...' : 'Actualizar Rutina'}
        </Button>
      </form>
    </Container>
  );
}