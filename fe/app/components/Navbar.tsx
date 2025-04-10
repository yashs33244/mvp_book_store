import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[var(--coffee)] text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl krona-one-regular">
            <Link
              href="/"
              className="text-[#f5deb3] hover:text-[#eedc82] transition-colors"
            >
              Book Exchange
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-[var(--almond)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/books"
              className="hover:text-[var(--almond)] transition-colors"
            >
              Books
            </Link>
            <Link
              href="/exchange"
              className="hover:text-[var(--almond)] transition-colors"
            >
              Exchange
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--almond)] transition-colors"
            >
              About
            </Link>
            <div className="flex space-x-3 ml-4">
              <Link
                href="/login"
                className="bg-[#b76e36] text-white px-4 py-2 hover:bg-[#d1884f] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-[#f5deb3] text-[#4b3621] px-4 py-2 hover:bg-[#eedc82] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
