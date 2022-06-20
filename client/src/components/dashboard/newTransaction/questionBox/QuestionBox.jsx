// Style imports
import "./questionBox.scss";

// Library imports
import { Card } from "@mui/material";

export default function QuestionBox(question) {
  return (
    <div>
      <Card variant="outlined">{question}</Card>
    </div>
  );
}
