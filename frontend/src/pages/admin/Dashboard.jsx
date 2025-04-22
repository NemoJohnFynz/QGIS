import React from 'react'
import { useState, useEffect } from 'react'
import Stat from '../../components/Admin/Stat'
import { getAllCategory, getAllLocation, getAllUser } from '../../service/admin'
import { LocationOn, Person, Category } from '@mui/icons-material'
export default function Dashboard() {
    const [locations, setLocations] = useState([])
    const [users, setUsers] = useState([])
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const responseUser = await getAllUser();
                const responseLocations = await getAllLocation();
                const responseUsers = await getAllUser();
                const responseCategories = await getAllCategory();
                // setUser(responseUser.data);
                setLocations(responseLocations);
                setUsers(responseUsers);
                setCategories(responseCategories)
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
                <Stat title={"Location total"} value={locations.length} icon={<LocationOn className='size-10 text-sky-500' />} />
                <Stat title={"User total"} value={users.length} icon={<Person className='size-10 text-gray-200' />} />
                <Stat title={"Category total"} value={categories.length} icon={<Category className='size-10 text-orange-500' />} />

            </div>
        </div>
    )
}
