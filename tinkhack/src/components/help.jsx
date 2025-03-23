import { useState } from "react";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Box, 
  Container, 
  IconButton,
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Tabs, 
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  AppBar,
  Toolbar
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShieldIcon from "@mui/icons-material/Shield";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ChatIcon from "@mui/icons-material/Chat";
import PsychologyIcon from "@mui/icons-material/Psychology";  // For counselors
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";  // For doctors
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";  // For therapists
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
import supabase from "../supabase";

// New color theme
const theme = {
  primary: "#8d6b4d", // Warm brown
  secondary: "#ffd599", // Light orange
  background: "#fcf8f3", // Cream
  accent: "#e5ebda", // Light green
  white: "#ffffff",
  textPrimary: "#333333",
  textSecondary: "#666666"
};

const counselors = [
  { name: "Dr. Sarah Johnson", contact: "+91 98765 43210" },
  { name: "Mr. Alex Brown", contact: "+91 92345 67890" },
];

const doctors = [
  { name: "Dr. Ramesh Kumar", contact: "+91 98765 12345" },
  { name: "Dr. Emily Watson", contact: "+91 93456 78901" },
];

const therapists = [
  { name: "Ms. Jane Doe", contact: "+91 91234 56789" },
  { name: "Mr. John Smith", contact: "+91 94567 12345" },
];

