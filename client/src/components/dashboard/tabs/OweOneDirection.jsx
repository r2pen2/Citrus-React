// Library Imports
import { useState, useEffect } from 'react';

// Component Imports
import { Breadcrumbs } from "../../resources/Navigation";
import { OweOneDirectionHeader, OweOneDirectionPerson } from "../../resources/OweCards";

// API Imports
import { SessionManager } from "../../../api/sessionManager";

export default function OweOneDirection({positive}) {

  const [userRelations, setUserRelations] = useState([]);

  useEffect(() => {

    async function fetchOweData() {
      const userManager = SessionManager.getCurrentUserManager();
      const relationsFromDB = await userManager.getSimplifiedRelations();
      setUserRelations(relationsFromDB);
    }

    fetchOweData();
  }, [])

  function renderCards() {
    let relevantRelations = [];
    console.log(userRelations)
    for (const relation of userRelations) {
      if (positive) {
        if (relation.to.id === SessionManager.getUserId()) {
          relevantRelations.push(relation);
        }
      } else {
        if (relation.from.id === SessionManager.getUserId()) {
          relevantRelations.push(relation);
        }
      }
    }
    // Make a map of all users and their amounts across all realtions with them
    const peopleMap = new Map();
    for (const relation of relevantRelations) {
      if (positive) {
        if (relation.to.id === SessionManager.getUserId()) {
          if (peopleMap.has(relation.from.id)) {
            const existingUser = peopleMap.get(relation.from.id);
            existingUser.amount += relation.amount;
            peopleMap.set(relation.from.id, existingUser);
          } else {
            peopleMap.set(relation.from.id, {personId: relation.from.id, displayName: relation.from.displayName, pfpUrl: relation.from.pfpUrl, amount: relation.amount});
          }
        }
      } else {
        if (relation.from.id === SessionManager.getUserId()) {
          if (peopleMap.has(relation.to.id)) {
            const existingUser = peopleMap.get(relation.to.id);
            existingUser.amount += relation.amount;
            peopleMap.set(relation.to.id, existingUser);
          } else {
            peopleMap.set(relation.to.id, {personId: relation.to.id, displayName: relation.to.displayName, pfpUrl: relation.to.pfpUrl, amount: relation.amount});
          }
        }
      }
    }
    // Now we have a map of all users and the amounts
    let people = [];
    for (const key of peopleMap) {
      const person = key[1];
      people.push(person);
    }
    // Render the cards
    return people.map((person, index) => {
      return (
        <OweOneDirectionPerson key={index} person={person} positive={positive}/>
      )
    })
  }

  return (
    <div className="owe-one-direction-page">
      <Breadcrumbs path={"Dashboard/IOU/" + (positive ? "Owe Me" : "I Owe")} />
      <OweOneDirectionHeader positive={positive} relations={userRelations} />
      <div className="owe-one-direction-container">
        { renderCards() }
      </div>
  </div>
  )
}