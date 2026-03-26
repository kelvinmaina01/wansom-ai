import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

const TermsContent = () => (
  <div className="space-y-6">
    <div>
      <p className="mb-4">Last Updated: March 2026</p>
      <p className="mb-6">Welcome to Lawlify AI. By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">1. Acceptance of Terms</h4>
      <p>By creating an account, accessing, or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">2. Data Privacy & Security</h4>
      <p>We take your data privacy seriously. All client data is encrypted and stored securely. We do not use your confidential data to train our public models.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">3. Professional Responsibility</h4>
      <p>Lawlify AI is a tool to assist legal professionals. It does not provide legal advice and should not be relied upon as a substitute for professional legal judgment.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">4. User Accounts</h4>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">5. Intellectual Property</h4>
      <p>All content, features, and functionality of Lawlify AI are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">6. Limitation of Liability</h4>
      <p>Lawlify AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">7. Contact Information</h4>
      <p>If you have any questions about these Terms, please contact us at support@lawlify.ai</p>
    </div>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-6">
    <div>
      <p className="mb-4">Last Updated: March 2026</p>
      <p className="mb-6">At Lawlify AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">1. Information We Collect</h4>
      <p>We collect information you provide directly to us, including account information, content you upload, and communications with us. We also automatically collect certain information when you use our platform.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">2. How We Use Your Information</h4>
      <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">3. Data Security</h4>
      <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">4. Data Sharing</h4>
      <p>We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, and when required by law.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">5. Your Rights</h4>
      <p>You have the right to access, correct, or delete your personal information. You may also opt out of certain communications from us.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">6. Children's Privacy</h4>
      <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">7. Changes to This Policy</h4>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
    </div>

    <div>
      <h4 className="font-bold text-white text-lg mb-2">8. Contact Us</h4>
      <p>If you have any questions about this Privacy Policy, please contact us at support@lawlify.ai</p>
    </div>
  </div>
);

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, type }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
          >
            <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl w-full h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-8 border-b border-white/10">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                  {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h2>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-colors text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 text-gray-300 leading-relaxed no-scrollbar">
                {type === 'terms' ? <TermsContent /> : <PrivacyContent />}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
