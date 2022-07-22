import "./bookmarks.scss";
import Breadcrumbs from "../../resources/Breadcrumbs";
import { CircularProgress, Button, Stack, Tooltip, Modal, Box, Typography, CardContent, CardActionArea, IconButton, TextField } from '@mui/material';
import { getBookmarksById, removeBookmarkFromUser, createBookmarkOnUser } from '../../../api/dbManager';
import { getSlashDateString } from '../../../api/strings';
import formatter from '../../../api/formatter';
import { sortByCreatedAt } from '../../../api/sorting';

import { useState, useEffect } from 'react';

import ColoredCard from "../../resources/surfaces/ColoredCard";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NoteIcon from '@mui/icons-material/Note';

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
  
  const [userBookmarks, setUserBookmarks] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(null);
  const [newWho, setNewWho] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNote, setNewNote] = useState(null);
  const [newReceiptUrl, setNewReceiptUrl] = useState(null);

  /**
   * Fetch bookmark list for current user
   * @param {Object} u current user
   */
  async function fetchBookmarks(uid) {
    const bm = await getBookmarksById(uid);
    setUserBookmarks(bm !== "none" ? sortByCreatedAt(bm).reverse() : bm);
  }

  /**
   * Renders bookmark slides based on given array
   * @param {Array} a bookmarks for user
   * @param {String} uid user ID for delete bookmark function
   */
   function renderBookmarks(a, uid)  {

    function getBookmarkAge(bookmark) {
      const now = new Date();
      const delta = now.getTime() - bookmark.createdAt.toDate().getTime();
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

    if (a === "none") {
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
        a.map((bookmark, idx) => {
          return (
            <div className="bookmark-wrapper" key={idx}>
              <ColoredCard color={getBookmarkColor(bookmark)}>
                <CardActionArea onClick={() => console.log("Sending transaction for bookmark: " + bookmark.id)}>
                  <CardContent>
                    <div className="bookmark">
                      <div className="left">
                        <div className="delete-button">
                          <Tooltip title="Delete Bookmark">
                            <IconButton onClick={() => removeBookmarkFromUser(uid, bookmark.id).then(() => fetchBookmarks(uid))}>
                              <DeleteIcon fontSize="medium"/>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="left-data">
                          <div className="date">
                            {getSlashDateString(bookmark.createdAt.toDate())}
                          </div>
                          <div className="icons">
                            <div className="receipt">
                              {bookmark.receiptUrl ? <Tooltip title="Receipt Uploaded"><ReceiptLongIcon fontSize="medium"/></Tooltip> : <div/>}
                            </div>
                            <div className="note">
                              {bookmark.note ? <Tooltip title="Note Attached"><NoteIcon fontSize="medium"/></Tooltip> : <div/>}
                            </div>
                          </div>
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
  }

  /**
   * Render new bookmark form in modal
   * @param {String} uid current user's ID 
   * @returns 
   */
  function renderNewBookmarkForm(uid) {

    function handleEnter(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    }

    async function handleSubmit() {
      const newBookmark = {
        title: newTitle,
        who: newWho,
        amount: newAmount,
        note: newNote,
        receiptUrl: newReceiptUrl,
      }
      createBookmarkOnUser(uid, newBookmark).then(() => {
        fetchBookmarks(uid);
      });
      setAddModalOpen(false);
    }

    return (
      <Stack component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off" alignItems="center" display="flex" justifyContent="center" data-testid="new-bookmark-form-wrapper">
        <div className="fields">
          <TextField id="title" label="Title (optional)" onChange={e => setNewTitle(e.target.value)} data-testid="new-title-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="who" label="Who (optional)" onChange={e => setNewWho(e.target.value)} data-testid="new-who-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="amount" label="Amount (optional)" onChange={e => setNewAmount(e.target.value)} data-testid="new-amount-input" onKeyDown={(e) => handleEnter(e)}/>
          <TextField id="note" label="Note (optional)" onChange={e => setNewNote(e.target.value)} data-testid="new-note-input" onKeyDown={(e) => handleEnter(e)}/>
        </div>
        <div className="receipt">
          <Typography>{newReceiptUrl ? "Receipt ✓" : "Receipt (optional)"}</Typography>
          <div className="receipt-methods">
            <IconButton onClick={() => setNewReceiptUrl("Receipt added by upload")}>
              <UploadIcon fontSize="large"/>
            </IconButton>
            <IconButton onClick={() => setNewReceiptUrl("Receipt added by camera")}>
              <PhotoCameraIcon fontSize="large"/>
            </IconButton>
          </div>
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
    fetchBookmarks(user.uid);
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
