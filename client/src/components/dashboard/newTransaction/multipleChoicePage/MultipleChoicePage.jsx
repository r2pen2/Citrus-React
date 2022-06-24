// Style imports
import "./multipleChoicePage.scss";

// Library imports
import { Fab, Stack } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../backButton/BackButton";
import InfoButton from "../infoButton/InfoButton";

export default function GroupOrOneTimeBox({
  options,
  priorPage,
  nextPage,
  informationText,
}) {
  function handleClick(choice) {}

  function returnChoices() {
    return options.map((option, oIndex) => (
      <MultipleChoiceButton
        order={oIndex}
        text={option}
        href={nextPage}
      ></MultipleChoiceButton>
    ));
  }

  return (
    <div>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ marginLeft: "30px", marginTop: "2vh" }}>
        <BackButton priorHref={priorPage}></BackButton>
      </div>
      <Stack spacing={5} marginTop="5vh" alignItems="center">
        {returnChoices()}
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
