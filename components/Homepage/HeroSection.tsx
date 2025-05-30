import React from 'react';
// import Image from 'next/image';

const HeroSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-white to-gray-100">
                <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            The everything app, for work.
          </h1>

{/* <Image src="/dot1.svg" alt='bg' className='w-40 h-40 blur-lg  rotate-180' fill/> */}
      <div className="container mx-auto px-6 py-24 flex flex-col  items-center">
        <div className="flex flex-col justify-center items-center mb-16 md:mb-0 ">
          <h1 className="text-4xl text-center md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            The everything app, for work.
          </h1>
          <p className="text-lg text-center text-gray-600 mb-10">
            One app for projects, knowledge, conversations, and more.<br />
            Get more done faster—together.
          </p>
          
          <div className="mb-12">
            <div className="h-px bg-gray-200 w-full mb-6"></div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Get started. It's FREE!</h2>
            <p className="text-gray-500 text-center">Free Forever. No Credit Card.</p>
          </div>
          
          <button className="bg-purple-600 w-52 bg-gradient-to-r from-blue-600 to-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
            Sign Up Free →
          </button>
        </div>
        
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-xl p-8 shadow-2xl border border-gray-200">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-700">Settings</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Workspace</p>
                  <div className="space-y-2">
                    {['Name', 'Price', 'Size', 'Successes', 'Scale', 'Store'].map((item) => (
                      <div key={item} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex text-sm text-gray-500 space-x-4">
                    <span>Inventory | 0: Company | 8: Stock</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {['List', 'Share', 'Calendar', 'Worksheet', 'Note', 'Show', 'Save'].map((item) => (
                    <span key={item} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {item}
                    </span>
                  ))}
                </div>
                
                <div className="pt-2 text-sm text-gray-500">
                  <p>Share: Stock | Website: Discover | Customs</p>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <span className="text-gray-500">To be</span>
                  <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">+</button>
                  <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">+</button>
                </div>
                
                <div className="pt-2 text-sm text-gray-500 flex items-center">
                  <span>Create promotional videos and social media posts</span>
                  <button className="ml-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">+</button>
                  <button className="ml-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default HeroSection;
