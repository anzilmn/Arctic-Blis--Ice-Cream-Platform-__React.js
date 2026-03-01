const Skeleton = ({ className }) => {
  return (
    // Updated with smoother animation and custom color classes for a premium feel
    <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:dark:from-gray-700 rounded-xl ${className}`}></div>
  );
};

export default Skeleton;