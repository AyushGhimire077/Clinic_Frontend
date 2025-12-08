import { FaArrowLeft } from "react-icons/fa";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export const BackButton = ({
  onClick,
  className = "",
  ariaLabel = "Go back",
}: BackButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        h-8 w-8 sm:h-10 sm:w-10
        rounded-full
        backdrop-blur-md
        border border-border
        text-muted
        transition-all duration-200
        hover:bg-primary-light hover:text-primary hover:border-primary
        hover:shadow-soft
        active:scale-95
        focus-ring
        ${className}
      `}
      aria-label={ariaLabel}
    >
      <FaArrowLeft className="text-current" />
    </button>
  );
};
