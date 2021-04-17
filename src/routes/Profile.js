import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { FcUpload } from "react-icons/fc";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDispayName, setNewDispayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
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
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDispayName) {
      await userObj.updateProfile({ displayName: newDispayName });
    }
    refreshUser();
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
        <img src={newPhotoURL} alt="Profile" className="rounded-full my-4" />
        <label
          htmlFor="nwitteFile"
          className="w-full my-2 block p-3 border border-dashed hover:text-white hover:bg-gray-400 text-center"
        >
          <FcUpload size="25px" className="inline" /> 프로필 사진 변경하기
        </label>
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
