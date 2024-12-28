import { Avatar, AvatarGroup, Box, Stack, Tooltip } from "@mui/material";
import React from "react";
import { transformImage } from "@/lib/features";

const AvatarCard = ({ avatar = [], max = 5 }: any) => {
  const displayedAvatars = avatar.slice(0, max);
  const remainingCount = Math.max(avatar.length - max, 0);

  return (
    <Stack direction={"row"} spacing={0.5} alignItems="center">
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        <Box height={"3rem"} width={"auto"} display="flex">
          {displayedAvatars.map((participant: any, index: any) => (
            <Tooltip key={index} title={participant.name} arrow>
              <Avatar
                src={transformImage(participant.avatar)}
                alt={participant.name}
                sx={{
                  width: "3rem",
                  height: "3rem",
                  position: "absolute",
                  left: {
                    xs: `${0.5 + index}rem`,
                    sm: `${index}rem`,
                  },
                }}
              />
            </Tooltip>
          ))}
          {remainingCount > 0 && (
            <div className="pl-20">
              <Avatar
                sx={{
                  position: "relative",
                  marginLeft: `${max + 0.8}rem `,
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#fff",
                  color: "black",
                  fontSize: "1rem",
                  alignItems: "center",
                  paddingLeft: "6px",
                }}
              >
                +{remainingCount} more
              </Avatar>
            </div>
          )}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
