import React from 'react'
import { useState, useEffect } from 'react'
import Stat from '../../components/Admin/Stat'
import { getAllLocation } from '../../service/admin'
import { LocationOn } from '@mui/icons-material'
export default function Dashboard() {
    const [locations, setLocations] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const responseUser = await getAllUser();
                const responseLocations = await getAllLocation();
                // setUser(responseUser.data);
                setLocations(responseLocations);
            }
            catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchData()
    }, [])

    return (
        <div className='py-3 px-5 w-full'>
            <div className='grid grid-cols-3 gap-4 mx-auto justify-center '>
                <Stat title={"Location total"} value={locations.length} icon={<LocationOn className='size-10 text-sky-600' />} />
                <Stat title={"Location total"} value={locations.length} icon={<LocationOn className='size-10 text-sky-600' />} />
                <Stat title={"Location total"} value={locations.length} icon={<LocationOn className='size-10 text-sky-600' />} />
                <Stat title={"Location total"} value={locations.length} icon={<LocationOn className='size-10 text-sky-600' />} />
            </div>
        </div>
    )
}
