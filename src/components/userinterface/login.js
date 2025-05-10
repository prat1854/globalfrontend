import React, { useState } from 'react';
import { Container, CssBaseline, Avatar, Typography, TextField, Button, FormControlLabel, Checkbox, Link, Grid, Box, Paper, InputAdornment, IconButton, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../Services/FetchNodeAdminServices';

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
  
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
  
    const attemptLogin = (retriesLeft) => {
      ApiService.login({ email, password })
        .then(response => {
          const data = response.data;
  
          if (data.success) {
            localStorage.setItem('userToken', JSON.stringify({
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              expires_at: data.expires_at
            }));
  
            window.dispatchEvent(new Event('login'));
            navigate('/profile');
          } else {
            if (retriesLeft > 0) {
              setTimeout(() => attemptLogin(retriesLeft - 1), 1000);
            } else {
              setError(data.message || 'Login failed. Please try again.');
            }
          }
        })
        .catch(error => {
          if (retriesLeft > 0) {
            setTimeout(() => attemptLogin(retriesLeft - 1), 1000);
          } else {
            if (error.code === 'ERR_NETWORK') {
              setError('Unable to connect to the server. Please try again later.');
            } else if (error.response) {
              setError(error.response.data.message || 'Invalid email or password');
            } else {
              setError('Something went wrong. Please try again.');
            }
          }
        });
    };
  
    attemptLogin(2); // 3 attempts total: initial + 2 retries
  };  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 2,
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: '#1976d2',
              width: 56,
              height: 56,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ 
              mb: 2,
              fontWeight: 500,
              color: '#333333'
            }}
          >
            Welcome Back
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 3,
              color: '#666666',
              textAlign: 'center'
            }}
          >
            Sign in to access your Global Journal
          </Typography>
          {error && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                color: 'error.main',
                textAlign: 'center'
              }}
            >
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Link 
                  component="button" 
                  variant="body2" 
                  onClick={() => navigate('/reset-password')}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
            
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Not a member?
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
                onClick={() => navigate('/signup')}
              >
                Join Now
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
