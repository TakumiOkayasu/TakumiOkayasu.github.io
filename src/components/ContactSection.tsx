import type React from 'react';
import type { ContactInfo } from '../types/types';
import { EnvelopeIcon } from './Icons';

interface ContactSectionProps {
  contactInfo: ContactInfo;
}

const ContactItem: React.FC<{ icon: React.ReactNode; value: string }> = ({ icon, value }) => {
  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 min-h-14 transition-all duration-200 rounded-lg">
      <div className="text-gray-700 dark:text-gray-300 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 size-10 transition-colors duration-300">
        {icon}
      </div>
      <p className="text-gray-900 dark:text-gray-100 text-base font-normal leading-normal flex-1 truncate">
        {value}
      </p>
    </div>
  );
};

const ContactSection: React.FC<ContactSectionProps> = ({ contactInfo }) => {
  const contactItems = [
    { icon: <EnvelopeIcon />, value: contactInfo.email },
  ];

  return (
    <section id="contact" className="min-h-screen transition-colors duration-300">
      <div className="flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-4xl flex-1">
          <div className="flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-gray-900 dark:text-gray-100 text-3xl font-bold leading-tight tracking-tight">
                Get in Touch
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                I'm always open to discussing new projects, creative ideas, or opportunities to be
                part of your visions. Feel free to reach out!
              </p>
            </div>
          </div>
          <div className="space-y-3 px-4">
            {contactItems.map(item => (
              <ContactItem key={item.value} icon={item.icon} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
