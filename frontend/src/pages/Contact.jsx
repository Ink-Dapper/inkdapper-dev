import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div>
      <h1 className="sr-only">Contact Us</h1>
      <div className='text-center text-xl md:text-2xl lg:text-3xl pt-6 md:pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-3 md:my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} alt="contact_img" className='w-full md:max-w-[480px]'/>

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>1D, Bazaar Street <br />Vettuvanam, Vellore - 635809</p>
          <p className='text-gray-500'><a href="tel:+919994005696" className='border-b-2 border-gray-400'>Tel : +91 99940 05696</a> <br /><a href="mailto:support@inkdapper.com" className='border-b-2 border-gray-400'>Email : support@inkdapper.com</a></p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Ink Dapper</p>
          <p className='text-gray-500'>Learn more about our teams and job opening</p>
          <button className='border border-black px-5 md:px-8 py-2 md:py-4 text-base hover:bg-black hover:text-white transition-all duration-500'>Explores Jobs</button>
        </div>
      </div>

      <div>
        <NewsLetterBox/>
      </div>
    </div>
  )
}

export default Contact