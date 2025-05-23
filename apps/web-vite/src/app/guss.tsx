import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Card, CardContent, CardMedia, Container, Grid, Toolbar } from '@mui/material';

import { swaggerApi } from '../api/api-instance';
import { authStore } from '../store/auth';

const GussComponent = (props: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    if (!authStore.isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Box sx={{ height: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { sx: 'none', sm: 'block' } }}>
            Раунд
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block ' } }}>{authStore.user?.name}</Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10vh' }}>
        <Grid container direction="column" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 545, width: 545 }}>
            <CardMedia
              sx={{ height: 440 }}
              image="krutoi-gus.webp"
              title="Виртуальный гусь, подхвативший мутацию G-42"
            />
            <CardContent>
              <Typography gutterBottom align="center" variant="h5">
                Раунд активен!
              </Typography>
              <Typography gutterBottom align="center" variant="h6">
                До конца осталось: !
              </Typography>
              <Typography gutterBottom align="center" variant="h6">
                Мои очки -{' '}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
};

export const Guss = observer(GussComponent);
