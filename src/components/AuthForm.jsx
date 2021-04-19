import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = ({ children }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    setForm({ ...form, [name]: value });
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount) {
        await authService.createUserWithEmailAndPassword(
          form.email,
          form.password
        );
      } else {
        await authService.signInWithEmailAndPassword(form.email, form.password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const onToggle = () => setNewAccount((prev) => !prev);

  return (
    <>
      <div className="border rounded sm:w-full md:w-4/12 flex flex-col">
        <header className="bg-gray-100 rounded-b p-5">
          <div className="text-center mb-3">
            <h1 className="text-blue-400 font-bold">Welcome to Nwitter!</h1>
          </div>
          {children}
        </header>
        <form onSubmit={onSubmit} className="flex flex-col mt-2 p-5">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={form.email}
            onChange={onChange}
            className="border p-3 text-gray-500 focus:text-gray-900 focus:border-blue-200 focus:shadow-lg mb-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            value={form.password}
            onChange={onChange}
            className="border p-3 text-gray-500 focus:text-gray-900 focus:border-blue-200 focus:shadow-lg mb-2 rounded"
          />
          <input
            type="submit"
            value={!newAccount ? "Login" : "Create Account"}
            className="border py-3 px-4 bg-green-400 text-white font-bold rounded cursor-pointer hover:shadow hover:bg-green-600"
          />
        </form>
        {error && (
          <div className="px-5 mb-4">
            <p className="p-3 bg-red-400 text-white rounded shadow">{error}</p>
          </div>
        )}
      </div>
      <div className="text-right mt-2">
        <span
          onClick={onToggle}
          className="text-blue-400 hover:text-blue-500 cursor-pointer"
        >
          {newAccount ? "Sign In" : "Create Account"}
        </span>
      </div>
    </>
  );
};

export default AuthForm;
