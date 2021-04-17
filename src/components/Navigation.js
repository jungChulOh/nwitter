import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const Navigation = () => {
  return (
    <div className="flex justify-center p-5 border-b shadow fixed w-full bg-white z-30">
      <nav className="w-5/12">
        <ul className="flex justify-around">
          <li>
            <Link to="/" className="hover:text-gray-500">
              <div className="flex flex-col justify-center items-center">
                <FaHome size="25px" />
                <span>Home</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-500">
              <div className="flex flex-col justify-center items-center">
                <ImProfile size="25px" />
                <span>Profile</span>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
