import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure Delete Nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentURL).delete();
    }
  };
  const onToggleEdit = () => setIsEdit((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    setIsEdit(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  return (
    <>
      {isEdit ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit is Nweet"
              value={newNweet}
              onChange={onChange}
            />
            <input type="submit" value="Edit Nweet" />
          </form>
          <button onClick={onToggleEdit}>Cancel</button>
        </>
      ) : (
        <div>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img
              src={nweetObj.attachmentURL}
              width="50px"
              height="50px"
              alt="..."
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={onToggleEdit}>Change Nweet</button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Nweet;
