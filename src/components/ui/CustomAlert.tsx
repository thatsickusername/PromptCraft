import { useEffect } from "react";

interface CustomAlertProps {
  showAlert: boolean;
  alertMessage: string;
}

export default function CustomAlert({ showAlert, alertMessage }: CustomAlertProps) {
  useEffect(() => {
    // Add the fade-in animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      .animate-fade-in {
        animation: fadeIn ease 0.5s;
        -webkit-animation: fadeIn ease 0.5s;
        -moz-animation: fadeIn ease 0.5s;
        -o-animation: fadeIn ease 0.5s;
        -ms-animation: fadeIn ease 0.5s;
      }
      @keyframes fadeIn {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        100% { opacity: 1; transform: translate(-50%, 0); }
      }
      @-webkit-keyframes fadeIn {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        100% { opacity: 1; transform: translate(-50%, 0); }
      }
    `;
    
    if (!document.head.querySelector('[data-custom-alert-styles]')) {
      style.setAttribute('data-custom-alert-styles', 'true');
      document.head.appendChild(style);
    }
    
    return () => {
      const existingStyle = document.head.querySelector('[data-custom-alert-styles]');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-xl animate-fade-in z-50">
      {alertMessage}
    </div>
  );
}
