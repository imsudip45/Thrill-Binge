import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block group mb-4">
              <span className="font-black text-xl flex items-center space-x-1">
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">THRILL</span>
                  <span className="absolute -inset-y-2 -inset-x-1 bg-red-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></span>
                  <span className="absolute -inset-y-3 -inset-x-2 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 blur-2xl group-hover:via-red-500/30 transition-all rounded-[100%]"></span>
                  <span className="absolute -inset-1 bg-gradient-to-tr from-red-500/0 via-red-500/10 to-transparent blur-xl group-hover:via-red-500/20 transition-all rotate-6"></span>
                </span>
                <span className="relative inline-block">
                  <span className="relative z-10 text-red-500 font-bold group-hover:text-red-400 transition-colors">BINGE</span>
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
                </span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premier destination for the most thrilling cinema experience, bringing heart-pounding action and suspense to your screen.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/copyright" className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                  Copyright Information
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 text-center">
            &copy; {currentYear} ThrillBinge. All rights reserved.
          </div>
          <p className="text-gray-500 text-xs mt-2 md:mt-0">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </div>
    </footer>
  );
}