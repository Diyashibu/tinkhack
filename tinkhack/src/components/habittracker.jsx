import React, { useState } from "react";
import { 
  Button, 
  Slider, 
  Box, 
  Typography, 
  Select, 
  MenuItem,
  Paper,
  Container,
  FormControl
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HabitTracker = () => {
  // Color theme variables
  const primaryColor = "#7a5a3d"; // Dark brown
  const secondaryColor = "#8d6b4d"; // Warm brown
  const accentColor = "#ffd599"; // Light orange/peach
  const backgroundColor = "#fcf8f3"; // Light cream

  const [sleepHours, setSleepHours] = useState("6-8 hrs");
  const [nutrition, setNutrition] = useState("Average");
  const [waterIntake, setWaterIntake] = useState(5);
  const [exercise, setExercise] = useState("None");
  const [breastfeeding, setBreastfeeding] = useState(2);
  const [energy, setEnergy] = useState("Moderate");
  const [babySleep, setBabySleep] = useState("Frequent Wakes");
  const [stress, setStress] = useState("Moderate");
  const [pain, setPain] = useState("Mild");
  const [medication, setMedication] = useState(false);
  const [selfCare, setSelfCare] = useState("None");

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
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, bgcolor: backgroundColor }}>
      <Paper 
        elevation={6} 
        sx={{ 
          width: '100%', 
          maxWidth: 400, 
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          bgcolor: backgroundColor, // Changed form background to match container background
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
        <Box sx={{ p: 3, bgcolor: backgroundColor }}>
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
            Save Today's Progress
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HabitTracker;