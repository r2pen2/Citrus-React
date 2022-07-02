// Style imports
import "./multipleChoicePage.scss";

// Library imports
import { Stack, Typography } from "@mui/material";

// Component imports
import MultipleChoiceButton from "../multipleChoiceButton/MultipleChoiceButton";
import BackButton from "../backButton/BackButton";
import InfoButton from "../infoButton/InfoButton";

export default function MultipleChoicePage({
  field,
  options,
  informationText,
  nextStep,
  prevStep,
  updateValue,
}) {
  return (
    <div>
      {/* <div style={{ marginTop: "40px" }}></div> */}
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <BackButton onClick={prevStep}></BackButton>
      </div>
      <Stack spacing={5} marginTop="1vh" alignItems="center">
        <Typography variant="h3" fontFamily="fredokaOne">
          {field + "?"}
        </Typography>
        {options.map(function (option, index) {
          return (
            <MultipleChoiceButton
              index={index}
              choice={option}
              field={field}
              updateValue={updateValue}
              nextStep={nextStep}
            />
          );
        })}
        <div style={{ height: "1vh" }}></div>
        <InfoButton informationText={informationText}></InfoButton>
      </Stack>
    </div>
  );
}
