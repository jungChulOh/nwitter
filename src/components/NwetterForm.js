import React, { useRef, useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidV4 } from "uuid";
import { FcUpload } from "react-icons/fc";

const NwetterForm = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const nwitteRef = useRef();
  const fileRef = useRef();
  // submit
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    if (!nweet) {
      alert("생각을 먼저 입력해 주세요.");
      nwitteRef.current.focus();
      return;
    }
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
      displayName: userObj.displayName,
      photoURL: userObj.photoURL,
      attachmentURL,
    };
    await dbService
      .collection("nweets")
      .add(nweetObj)
      .then((result) => {
        setNweet("");
        setAttachment("");
        fileRef.current.value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // 텍스트박스, 첨부파일(사진) 변경
  const onChange = (event) => {
    const {
      target: { type, value, files },
    } = event;

    if (type === "text") {
      setNweet(value);
      return;
    }

    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = (fileData) => setAttachment(fileData.target.result);
        reader.readAsDataURL(file);
      } else {
        setAttachment("");
      }
      return;
    }
  };
  //첨부파일(사진) input box 변경
  // const onFileChange = (event) => {
  //   const {
  //     target: { files },
  //   } = event;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = (fileData) => setAttachment(fileData.target.result);
  //   reader.readAsDataURL(file);
  // };

  const onClearAttachment = () => {
    setAttachment("");
    fileRef.current.value = "";
  };

  return (
    <form onSubmit={onSubmit}>
      {attachment && (
        <div className="mb-2 relative flex justify-center">
          <img src={attachment} alt="..." className="w-80 h-48" />
          <div className="absolute right-0">
            <button
              onClick={onClearAttachment}
              className="py-2 px-4 text-white bg-red-500 hover:bg-red-600 font-bold rounded"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      <div className="mb-2 h-10 border flex justify-between rounded">
        <input
          type="text"
          name="nwitte"
          ref={nwitteRef}
          placeholder="지금 당신의 생각은 어떻습니까?"
          value={nweet}
          onChange={onChange}
          maxLength={120}
          className="p-2 w-10/12 h-full text-gray-400 focus:border-blue-700 focus:shadow-xl focus:text-gray-700 flex-auto rounded rounded-r-none"
        />
        <input
          type="submit"
          value="Nwitte"
          className="p-2 font-bold text-white bg-blue-500 hover:bg-blue-600 flex-auto rounded rounded-l-none"
        />
      </div>
      {/* <div className="w-full border flex justify-center p-3 text-center border-dashed"> */}
      <label
        htmlFor="nwitteFile"
        className="block p-3 border border-dashed hover:text-white hover:bg-gray-400 text-center"
      >
        <FcUpload size="25px" className="inline" /> 사진 올리기
      </label>
      <input
        ref={fileRef}
        type="file"
        name="nwitteFile"
        id="nwitteFile"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
      {/* </div> */}
    </form>
  );
};

export default NwetterForm;
