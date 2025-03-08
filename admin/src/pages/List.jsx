import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import EditProductModal from '../components/EditProductModal';
import { ShopContext } from '../context/ShopContext';

const List = ({ token }) => {
  const { edit, trash } = useContext(ShopContext);
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', { id: productIdToRemove }, { headers: { token } });
      if (response.data.success) {
        toast.error(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsConfirmModalOpen(false);
      setProductIdToRemove(null);
    }
  };

  const openConfirmModal = (id) => {
    setProductIdToRemove(id);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setProductIdToRemove(null);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleEditSuccess = () => {
    fetchList();
    closeEditModal();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='font-semibold mt-3 text-2xl mb-3'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* ---------------List table title--------------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_0.5fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
          <b className='text-center'>Edit</b>
        </div>

        {/* ---------------  product list  ----------------- */}

        {list.map((product, index) => (
          <div key={index} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr_0.5fr] items-center gap-2 py-1 px-2 border text-sm '>
            <img src={product.image[0]} alt={product.name} className='w-12' />
            <p>{product.name}</p>
            <p className='pl-2'>{product.category}</p>
            <p className='pl-1'>{currency}{product.price}</p>
            <p onClick={() => openConfirmModal(product._id)} className='flex justify-center cursor-pointer text-lg'>{trash}</p>
            <p onClick={() => openEditModal(product)} className='flex justify-center cursor-pointer text-lg'>{edit}</p>
          </div>
        ))}
      </div>
      {editingProduct && (
        <EditProductModal
          token={token}
          product={editingProduct}
          close={closeEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
      {isConfirmModalOpen && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-4 rounded-md'>
            <h2 className='text-xl font-bold mb-4'>Confirm Removal</h2>
            <p className='mb-4'>Are you sure you want to remove this product?</p>
            <div className='flex justify-end gap-2'>
              <button onClick={closeConfirmModal} className='bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded'>
                Cancel
              </button>
              <button onClick={removeProduct} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;