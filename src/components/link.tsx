import { AiFillInstagram } from 'react-icons/ai';
import { FaGithub, FaTicketAlt, FaTiktok, FaYoutube } from 'react-icons/fa';
import { SiOnlyfans } from 'react-icons/si';
import { IconType } from '../types';

type LinkProps = {
  href: string;
  children?: React.ReactNode;
  icon: IconType;
};

export const Link: React.FC<LinkProps> = ({ href, icon, children }) => {
  const linkStyle = `flex justify-center px-4 py-4 bg-white text-gray-900 font-bold rounded-md transition-all   
    w-full hover:translate-x-1 hover:translate-y-1 shadow hover:shadow-lg text-center align-middle items-center gap-3`;

  const iconElement = () => {
    switch (icon) {
      case IconType.Youtube:
        return <FaYoutube size="1.5em" />;
      case IconType.Instagram:
        return <AiFillInstagram size="1.5em" />;
      case IconType.Onlyfans:
        return <SiOnlyfans size="1.5em" />;
      case IconType.Tiktok:
        return <FaTiktok size="1.5em" />;
      case IconType.Github:
        return <FaGithub size="1.5em" />;
      case IconType.Tickets:
        return <FaTicketAlt size="1.5em" />;
      default:
        break;
    }
  };

  return (
    <a target="_blank" rel="noopener noreferrer" href={href} className={linkStyle}>
      {iconElement()}
      {children}
    </a>
  );
};