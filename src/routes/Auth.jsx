import React from "react";
import { authService, firebaseInstance } from "fbase";
import AuthForm from "components/AuthForm";
import { FaGoogle, FaGithub } from "react-icons/fa";

const Auth = () => {
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }

    await authService.signInWithPopup(provider);
  };

  const SocialButtonGroup = () => {
    return (
      <div className="flex flex-col">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded border hover:shadow py-3 px-4 mb-2"
          onClick={onSocialClick}
          name="google"
        >
          <FaGoogle className="inline mr-3" size="20px" /> Continue with Google
        </button>
        <button
          className="bg-white hover:bg-gray-400 hover:text-white font-bold rounded border hover:shadow py-3 px-4 mb-2"
          onClick={onSocialClick}
          name="github"
        >
          <FaGithub className="inline mr-3" size="20px" /> Continue with Github
        </button>
      </div>
    );
  };

  return (
    <div className="container w-full h-screen flex flex-col items-center justify-center">
      <AuthForm>
        <SocialButtonGroup />
      </AuthForm>
    </div>
  );
};

export default Auth;
