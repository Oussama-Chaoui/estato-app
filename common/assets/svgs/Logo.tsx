import Image from 'next/image';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const APP_TITLE = process.env.NEXT_PUBLIC_TITLE || 'YAKOUT';

interface LogoProps {
  isFullLogo?: boolean;
  onClick?: () => void;
}

const Logo = ({ isFullLogo = false, onClick }: LogoProps) => {
  if (!isFullLogo) {
    return (
      <div 
        className={`${onClick ? 'cursor-pointer' : 'cursor-default'}`} 
        onClick={onClick}
      >
        <Image src="/logo.png" width={50} height={33} alt="logo" />
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1 items-end ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={onClick}
    >
      <div className="relative w-[35px] h-[28px] md:w-[50px] md:h-[33px]">
        <Image src="/logo.png" alt="logo" fill style={{ objectFit: 'contain' }} />
      </div>
      <h1
        className={`text-xl md:text-[28px] font-bold leading-none mb-0 flex items-end ${montserrat.className}`}
      >
        {APP_TITLE}
      </h1>
    </div>
  );
};

export default Logo;
