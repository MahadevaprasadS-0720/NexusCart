import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Sparkles } from 'lucide-react';

const AmazonFooter = ({ onTogglePreviewMode }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#232f3e] text-white font-['Inter'] mt-10 select-none">
      
      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-center text-xs font-bold text-white transition-colors cursor-pointer block"
      >
        Back to top
      </button>

      {/* 4-Column Directory Links */}
      <div className="max-w-[1000px] mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        
        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Get to Know Us</h4>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link to="/" className="hover:underline">About Amazon</Link></li>
            <li><Link to="/" className="hover:underline">Careers</Link></li>
            <li><Link to="/" className="hover:underline">Press Releases</Link></li>
            <li><Link to="/" className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Connect with Us</h4>
          <ul className="space-y-2 text-[#dddddd]">
            <li><a href="#" className="hover:underline">Facebook</a></li>
            <li><a href="#" className="hover:underline">Twitter</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Make Money with Us</h4>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link to="/admin" className="hover:underline">Sell on Amazon</Link></li>
            <li><Link to="/admin" className="hover:underline">Sell under Amazon Accelerator</Link></li>
            <li><Link to="/admin" className="hover:underline">Protect and Build Your Brand</Link></li>
            <li><Link to="/admin" className="hover:underline">Amazon Global Selling</Link></li>
            <li><Link to="/admin" className="hover:underline">Supply to Amazon</Link></li>
            <li><Link to="/admin" className="hover:underline">Fulfillment by Amazon</Link></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-bold text-sm text-white">Let Us Help You</h4>
          <ul className="space-y-2 text-[#dddddd]">
            <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
            <li><Link to="/orders" className="hover:underline">Returns Centre</Link></li>
            <li><Link to="/orders" className="hover:underline">100% Purchase Protection</Link></li>
            <li><Link to="/orders" className="hover:underline">Amazon App Download</Link></li>
            <li><Link to="/" className="hover:underline">Help</Link></li>
          </ul>
        </div>

      </div>

      {/* Middle Amazon Strip */}
      <div className="border-t border-[#3a4553] py-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-[#cccccc]">
        
        {/* Amazon Logo */}
        <div className="flex flex-col items-start leading-none">
          <div className="text-2xl font-black tracking-tight text-white flex items-center font-['Outfit']">
            <span>amazon</span>
            <span className="text-[#febd69] font-bold text-xs ml-0.5">.in</span>
          </div>
          <div className="w-16 h-1.5 bg-[#febd69] rounded-full -mt-0.5 transform -rotate-1 shadow-sm" />
        </div>

        {/* Language / Country Selectors */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 border border-[#848688] rounded-sm flex items-center gap-2 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#cccccc]" />
            <span>English</span>
          </div>
          <div className="px-3 py-1.5 border border-[#848688] rounded-sm flex items-center gap-2 text-xs">
            <span>🇮🇳 India</span>
          </div>

          {/* Theme Preview Switcher */}
          {onTogglePreviewMode && (
            <button
              onClick={onTogglePreviewMode}
              className="px-3 py-1.5 bg-[#febd69] hover:bg-[#f3a847] text-slate-900 font-bold rounded-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Switch to VIP Soft-UI View</span>
            </button>
          )}
        </div>

      </div>

      {/* Bottom Subsidiary Strip */}
      <div className="bg-[#131a22] py-8 text-[11px] text-[#999999]">
        <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 leading-tight">
          <div>
            <span className="font-bold text-white block">AbeBooks</span>
            <span>Books, art & collectibles</span>
          </div>
          <div>
            <span className="font-bold text-white block">Amazon Web Services</span>
            <span>Scalable Cloud Computing Services</span>
          </div>
          <div>
            <span className="font-bold text-white block">Audible</span>
            <span>Download Audio Books</span>
          </div>
          <div>
            <span className="font-bold text-white block">IMDb</span>
            <span>Movies, TV & Celebrities</span>
          </div>
          <div>
            <span className="font-bold text-white block">Shopbop</span>
            <span>Designer Fashion Brands</span>
          </div>
          <div>
            <span className="font-bold text-white block">Amazon Business</span>
            <span>Everything For Your Business</span>
          </div>
          <div>
            <span className="font-bold text-white block">Prime Now</span>
            <span>2-Hour Delivery on Everyday Items</span>
          </div>
          <div>
            <span className="font-bold text-white block">Amazon Prime Music</span>
            <span>100 million songs, ad-free</span>
          </div>
        </div>

        <div className="text-center space-y-1 text-[11px]">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">Conditions of Use & Sale</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <a href="#" className="hover:underline">Interest-Based Ads</a>
          </div>
          <p>© 1996-2026, Amazon.com, Inc. or its affiliates / NexusCart Enterprise Ecosystem</p>
        </div>
      </div>

    </footer>
  );
};

export default AmazonFooter;
