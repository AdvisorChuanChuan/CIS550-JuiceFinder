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

function Signup() {
  const theme = useTheme();

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/settings");
    } catch (signupError) {
      setError(`Failed to create your account. ${signupError.message}`);
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
          Sign up
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
            <Grid item xs={12}>
              <StyledTextField
                variant="outlined"
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="passwordConfirm"
                autoComplete="off"
                inputRef={passwordConfirmRef}
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
            Sign Up
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
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
              >
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default Signup;
