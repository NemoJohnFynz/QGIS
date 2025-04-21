
import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/Admin/SideBar'

export default function LayoutAdmin() {
    return (
        <div className="flex flex-col bg-[#020202] text-white">
            <div className="flex">
                <aside
                    className="  flex flex-col items-center sticky border-r-[1px] border-[#222222]"
                >
                    <SideBar />
                </aside>
                <main className="bg-[#020202] text-white flex flex-col items-center w-full max-w-7xl mx-auto min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
