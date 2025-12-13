import { useState } from 'react';
import { 
  Container, TextField, Button, Typography, Box, Paper, Grid, 
  IconButton, MenuItem, Divider, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import client from '../api/axios';

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function CrearRutina() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rutina, setRutina] = useState({
    nombre: '',
    descripcion: '',
    ejercicios: []
  });

  const agregarEjercicio = () => {
    setRutina({
      ...rutina,
      ejercicios: [
        ...rutina.ejercicios,
        { 
          nombre: '', 
          dia: 'Lunes', 
          series: 3, 
          repeticiones: 10, 
          peso: 0, 
          notas: '',
          orden: rutina.ejercicios.length + 1
        }
      ]
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!rutina.nombre) {
      setError("El nombre de la rutina es obligatorio.");
      setLoading(false);
      return;
    }
    if (rutina.ejercicios.length === 0) {
      setError("Debes agregar al menos un ejercicio.");
      setLoading(false);
      return;
    }

    try {
      await client.post('/rutinas', rutina);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error al guardar la rutina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* 1. TÍTULO PRINCIPAL: Centrado en móvil, Izquierda en PC */}
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: 'primary.main',
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Nueva Rutina
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* --- DATOS GENERALES --- */}
        <Paper sx={{ p: 3, mb: 3 }}>
          {/* Subtítulo centrado en móvil */}
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
                fullWidth
                label="Nombre de la Rutina"
                variant="outlined"
                value={rutina.nombre}
                onChange={(e) => setRutina({ ...rutina, nombre: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción (Opcional)"
                multiline
                rows={2}
                value={rutina.descripcion}
                onChange={(e) => setRutina({ ...rutina, descripcion: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* --- CABECERA DE EJERCICIOS (Título + Botón) --- */}
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

        {rutina.ejercicios.length === 0 && (
          <Typography 
            color="text.secondary" 
            sx={{ fontStyle: 'italic', mb: 3, textAlign: { xs: 'center', sm: 'left' } }}
          >
            No hay ejercicios. Pulsa el botón para agregar uno.
          </Typography>
        )}

        {rutina.ejercicios.map((ejercicio, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative', borderLeft: '4px solid #9c27b0' }}>
            
            <IconButton 
              color="error" 
              onClick={() => eliminarEjercicio(index)}
              sx={{ position: 'absolute', top: 5, right: 5 }}
            >
              <DeleteIcon />
            </IconButton>

            <Grid container spacing={2} sx={{ pr: 4 }}>
              {/* ... (El contenido de los inputs queda igual) ... */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre Ejercicio"
                  size="small"
                  value={ejercicio.nombre}
                  onChange={(e) => handleEjercicioChange(index, 'nombre', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Día"
                  size="small"
                  value={ejercicio.dia}
                  onChange={(e) => handleEjercicioChange(index, 'dia', e.target.value)}
                >
                  {DIAS.map((dia) => (
                    <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Peso (kg)"
                    type="number"
                    size="small"
                    value={ejercicio.peso || ''}
                    onChange={(e) => handleEjercicioChange(index, 'peso', e.target.value)}
                  />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Series"
                  type="number"
                  size="small"
                  value={ejercicio.series}
                  onChange={(e) => handleEjercicioChange(index, 'series', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Reps"
                  type="number"
                  size="small"
                  value={ejercicio.repeticiones}
                  onChange={(e) => handleEjercicioChange(index, 'repeticiones', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notas"
                  size="small"
                  placeholder="Ej: Drop set en la última"
                  value={ejercicio.notas}
                  onChange={(e) => handleEjercicioChange(index, 'notas', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large" 
          fullWidth
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{ mt: 2 }}
        >
          {loading ? 'Guardando...' : 'Guardar Rutina Completa'}
        </Button>
      </form>
    </Container>
  );
}