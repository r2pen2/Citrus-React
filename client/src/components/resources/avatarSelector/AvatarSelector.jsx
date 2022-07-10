// Library imports
import { Grid } from "@mui/material";

// component imports
import AvatarButton from "./avatarButton/AvatarButton";

export default function AvatarSelector({ possibleFriends }) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <AvatarButton
            index={possibleFriends[0].id}
            firstName={possibleFriends[0].firstName}
            avatarSrc={possibleFriends[0].avatarSrc}
            size="large"
          />
        </Grid>
        <Grid item xs={6}>
          <AvatarButton
            index={possibleFriends[1].id}
            firstName={possibleFriends[1].firstName}
            avatarSrc={possibleFriends[1].avatarSrc}
            size="large"
          />
        </Grid>
        <Grid item xs={6}>
          <AvatarButton
            index={possibleFriends[2].id}
            firstName={possibleFriends[2].firstName}
            avatarSrc={possibleFriends[2].avatarSrc}
            size="large"
          />
        </Grid>
      </Grid>
    </div>
  );
}
