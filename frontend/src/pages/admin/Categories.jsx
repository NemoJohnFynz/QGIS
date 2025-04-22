import React, { useState, Suspense, useEffect } from 'react'
import TableCategory from '../../components/Admin/TableCategory';
import Loading from '../../components/Loading';
import { createCategory, getAllCategory } from '../../service/admin';
import { toast } from 'react-toastify';
import SimpleAlert from '../../components/Alert';


export default function Categories() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategory();
            const sortedCategories = data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt) // Sắp xếp giảm dần theo createdAt
            );
            setCategories(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };
    const handleAddCategory = () => {
        setIsModalOpen(true); // Open modal
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); // Close modal
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        // Handle form submission logic here
        try {
            const response = await createCategory(formData);
            if (response) {
                console.log("Create category success:", response);
                setFormData({ name: '', description: '' });
                setSuccess(true);
                toast.success('Category created successfully');

                // Refresh categories data without page reload
                fetchCategories();
            }
        } catch (error) {
            console.error("Error during category creation:", error);
            toast.error('Failed to create category');
        } finally {
            setLoading(false);
            setTimeout(() => {
                setIsModalOpen(false);
                setSuccess(false);
            }, 2000)
        }
    };

    return (
        <div className="p-6 min-h-screen text-white">
            {/* Search Bar */}
            <div className="mb-6 max-w-md mx-auto ">
                <label className="input input-bordered flex items-center gap-2 rounded-lg shadow-md focus-within:ring-2 focus-within:ring-primary">
                    <input
                        type="text"
                        className="grow bg-transparent focus:outline-none text-gray-300  p-2"
                        placeholder="Search categories..."
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
            <div className="mb-4 text-right">
                <button
                    className="bg-blue-600 px-4 py-2 rounded-lg shadow-md"
                    onClick={handleAddCategory}>
                    Add Category
                </button>
            </div>



            {/* Table Container with shadow and rounded corners */}
            <div className=" rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        {/* Table Header */}
                        <thead className="">
                            <tr className='border-b-2 border-gray-200'>
                                <th className='px-4 py-2'>No</th>
                                <th className="w-10 px-4 py-2">Name</th>
                                <th className="px-4 py-2">Description</th>
                            </tr>
                        </thead>

                        {/* Table Content with Loading Fallback */}
                        <Suspense fallback={
                            <tbody>
                                <tr>
                                    <td colSpan="8" className="text-center px-4 py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            </tbody>
                        }>
                            <TableCategory query={query} newcategories={categories} />
                        </Suspense>
                    </table>
                </div>
            </div>

            {/* Modal for Adding Category */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Add New Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name='name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="input input-bordered w-full p-3"
                                    placeholder="Category name "
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="textarea textarea-bordered w-full resize-none p-3"
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Category description"
                                />
                            </div>

                            {success ? (
                                <SimpleAlert mess={"Register successful"} />
                            ) : loading ? (
                                <div className="flex justify-center items-center">
                                    <Loading />
                                </div>
                            ) : (
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md"
                                        onClick={handleCloseModal}>
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md">
                                        Save
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
