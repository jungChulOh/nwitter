import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FiDelete, FiEdit3 } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

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
    <div className="inline-block border rounded mb-5 lg:w-3/6 md:w-10/12 w-10/12">
      {nweetObj.attachmentURL ? (
        <img src={nweetObj.attachmentURL} alt="..." width="100%" />
      ) : (
        <div className="w-screen h-3"></div>
      )}
      {isEdit ? (
        <>
          <form onSubmit={onSubmit} className="px-5">
            <div className="text-right mt-2">
              <input
                type="submit"
                value="Edit Nweet"
                className="px-2 py-1 mr-2 bg-blue-400 hover:bg-blue-500 text-white rounded"
              />
              <button
                onClick={onToggleEdit}
                className="px-2 py-1 bg-red-400 text-white hover:bg-red-500 rounded"
              >
                Cancel
              </button>
            </div>
            <input
              type="text"
              placeholder="Edit is Nweet"
              value={newNweet}
              onChange={onChange}
              className="w-full my-2 border rounded p-3 text-gray-500 focus:text-gray-800 focus:shadow-lg"
            />
          </form>
        </>
      ) : (
        <div className="px-5 text-gray-600">
          <div className="flex justify-between items-center mt-2">
            <div className="flex justify-center items-center">
              {nweetObj.photoURL ? (
                <img
                  src={nweetObj.photoURL}
                  alt="profile"
                  width="50px"
                  height="50px"
                  className="rounded-full inline mr-2"
                />
              ) : (
                <CgProfile size="50px" className="mr-2" />
              )}
              <span className="text-gray-400">
                {!nweetObj.displayName ? "No NickName" : nweetObj.displayName}
              </span>
            </div>
            {isOwner && (
              <div>
                <button
                  onClick={onToggleEdit}
                  className="hover:text-gray-400 p-2 mr-1"
                >
                  <FiEdit3 size="25px" />
                </button>
                <button
                  onClick={onDeleteClick}
                  className="hover:text-gray-400 p-2"
                >
                  <FiDelete size="25px" />
                </button>
              </div>
            )}
          </div>
          <h4 className="my-4">{nweetObj.text}</h4>
        </div>
      )}
    </div>
  );
};

export default Nweet;
