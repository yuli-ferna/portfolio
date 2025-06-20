const Tag = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-2.5 py-1 rounded-[50px] bg-container-primary border border-primary hover:bg-black/20 bg-mix-blend-plus-darker cursor-pointer ${className}`}
    >
      <p
        className={`flex-grow-0 flex-shrink-0 text-[13px] text-left text-primary`}
      >
        {text}
      </p>
    </div>
  );
}
export default Tag;