import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";
import NwetterForm from "components/NwetterForm";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    dbService
      .collection("nweets")
      .orderBy("createDt", "desc")
      .onSnapshot((result) => {
        const nweetsArray = result.docs.map((n) => ({
          ...n.data(),
          id: n.id,
          text: n.data().text,
        }));
        setNweets(nweetsArray);
      });
  }, []);

  return (
    <div className="px-3 w-full lg:w-4/5">
      <div className="border p-5 rounded-md shadow-lg my-5">
        <NwetterForm userObj={userObj} />
      </div>
      <div className="w-full flex flex-col items-center">
        {nweets &&
          nweets.map((nweet) => (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.createId === userObj.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
