// import { useLocation, Link } from "react-router-dom";
// import { useEffect } from "react";

// const NotFound = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // This hook logs the non-existent path that the user tried to access.
//     console.error(
//       "404 Error: User attempted to access non-existent route:",
//       location.pathname
//     );
//   }, [location.pathname]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
//       <div className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl md:p-12">
//         {/* Top Navigation */}
//         <nav className="absolute left-0 right-0 top-0 flex items-center justify-between p-8 md:px-12">
//           {/* Logo Placeholder */}
//           <Link to="/">
//             <div className="h-8 w-8 cursor-pointer rounded-full bg-gray-900"></div>
//           </Link>
//           <div className="flex items-center space-x-6">
//             <Link to="/documentation" className="text-gray-600 hover:text-gray-900">
//               Documentation
//             </Link>
//             <Link
//               to="/invoices"
//              className="text-gray-600 hover:text-gray-900"
//             >
//               Invoices
//             </Link>
           
//             <Link
//               to="/contact"
//               className="rounded-full bg-gray-900 px-6 py-2 text-white hover:bg-gray-800"
//             >
//               Get in touch
//             </Link>
//           </div>
//         </nav>

//         {/* Main Content Area */}
//         <div className="mt-24 flex flex-col items-center justify-center py-16 text-center">
//           {/* 404 Graphic */}
//           <div className="mb-12 flex items-center justify-center space-x-2 text-[8rem] font-black leading-none md:text-[10rem]">
//             <span className="text-red-500">4</span>
//             <span className="text-blue-500">0</span>
//             <span className="text-yellow-500">4</span>
//           </div>
          
//           <h2 className="mb-4 text-4xl font-bold text-gray-900">
//             Something is wrong
//           </h2>
//           <p className="mb-8 max-w-md text-lg text-gray-600">
//             The page you are looking for was moved, removed, renamed or might
//             never have existed!
//           </p>

//           {/* Return to Home Button */}
//           <Link
//             to="/"
//             className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-800"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={2}
//               stroke="currentColor"
//               className="h-8 w-8 rotate-180" // Rotated to point left
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
//               />
//             </svg>
//           </Link>
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-8 left-0 right-0 p-8 text-center text-sm text-gray-500 md:px-12">
//           <span><Link 
//           to="/privacy" >Privacy Policy</Link></span>
//           <span className="mx-2">|</span>
//           <span><Link
//           to="/terms"
//           >Terms of Service</Link></span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;




import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // This hook logs the non-existent path that the user tried to access.
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // Use the Layout component for a consistent page structure and background
    <Layout>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        {/* The main card uses theme-aware colors from shadcn/ui */}
        <div className="relative w-full max-w-4xl rounded-2xl bg-card p-8 text-card-foreground md:p-12">
          
          {/* Main Content Area - Top margin has been removed for proper alignment */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* 404 Graphic */}
            <div className="mb-12 flex items-center justify-center space-x-2 text-[8rem] font-black leading-none md:text-[10rem]">
              <span className="text-red-500">4</span>
              <span className="text-blue-500">0</span>
              <span className="text-yellow-500">4</span>
            </div>
            
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              Something is wrong
            </h2>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              The page you are looking for was moved, removed, renamed or might
              never have existed!
            </p>

            {/* Return to Home Button */}
            <Link to="/">
              <Button size="icon" className="h-16 w-16 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-8 w-8 rotate-180" // Rotated to point left
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-0 right-0 p-8 text-center text-sm text-muted-foreground md:px-12">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;