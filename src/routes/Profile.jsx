import { authService, dbService, storageService } from "fbase";
import React, { useRef, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useHistory } from "react-router";
import { FcUpload } from "react-icons/fc";
import { CgProfile } from "react-icons/cg";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDispayName, setNewDispayName] = useState(() =>
    !userObj.displayName ? "No NickName" : userObj.displayName
  );
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);

  const fileRef = useRef(null);

  const onLogoutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onDisplayNameChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDispayName(value);
  };
  const onDisplayPhotoChange = (event) => {
    const {
      target: { files },
    } = event;

    const file = files[0];
    if (!file) {
      setNewPhotoURL("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (fileData) => setNewPhotoURL(fileData.target.result);
    reader.readAsDataURL(file);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    let changeProfile = {};

    if (userObj.photoURL !== newPhotoURL) {
      const deleteFile = storageService.refFromURL(userObj.photoURL);
      await deleteFile
        .delete()
        .then((test) => console.log)
        .catch((e) => console.log);

      if (newPhotoURL) {
        const attachementRef = storageService
          .ref()
          .child(`user/${userObj.uid}/profile/${uuidV4()}`);
        const response = await attachementRef.putString(
          newPhotoURL,
          "data_url"
        );
        attachmentURL = await response.ref.getDownloadURL();
      }
      changeProfile.photoURL = attachmentURL;
    }

    if (userObj.displayName !== newDispayName) {
      changeProfile.displayName = newDispayName;
    }
    await userObj.updateProfile(changeProfile);
    refreshUser();
    const data = await dbService
      .collection("nweets")
      .where("createId", "==", userObj.uid)
      .get();
    data.docs.map((doc) => doc.ref.update(changeProfile));
  };

  // const getNwitter = async () => {
  //   const response = await dbService
  //     .collection("nweets")
  //     .where("createId", "==", userObj.uid)
  //     .orderBy("createDt", "desc")
  //     .get();
  //   console.log(response.docs.map((nweet) => nweet.data()));
  // };

  // useEffect(() => {
  //   getNwitter();
  // }, []);
  return (
    <div className="px-3 w-full lg:w-4/5 flex flex-col items-center">
      <div className="border p-5 rounded-md shadow-lg my-5 flex flex-col items-center">
        {newPhotoURL ? (
          <img
            src={newPhotoURL}
            alt="Profile"
            width="100px"
            height="100px"
            className="rounded-full my-4"
          />
        ) : (
          <CgProfile size="100px" />
        )}
        <label
          htmlFor="photoFile"
          className="w-full my-2 block p-3 border border-dashed hover:text-white hover:bg-gray-400 text-center"
        >
          <FcUpload size="25px" className="inline" /> 프로필 사진 변경하기
        </label>
        <input
          ref={fileRef}
          type="file"
          name="photoFile"
          id="photoFile"
          accept="image/*"
          onChange={onDisplayPhotoChange}
          className="hidden"
        />
        <form onSubmit={onSubmit}>
          <div className="mb-2 h-10 border flex justify-between rounded">
            <input
              type="text"
              placeholder="Update Your Display Name!"
              value={newDispayName}
              onChange={onDisplayNameChange}
              className="p-2 w-10/12 h-full text-gray-400 focus:border-blue-700 focus:shadow-xl focus:text-gray-700 flex-auto rounded rounded-r-none"
            />
            <input
              type="submit"
              value="Update Profile"
              className="p-2 font-bold text-white bg-blue-500 hover:bg-blue-600 flex-auto rounded rounded-l-none"
            />
          </div>
        </form>
      </div>
      <div className="px-3 w-full lg:w-4/5 text-center">
        <button
          onClick={onLogoutClick}
          className="px-6 py-3 bg-red-400 text-white hover:bg-red-500 rounded"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
