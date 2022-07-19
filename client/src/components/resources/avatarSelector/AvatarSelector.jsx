// Library imports
import { Grid } from "@mui/material";
import { useState } from "react";

// component imports
import AvatarButton from "./avatarButton/AvatarButton";

export default function AvatarSelector({
  selectedFriendName,
  possibleFriends,
  setSelectedFriendName,
  setSelectedFriendId,
}) {
  // function handleClick(friend) {
  //   setFriendName(friend.name);
  //   setFriendId(friend.id);
  // }

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={4}>
          <AvatarButton
            index={possibleFriends[0].id}
            firstName={possibleFriends[0].firstName}
            avatarSrc={possibleFriends[0].avatarSrc}
            size="small"
            selectedFriendName={selectedFriendName}
            setSelectedFriendName={setSelectedFriendName}
            setSelectedFriendId={setSelectedFriendId}
          />
        </Grid>
        <Grid item xs={4}>
          <AvatarButton
            index={possibleFriends[1].id}
            firstName={possibleFriends[1].firstName}
            avatarSrc={possibleFriends[1].avatarSrc}
            size="small"
            selectedFriendName={selectedFriendName}
            setSelectedFriendName={setSelectedFriendName}
            setSelectedFriendId={setSelectedFriendId}
          />
        </Grid>
        <Grid item xs={4}>
          <AvatarButton
            index={possibleFriends[2].id}
            firstName={possibleFriends[2].firstName}
            avatarSrc={possibleFriends[2].avatarSrc}
            size="small"
            selectedFriendName={selectedFriendName}
            setSelectedFriendName={setSelectedFriendName}
            setSelectedFriendId={setSelectedFriendId}
          />
        </Grid>
      </Grid>
    </div>
  );
}
