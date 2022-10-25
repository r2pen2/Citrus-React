// Style imports
import "./style/oweCards.scss";

// Library imports
import { CardContent, CardActionArea, Typography, Stack, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import { useState, useEffect } from 'react';

// API imports
import formatter from "../../api/formatter";
import { RouteManager } from "../../api/routeManager";
import { SessionManager } from "../../api/sessionManager";
import { DBManager } from "../../api/db/dbManager";

// Component imports
import { SectionTitle } from "./Labels";
import { OutlinedCard } from "./Surfaces";

export function DashboardOweCards() {

    const [relations, setRelations] = useState({
        postitive: [],
        negative: []
    })

    useEffect(() => {

        async function fetchUserRelations() {
            // Get all transactions for current user
            const userManager = SessionManager.getCurrentUserManager();
            const userTransactions = await userManager.getTransactions();

            let newPositiveRelations = [];
            let newNegativeRelations = [];

            for (const transactionId of userTransactions) {
                const transactionManager = DBManager.getTransactionManager(transactionId);
                const transactionUser = await transactionManager.getUser(SessionManager.getUserId());
                // Get all of this user's relations in this transaction
                const relations = transactionUser.getRelations();
                for (const relation of relations) {
                    if (relation.to.id === SessionManager.getUserId()) {
                        // This user is owed money
                        newPositiveRelations.push(relation);
                    } else if (relation.from.id === SessionManager.getUserId()) {
                        // This user owes money
                        newNegativeRelations.push(relation);
                    }
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
                      {positive ? "From" : "To"} {numPeople} {numPeople > 1 ? "people" : "person"}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </OutlinedCard>
          </div>
        </div>
    );
}
  