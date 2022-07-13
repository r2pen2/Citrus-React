import "./bookmarks.scss";
import { Routes, Route } from 'react-router-dom';

import BookmarkHome from "./bookmarkHome/BookmarkHome";
import BookmarkNew from "./bookmarkNew/BookmarkNew";

export default function Bookmarks({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<BookmarkHome user={user}/>} />
            <Route path="/new" element={<BookmarkNew user={user}/>} />
        </Routes>
    </div>
  )
}