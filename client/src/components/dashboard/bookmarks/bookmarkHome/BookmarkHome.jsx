import "./bookmarkHome.scss";
import Breadcrumbs from "../../../resources/navigation/breadcrumbs/Breadcrumbs";
import { CircularProgress, Tooltip, Typography, CardContent, CardActionArea, IconButton } from '@mui/material';
import { getBookmarksById, removeBookmarkFromUser } from '../../../../api/dbManager';
import { getSlashDateString } from '../../../../api/strings';
import formatter from '../../../../api/formatter';
import { sortByCreatedAt } from '../../../../api/sorting';

import { useState, useEffect } from 'react';

import ColoredCard from "../../../resources/surfaces/ColoredCard";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DeleteIcon from '@mui/icons-material/Delete';

const b = 
[{
  id: "ajwglahjglajhlihawg",
  title: "fullBookmark",
  who: "Oliver",
  amount: 40,
  extra: "No more information",
  receiptUrl: "testUrl",
  createdAt: new Date(),
},
{
  id: "awgagasdgagawg",
  title: "noWho",
  who: null,
  amount: 400,
  extra: "No more information",
  receiptUrl: null,
  createdAt: new Date((new Date()).getTime() - 86400000 * 4),
},
{
  id: "awggawagwawgagwb",
  title: "noAmount",
  who: "Oliver",
  amount: null,
  extra: "No more information",
  receiptUrl: null,
  createdAt: new Date((new Date()).getTime() - 86400000 * 10),
},
{
  id: "GGggwgwgagaw",
  title: "noExtra",
  who: "Oliver",
  amount: 1000.2,
  extra: null,
  receiptUrl: null,
  createdAt: new Date(),
}];

/**
 * Renders bookmark slides based on given array
 * @param {Array} a bookmarks for user
 * @param {String} uid user ID for delete bookmark function
 */
function renderBookmarks(a, uid)  {

  function getBookmarkAge(bookmark) {
    const now = new Date();
    const delta = now.getTime() - bookmark.createdAt.getTime();
    const seconds = delta/1000;
    const minutes = seconds/60;
    const hours = minutes/60;
    const days = hours/24;
    return Math.floor(days);
  }

  function getBookmarkColor(bookmark) {
    const age = getBookmarkAge(bookmark);
    if (age < 3) {
      return "#bfd679"; // citrus green
    }
    if (age < 7) {
      return "#FDB90F"; // citrus orange
    }
    return "#EA4236"; // citrus red
  }

  function blankIfNull(s) {
    return s ? s : "";
  }

  if (!a) {
    // If array is null, generate loading circle while we fetch
    return (
      <div className="loading-box">
        <CircularProgress />
      </div>
    )
  }
  if (a === "none") {
    //dbManager returned string "none", meaning the user has no bookmarks.
    return (
      <div className="loading-box">
        <Typography>User has no bookmarks.</Typography>
      </div>
    )
  }
  // Otherwise, we have bookmarks from DB and should display cards accordingly
  return (
    a.map((bookmark, idx) => {
      return (
        <div className="bookmark-wrapper">
          <div className="delete-button">
            <Tooltip title="Delete Bookmark">
              <IconButton onClick={() => removeBookmarkFromUser(uid, bookmark.id)}>
                <DeleteIcon fontSize="medium"/>
              </IconButton>
            </Tooltip>
          </div>
          <ColoredCard color={getBookmarkColor(bookmark)}>
            <CardActionArea onClick={() => console.log("Sending transaction for bookmark: " + bookmark.id)}>
              <CardContent>
                <div className="bookmark">
                  <div className="left">
                    <div className="date">
                      {getSlashDateString(bookmark.createdAt)}
                    </div>
                    <div className="receipt">
                      {bookmark.receiptUrl ? <Tooltip title="Receipt Uploaded"><ReceiptLongIcon fontSize="medium"/></Tooltip> : <div/>}
                    </div>
                  </div>
                  <div className="center">
                    <div className="title">
                      {blankIfNull(bookmark.title)}
                    </div>
                    <div className="who">
                      {blankIfNull(bookmark.who)}
                    </div>
                  </div>
                  <div className="right">
                    <div className="amount">
                      {blankIfNull(formatter.format(bookmark.amount))}
                    </div>
                  </div>
                </div>
              </CardContent>  
            </CardActionArea>
          </ColoredCard>
        </div>
      )
    })
  )
}

export default function BookmarkHome({user}) {
  
  const [userBookmarks, setUserBookmarks] = useState(null);

  async function fetchBookmarks(u) {
    const bm = await getBookmarksById(u.uid);
    setUserBookmarks(bm !== "none" ? sortByCreatedAt(bm).reverse() : bm);
  }

  // Fetch bookmarks by ID on mount
  useEffect(() => {
    fetchBookmarks(user);
  }, [])

  return (
    <div>
      <Breadcrumbs path="Dashboard/Bookmarks" />
      <div className="bookmarks">
        { renderBookmarks(userBookmarks, user.uid) }
      </div>
    </div>
  );
}
