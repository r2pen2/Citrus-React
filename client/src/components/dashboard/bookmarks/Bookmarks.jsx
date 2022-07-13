import "./bookmarks.scss";
import { Routes, Route } from 'react-router-dom';

export default function Bookmarks({user}) {
  return (
    <div>
        <Routes>
            <Route path="/" element={<BookmarkHome user={user}/>} />
            <Route path="/new" element={<NewBookmark user={user}/>} />
        </Routes>
    </div>
  )
}
