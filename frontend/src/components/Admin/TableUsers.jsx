import React from 'react'
import { useEffect, useState } from 'react';
import { getAllUser } from '../../service/admin';
import Loading from '../Loading';
export default function TableUsers({ query }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fixed: Call getAllLocation as a function
        const response = await getAllUser();
        if (response) {
          setUsers(response);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredUsers = query.trim() === "" ? users : users.filter(user => {
    const fullName = `${user.lastName || ''} ${user.firstName || ''}`.toLowerCase();
    const phone = user.numberPhone || '';
    return fullName.includes(query.toLowerCase()) ||
      phone.includes(query) ||
      (user.email && user.email.toLowerCase().includes(query.toLowerCase()));
  });
  console.log("filteredUsers", filteredUsers)

  if (loading) {
    return (
      <Loading />
    )
  }
  return (
    <tbody>
      {filteredUsers.length === 0 ? (
        <tr>
          <td colSpan="5" className="text-center py-4">
            <p>Unable to find user: <i>"{query}"</i></p>
          </td>
        </tr>
      ) : (
        filteredUsers.map((user, index) => (
          <tr key={user._id}>

            <td className='px-4 py-2'>{index + 1}</td>
            <td>
              <div className="font-bold px-4 py-2 text-nowrap">{user.lastName} {user.firstName}</div>
            </td>
            <td>
              <span className="px-4 py-2">{user.numberPhone}</span>
            </td>
            <td className='px-4 py-2'>{user.email} </td>
            <td className='px-4 py-2'>{user.gender === true ? "Male" : "Female"}</td>
          </tr>
        ))
      )}
    </tbody>
  )
}
