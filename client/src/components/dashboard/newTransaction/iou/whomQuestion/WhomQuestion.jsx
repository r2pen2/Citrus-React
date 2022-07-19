// Style imports
import "./whomQuestion.scss";

// Library imports
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { faker } from "@faker-js/faker";

// Component imports
import AvatarSelector from "../../../../resources/avatarSelector/AvatarSelector";
import BackButton from "../../templates/backButton/BackButton";
import ForwardButton from "../../templates/forwardButton/ForwardButton";

export default function WhomQuestion({
  nextStep,
  prevStep,
  setFriendName,
  setFriendId,
}) {
  const [selectedFriendName, setSelectedFriendName] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState("");

  // example data for listing friend options
  const possibleFriends = [
    {
      id: 1,
      firstName: "Joe",
      avatarSrc: faker.image.animals(200, 200, true),
    },
    {
      id: 2,
      firstName: "Leo",
      avatarSrc: faker.image.animals(200, 200, true),
    },
    {
      id: 3,
      firstName: "Oliver",
      avatarSrc: faker.image.animals(200, 200, true),
    },
  ];

  function handleForwardClick() {
    if (selectedFriendName === "") {
      console.log("Can't proceed without answering the question");
      // dialog box
    } else {
      setFriendName(selectedFriendName);
      setFriendId(selectedFriendId);
      nextStep();
    }
  }

  return (
    <div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={"3vh"} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {"With whom?"}
        </Typography>
        <AvatarSelector
          selectedFriendName={selectedFriendName}
          possibleFriends={possibleFriends}
          setSelectedFriendName={setSelectedFriendName}
          setSelectedFriendId={setSelectedFriendId}
        ></AvatarSelector>
        <ForwardButton onClick={handleForwardClick} />
      </Stack>
    </div>
  );
}
