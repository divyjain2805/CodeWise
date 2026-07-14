import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content border-t border-base-300 mt-10">
        <div className="footer flex justify-between max-w-7xl mx-auto p-10">
            <aside>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        CodeWise
                    </span>
                </div>
                <p className="max-w-xs text-sm opacity-80 leading-relaxed">
                    CodeWise is your ultimate platform for mastering algorithms, preparing for technical interviews, and leveling up your coding skills. Practice, learn, and grow.
                </p>
            </aside>
            
             
            <nav>
                <h6 className="footer-title text-base-content/80">Contact Us</h6>
                <div className="flex items-center gap-2 mb-1">
                    <Mail size={16} className="text-primary" />
                    <a href="mailto:support@codewise.com" className="link link-hover text-sm opacity-80">support@codewise.com</a>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} className="text-primary" />
                    <span className="text-sm opacity-80">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm opacity-80">123 Tech Avenue, Pune</span>
                </div>
            </nav>
            
            <nav>
                <h6 className="footer-title text-base-content/80">Follow Us</h6>
                <div className="flex gap-4">
                    <a href="https://github.com/divyjain2805" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary hover:opacity-100 transition-all hover:scale-110 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=divyjain2805@gmail.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary hover:opacity-100 transition-all hover:scale-110 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z" /><polyline points="4,4 12,13 20,4" /></svg>
                    </a>
                    <a href="https://linkedin.com/in/divya-jain-3b98a028a" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-primary hover:opacity-100 transition-all hover:scale-110 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                </div>
            </nav>
        </div>
        <div className="footer footer-center p-4 bg-base-300 text-base-content/70 text-sm">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by CodeWise</p>
            </aside>
        </div>
    </footer>
  );
};

export default Footer;
