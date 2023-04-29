import React, { useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Link,
  Alert,
  AlertTitle,
  Avatar,
} from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useAuth } from "./AuthContext";

function StyledTextField({ ...other }) {
  const theme = useTheme();

  return (
    <TextField
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      sx={{
        "& .MuiInputLabel-root": {
          color: theme.palette.primary.main,
        },
        "& .MuiOutlinedInput-root": {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        },
        "& .MuiInputBase-input": {
          color: theme.palette.info.light,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderWidth: "1px",
          borderColor: theme.palette.primary.hint,
        },
      }}
    />
  );
}

function Login() {
  const theme = useTheme();

  const emailRef = useRef();
  const passwordRef = useRef();

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/settings");
    } catch (loginError) {
      setError(`Failed to log in. ${loginError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/settings");
    } catch (e) {
      setError(`Failed to log in. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    const auth = getAuth();
    const provider = new GithubAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/settings");
    } catch (e) {
      setError(`Failed to log in. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div
        style={{
          marginTop: theme.spacing(10),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          paddingTop: theme.spacing(6),
          paddingBottom: theme.spacing(10),
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography
          component="h1"
          variant="h3"
          color="primary"
          sx={{ textAlign: "center" }}
        >
          JuiceFinder
        </Typography>
        <Avatar
          sx={{
            margin: theme.spacing(1),
            color: theme.palette.secondary.main,
            backgroundColor: theme.palette.success.main,
          }}
        >
          <OfflineBoltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
                inputRef={passwordRef}
              />
            </Grid>
          </Grid>
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            sx={{
              marginTop: theme.spacing(2),
              marginBottom: theme.spacing(1),
              color: theme.palette.success.contrastText,
              backgroundColor: theme.palette.success,
              "&:hover": {
                backgroundColor: theme.palette.success.light,
              },
            }}
          >
            Log In
          </Button>
          <Button
            component={RouterLink}
            to="/"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginBottom: theme.spacing(1),
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.dark,
              "&:hover": {
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            Cancel
          </Button>

          <Grid container>
            <Grid item xs>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="primary"
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                color="primary"
              >
                No account yet? Sign Up!
              </Link>
            </Grid>
          </Grid>
        </form>
        <Button
          onClick={handleGoogleSignIn}
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            marginTop: theme.spacing(1),
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <GoogleIcon fontSize="small" /> &nbsp; Login with Google
        </Button>
        <Button
          onClick={handleGithubSignIn}
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            marginTop: theme.spacing(1),
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.light,
            },
          }}
        >
          <GitHubIcon fontSize="small" /> &nbsp; Login with GitHub
        </Button>
      </div>
    </Container>
  );
}

export default Login;
