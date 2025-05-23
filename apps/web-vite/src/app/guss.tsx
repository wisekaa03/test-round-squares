import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Card, CardContent, CardMedia, Container, Grid, Toolbar } from '@mui/material';

import { authStore } from '../store/auth';
import { gussStore } from '../store/guss';

const GussComponent = (props: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    if (!authStore.isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  React.useEffect(() => {
    if (id) {
      gussStore.getTap(id);
    }
  }, [id]);

  const { status, score, roundScore, winnerUserName, startTime, endTime } = gussStore.guss;
  let firstString, secondString, thirdString;

  if (status === 'Активный') {
    firstString = 'Раунд активен!';
    secondString = `До конца осталось: ${endTime}`;
    thirdString = `Мои очки: ${score}`;
  } else if (status === 'Cooldown') {
    firstString = 'Cooldown';
    secondString = `До начала раунда осталось: ${startTime}`;
    thirdString = '';
  } else {
    firstString = `Всего: ${roundScore}`;
    secondString = `Победитель: ${winnerUserName || 'Не определен'}`;
    thirdString = `Мои очки: ${score}`;
  }

  const tap = () => {
    if (id) {
      gussStore.tap(id);
    }
  };

  return (
    <Box sx={{ height: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { sx: 'none', sm: 'block' } }}>
            {status}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block ' } }}>{authStore.user?.name}</Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10vh' }}>
        <Grid container direction="column" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 545, width: 545 }}>
            <CardMedia
              sx={{ height: 440, cursor: 'pointer' }}
              image="krutoi-gus.webp"
              title="Виртуальный гусь, подхвативший мутацию G-42"
              onClick={tap}
            />
            <CardContent>
              <Typography gutterBottom align="center" variant="h5">
                {firstString}
              </Typography>
              <Typography gutterBottom align="center" variant="h6">
                {secondString}
              </Typography>
              <Typography gutterBottom align="center" variant="h6">
                {thirdString}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
};

export const Guss = observer(GussComponent);
