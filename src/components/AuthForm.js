import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
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
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={form.email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          value={form.password}
          onChange={onChange}
        />
        <input type="submit" value={!newAccount ? "Login" : "Create Account"} />
      </form>
      {error}
      <span onClick={onToggle}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;
