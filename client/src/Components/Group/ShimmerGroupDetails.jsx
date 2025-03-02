import React from "react";

const ShimmerGroupDetails = () => {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-10 bg-gray-300 rounded w-3/4 mx-auto"></div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-24 bg-gray-300 rounded"></div>
          ))}
      </div>

      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="h-12 bg-gray-300 rounded"></div>
          ))}
      </div>
    </div>
  );
};

export default ShimmerGroupDetails;
