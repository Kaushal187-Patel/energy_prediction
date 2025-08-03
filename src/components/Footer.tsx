import { Github, Linkedin, Mail, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="bg-black/20 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-green-400 mr-2" />
              <span className="text-2xl font-bold text-white">EnergyAI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              AI-powered energy consumption prediction platform helping optimize energy usage and reduce costs.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@energyai.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/predict" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">Predict</Link></li>
              <li><Link to="/dashboard" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/insights" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">Insights</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/team" onClick={handleLinkClick} className="text-gray-300 hover:text-white transition-colors">Team</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 EnergyAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;