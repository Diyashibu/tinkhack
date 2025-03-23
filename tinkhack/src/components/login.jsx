import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import { TextField, Button, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [dob, setDob] = useState("");
  const [interests, setInterests] = useState("");
  const [supportNeeds, setSupportNeeds] = useState("");
  const [preferredCommunication, setPreferredCommunication] = useState("");
  const [role, setRole] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
      if (user) {
        await checkUserProfile(user.id);
        if (!isNewUser) {
          // Redirect existing users to Help page
          navigate('/Help');
        }
      }
    };
  
    fetchUser();
  
    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setIsSignUp(false);
        setIsNewUser(false);
      }
    });
  
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [isNewUser, navigate]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "Email is required";
    } else if (!regex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = () => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must be at least 6 characters long";
    } else if (isSignUp && password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsNewUser(false);
    setIsSignUp(false);
  };
  
  const handleSignUp = async () => {
    // Validate email
    const emailErrorMsg = validateEmail(email);
    setEmailError(emailErrorMsg);

    // Validate password
    const passwordErrorMsg = validatePassword();
    setPasswordError(passwordErrorMsg);

    // If there are validation errors, return
    if (emailErrorMsg || passwordErrorMsg) {
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: null },
    });
  
    if (error) {
      alert(error.message);
    } else {
      // Set the user and isNewUser state directly
      setUser(data.user);
      setIsNewUser(true);
      // No need to navigate or show alert
    }
  };
  
  const handleLogin = async () => {
    // Validate email
    const emailErrorMsg = validateEmail(email);
    setEmailError(emailErrorMsg);

    // Validate password exists
    if (!password) {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    // If there are validation errors, return
    if (emailErrorMsg) {
      return;
    }
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    } else {
      setUser(data.user);
      await checkUserProfile(data.user.id);
      if (!isNewUser) {
        // Redirect existing users to Help page
        navigate('/Help');
      }
    }
  };
  
  const checkUserProfile = async (userId) => {
    let { data } = await supabase.from("profiles").select("id").eq("id", userId);
    const newUserStatus = data.length === 0;
    setIsNewUser(newUserStatus);
    return newUserStatus;
  };

  const handleSaveProfile = async () => {
    const { error } = await supabase.from("profiles").insert([
      {
        id: user.id,
        email,
        dob,
        interests,
        support_needs: supportNeeds,
        preferred_communication: preferredCommunication,
        role,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile saved! Thank you for sharing.");
      navigate('/Help');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (isSignUp && confirmPassword) {
      setPasswordError(value !== confirmPassword ? "Passwords do not match" : "");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordError(password !== value ? "Passwords do not match" : "");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 400, padding: 3, boxShadow: 3 }}>
        <CardContent>
          {!user ? (
            isSignUp ? (
              // Sign-Up Form
              <Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Create an Account
                </Typography>
                <TextField 
                  label="Email" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField 
                  label="Password" 
                  type="password" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordError && confirmPassword === ""}
                  helperText={passwordError && confirmPassword === "" ? passwordError : ""}
                />
                <TextField 
                  label="Confirm Password" 
                  type="password" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={!!passwordError && confirmPassword !== ""}
                  helperText={passwordError && confirmPassword !== "" ? passwordError : ""}
                />
                <TextField
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setDob(e.target.value)}
                />
                <Button variant="contained" color="success" fullWidth sx={{ mt: 2 }} onClick={handleSignUp}>
                  Sign Up
                </Button>
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", cursor: "pointer" }} onClick={() => setIsSignUp(false)}>
                  Already have an account? <strong>Login</strong>
                </Typography>
              </Box>
            ) : (
              // Login Form
              <Box>
                <Typography variant="h5" fontWeight="bold" mb={2}>
                  Login
                </Typography>
                <TextField 
                  label="Email" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField 
                  label="Password" 
                  type="password" 
                  variant="outlined" 
                  fullWidth 
                  margin="normal" 
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
                  Login
                </Button>
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center", cursor: "pointer" }} onClick={() => setIsSignUp(true)}>
                  Don't have an account? <strong>Sign Up</strong>
                </Typography>
              </Box>
            )
          ) : isNewUser ? (
            // Profile Setup for New Users
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Tell us about yourself
              </Typography>
              <TextField label="Tell Us about yourself" multiline rows={2} variant="outlined" fullWidth margin="normal" onChange={(e) => setInterests(e.target.value)} />
              <TextField label="What are your interests or hobbies?" multiline rows={2} variant="outlined" fullWidth margin="normal" onChange={(e) => setInterests(e.target.value)} />
              <TextField label="What kind of support do you need?" multiline rows={2} variant="outlined" fullWidth margin="normal" onChange={(e) => setSupportNeeds(e.target.value)} />
              <FormControl fullWidth margin="normal">
                <InputLabel>Preferred Mode of Communication</InputLabel>
                <Select value={preferredCommunication} onChange={(e) => setPreferredCommunication(e.target.value)}>
                  <MenuItem value="Email">Email</MenuItem>
                  <MenuItem value="Chat">Chat</MenuItem>
                  <MenuItem value="Community Forum">Community Forum</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Are you a mother or a caretaker?</InputLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="Mother">Mother</MenuItem>
                  <MenuItem value="Caretaker">Caretaker</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSaveProfile}>
                Save Profile
              </Button>
            </Box>
          ) : null }
        </CardContent>
      </Card>
    </Box>
  );
}