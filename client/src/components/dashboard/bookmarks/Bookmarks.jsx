import "./bookmarks.scss";
import { Breadcrumbs } from "../../resources/Navigation";
import { CircularProgress, Button, Stack, Tooltip, Modal, Box, Typography, CardContent, CardActionArea, IconButton, TextField } from '@mui/material';
import { getBookmarksById, removeBookmarkFromUser, createBookmarkOnUser } from '../../../api/dbManager';
import { DBManager } from '../../../api/db/dbManager';
import { getSlashDateString, cutAtIndex } from '../../../api/strings';
import formatter from '../../../api/formatter';
import { sortByCreatedAt } from '../../../api/sorting';

import { useState, useEffect } from 'react';

import { Debugger } from "../../../api/debugger";

import { ColoredCard } from "../../resources/Surfaces";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NotesIcon from '@mui/icons-material/Notes';

function renderLoadingBox(marks) {
  if (!marks) {
    return (
      <CircularProgress />
    )
  }
  return (
      <div/>
  )
}

export default function Bookmarks({user}) {

  const userManager = DBManager.getUserManager(user.uid);
  
  const [userBookmarks, setUserBookmarks] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(null);
  const [newWho, setNewWho] = useState(null);
  const [newTotal, setNewTotal] = useState(null);
  const [newNote, setNewNote] = useState(null);
  const [newReceiptUrl, setNewReceiptUrl] = useState(null);

  /**
   * Fetch bookmark list for current user
   */
  async function fetchBookmarks() {
    const userBookmarks = await userManager.getBookmarks();
    setUserBookmarks(userBookmarks);
  }

  /**
   * Renders bookmark slides based on given array
   * @param {Array} a bookmarks for user
   */
  function renderBookmarks(a)  {

    if (!a) { // If we don't yet have a list of bookmarks, just display a little loading circle
      return <div className="loading-box" key="transaction-list-loading-box"><CircularProgress /></div>
    }
    if (a.length <= 0) {
      //dbManager returned string "none", meaning the user has no bookmarks.
      return (
        <div className="empty">
          <Typography>
            User has no bookmarks.
          </Typography>
        </div>
      )
    }
    // Otherwise, we have bookmarks from DB and should display cards accordingly
    if (a) {
      return (
        a.map((bookmarkId, idx) => {
          return (
            <BookmarkCard id={bookmarkId} index={idx} user={user} fetchBookmarks={fetchBookmarks}/>
          )
        })
      )
    }
  }

  /**
   * Render new bookmark form in modal
   */
  function renderNewBookmarkForm() {

    function handleEnter(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    }

    async function handleSubmit() {
      const bookmarkManager = DBManager.getBookmarkManager();
      if (newTitle) {
        bookmarkManager.setTitle(newTitle);
      }
      if (newTotal) {
        bookmarkManager.setTotal(newTotal);
      }
      bookmarkManager.setCreatedAt(new Date());
      bookmarkManager.setCreatedBy(user.uid);
      const newBookmarkDocRef = await bookmarkManager.push();
      userManager.addBookmark(newBookmarkDocRef.id); 
      await userManager.push();
      fetchBookmarks();
    }

    return (
      <Stack component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off" alignItems="center" display="flex" justifyContent="center" data-testid="new-bookmark-form-wrapper">
        <div className="fields">
          <TextField id="title" label="Title (optional)" onChange={e => setNewTitle(e.target.value)} data-testid="new-title-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="who" label="Who (optional)" onChange={e => setNewWho(e.target.value)} data-testid="new-who-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="total" label="Total (optional)" onChange={e => setNewTotal(e.target.value)} data-testid="new-total-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="note" label="Note (optional)" onChange={e => setNewNote(e.target.value)} data-testid="new-note-input" onKeyDown={(e) => handleEnter(e)}/>
        </div>
        <div className="submit-button">
          <Button variant="contained" component="div" onClick={() => handleSubmit()} data-testid="submit-button">
            Add Bookmark
          </Button>
        </div>
      </Stack>
    )
  }

  // Fetch bookmarks by ID on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        aria-labelledby="modal-modal-title"
      >
        <Box className="modal">
          <Typography id="modal-modal-title" variant="h6" component="h2" marginTop="10px">
            New Bookmark
          </Typography>
          { renderNewBookmarkForm(user.uid) }
        </Box>
      </Modal>
      <Breadcrumbs path="Dashboard/Bookmarks" />
      <div className={"loading-box " + (userBookmarks ? "hidden" : "")}>
        { renderLoadingBox(userBookmarks) }
      </div>
      <div className="bookmarks">
        { renderBookmarks(userBookmarks, user.uid) }
        <div className={"add-button " + (userBookmarks ? "" : "hidden")}>
          <Tooltip title="Add Bookmark">
            <IconButton onClick={() => setAddModalOpen(true)} >
              <AddIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

function BookmarkCard({id, index, user, fetchBookmarks}) {

  const userManager = DBManager.getUserManager(user.uid);
  const bookmarkManager = DBManager.getBookmarkManager(id);

  async function fetchBookmarkData() {
    const bookmarkData = await bookmarkManager.fetchData();
    setData(bookmarkData);
    const bookmarkColor = await bookmarkManager.getColor();
    setColor(bookmarkColor);
    const bookmarkCreatedAt = await bookmarkManager.getCreatedAt();
    setCreatedAt(bookmarkCreatedAt);
    const bookmarkTitle = await bookmarkManager.getTitle();
    setTitle(bookmarkTitle);
    const bookmarkTotal = await bookmarkManager.getTotal();
    setTotal(bookmarkTotal);
  }

  useEffect(() => {
    fetchBookmarkData();
  }, [])
  
  const [data, setData] = useState();
  const [color, setColor] = useState("#fafafa");
  const [createdAt, setCreatedAt] = useState(new Date());
  const [title, setTitle] = useState(null);
  const [total, setTotal] = useState(null);

  function blankIfNull(s) {
    return s ? s : "";
  }

  function deleteBookmark() {
    userManager.removeBookmark(id);
    userManager.push().then((pushSuccess) => {
      if (pushSuccess) {
        bookmarkManager.deleteDocument();
        fetchBookmarks();
      }
    });
  }

  if (!data) {
    return (
      <div className="bookmark-wrapper" key={index}>
        <ColoredCard color={color}>
          <CardActionArea>
            <CardContent>
              <div className="bookmark">
                <div className="left">
                  <div className="delete-button">
                    <Tooltip title="Delete Bookmark">
                      <IconButton>
                        <DeleteIcon fontSize="medium"/>
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div className="left-data">
                    <div className="date">
                    </div>
                  </div>
                </div>
                <div className="center">
                  <div className="title">
                  </div>
                </div>
                <div className="note-container">
                  <NotesIcon fontSize="medium"/>
                </div>
                <div className="right">
                  <div className="amount">
                  </div>
                </div>
              </div>
            </CardContent>  
          </CardActionArea>
        </ColoredCard>
      </div>
    )
  }
  return (
    <div className="bookmark-wrapper" key={index}>
      <ColoredCard color={color}>
        <CardActionArea onClick={() => Debugger.log("Sending transaction for bookmark: " + id)}>
          <CardContent>
            <div className="bookmark">
              <div className="left">
                <div className="delete-button">
                  <Tooltip title="Delete Bookmark">
                    <IconButton onClick={() => deleteBookmark(id)}>
                      <DeleteIcon fontSize="medium"/>
                    </IconButton>
                  </Tooltip>
                </div>
                <div className="left-data">
                  <div className="date">
                    {getSlashDateString(createdAt)}
                  </div>
                </div>
              </div>
              <div className="center">
                <div className="title">
                  {blankIfNull(title)}
                </div>
              </div>
              <div className="note-container">
                <NotesIcon fontSize="medium"/>
              </div>
              <div className="right">
                <div className="amount">
                  {blankIfNull(formatter.format(total))}
                </div>
              </div>
            </div>
          </CardContent>  
        </CardActionArea>
      </ColoredCard>
    </div>
  )
}
