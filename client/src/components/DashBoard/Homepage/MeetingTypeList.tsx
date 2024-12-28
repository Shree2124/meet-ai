'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import HomeCard from '@/components/DashBoard/Homepage/HomeCard';
import { StateCardData } from '@/constants/StateCardData';
import { useUserContext } from '@/Context/userContext';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const MeetingTypeList = () => {
  const { token } = useUserContext();
  const router = useRouter();

  // State for modal and room ID
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCardClick = (state: 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | 'isPrivateMeeting') => {
    if (state === 'isInstantMeeting') {
      router.push('/user/create-meeting');
    } else if (state === 'isScheduleMeeting') {
      router.push('/user/create-meeting');
    } else if (state === 'isJoiningMeeting') {
      // Open modal to join meeting
      handleOpen();
      
    } else if (state === 'isPrivateMeeting') {
      router.push('/user/create-meeting');
    }
  };

  const handleJoinMeeting = () => {
    if (roomId) {
      router.push(`/user/meeting/${roomId}`);
      handleClose(); 
    } else {
      alert('Please enter a valid Room ID');
    }
  };

  return (
    <>
      <Box className="grid grid-cols-1 gap-3 md:gap-3 lg:gap-4 md:grid-cols-2 xl:grid-cols-4">
        {StateCardData.map((item, index) => (
          <HomeCard
            key={index}
            img={item.img}
            title={item.title}
            description={item.description}
            iconbg={item.iconbg}
            iconColor={item.iconColor}
            handleClick={() => handleCardClick(item.isState)}
          />
        ))}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="join-meeting-modal"
        aria-describedby="modal-to-enter-room-id"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <h2 id="join-meeting-modal">Join Meeting</h2>
          <TextField
            fullWidth
            label="Enter Room ID"
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleJoinMeeting}
            sx={{ mt: 3 }}
          >
            Join Meeting
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default MeetingTypeList;
