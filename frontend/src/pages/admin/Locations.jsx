import React, { useState, Suspense } from 'react'
import Loading from '../../components/Loading';
import TableLocations from '../../components/Admin/TableLocations';

export default function Locations() {
    const [query, setQuery] = useState('');

    return (
        <div className="p-6 min-h-screen text-white">
            {/* Search Bar */}
            <div className="mb-6 max-w-md mx-auto ">
                <label className="input input-bordered flex items-center gap-2 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-primary">
                    <input
                        type="text"
                        className="grow bg-transparent focus:outline-none text-gray-300  p-2"
                        placeholder="Search locations..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-5 w-5 text-gray-500">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
            </div>

            {/* Table Container with shadow and rounded corners */}
            <div className=" rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        {/* Table Header */}
                        <thead className="">
                            <tr className='border-b-2 border-gray-200'>
                                <th className='px-4 py-2'>No</th>
                                <th className="w-10 px-4 py-2">Image</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2">Address</th>
                                <th className="px-4 py-2">Contact</th>
                                <th className="px-4 py-2">Website</th>
                            </tr>
                        </thead>

                        {/* Table Content with Loading Fallback */}
                        <Suspense fallback={
                            <tbody>
                                <tr>
                                    <td colSpan="8" className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            </tbody>
                        }>
                            <TableLocations query={query} />
                        </Suspense>
                    </table>
                </div>
            </div>
        </div>
    )
}