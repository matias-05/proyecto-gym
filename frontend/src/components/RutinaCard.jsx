import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { Link } from 'react-router-dom';

export default function RutinaCard({ rutina, onDelete }) {
  const fecha = new Date(rutina.fecha_creacion).toLocaleDateString();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: '0.3s',
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        backgroundColor: 'background.paper',
        '&:hover': {
          boxShadow: '0 0 20px rgba(156, 39, 176, 0.6)',
          border: '1px solid #9c27b0'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {rutina.nombre}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {rutina.descripcion || "Sin descripción disponible."}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Chip 
            icon={<FitnessCenterIcon />} 
            label={`${rutina.ejercicios.length} Ejercicios`} 
            size="small" 
            variant="outlined" 
            color="secondary"
          />
          <Chip 
            icon={<EventIcon />} 
            label={fecha} 
            size="small" 
            variant="outlined" 
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button 
          size="small" 
          startIcon={<EditIcon />} 
          component={Link} 
          to={`/editar/${rutina.id}`}
        >
          Editar
        </Button>

        <Button 
          size="small" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(rutina.id)}
        >
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}