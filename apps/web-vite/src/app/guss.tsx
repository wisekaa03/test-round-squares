import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Card, CardContent, CardMedia, Container, Grid, Paper, Toolbar } from '@mui/material';

import dayjs from '../dayjs-setup';
import { authStore } from '../store/authStore';
import { timeStore } from '../store/timeStore';
import { gussStore } from '../store/gussStore';

const GussComponent = (props: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (authStore.isLoggedIn === false) {
      navigate('/login');
    }
  }, [authStore.isLoggedIn, navigate]);

  useEffect(() => {
    if (id) {
      gussStore.getTap(id);
    }
  }, [id]);

  let firstString = '';
  let secondString = '';
  let thirdString = '';
  let cursor = 'wait';

  if (gussStore.guss) {
    if (gussStore.guss?.status === 'Активный') {
      firstString = 'Раунд активен!';
      secondString = `До конца осталось: ${dayjs.duration(dayjs(gussStore.guss.endTime).diff(timeStore.now)).format('mm:ss')}`;
      thirdString = `Мои очки: ${gussStore.guss.score}`;
      cursor = 'pointer';
    } else if (gussStore.guss.status === 'Cooldown') {
      firstString = 'Cooldown';
      secondString = `До начала раунда осталось: ${dayjs.duration(dayjs(gussStore.guss.startTime).diff(timeStore.now)).format('mm:ss')}`;
      thirdString = '';
    } else {
      firstString = `Всего: ${gussStore.guss.roundScore}`;
      secondString = `Победитель: ${gussStore.guss.winnerUserName || 'Не определен'}`;
      thirdString = `Мои очки: ${gussStore.guss.score}`;
    }
  }

  return (
    <Container sx={{ height: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            {gussStore.guss?.status || 'Загрузка...'}
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{authStore.user?.name}</Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10vh' }}>
        <Grid container direction="column" sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 545, width: 545 }}>
            <CardMedia
              sx={{ height: 440, cursor }}
              image="krutoi-gus.webp"
              title="Виртуальный гусь, подхвативший мутацию G-42. Нажми чтобы тапнуть"
              onClick={() => {
                if (id) {
                  gussStore.tap(id);
                }
              }}
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
      </Box>
    </Container>
  );
};

export const Guss = observer(GussComponent);
