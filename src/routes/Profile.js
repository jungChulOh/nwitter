import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router";

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDispayName, setNewDispayName] = useState(userObj.displayName);
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
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Update Your Display Name!"
          value={newDispayName}
          onChange={onDisplayNameChange}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogoutClick}>Log Out</button>
    </>
  );
};

export default Profile;
