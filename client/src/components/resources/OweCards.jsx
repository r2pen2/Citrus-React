// Style imports
import "./style/oweCards.scss";

// Library imports
import { CardContent, CardActionArea, Typography, Stack, Box, Button } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { useState, useEffect } from 'react';

// API imports
import formatter from "../../api/formatter";
import { RouteManager } from "../../api/routeManager";
import { SessionManager } from "../../api/sessionManager";

// Component imports
import { SectionTitle } from "./Labels";
import { OutlinedCard } from "./Surfaces";
import { AvatarIcon } from "./Avatars";

// Get user manager from LS
const currentUserManager = SessionManager.getCurrentUserManager();

export function DashboardOweCards() {

    const [relations, setRelations] = useState({
        postitive: [],
        negative: []
    })

    useEffect(() => {

        async function fetchUserRelations() {
            // Get all transactions for current user
            const userRelations = await currentUserManager.getSimplifiedRelations();
            setRelations({
                positive: userRelations.positive,
                negative: userRelations.negative
            })
        }

        fetchUserRelations();
    }, [])

    return (
      <div className="d-flex flex-row" data-testid="owe-cards">
          <DashboardOweCard direction={"positive"} relations={relations.positive}/>
          <div className="spacer"></div>
          <DashboardOweCard direction={"negative"} relations={relations.negative}/>
      </div>
    )
}

function DashboardOweCard({direction, relations, negativeRelations}) {

    function handleOweCardClick() {
        const newVal = "owe-" + (direction ? direction : "all");
        RouteManager.redirectWithHash("dashboard", newVal);
    }

    function getCardColor() {
      if (direction === "positive") {
        return "rgba(176, 200, 86, 0.8)";
      } else if (direction === "negative") {
        return "rgba(234, 66, 54, 0.5)";
      }
      return "#f0e358";
    }

    function getCardTitle() {
      if (direction === "positive") {
        return "Owe Me";
      } else if (direction === "negative") {
        return "I Owe";
      }
      return "Total";
    }

    function getToFromString() {
      if (direction === "positive") {
        return "From";
      } else if (direction === "negative") {
        return "To";
      }
      return "With"
    }

    let amountOwed = 0;
    let peopleFound = [];
    // Simplify relations
    if (relations) {
        for (const relation of relations) {
            if (relation.to.id === SessionManager.getUserId()) {
                if (!peopleFound.includes(relation.from.id)) {
                    peopleFound.push(relation.from.id);
                }
            } else if (relation.from.id === SessionManager.getUserId()) {
                if (!peopleFound.includes(relation.to.id)) {
                    peopleFound.push(relation.to.id);
                }
            }
            amountOwed += relation.amount;
        }
    }
    if (negativeRelations) {
        for (const negativeRelation of negativeRelations) {
            if (negativeRelation.from.id === SessionManager.getUserId()) {
                if (!peopleFound.includes(negativeRelation.to.id)) {
                    peopleFound.push(negativeRelation.to.id);
                }
            } else if (negativeRelation.to.id === SessionManager.getUserId()) {
                if (!peopleFound.includes(negativeRelation.from.id)) {
                    peopleFound.push(negativeRelation.from.id);
                }
            }
            amountOwed -= negativeRelation.amount;
        }
    }
    const numPeople = peopleFound.length;
  
    return (
        <div
          data-testid={"owe-card-" + (direction ? direction : "all")}
          className="dashboard-owe-card-container"
        >
          <SectionTitle title={getCardTitle()} />
          <div className="card-wrapper" data-testid="owe-card-card-element">
            <OutlinedCard borderWeight="2px" borderColor={getCardColor()} data-testid="owe-card-card-element">
              <CardActionArea>
                <CardContent onClick={() => handleOweCardClick()}>
                  <Typography variant="h5" component="div">
                    {formatter.format(amountOwed)}
                  </Typography>
                  <Stack direction="row" alignItems="center">
                    <GroupsIcon fontSize="large" />
                    <Typography
                      variant="subtitle1"
                      component="div"
                      marginLeft="5px"
                      marginTop="2px"
                    >
                      {getToFromString()} {numPeople} {numPeople === 1 ? "person" : "people"}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </OutlinedCard>
          </div>
        </div>
    );
}

export function OweOneDirectionHeader({positive, relations}) {
  function getRelationTotal() {
    let total = 0;
    const relevantRelations = positive ? relations.positive : relations.negative;
    for (const r of relevantRelations) {
      total += r.amount;
    }
    return total;
  }

  return (
    <div className="owe-one-direction-header">
      <Typography variant="h1">{positive ? "Owe Me" : "I Owe"}</Typography>
      <Typography variant="h2">{formatter.format(getRelationTotal())}</Typography>
    </div>
  )
}

export function OweOneDirectionPerson({person, positive}) {
  
  return (
    <OutlinedCard borderWeight="4px" borderColor={positive ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)"} >
      <div className="personal-owe-card">
        <div className="row">
          <AvatarIcon src={person.pfpUrl} displayName={person.displayName} size={100}/>
          <Typography variant="h1">{person.displayName}</Typography>
          <Typography variant="h1">{formatter.format(person.amount)}</Typography>
        </div>
        <div className="row buttons">
          <Button variant="contained" color={positive ? "primary" : "citrusRed"}>Remind</Button>
          <Button variant="contained" color={positive ? "primary" : "citrusRed"}>Settle</Button>
          <Button variant="contained" color="venmo">Venmo</Button>
        </div>
      </div>
    </OutlinedCard>
  )
}