import React, { useState } from 'react';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';

const JobExplore = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobPostings = [
    {
      id: 1,
      title: "Sticker Design Specialist",
      company: "Ink Dapper",
      location: "Vellore, Tamil Nadu",
      type: "Freelancing",
      experience: "2-4 years",
      postedDate: "2 days ago",
      description: "We are looking for a creative and detail-oriented Sticker Design Specialist to join our team. You will be responsible for creating realistic and perfect sticker designs for our t-shirt models, ensuring high-quality visual execution that enhances our product offerings.",
      requirements: [
        "Proficiency in Adobe Photoshop, Illustrator, and other design software",
        "Strong understanding of print design and color theory",
        "Experience with sticker design and application techniques",
        "Ability to create realistic and detailed designs",
        "Knowledge of different sticker materials and finishes",
        "Portfolio demonstrating sticker design work",
        "Good communication skills and attention to detail"
      ],
      responsibilities: [
        "Design creative and realistic stickers for t-shirt models",
        "Ensure perfect execution and visual quality of designs",
        "Collaborate with the design team to maintain brand consistency",
        "Research current design trends and techniques",
        "Prepare designs for print production",
        "Review and refine designs based on feedback",
        "Maintain organized design files and documentation"
      ],
      benefits: [
        "Flexible working hours",
        "Remote work opportunity",
        "Creative and collaborative work environment",
        "Professional development opportunities",
        "Project-based compensation",
        "Portfolio building opportunities"
      ],
      skills: ["Adobe Photoshop", "Adobe Illustrator", "Print Design", "Color Theory", "Sticker Design", "Creative Design", "Attention to Detail"]
    }
  ];

  const handleApplyJob = (jobId) => {
    const job = jobPostings.find(job => job.id === jobId);
    const subject = `Application for ${job?.title} - ${job?.company}`;
    const body = `Dear Hiring Team,

I am writing to express my interest in the ${job?.title} position at ${job?.company}.

Please find my resume attached and let me know if you need any additional information.

Best regards,
[Your Name]`;

    const mailtoLink = `mailto:careers@inkdapper.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="min-h-screen">
      <h1 className="sr-only">Job Explore - Ink Dapper Careers</h1>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full translate-y-40 -translate-x-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Join Our <span className="text-orange-100">Creative Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
            Be part of a dynamic team that's revolutionizing the t-shirt design industry with innovative sticker applications and creative solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              View Open Positions
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transform hover:scale-105 transition-all duration-300">
              Learn About Us
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Current Openings
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities and join our mission to create amazing t-shirt designs with innovative sticker applications.
          </p>
        </div>

        <div className="grid gap-8">
          {jobPostings.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-2xl font-bold text-gray-800 mr-4">{job.title}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.company}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.experience}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0 lg:ml-6">
                    <button
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button
                      onClick={() => handleApplyJob(job.id)}
                      className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transform hover:scale-105 transition-all duration-300"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Expanded Job Details */}
                {selectedJob === job.id && (
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 mb-4">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="text-gray-700">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4">Benefits & Perks</h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center bg-orange-50 rounded-lg p-3">
                            <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                          Posted {job.postedDate} • Job ID: #{job.id.toString().padStart(3, '0')}
                        </div>
                        <div className="flex gap-3">
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            Save Job
                          </button>
                          <button className="text-orange-500 hover:text-orange-600 font-medium">
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Jobs Message */}
        {jobPostings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No current openings</h3>
            <p className="text-gray-500">Check back later for new opportunities!</p>
          </div>
        )}
      </div>

      {/* Company Culture Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a team that values creativity, innovation, and professional growth in the exciting world of custom t-shirt design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Innovation First</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of t-shirt design with cutting-edge sticker applications and creative techniques.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Collaborative Team</h3>
              <p className="text-gray-600">
                Work alongside talented designers and creative professionals in a supportive and collaborative environment.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Growth Opportunities</h3>
              <p className="text-gray-600">
                Advance your career with continuous learning opportunities, skill development programs, and leadership roles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-100 rounded-lg shadow-lg to-amber-50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <NewsLetterBox />
        </div>
      </div>
    </div>
  );
};

export default JobExplore;
