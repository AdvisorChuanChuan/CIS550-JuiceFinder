import React, { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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

function ForgotPassword() {
  const theme = useTheme();

  const emailRef = useRef();

  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch (resetError) {
      setError(`Failed to reset password. ${resetError.message}`);
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
          Reset Password
        </Typography>
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success">
            <AlertTitle>Reset Email Sent</AlertTitle>
            {message}
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <StyledTextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="off"
                autoFocus
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={loading}
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                sx={{
                  marginBottom: theme.spacing(1),
                  color: theme.palette.success.contrastText,
                  backgroundColor: theme.palette.success,
                  "&:hover": {
                    backgroundColor: theme.palette.success.light,
                  },
                }}
              >
                Reset via Email
              </Button>
              <Button
                component={RouterLink}
                to="/login"
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
                Go to Log In
              </Button>
            </Grid>
            <Grid container justifyContent="flex-end">
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
          </Grid>
        </form>
      </div>
    </Container>
  );
}

export default ForgotPassword;
