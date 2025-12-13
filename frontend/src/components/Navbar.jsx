import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        {/* disableGutters reduce el padding lateral del Toolbar en móviles, ganando espacio */}
        <Toolbar disableGutters>
          
          {/* --- 1. LOGO (Responsive) --- */}
          <Link to="/">
            <Box
              component="img"
              src="/logo.png"
              alt="Gym Manager Logo"
              sx={{
                height: { xs: 25, md: 40 }, 
                mr: { xs: 1, md: 2 },
                display: 'flex', 
                objectFit: 'contain',
                cursor: 'pointer' 
              }}
            />
          </Link>

          {/* Empujamos el contenido a la derecha */}
          <Box sx={{ flexGrow: 1 }} /> 

          {/* --- 2. BOTONES DE NAVEGACIÓN (Siempre visibles y adaptables) --- */}
          <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              // Gap dinámico: menos espacio entre botones en celular (8px vs 16px)
              gap: { xs: 1, md: 2 } 
            }}
          >
            
            {/* Botón 1: Mis Rutinas */}
            <Button 
              component={Link} 
              to="/" 
              color="inherit" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, md: 2 },
                minWidth: { xs: 'auto', md: '64px' },
                minHeight: { xs: 1, md: 36 }
              }}
            >
              Mis Rutinas
            </Button>

            {/* Botón 2: Nueva Rutina (Resaltado) */}
            <Button 
                component={Link} 
                to="/crear" 
                variant="contained" 
                color="primary"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, md: 2 },
                  minWidth: { xs: 'auto', md: '64px' },
                  minHeight: { xs: 1, md: 36 }
                }}
            >
              Nueva Rutina
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}