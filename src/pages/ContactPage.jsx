import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Building,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { validatePhone } from '../utils/validation';
import api from '../services/api';

export const ContactPage = () => {
  const settings = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const inquiryOptions = [
    'General Inquiry',
    'Order Feedback & Support',
    'Franchise & Business Opportunity',
    'Corporate & Party Catering',
    'Careers & HR'
  ];

  const faqs = [
    {
      q: 'How can I track my active order?',
      a: 'Once your order is placed, you can track live kitchen and rider delivery updates in your Order History tab or via SMS status link.'
    },
    {
      q: 'What are UrbanBite delivery hours?',
      a: 'Our branches operate express delivery from 11:00 AM to 02:00 AM daily across Lahore, Islamabad, Multan, and Faisalabad.'
    },
    {
      q: 'Do you offer party and corporate catering?',
      a: 'Yes! We offer bulk meal boxes, burger bars, and pizza platters for corporate events, birthday parties, and gatherings. Contact us via the form or email corporate@urbanbite.pk.'
    },
    {
      q: 'What should I do if my order is delayed or incorrect?',
      a: 'Our customer delight team resolves any order issues immediately. Call our hotline at 042-111-URBAN or message us directly with your Order ID.'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567)');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/contact', formData);
      toast.success('Thank you! Your message has been sent to UrbanBite support team. We will respond shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'General Inquiry',
        subject: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-50 text-red-600 inline-block border border-red-100">
            We’re Here to Help
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight">
            Contact UrbanBite
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Have a question about your order, corporate catering, or franchise opportunities? Reach out to our team — we’re always ready to assist you.
          </p>
        </div>

        {/* Main Section: Message Form (Full Width / Centered) */}
        <div className="max-w-4xl mx-auto bg-neutral-50 rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm hover:shadow-[0_20px_45px_rgba(239,68,68,0.35)] hover:border-red-500 hover:ring-1 hover:ring-red-400/40 transition-all duration-300">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-900">
              Send Us a Message
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Fill out the form below and our customer support team will get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_name" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ali Raza"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ali@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact_phone" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 03001234567"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="contact_inquiryType" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Inquiry Type
                </label>
                <select
                  id="contact_inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors cursor-pointer"
                >
                  {inquiryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact_subject" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                id="contact_subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Question about catering menu..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact_message" className="block text-xs font-semibold text-neutral-800 mb-1.5">
                Message *
              </label>
              <textarea
                id="contact_message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message or order feedback details here..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>

        {/* Section 2: FAQ Accordion (Light Theme) */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-neutral-50 rounded-3xl p-6 sm:p-10 space-y-6 border border-neutral-200 shadow-sm hover:shadow-[0_20px_45px_rgba(239,68,68,0.35)] hover:border-red-500 hover:ring-1 hover:ring-red-400/40 transition-all duration-300 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-900">
              Got Questions? We’ve Got Answers.
            </h3>

            <div className="space-y-3 pt-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-neutral-200 hover:border-red-400 hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)] rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-neutral-900 hover:text-red-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ml-2 ${
                        openFaq === index ? 'rotate-180 text-red-600' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Contact Info Cards (Placed AFTER Questions Section with Modern Premium Styling) */}
        <div className="max-w-7xl mx-auto pt-4">
          <div className="text-center mb-8">
            <h3 className="font-sans font-bold text-2xl text-neutral-900">
              Direct Contact & Support Channels
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1">
              Connect with our customer care representatives through your preferred channel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Call Hotline */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 hover:-translate-y-1.5 transition-all duration-300 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-neutral-900 text-lg mb-1">
                Call Hotline
              </h4>
              <p className="text-neutral-500 text-xs mb-4 leading-relaxed">
                Instant helpline for order changes & live support
              </p>
              <a
                href={`tel:${settings?.contactPhone || '04211187226'}`}
                className="font-bold text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{settings?.contactPhone ? `Helpline: ${settings.contactPhone}` : 'UAN: 042-111-URBAN'}</span>
              </a>
            </div>

            {/* Card 2: Email Support */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 hover:-translate-y-1.5 transition-all duration-300 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-neutral-900 text-lg mb-1">
                Email Support
              </h4>
              <p className="text-neutral-500 text-xs mb-4 leading-relaxed">
                Send us detailed feedback or business queries
              </p>
              <a
                href={`mailto:${settings?.contactEmail || 'support@urbanbite.pk'}`}
                className="font-bold text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{settings?.contactEmail || 'support@urbanbite.pk'}</span>
              </a>
            </div>

            {/* Card 3: Operating Hours */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 hover:-translate-y-1.5 transition-all duration-300 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-neutral-900 text-lg mb-1">
                Operating Hours
              </h4>
              <p className="text-neutral-500 text-xs mb-4 leading-relaxed">
                Express Delivery & Kitchen Schedule
              </p>
              <span className="font-bold text-neutral-900 text-sm block">
                11:00 AM – 02:00 AM Daily
              </span>
            </div>

            {/* Card 4: Main Cities */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/90 shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 hover:-translate-y-1.5 transition-all duration-300 text-left group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/60 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-neutral-900 text-lg mb-1">
                Main Cities
              </h4>
              <p className="text-neutral-500 text-xs mb-4 leading-relaxed">
                7+ Flagship branches across major hubs
              </p>
              <Link
                to="/restaurants"
                className="font-bold text-red-600 hover:text-red-700 text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>View Branch Locations →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Section 4: Corporate / Franchise Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 via-red-50/70 to-neutral-50 rounded-3xl p-6 sm:p-8 border border-red-100 space-y-3 text-left shadow-xs hover:shadow-[0_16px_36px_rgba(239,68,68,0.26)] hover:border-red-400/90 transition-all duration-300">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
              <Building className="w-4 h-4" />
              <span>CORPORATE & FRANCHISE INQUIRIES</span>
            </div>
            <h4 className="font-sans font-bold text-lg sm:text-xl text-neutral-900">
              Interested in opening an UrbanBite branch?
            </h4>
            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
              We are actively expanding across major cities. Contact our franchise development head at <strong className="text-neutral-900 font-semibold">franchise@urbanbite.pk</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
