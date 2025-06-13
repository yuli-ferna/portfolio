const Button = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-container-paper text-primary ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
export default Button;