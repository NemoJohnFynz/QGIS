import React from 'react'
import { useEffect, useState } from 'react';
import { getAllLocation } from '../../service/admin';
import Loading from '../Loading';

export default function TableLocations({ query }) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fixed: Call getAllLocation as a function
                const response = await getAllLocation();
                if (response) {
                    setLocations(response);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Loading />
        )
    }
    console.log("locations", locations)

    const filteredLocation = query.trim() === "" ? locations : locations.filter(location => {
        const searchQuery = query.trim().toLowerCase();

        // Safely check if name contains the query
        const nameMatch = location.name ?
            location.name.toLowerCase().includes(searchQuery) : false;

        // Safely check if address contains the query
        const addressMatch = location.address ?
            location.address.toLowerCase().includes(searchQuery) : false;

        return nameMatch || addressMatch;
    });

    return (
        <tbody>
            {filteredLocation.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center py-4 ">
                        <p>Unable to find user: <i className="">"{query}"</i></p>
                    </td>
                </tr>
            ) : (
                filteredLocation.map((l, index) => (
                    <tr key={l._id} className="hover:bg-gray-700">
                        <td className='px-4 py-2'>{index + 1}</td>
                        <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle ">
                                        <img
                                            src={l.images || "https://via.placeholder.com/150"}
                                            alt="images"
                                            className="object-cover h-12 w-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="font-bold ">{l.name}</div>
                        </td>
                        <td className="px-4 py-2 ">
                            <span>{l.description}</span>
                        </td>
                        <td className="px-4 py-2 ">{l.categories}</td>
                        <td className="px-4 py-2 ">{l.address}</td>
                        <td className="px-4 py-2 ">
                            <span className="badge badge-ghost badge-sm">{l.contact.phone}</span>
                        </td>
                        <td className="px-4 py-2 ">{l.website}</td>
                    </tr>
                ))
            )}
        </tbody>
    )
}
