import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidV4 } from "uuid";

const NwetterForm = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidV4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentURL = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createDt: Date.now(),
      createId: userObj.uid,
      attachmentURL,
    };
    dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (fileData) => setAttachment(fileData.target.result);
    reader.readAsDataURL(file);
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="지금 당신의 생각은 어떰?"
        value={nweet}
        onChange={onChange}
        maxLength={120}
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Nwitte" />
      {attachment && (
        <div>
          <img src={attachment} alt="..." width="100px" height="100px" />{" "}
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NwetterForm;
