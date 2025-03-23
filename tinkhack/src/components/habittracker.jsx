import React, { useState, useEffect } from "react";
import supabase from "../supabase";
import { 
  Button, 
  Slider, 
  Box, 
  Typography, 
  Select, 
  MenuItem,
  Paper,
  Container,
  FormControl,
  Snackbar,
  Alert
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const HabitTracker = ({ profileId }) => {
  // Auth state
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeProfileId, setActiveProfileId] = useState(null);
  
  // Color theme variables
  const primaryColor = "#7a5a3d"; // Dark brown
  const secondaryColor = "#8d6b4d"; // Warm brown
  const accentColor = "#ffd599"; // Light orange/peach
  const backgroundColor = "#fcf8f3"; // Light cream

  // Form state
  const [sleepHours, setSleepHours] = useState("6-8 hrs");
  const [nutrition, setNutrition] = useState("Average");
  const [waterIntake, setWaterIntake] = useState(5);
  const [exercise, setExercise] = useState("None");
  const [breastfeeding, setBreastfeeding] = useState(2);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Get current authenticated user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user:', error);
        return;
      }
      
      if (user) {
        setCurrentUserId(user.id);
        // Use the authenticated user ID as the active profile ID if no profile ID is provided
        setActiveProfileId(profileId || user.id);
      } else if (profileId) {
        // If no authenticated user but profile ID is provided, use that
        setActiveProfileId(profileId);
      } else {
        // No user and no profile ID
        setSnackbar({
          open: true,
          message: "Error: Profile ID is required",
          severity: "error"
        });
      }
    };
    
    getCurrentUser();
  }, [profileId]);

  // Check if there's existing data for the selected date
  useEffect(() => {
    const fetchTodayData = async () => {
      if (!activeProfileId) return;
      
      try {
        const { data, error } = await supabase
          .from('wellness_logs')
          .select('*')
          .eq('profile_id', activeProfileId)
          .eq('log_date', logDate)
          .single();
        
        if (error) {
          console.error('Error fetching data:', error);
          return;
        }
        
        if (data) {
          // Populate form with existing data
          setSleepHours(data.sleep_hours);
          setNutrition(data.nutrition);
          setWaterIntake(data.water_intake);
          setExercise(data.exercise);
          setBreastfeeding(data.breastfeeding);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (activeProfileId) {
      fetchTodayData();
    }
  }, [activeProfileId, logDate]);

  // Function to calculate total score
  const calculateScore = () => {
    let score = 0;

    // Sleep Hours (Max 15)
    const sleepScores = { "< 4 hrs": 5, "4-6 hrs": 10, "6-8 hrs": 20, "8+ hrs": 30 };
    score += sleepScores[sleepHours];

    // Nutrition (Max 10)
    const nutritionScores = { Poor: 10, Average: 15, Good: 20 };
    score += nutritionScores[nutrition];

    // Water Intake (Max 10)
    score += (waterIntake >= 8 ? 20 : waterIntake);

    // Exercise (Max 10)
    const exerciseScores = { None: 5, "< 15 mins": 10, "15-30 mins": 15, "30+ mins": 20 };
    score += exerciseScores[exercise];

    // Breastfeeding Frequency (Max 5)
    const breastfeedingScores = { 1: 3, 2: 6, 3: 8, "4+": 10 };
    score += breastfeedingScores[breastfeeding];

    return Math.min(100, score);
  };

  // Function to save data to Supabase
  const saveProgress = async () => {
    if (!activeProfileId) {
      setSnackbar({
        open: true,
        message: "Error: Profile ID is required",
        severity: "error"
      });
      return;
    }

    setLoading(true);
    const wellness_score = calculateScore();
    
    try {
      const { data, error } = await supabase
        .from('wellness_logs')
        .upsert({
          profile_id: activeProfileId,
          log_date: logDate,
          submission_date: new Date().toISOString().split('T')[0],
          sleep_hours: sleepHours,
          nutrition: nutrition,
          water_intake: waterIntake,
          exercise: exercise,
          breastfeeding: breastfeeding.toString(), // Convert to string as per db schema
          wellness_score: wellness_score
        }, { 
          onConflict: 'profile_id,log_date' // Handle duplicate entries
        });

      if (error) {
        console.error('Error saving data:', error);
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error"
        });
      } else {
        setSnackbar({
          open: true,
          message: "Progress saved successfully!",
          severity: "success"
        });
      }
    } catch (error) {
      console.error('Exception:', error);
      setSnackbar({
        open: true,
        message: "An unexpected error occurred",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom Select with Icon
  const IconSelect = ({ icon, label, value, options, onChange, suffix = "" }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}>
        {label}
      </Typography>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            height: '56px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            bgcolor: 'white',
          }}
          IconComponent={(props) => (
            <ArrowForwardIcon
              {...props}
              sx={{
                transform: 'rotate(90deg)',
                color: 'rgba(0, 0, 0, 0.3)',
                right: 12,
              }}
            />
          )}
          startAdornment={
            <Box sx={{ color: primaryColor, mr: 2, display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          }
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}{suffix}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ 
      height: '100vh', 
      overflow: 'auto', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      p: 2, 
      bgcolor: backgroundColor 
    }}>
      <Paper 
        elevation={6} 
        sx={{ 
          width: '100%', 
          maxWidth: 400, 
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          bgcolor: backgroundColor,
          my: 2,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box 
          sx={{ 
            bgcolor: secondaryColor, 
            color: 'white', 
            p: 3, 
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
              Wellness Tracker
            </Typography>
          </Box>
          
          {/* Score circle */}
          <Box 
            sx={{ 
              width: 90, 
              height: 90, 
              bgcolor: accentColor, 
              borderRadius: '50%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              margin: '0 auto',
              color: primaryColor,
            }}
          >
            <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>
              {calculateScore()}
            </Typography>
            <Typography variant="caption" component="p" sx={{ fontSize: '0.7rem' }}>
              Score
            </Typography>
          </Box>
        </Box>

        {/* Form Inputs */}
        <Box sx={{ p: 3, bgcolor: backgroundColor, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          {/* Show profile info if available */}
          {activeProfileId && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 213, 153, 0.2)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: primaryColor }}>
                Tracking wellness for profile: {activeProfileId.substring(0, 8)}...
              </Typography>
            </Box>
          )}
        
          {/* Date picker */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}>
              Log Date
            </Typography>
            <FormControl fullWidth>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: '56px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                px: 2,
                bgcolor: 'white',
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
              }}>
                <CalendarTodayIcon sx={{ color: primaryColor, mr: 2 }} />
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    backgroundColor: 'transparent'
                  }}
                />
              </Box>
            </FormControl>
          </Box>

          <IconSelect 
            icon={<AccessTimeIcon />}
            label="Sleep Duration"
            value={sleepHours}
            options={["< 4 hrs", "4-6 hrs", "6-8 hrs", "8+ hrs"]}
            onChange={setSleepHours}
          />

          <IconSelect 
            icon={<RestaurantIcon />}
            label="Nutrition Quality"
            value={nutrition}
            options={["Poor", "Average", "Good"]}
            onChange={setNutrition}
          />

          {/* Water Intake Slider */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, color: "rgba(0, 0, 0, 0.7)" }}>
              Water Intake: {waterIntake} glasses
            </Typography>
            <Slider
              value={waterIntake}
              onChange={(e, newValue) => setWaterIntake(newValue)}
              min={1}
              max={10}
              step={1}
              sx={{
                color: primaryColor,
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(122, 90, 61, 0.2)',
                  height: 4,
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  '&:before': {
                    boxShadow: `0 0 0 8px rgba(122, 90, 61, 0.1)`,
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px rgba(122, 90, 61, 0.16)`,
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <LocalDrinkIcon sx={{ color: primaryColor, fontSize: '1rem' }} />
              <LocalDrinkIcon sx={{ color: primaryColor, fontSize: '1rem' }} />
            </Box>
          </Box>

          <IconSelect 
            icon={<FitnessCenterIcon />}
            label="Exercise Duration"
            value={exercise}
            options={["None", "< 15 mins", "15-30 mins", "30+ mins"]}
            onChange={setExercise}
          />

          <IconSelect 
            icon={<ChildCareIcon />}
            label="Breastfeeding Frequency"
            value={breastfeeding}
            options={[1, 2, 3, "4+"]}
            onChange={setBreastfeeding}
            suffix=" times"
          />

          {/* Save Button */}
          <Button 
            variant="contained" 
            fullWidth 
            endIcon={<ArrowForwardIcon />}
            onClick={saveProgress}
            disabled={loading || !activeProfileId}
            sx={{ 
              mt: 2, 
              py: 1.5, 
              bgcolor: primaryColor, 
              '&:hover': { 
                bgcolor: secondaryColor 
              },
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            {loading ? "Saving..." : "Save Today's Progress"}
          </Button>
        </Box>
      </Paper>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HabitTracker;