import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className=' text-2xl md:text-3xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-2 md:my-10 flex flex-col md:flex-row gap-7 md:gap-16'>
        <img src={assets.about_us} alt="about_img" className='w-full md:max-w-[450px]' />
        <div className='flex flex-col justify-center gap-2 md:w-2/4 text-gray-600'>
          <p>At Ink Dapper, we believe that fashion is more than just clothing—it’s a form of self-expression. Founded with creativity at its core, we specialize in custom t-shirts, oversized tees, hoodies, and sweatshirts that empower you to wear your story.Whether you want to rock personalized designs, make a bold statement, or keep it cool with timeless essentials, Ink Dapper offers something for every personality and style.</p>
          <b className='text-gray-800 mt-4'>Our Mission</b>
          <p>We’re here to blur the lines between comfort and creativity. With a focus on premium quality and individuality, we aim to provide clothing that’s not only stylish but also feels great to wear, every day.</p>
          <b className='text-gray-800 mt-4'>Our Promise</b>
          <p>At Ink Dapper, each piece is crafted with care, using high-quality fabrics and thoughtful designs. We value creativity, inclusivity, and sustainability, ensuring that you get products that look great, long lasting, and feel good to wear.</p>
          <b className='text-gray-800 mt-4'>Join the Ink Dapper Movement</b>
          <p>We don’t just sell clothes—we help you express your vibe. From casual streetwear to fully customized creations, Ink Dapper makes sure that you can wear your style in your way.</p>
          <p className='text-gray-800 font-medium mt-4'>Ink Dapper – Elevate Your Wardrobe.</p>
        </div>
      </div>

      <div className='text-2xl md:text-3xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border p-6 md:px-12 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance – Made to Last:</b>
          <p className='text-gray-500'>We believe great style starts with great quality. Every piece is crafted with premium fabrics and attention to detail, ensuring your wardrobe stands the test of time.<br /><br /> <b>Soft and durable materials</b> for maximum comfort.<br /> <b>Vibrant prints and embroidery</b> that stay fresh after many wash.<br /> <b>Rigorous quality checks</b> has been performed for every item before its been packed for him.
          </p>
        </div>
        <div className='border p-6 md:px-12 sm:py-20 flex flex-col gap-5'>
          <b>Convenience – Easy, Fast & Seamless:</b>
          <p className='text-gray-500'>Shopping with us is simple, smooth, and stress-free, from browsing to checkout and delivery. Whether you're customizing your look or picking a pre-designed piece, we make it effortless.<br /><br /> <b>User-friendly online store</b> with easy customization tools.<br /><br /> <b>Fast shipping</b> and secure payments.<br /><br /> <b>Worldwide delivery</b> so you can shop from anywhere.</p>
        </div>
        <div className='border p-6 md:px-12 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service – We’re Here for You:</b>
          <p className='text-gray-500'>At Ink Dapper, our customer comes first. We're committed to providing responsive, friendly, and personalized support to make sure that every shopping experience exceeds your expectations.<br /><br /> <b>Easy returns and exchanges</b> for a hassle-free experience.<br /><br /> <b>Quick response time</b> via email and social media.<br /><br /> <b>Dedicated support team ready</b> to assist with all your needs.
          </p>
        </div>
      </div>

      <div>
        <NewsLetterBox />
      </div>
    </div>
  )
}

export default About