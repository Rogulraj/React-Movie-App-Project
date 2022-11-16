import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="footer-media-icon-container">
      <FaGoogle size={20} color="#FFFFFF" className="footer-list-item" />
      <FaTwitter size={20} color="#FFFFFF" className="footer-list-item" />
      <FaInstagram size={20} color="#FFFFFF" className="footer-list-item" />
      <FaYoutube size={20} color="#FFFFFF" className="footer-list-item" />
    </div>
    <p className="footer-contact-us-title">Contact us</p>
  </div>
)
export default Footer
