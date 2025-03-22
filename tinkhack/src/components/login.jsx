import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import { TextField, Button, Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [dob, setDob] = useState("");
  const [interests, setInterests] = useState("");
  const [supportNeeds, setSupportNeeds] = useState("");
  const [preferredCommunication, setPreferredCommunication] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
      if (user) checkUserProfile(user.id);
    };
  
    fetchUser();
  
    // Listen for authentication changes (fixes the issue)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null); // Ensure state resets properly
        setIsSignUp(false); // Show login form
        setIsNewUser(false);
      }
    });
  
    return () => {
      authListener.subscription.unsubscribe(); // Cleanup listener
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // Clear user state
    setIsNewUser(false); // Ensure login form is shown
    setIsSignUp(false); // Reset signup state
  };
  

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: null }, // Prevents email verification
    });
  
    if (error) {
      alert(error.message);
    } else {
      setIsSignUp(false); // Redirect to login screen
      alert("Sign-up successful! Please log in.");
      navigate("/");
    }
  };
  

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
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
      checkUserProfile(data.user.id);
    }
  };
  

  const checkUserProfile = async (userId) => {
    let { data } = await supabase.from("profiles").select("id").eq("id", userId);
    setIsNewUser(data.length === 0);
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
        created_at: new Date().toISOString(), // Ensures a timestamp is added
      },
    ]);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      alert("Profile saved! Thank you for sharing.");
      setIsNewUser(false);
    }
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
                <TextField label="Email" variant="outlined" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
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
                <TextField label="Email" variant="outlined" fullWidth margin="normal" onChange={(e) => setEmail(e.target.value)} />
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" onChange={(e) => setPassword(e.target.value)} />
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
          ) :(
            <Box>
    <Typography variant="h6">Welcome back!</Typography>
    <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={handleLogout}>
      Logout
    </Button>
  </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
