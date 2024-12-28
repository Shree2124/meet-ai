import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/icons/logo.svg'
import meetai from "@/assets/meetai.jpg";

import MobileNav from '@/components/DashBoard/Slidebar/MobileNav';

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full  px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center justify-center gap-1">
        <Image
          src={meetai}
          width={120} 
          height={100}
          alt="MeetAi logo"
          className="max-sm:size-10"
        />
      </Link>
      <div className="flex-between gap-5">
      

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;