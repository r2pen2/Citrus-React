import "./bookmarkHome.scss";
import Breadcrumbs from "../../../miscellaneous/navigation/breadcrumbs/Breadcrumbs";

export default function BookmarkHome() {
  return (
    <div>
        <Breadcrumbs path="Dashboard/Bookmarks" />
        <h1>Bookmarks Home Page</h1>
        <h2>Needs implementation</h2>
        <a href="https://github.com/r2pen2/Citrus-React/issues/103">Github: Implement Dashboard/Bookmarks #103</a>
        <ul>
            <li><div>Has a link to add a new bookmark</div></li>
            <li><div>Shows a list of user's bookmarked transactions</div></li>
            <li><div>Bookmarks can be deleted individually from the list</div></li>
            <li><div>Shows a receipt icon for bookmarks with receipts scanned</div></li>
            <li><div>Shows price on each bookmark (if added)</div></li>
            <li><div>Shows users on each bookmark (if added)</div></li>
            <li><div>Shows date on each bookmark ALWAYS</div></li>
            <li><div>Shows title on each bookmark (if added)</div></li>
            <li><div>Shows extra information on each bookmark (if added)</div></li>
            <li><a href="/dashboard/bookmarks/new">New Bookmark</a></li>
        </ul>
    </div>
  )
}