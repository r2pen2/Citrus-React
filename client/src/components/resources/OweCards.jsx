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

export function DashboardOweCards() {

    const [relations, setRelations] = useState({
        postitive: [],
        negative: []
    })

    useEffect(() => {

        async function fetchUserRelations() {
            // Get all transactions for current user
            const userManager = SessionManager.getCurrentUserManager();
            const userRelations = await userManager.getSimplifiedRelations();
            console.log(userRelations)

            let newPositiveRelations = [];
            let newNegativeRelations = [];

            for (const relation of userRelations) {
              if (relation.to.id === SessionManager.getUserId()) {
                  // This user is owed money
                  newPositiveRelations.push(relation);
              } else if (relation.from.id === SessionManager.getUserId()) {
                  // This user owes money
                  newNegativeRelations.push(relation);
              }
            }

            setRelations({
                positive: newPositiveRelations,
                negative: newNegativeRelations
            })
        }

        fetchUserRelations();
    }, [])

    return (
        <Box data-testid="owe-cards">
            <div className="dashboard-owe-cards-row">
              <DashboardOweCard positive={true} relations={relations.positive}/>
              <div className="spacer"></div>
              <DashboardOweCard positive={false} relations={relations.negative}/>
            </div>
        </Box>
    )
}

function DashboardOweCard({positive, relations}) {

    function handleOweCardClick() {
        const newVal = "owe-" + (positive ? "positive" : "negative");
        RouteManager.redirectWithHash("dashboard", newVal);
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
    const numPeople = peopleFound.length;
  
    return (
        <div
          data-testid={"owe-card-" + (positive ? "positive" : "negative")}
          className="dashboard-owe-card-container"
        >
          <SectionTitle title={positive ? "Owe Me" : "I Owe"} />
          <div className="card-wrapper" data-testid="owe-card-card-element">
            <OutlinedCard borderWeight="2px" borderColor={positive ? "rgba(176, 200, 86, 0.8)" : "rgba(234, 66, 54, 0.5)"} data-testid="owe-card-card-element">
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
                      {positive ? "From" : "To"} {numPeople} {numPeople === 1 ? "person" : "people"}
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
    for (const r of relations) {
      if (positive) {
        if (r.to.id === SessionManager.getUserId()) {
          total += r.amount;
        }
      } else {
        if (r.from.id === SessionManager.getUserId()) {
          total += r.amount;
        }
      }
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