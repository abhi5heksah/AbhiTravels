import { useState } from 'react';
import { Settings } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

export default function FloatingGearButton() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPrivacyModal(true)}
        className="fixed bottom-6 left-6 btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <Settings className="w-6 h-6" />
      </button>

      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </>
  );
}
