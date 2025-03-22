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
  Avatar
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

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f0f8ff" }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          bgcolor: "white"
        }}>
          {/*<Box sx={{ display: "flex", alignItems: "center" }}>
            <FavoriteIcon sx={{ color: "#ff4081", mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              MindfulSupport
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<PhoneIcon />}
            onClick={() => setHelpModalOpen(true)}
          >
            Get Help Now
          </Button>*/}
        </Box>

        <Container maxWidth="lg">
          {/* Main Heading */}
          <Box sx={{ textAlign: "center", mt: 8, mb: 3 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: "bold", 
                background: "linear-gradient(90deg, #4169e1, #9370db)", 
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1
              }}
            >
              You're Not Alone. Help is Here.
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Reach out now – support is available 24/7.
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ mt: 5, display: "flex", gap: 3, flexWrap: "wrap" }}>
            {/* Crisis Analysis */}
            <Card sx={{ flex: 1, minWidth: 300, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ bgcolor: "#e6efff", borderRadius: "50%", p: 2, mr: 2 }}>
                    <PhoneIcon sx={{ color: "#4169e1", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" fontWeight="medium">Crisis Analysis</Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  View details of mental health professionals.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    bgcolor: "#4169e1", 
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: "none"
                  }} 
                  onClick={() => setCrisisModalOpen(true)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card sx={{ flex: 1, minWidth: 300, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
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
                        bgcolor: "#f9f9f9"
                      } 
                    }}
                  />
                  <IconButton 
                    onClick={handleAddContact} 
                    sx={{ 
                      bgcolor: "#9c27b0", 
                      color: "white",
                      "&:hover": { bgcolor: "#7b1fa2" }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                  Saved Contacts:
                </Typography>
                <List>
                  {emergencyContacts.map((c, index) => (
                    <ListItem key={index} sx={{ px: 1 }}>
                      <ListItemIcon>
                        <PersonIcon sx={{ color: "#666" }} />
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
            <Card sx={{ flex: 1, minWidth: 300, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#9c27b0", mr: 2 }}>
                    <AccessTimeIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">24/7 Support</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Always available when you need help.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Confidential */}
            <Card sx={{ flex: 1, minWidth: 300, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#9c27b0", mr: 2 }}>
                    <ShieldIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">Confidential</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Your privacy is our top priority.
                </Typography>
              </CardContent>
            </Card>
            
            {/* Professional Care */}
            <Card sx={{ flex: 1, minWidth: 300, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box sx={{ color: "#9c27b0", mr: 2 }}>
                    <SupportAgentIcon fontSize="large" />
                  </Box>
                  <Typography variant="h6">Professional Care</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
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
            color="error" 
            size="large" 
            startIcon={<PhoneIcon />}
            onClick={() => setHelpModalOpen(true)}
            sx={{
              borderRadius: 30,
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              bgcolor: "#e53935",
              "&:hover": { bgcolor: "#c62828" }
            }}
          >
            Get Help Now
          </Button>
        </Box>
      </Box>

      {/* Modals */}
      {/* Help Modal */}
      <Dialog open={helpModalOpen} onClose={() => setHelpModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Emergency Support</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Immediate Assistance</Typography>
          <Typography variant="body1">If you or someone you know is in crisis, call emergency services immediately.</Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => window.location.href = 'tel:+911'}>
            📞 Call Emergency Helpline
          </Button>
        </DialogContent>
      </Dialog>

      {/* Crisis Modal */}
      <Dialog open={crisisModalOpen} onClose={() => setCrisisModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crisis Analysis - Find a Professional</DialogTitle>
        <DialogContent>
          <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} variant="fullWidth">
            <Tab icon={tabIcons[0]} label="Counselors" iconPosition="start" />
            <Tab icon={tabIcons[1]} label="Doctors" iconPosition="start" />
            <Tab icon={tabIcons[2]} label="Therapists" iconPosition="start" />
          </Tabs>
          <Box p={2}>
            {[counselors, doctors, therapists][tabIndex].map((professional, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar sx={{ bgcolor: tabIndex === 0 ? "#9c27b0" : tabIndex === 1 ? "#1976d2" : "#43a047", mr: 2 }}>
                    {tabIndex === 0 ? <PsychologyIcon /> : tabIndex === 1 ? <LocalHospitalIcon /> : <HealthAndSafetyIcon />}
                  </Avatar>
                  <Typography variant="h6">{professional.name}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>Contact: {professional.contact}</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<ChatIcon />}
                  sx={{ borderRadius: 2, textTransform: "none" }}
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
            flexDirection: "column" 
          } 
        }}
      >
        <DialogTitle sx={{ bgcolor: "#f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: tabIndex === 0 ? "#9c27b0" : tabIndex === 1 ? "#1976d2" : "#43a047", mr: 2 }}>
              {tabIndex === 0 ? <PsychologyIcon /> : tabIndex === 1 ? <LocalHospitalIcon /> : <HealthAndSafetyIcon />}
            </Avatar>
            <Typography variant="h6">
              {currentProfessional?.name || "Professional"}
            </Typography>
          </Box>
          <IconButton onClick={() => setChatOpen(false)}>
            <CloseIcon />
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
                  <Avatar sx={{ bgcolor: tabIndex === 0 ? "#9c27b0" : tabIndex === 1 ? "#1976d2" : "#43a047", mr: 1 }}>
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
                      ? "#e3f2fd" 
                      : msg.sender === "system"
                      ? "#f5f5f5"
                      : "#ffffff",
                    border: msg.sender === "system" ? "1px dashed #bbbbbb" : "none"
                  }}
                >
                  <Typography variant="body1">{msg.message}</Typography>
                </Paper>
                
                {msg.sender === "user" && (
                  <Avatar sx={{ bgcolor: "#4caf50", ml: 1 }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              variant="outlined"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<SendIcon />} 
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
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