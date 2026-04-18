import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const BackNavigation = ({
  label = 'Back',
  fallbackTo = '/dashboard',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <button
      onClick={handleBack}
      className={`group inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground transition-all hover:border-primary/50 hover:text-primary ${className}`}
      type="button"
    >
      <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
};

export default BackNavigation;
