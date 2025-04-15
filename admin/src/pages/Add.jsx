import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [reviewImage1, setReviewImage1] = useState(false);
  const [reviewImage2, setReviewImage2] = useState(false);
  const [reviewImage3, setReviewImage3] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(599);
  const [beforePrice, setBeforePrice] = useState(699);
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Customtshirt');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading

  // Fetch the product list and set the default product code
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`, {
          headers: { token },
        });

        if (response.data.success) {
          const productList = response.data.products;
          if (productList.length > 0) {
            // Extract the last product code and increment it
            const lastProduct = productList[productList.length - 1];
            const lastCode = lastProduct.code; // Assuming the product object has a 'code' field
            const match = lastCode.match(/(\d+)$/); // Extract the numeric part of the code
            const nextNumber = match ? parseInt(match[1], 10) + 1 : 1;
            const newCode = `O001BL05-S${String(nextNumber).padStart(4, '0')}`;
            setCode(newCode);
          } else {
            // Default code if no products exist
            setCode('O001BL05-S0001');
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch product list.');
      }
    };

    fetchProductList();
  }, [token]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('beforePrice', beforePrice);
      formData.append('category', category);
      formData.append('code', code);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      reviewImage1 && formData.append('reviewImage1', reviewImage1);
      reviewImage2 && formData.append('reviewImage2', reviewImage2);
      reviewImage3 && formData.append('reviewImage3', reviewImage3);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setReviewImage1(false);
        setReviewImage2(false);
        setReviewImage3(false);
        setPrice('');
        setBeforePrice('');
        setCode('');
        setSizes('');
        setBestseller(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="font-semibold mt-3 text-2xl mb-3">Upload Image</p>
        <p className="mt-3 mb-2">Product Images</p>
        <div className="flex gap-2">
          <label htmlFor="image1">
            <img className="w-20 h-25" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
          <label htmlFor="image2">
            <img className="w-20 h-25" src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>
          <label htmlFor="image3">
            <img className="w-20 h-25" src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>
          <label htmlFor="image4">
            <img className="w-20 h-25" src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mt-3 mb-2">Review Images</p>
        <div className="flex gap-2">
          <label htmlFor="reviewImage1">
            <img className="w-20 h-25 h-30" src={!reviewImage1 ? assets.upload_area : URL.createObjectURL(reviewImage1)} alt="" />
            <input onChange={(e) => setReviewImage1(e.target.files[0])} type="file" id="reviewImage1" hidden />
          </label>
          <label htmlFor="reviewImage2">
            <img className="w-20 h-25" src={!reviewImage2 ? assets.upload_area : URL.createObjectURL(reviewImage2)} alt="" />
            <input onChange={(e) => setReviewImage2(e.target.files[0])} type="file" id="reviewImage2" hidden />
          </label>
          <label htmlFor="reviewImage3">
            <img className="w-20 h-25" src={!reviewImage3 ? assets.upload_area : URL.createObjectURL(reviewImage3)} alt="" />
            <input onChange={(e) => setReviewImage3(e.target.files[0])} type="file" id="reviewImage3" hidden />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Write content here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Code</p>
        <input
          onChange={(e) => setCode(e.target.value)}
          value={code}
          className="w-full max-w-[500px] px-3 py-2 uppercase"
          type="text"
          placeholder="Type Product code"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>

          <FormControl sx={{ m: 0, minWidth: 120 }} size="small">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="Men">Men</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div>
          <p className="mb-2">Sub category</p>

          <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}>
              <MenuItem value="Customtshirt">Custom T-shirt</MenuItem>
              <MenuItem value="Oversizedtshirt">Over Sized T-shirt</MenuItem>
              <MenuItem value="Quotesdesigns">Quotes Designs</MenuItem>
              <MenuItem value="Plaintshirt">Plain T-shirt</MenuItem>
              <MenuItem value="Polotshirt">Polo T-shirt</MenuItem>
              <MenuItem value="Acidwash">Acid Wash</MenuItem>
              <MenuItem value="Hoddies">Hoddies</MenuItem>
              <MenuItem value="Sweattshirts">Sweat T-shirt</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price}
            className="w-full py-2 px-3 sm:w-[120px]" type="number" placeholder="599" />
        </div>

        <div>
          <p className="mb-2">Before Price</p>
          <input onChange={(e) => setBeforePrice(e.target.value)} value={beforePrice} className="w-full py-2 px-3 sm:w-[120px]" type="number" placeholder="699" />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div onClick={() => setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
            <p className={`${sizes.includes("S") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
            <p className={`${sizes.includes("M") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
            <p className={`${sizes.includes("L") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={() => setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
            <p className={`${sizes.includes("XL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          {/* <div onClick={() => setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
            <p className={`${sizes.includes("XXL") ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div> */}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500-6" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to bestseller</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'ADD'}
      </button>
    </form>
  );
};

export default Add;