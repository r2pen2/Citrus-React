import "./bookmarkHome.scss";
import Breadcrumbs from "../../../resources/navigation/breadcrumbs/Breadcrumbs";
import { CircularProgress, Typography } from '@mui/material';
import { getBookmarksById } from '../../../../api/dbManager';

import { useState, useEffect } from 'react';

const b = 
[{
  id: "ajwglahjglajhlihawg",
  title: "fullBookmark",
  who: "Oliver",
  amount: 40,
  extra: "No more information"
},
{
  id: "awgagasdgagawg",
  title: "noWho",
  who: null,
  amount: 40,
  extra: "No more information"
},
{
  id: "awggawagwawgagwb",
  title: "noAmount",
  who: "Oliver",
  amount: null,
  extra: "No more information"
},
{
  id: "GGggwgwgagaw",
  title: "noExtra",
  who: "Oliver",
  amount: 40,
  extra: null
}];

/** Builds bookmark slides with bookmarks array */
function generateBookmarks(a)  {
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

}

export default function BookmarkHome({user}) {
  
  const [userBookmarks, setUserBookmarks] = useState(null);

  async function fetchBookmarks(u) {
    const bm = await getBookmarksById(u.uid);
    setUserBookmarks(bm);
  }

  // Fetch bookmarks by ID on mount
  useEffect(() => {
    fetchBookmarks(user);
  }, [])

  return (
    <div>
      <Breadcrumbs path="Dashboard/Bookmarks" />
      <div className="bookmarks">
        { generateBookmarks(userBookmarks) }
      </div>
    </div>
  );
}
