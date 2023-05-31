import React from "react";
import { Link, NavLink } from "react-router-dom";

const SideNav = ()=> {
    return (
      <div className="side-nav">
        <ul className="list-group list-group-flush">
          <NavLink
            to="/home/dashboard"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Dashboard"
          >
            <i className="las la-shapes la-lw" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/home/patients"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Patients"
          >
            <i className="las la-user-injured la-lw" />
            <span>Patients</span>
          </NavLink>
          <NavLink
            to="/home/doctors"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Doctors"
          >
            <i className="las la-stethoscope la-lw" />
            <span>Doctors</span>
          </NavLink>
          <NavLink
            to="/home/pharmacy"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Pharmacy"
          >
            <i className="las la-capsules la-lw" />
            <span>Pharmacy</span>
          </NavLink>
          <NavLink
            to="/home/reservations"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Reservations"
          >
            <i className="las la-calendar-check la-lw" />
            <span>Reservations</span>
          </NavLink>
          <NavLink
            to="/home/radiation"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Radiations"
          >
            <i className="las la-x-ray la-lw" />
            <span>Radiations</span>
          </NavLink>
          <NavLink
            to="/home/laboratory"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Labs"
          >
            <i className="las la-vials la-lw" />
            <span>Laboratory</span>
          </NavLink>
          <NavLink 
            to="/home/general"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="general"
          >
            <i className="las la-globe la-lw" />
            <span>General</span>
          </NavLink>
          <NavLink 
            to="/home/settings"
            className="list-group-item"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Settings"
          >
            <i className="las la-cogs la-lw" />
            <span>Settings</span>
          </NavLink>
        </ul>
      </div>
    );
  }


export default SideNav;