const MentalHealthSupport = () => {
  const navigate = useNavigate();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState(["790707374"]);
  const [tabIndex, setTabIndex] = useState(0);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleAddContact = () => {
    if (contact.trim()) {
      setEmergencyContacts([...emergencyContacts, contact]);
      setContact("");
    }
  };
  
  const handleOpenChat = (professional) => {
    setCurrentProfessional(professional);
    setChatHistory([
      { sender: "system", message: `Connected with ${professional.name}. How can they help you today?` }
    ]);
    setChatOpen(true);
  };
  
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Add user message
      const updatedHistory = [
        ...chatHistory,
        { sender: "user", message: chatMessage }
      ];
      
      setChatHistory(updatedHistory);
      setChatMessage("");
      
      // Simulate professional response after a delay
      setTimeout(() => {
        const responseMessages = [
          "I understand how you're feeling. Can you tell me more?",
          "Thank you for sharing that with me. How long have you been experiencing this?",
          "I'm here to support you. Let's discuss some strategies that might help.",
          "Your wellbeing is important. Have you tried any coping mechanisms so far?",
          "That sounds challenging. Would you like to schedule a proper session to discuss this further?"
        ];
        
        const randomResponse = responseMessages[Math.floor(Math.random() * responseMessages.length)];
        
        setChatHistory(prevHistory => [
          ...prevHistory,
          { sender: "professional", message: randomResponse }
        ]);
      }, 1000);
    }
  };

  const tabIcons = [
    <PsychologyIcon key="counselors" />,
    <LocalHospitalIcon key="doctors" />,
    <HealthAndSafetyIcon key="therapists" />
  ];
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        // Optionally show an error message to the user
      } else {
        navigate("/"); // Redirect to login page after successful logout
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };
  
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: theme.primary }}>
        <Toolbar 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            padding: 0,
            minHeight: "auto"
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              cursor: "pointer",
              paddingLeft: "4px",
              margin: 0,
              color: theme.white
            }} 
            onClick={() => navigate("/")}
          >
            My App
          </Typography>
          <Box sx={{ 
            display: "flex", 
            margin: 0,
            padding: 0
          }}>
            <Button color="inherit" onClick={() => navigate("/Community")}>Community</Button>
            <Button color="inherit" onClick={() => navigate("/Help")}>Help</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ minHeight: "100vh", bgcolor: theme.background }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          p: 0,
          borderBottom: `1px solid ${theme.secondary}`,
          bgcolor: theme.white
        }}>
          {/* Header content removed as per original */}
        </Box>

        <Container maxWidth="lg">
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mt: 8, mb: 3 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: "bold", 
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, 
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1
              }}
            >
              You're Not Alone. Help is Here.
            </Typography>
            <Typography variant="h6" color={theme.textSecondary}>
              Reach out now – support is available 24/7.
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ mt: 5, display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* Crisis Analysis */}
            <Card sx={{ 
              flex: 1, 
              minWidth: 300, 
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: theme.white
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ bgcolor: theme.accent, borderRadius: "50%", p: 2, mr: 2 }}>
                    <PhoneIcon sx={{ color: theme.primary, fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" fontWeight="medium">Crisis Analysis</Typography>
                </Box>
                <Typography variant="body1" color={theme.textSecondary} sx={{ mb: 3 }}>
                  View details of mental health professionals.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    bgcolor: theme.primary, 
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#7a5c42" }
                  }} 
                  onClick={() => setCrisisModalOpen(true)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card sx={{ 
              flex: 1, 
              minWidth: 300, 
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: theme.white
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="medium" sx={{ mb: 3 }}>Emergency Contacts</Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Enter emergency contact"
                    variant="outlined"
                    size="medium"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    sx={{ 
                      "& .MuiOutlinedInput-root": { 
                        borderRadius: 2,
                        bgcolor: theme.accent
                      } 
                    }}
                  />
                  <IconButton 
                    onClick={handleAddContact} 
                    sx={{ 
                      bgcolor: theme.primary, 
                      color: theme.white,
                      "&:hover": { bgcolor: "#7a5c42" }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" color={theme.textSecondary} sx={{ mb: 2 }}>
                  Saved Contacts:
                </Typography>
                <List>
                  {emergencyContacts.map((c, index) => (
                    <ListItem key={index} sx={{ px: 1 }}>
                      <ListItemIcon>
                        <PersonIcon sx={{ color: theme.primary }} />
                      </ListItemIcon>
                      <ListItemText primary={c} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
          
          {/* Additional Support Section */}
          <Box sx={{ mt: 5, display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* 24/7 Support */}
            <Card sx={{ 
              flex: 1, 
              minWidth: 300, 
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: theme.secondary
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: theme.primary, mr: 2 }}>
                    <AccessTimeIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">24/7 Support</Typography>
                </Box>
                <Typography variant="body2" color={theme.textSecondary}>
                  Always available when you need help.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Confidential */}
            <Card sx={{ 
              flex: 1, 
              minWidth: 300, 
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: theme.accent
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: theme.primary, mr: 2 }}>
                    <ShieldIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">Confidential</Typography>
                </Box>
                <Typography variant="body2" color={theme.textSecondary}>
                  Your privacy is our top priority.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Professional Care */}
            <Card sx={{ 
              flex: 1, 
              minWidth: 300, 
              borderRadius: 3, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: theme.secondary
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: theme.primary, mr: 2 }}>
                    <SupportAgentIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">Professional Care</Typography>
                </Box>
                <Typography variant="body2" color={theme.textSecondary}>
                  Expert counselors ready to help.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* Floating Help Button */}
        <Box 
          sx={{ 
            position: "fixed", 
            bottom: "16px", 
            right: "16px", 
            zIndex: 50 
          }}
        >
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<PhoneIcon />}
            onClick={() => setHelpModalOpen(true)}
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              bgcolor: theme.primary,
              "&:hover": { bgcolor: "#7a5c42" }
            }}
          >
            Get Help Now
          </Button>
        </Box>
      </Box>

      {/* Modals */}
      {/* Help Modal */}
      <Dialog 
        open={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ 
          sx: { bgcolor: theme.background } 
        }}
      >
        <DialogTitle sx={{ color: theme.primary }}>Emergency Support</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ color: theme.primary }}>Immediate Assistance</Typography>
          <Typography variant="body1">If you or someone you know is in crisis, call emergency services immediately.</Typography>
          <Button 
            variant="contained" 
            fullWidth 
            sx={{ 
              mt: 2, 
              bgcolor: theme.primary,
              "&:hover": { bgcolor: "#7a5c42" }
            }} 
            onClick={() => window.location.href = 'tel:+911'}
          >
            📞 Call Emergency Helpline
          </Button>
        </DialogContent>
      </Dialog>

      {/* Crisis Modal */}
      <Dialog 
        open={crisisModalOpen} 
        onClose={() => setCrisisModalOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ 
          sx: { bgcolor: theme.background } 
        }}
      >
        <DialogTitle sx={{ color: theme.primary }}>Crisis Analysis - Find a Professional</DialogTitle>
        <DialogContent>
          <Tabs 
            value={tabIndex} 
            onChange={(e, newValue) => setTabIndex(newValue)} 
            variant="fullWidth"
            TabIndicatorProps={{ sx: { bgcolor: theme.primary } }}
            sx={{
              "& .MuiTab-root": { color: theme.textSecondary },
              "& .Mui-selected": { color: theme.primary }
            }}
          >
            <Tab icon={tabIcons[0]} label="Counselors" iconPosition="start" />
            <Tab icon={tabIcons[1]} label="Doctors" iconPosition="start" />
            <Tab icon={tabIcons[2]} label="Therapists" iconPosition="start" />
          </Tabs>
          <Box p={2}>
            {[counselors, doctors, therapists][tabIndex].map((professional, index) => (
              <Card key={index} sx={{ mb: 2, p: 2, bgcolor: theme.white }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ bgcolor: theme.primary, mr: 2 }}>
                    {tabIndex === 0 ? <PsychologyIcon /> : tabIndex === 1 ? <LocalHospitalIcon /> : <HealthAndSafetyIcon />}
                  </Avatar>
                  <Typography variant="h6">{professional.name}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>Contact: {professional.contact}</Typography>
                <Button 
                  variant="contained" 
                  startIcon={<ChatIcon />}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: "none", 
                    bgcolor: theme.primary,
                    "&:hover": { bgcolor: "#7a5c42" }
                  }}
                  onClick={() => handleOpenChat(professional)}
                >
                  Chat Now
                </Button>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Chat Dialog */}
      <Dialog 
        open={chatOpen} 
        onClose={() => setChatOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ 
          sx: { 
            height: "70vh", 
            maxHeight: "600px", 
            display: "flex", 
            flexDirection: "column",
            bgcolor: theme.background
          } 
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.accent, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          color: theme.primary 
        }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: theme.primary, mr: 2 }}>
              {tabIndex === 0 ? <PsychologyIcon /> : tabIndex === 1 ? <LocalHospitalIcon /> : <HealthAndSafetyIcon />}
            </Avatar>
            <Typography variant="h6">
              {currentProfessional?.name || "Professional"}
            </Typography>
          </Box>
          <IconButton onClick={() => setChatOpen(false)}>
            <CloseIcon sx={{ color: theme.primary }} />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2, overflow: "auto" }}>
          <Box sx={{ flexGrow: 1, overflow: "auto", mb: 2 }}>
            {chatHistory.map((msg, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: "flex", 
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  mb: 2
                }}
              >
                {msg.sender === "professional" && (
                  <Avatar sx={{ bgcolor: theme.primary, mr: 1 }}>
                    {tabIndex === 0 ? <PsychologyIcon /> : tabIndex === 1 ? <LocalHospitalIcon /> : <HealthAndSafetyIcon />}
                  </Avatar>
                )}
                
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    maxWidth: "70%", 
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" 
                      ? theme.secondary 
                      : msg.sender === "system"
                      ? theme.accent
                      : theme.white,
                    border: msg.sender === "system" ? `1px dashed ${theme.primary}` : "none"
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                </Paper>
                
                {msg.sender === "user" && (
                  <Avatar sx={{ bgcolor: theme.primary, ml: 1 }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.secondary}` }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{ 
                mr: 1,
                "& .MuiOutlinedInput-root": { 
                  bgcolor: theme.white,
                  "& fieldset": {
                    borderColor: theme.secondary
                  },
                  "&:hover fieldset": {
                    borderColor: theme.primary
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.primary
                  }
                }
              }}
            />
            <Button 
              variant="contained" 
              endIcon={<SendIcon />} 
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
              sx={{ 
                bgcolor: theme.primary,
                "&:hover": { bgcolor: "#7a5c42" },
                "&.Mui-disabled": { bgcolor: "#c0b0a0" }
              }}
            >
              Send
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MentalHealthSupport;