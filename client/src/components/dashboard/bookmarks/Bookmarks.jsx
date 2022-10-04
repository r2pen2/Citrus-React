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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import NoteIcon from '@mui/icons-material/Note';
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
  
  const [userBookmarks, setUserBookmarks] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(null);
  const [newWho, setNewWho] = useState(null);
  const [newAmount, setNewAmount] = useState(null);
  const [newNote, setNewNote] = useState(null);
  const [newReceiptUrl, setNewReceiptUrl] = useState(null);

  /**
   * Fetch bookmark list for current user
   * @param {string} userId current user's id
   */
  async function fetchBookmarks(userId) {
    const userManager = DBManager.getUserManager(userId);
    const userBookmarks = await userManager.getBookmarks();
    let bookmarkManagers = [];
    for (const bookmarkId of userBookmarks) {
      bookmarkManagers.push(DBManager.getBookmarkManager(bookmarkId));
    }
    bookmarkManagers = sortByCreatedAt(bookmarkManagers).reverse();
    setUserBookmarks(bookmarkManagers);
  }

  /**
   * Renders bookmark slides based on given array
   * @param {Array} a bookmarks for user
   * @param {String} uid user ID for delete bookmark function
   */
   function renderBookmarks(a, uid)  {

    function blankIfNull(s) {
      return s ? s : "";
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
        a.map((bookmarkManager, idx) => {
          return (
            <div className="bookmark-wrapper" key={idx}>
              <ColoredCard color={bookmarkManager.getColor()}>
                <CardActionArea onClick={() => Debugger.log("Sending transaction for bookmark: " + bookmarkManager.getDocumentId())}>
                  <CardContent>
                    <div className="bookmark">
                      <div className="left">
                        <div className="delete-button">
                          <Tooltip title="Delete Bookmark">
                            <IconButton onClick={() => removeBookmarkFromUser(uid, bookmarkManager.getDocumentId()).then(() => fetchBookmarks(uid))}>
                              <DeleteIcon fontSize="medium"/>
                            </IconButton>
                          </Tooltip>
                        </div>
                        <div className="left-data">
                          <div className="date">
                            {getSlashDateString(bookmarkManager.getCreatedAt().toDate())}
                          </div>
                        </div>
                      </div>
                      <div className="center">
                        <div className="title">
                          {blankIfNull(bookmarkManager.getTitle())}
                        </div>
                      </div>
                      <div className="note-container">
                        <NotesIcon fontSize="medium"/>
                      </div>
                      <div className="right">
                        <div className="amount">
                          {blankIfNull(formatter.format(bookmarkManager.getTotal()))}
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
