import React, {useState} from "react"
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import "./ProfileOptions.css"

export default function ProfileOptions({handleLogout}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    console.log("im clicking");
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle variant="outline-light" id="profileDropdown">
        Profile
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/profile/info">Your Profile Info</Dropdown.Item>
        <Dropdown.Item as={Link} to="/profile/favorites">Your Favorites</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="logout" onClick={handleLogout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}