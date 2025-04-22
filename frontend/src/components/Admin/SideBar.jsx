import React from "react";
import {
    Dashboard,
    Person,
    LocationOn,
    Map
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
export default function SideBar() {
    const location = useLocation();
    const isActiveTab = (path) => location.pathname === path;
    return (
        <div className="p-2 w-full h-full bg-black">
            <div >
                <Link
                    to={"/admin"}
                    className={` p-4 flex items-center rounded-md ${isActiveTab("/") ? "bg-[#1D1D1D]" : "hover:bg-[#353535]"}`}
                >
                    <Dashboard />
                    <span className="px-10">Dashboard</span>
                </Link>
                <Link
                    to={"users"}
                    className={` p-4 flex items-center rounded-md ${isActiveTab("/") ? "bg-[#1D1D1D]" : "hover:bg-[#353535]"}`}
                >
                    <Person />
                    <span className="px-10">Users</span>
                </Link>
                <Link
                    to={"categories"}
                    className={` p-4 flex items-center rounded-md ${isActiveTab("/") ? "bg-[#1D1D1D]" : "hover:bg-[#353535]"}`}
                >
                    <LocationOn />
                    <span className="px-10">Categories</span>
                </Link>
                <Link
                    to={"locations"}
                    className={` p-4 flex items-center rounded-md ${isActiveTab("/") ? "bg-[#1D1D1D]" : "hover:bg-[#353535]"}`}
                >
                    <LocationOn />
                    <span className="px-10">Locations</span>
                </Link>
                <Link
                    to={"/"}
                    className={` p-4 flex items-center rounded-md ${isActiveTab("/") ? "bg-[#1D1D1D]" : "hover:bg-[#353535]"}`}
                >
                    <Map />
                    <span className="px-10">Map</span>
                </Link>
            </div>
        </div>
    );
}