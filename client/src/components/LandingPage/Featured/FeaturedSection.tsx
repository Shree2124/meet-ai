import React from "react";

// Responsive Featured Grid Component
function FeaturedSection() {
  return (
    <div className="mx-auto px-4 py-16 max-w-6xl">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {featuredItems.map((item, index) => (
          <div 
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg ${
              index === 3 ? "md:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title || "Featured image"} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {item.title && (
              <div className="p-5">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                {item.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Featured items data
const featuredItems = [
  {
    title: "Scheduling Simplified",
    description: "Easily book and manage meetings with integrated scheduling.",
    image: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/GetReadyToMeet_RWJPiD?resMode=sharp2&op_usm=1.5,0.65,15,0&wid=2000&hei=1200&qlt=90&fit=constrain"
  },
  {
    title: "Seamless Collaboration",
    description: "Collaborate with team members in real-time with ease.",
    image: "https://cdn.pixabay.com/photo/2017/12/21/12/08/consulting-3031678_640.jpg"
  },
  {
    title: "Intuitive Design",
    description: "Experience a user-friendly interface for all your meeting needs.",
    image: "https://media.istockphoto.com/id/489168376/photo/closeup-hand-holding-digital-tablet-show-analyzing-graph.jpg?s=612x612&w=0&k=20&c=sKz_T9IXT_xsHHyrSHgRn94u8VpG5ones6T1ae9mjAs="
  },
  {
    image: "https://thumbs.dreamstime.com/b/businessman-having-business-meeting-making-video-call-laptop-indoor-black-businessman-having-online-business-meeting-208032144.jpg"
  },
  {
    image: "https://images.pexels.com/photos/7793688/pexels-photo-7793688.jpeg"
  }
];

export default FeaturedSection;