import React from "react";
import {useState, useEffect} from 'react'
import {
  NavItem,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Media,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";
import * as Icon from "react-feather";
import classnames from "classnames";
import Autocomplete from "../../../components/@vuexy/autoComplete/AutoCompleteComponent";
import { history } from "../../../history";
import useAuthToken from "../../../hooks/auth/useAuthToken";
import useProfile from "../../../hooks/useProfile";

const UserDropdown = (props) => {
  const { setAuthToken } = useAuthToken();

  const handleLogout = () => {
    setAuthToken(null);
  };
  return (
    <DropdownMenu right>
      <DropdownItem tag="a" href="#">
        <Icon.User size={14} className="mr-50" />
        <span className="align-middle">Edit Profile</span>
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem
        tag="a"
        onClick={(e) => {
          history.push("/login");
          handleLogout();
        }}
      >
        <Icon.Power size={14} className="mr-50" />
        <span className="align-middle">Log Out</span>
      </DropdownItem>
    </DropdownMenu>
  );
};

const NavbarUser = (props) => {
  const [navbarSearch, setNavbarSearch] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get("/api/main-search/data").then(({ data }) => {
      setSuggestions(data.searchResult);
    });
  }, []);

  const handleNavbarSearch = () => {
    setNavbarSearch(!navbarSearch);
  };

  const { profile, errorProfile } = useProfile();


  return (
    <ul className="nav navbar-nav navbar-nav-user float-right">
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle tag="a" className="nav-link dropdown-user-link">
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name text-bold-600">
              {profile?.name}
            </span>
            <span className="user-status">Available</span>
          </div>
          <span data-tour="user">
            <img
              src={props.userImg}
              className="round"
              height="35"
              width="35"
              alt="avatar"
            />
          </span>
        </DropdownToggle>
        <UserDropdown {...props} />
      </UncontrolledDropdown>
    </ul>
  );
};
export default NavbarUser;
