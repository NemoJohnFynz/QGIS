import React from 'react'
import { useEffect, useState } from 'react';
import { deleteCategory, getAllCategory } from '../../service/admin';
import Loading from '../Loading';

export default function TableCategory({ query }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fixed: Call getAllLocation as a function
        const response = await getAllCategory();
        const sortedCategories = response.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt) // Sắp xếp giảm dần theo createdAt
        );
        if (sortedCategories) {
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //handle delete category
  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      const response = await deleteCategory(id);
      if (response) {
        setCategories(categories.filter(category => category._id !== id));
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = query.trim() === "" ? categories : categories.filter(category => {
    const searchQuery = query.trim().toLowerCase();

    // Safely check if name contains the query
    const nameMatch = category.name ?
      category.name.toLowerCase().includes(searchQuery) : false;

    // Safely check if address contains the query
    const descriptionMatch = category.description ?
      category.description.toLowerCase().includes(searchQuery) : false;

    return nameMatch || descriptionMatch;
  });

  if (loading) {
    return (
      <Loading />
    )
  }
  return (
    <tbody>
      {filteredCategories.length === 0 ? (
        <tr>
          <td colSpan="5" className="text-center py-4">
            <p>Unable to find user: <i>"{query}"</i></p>
          </td>
        </tr>
      ) : (
        filteredCategories.map((c, index) => (
          <tr key={c._id}>
            <td className='px-4 py-2'>{index + 1}</td>
            <td>
              <div className="font-bold px-4 py-2 text-nowrap">{c.name}</div>
            </td>
            <td className='px-4 py-2'>{c.description} </td>
            <td>
              <button onClick={(e) => handleDeleteCategory(c._id)} className="text-red-500 px-4 py-2 hover:underline">Delete</button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  )
}
