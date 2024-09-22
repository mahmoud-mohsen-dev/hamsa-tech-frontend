import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa6';

export function getSocialMediaIcon(icon: string) {
  switch (icon) {
    case 'facebook':
      return <FaFacebookF />;
    case 'youtube':
      return <FaYoutube />;
    case 'instagram':
      return <FaInstagram />;
    case 'tiktok':
      return <FaTiktok />;
    default:
      return null;
  }
}
