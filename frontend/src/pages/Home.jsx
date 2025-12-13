import { useEffect, useState } from 'react';
import { 
  Container, Grid, Typography, CircularProgress, Alert, Box, TextField, InputAdornment, Paper // <--- Agregamos Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; 
import client from '../api/axios';
import RutinaCard from '../components/RutinaCard';

export default function Home() {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const cargarRutinas = async (termino = '') => {
    try {
      let response;
      if (termino.trim() === '') {
        response = await client.get('/rutinas');
      } else {
        response = await client.get(`/rutinas/buscar?nombre=${termino}`);
      }
      setRutinas(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayBusqueda = setTimeout(() => {
      cargarRutinas(terminoBusqueda);
    }, 300); 

    return () => clearTimeout(delayBusqueda);
  }, [terminoBusqueda]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      try {
        await client.delete(`/rutinas/${id}`);
        cargarRutinas(terminoBusqueda);
      } catch (err) {
        alert('Error al eliminar la rutina');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      
      {/*Titulo y barra de busqueda*/}
      <Box 
        sx={{ 
          maxWidth: 'sm', 
          mx: 'auto',     
          mb: 5,          
          textAlign: 'center' 
        }}
      >
        {/* 1. Titulo*/}
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: 2, 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
          }}
        >
          Busca tu rutina aquí !
        </Typography>

        {/* 2. Barra de Búsqueda */}
        <TextField
          fullWidth 
          variant="outlined"
          placeholder="Ej: Espalda, Pecho, Pierna..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            backgroundColor: 'background.paper', 
            borderRadius: 1,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        />
      </Box>

      {/* Mensajes de Carga y Error */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Mensaje si no hay resultados */}
      {!loading && !error && rutinas.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 5, opacity: 0.7, p: 2, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 2 }}>
          <Typography variant="h6" color="white">
            {terminoBusqueda ? `No se encontraron rutinas con "${terminoBusqueda}"` : "No tienes rutinas creadas aún."}
          </Typography>
        </Box>
      )}

      {/* Lista de Resultados con Fondo */}
      {!loading && rutinas.length > 0 && (
        <Paper 
          elevation={4}
          sx={{ 
            p: 4, 
            mt: 2, 
            borderRadius: 3, 
            backgroundColor: 'rgba(30, 30, 30, 0.6)', 
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              justifyContent: 'center', 
              mb: 4, 
              display: 'flex',
              textShadow: '2px 2px 4px rgba(22, 11, 11, 1)' 
            }}
          >
              Lista de rutinas
          </Typography>

          <Grid 
            container 
            spacing={3} 
            justifyContent={{ xs: 'center', sm: 'flex-start' }} 
          >
            {rutinas.map((rutina) => (
              <Grid item key={rutina.id} xs={12} sm={6} md={4}>
                <RutinaCard rutina={rutina} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

    </Container>
  );
}