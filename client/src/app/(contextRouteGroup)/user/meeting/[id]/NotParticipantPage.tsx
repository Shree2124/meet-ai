'use client'
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";



const NotParticipantPage = () => {
  const router = useRouter();

  const handleReturn = () => {

    router.replace('/') 
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        marginTop: "50px",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
      You cannot enter this meeting
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
      This is a private meeting, and you are not invited. You cannot attend or enter this meeting.
      </Typography>

      <Button
        onClick={handleReturn}
        variant="contained"
        sx={{
          px: 6,
          py: 3,
          fontSize: "18px",
          bgcolor: "warning.main",
          "&:hover": {
            bgcolor: "warning.dark",
          },
        }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default NotParticipantPage;
