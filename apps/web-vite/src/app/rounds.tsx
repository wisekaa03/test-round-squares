import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Alert, AppBar, CircularProgress, Paper, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';

import { authStore } from '../store/auth';
import { roundsStore } from '../store/rounds';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const RoundsComponent = (props: { disableCustomTheme?: boolean }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const roundStart = async () => {
    await roundsStore.start();
    roundsStore.fetch();
  };

  useEffect(() => {
    roundsStore.fetch();
  }, []);

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { sx: 'none', sm: 'block' } }}>
            Список Раундов
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block ' } }}>{authStore.user?.name}</Box>
        </Toolbar>
      </AppBar>
      {authStore.isAdmin && !!roundsStore.errorStart ? (
        <Paper sx={{ my: 2, margin: '12pt' }}>
          <Button fullWidth size="large" variant="text" sx={{ justifyContent: 'space-between' }} onClick={roundStart}>
            <Typography sx={{ padding: '6px', justifyContent: 'left' }}>Создать раунд</Typography>
            <Alert severity="error" sx={{ padding: '0 6px' }}>
              {roundsStore.errorStart}
            </Alert>
          </Button>
        </Paper>
      ) : authStore.isAdmin ? (
        <Paper sx={{ my: 2, margin: '12pt' }}>
          <Button fullWidth size="large" variant="text" sx={{ justifyContent: 'space-between' }} onClick={roundStart}>
            <Typography sx={{ padding: '6px', justifyContent: 'left' }}>Создать раунд</Typography>
          </Button>
        </Paper>
      ) : null}
      {roundsStore.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2, margin: '12pt' }}>
          <CircularProgress />
        </Box>
      )}
      {roundsStore.errorRounds && (
        <Paper sx={{ my: 2, margin: '12pt' }}>
          <Alert severity="error">{roundsStore.errorRounds}</Alert>
        </Paper>
      )}

      {!roundsStore.loading &&
        !roundsStore.errorRounds &&
        roundsStore.rounds.map((round) => (
          <Paper
            key={round.id}
            onClick={() => navigate(`/guss/${round.id}`)}
            sx={{ cursor: 'pointer', my: 2, margin: '12pt' }}
          >
            <Card>
              <Typography>Round ID: {round.id}</Typography>
              <Typography>Start: {round.startTime}</Typography>
              <Typography>End: {round.endTime}</Typography>
              <Typography>Статус: {round.status}</Typography>
            </Card>
          </Paper>
        ))}
    </Box>
  );
};

export const Rounds = observer(RoundsComponent);
