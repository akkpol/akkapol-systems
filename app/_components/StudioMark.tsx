export function StudioMark({
  className = "h-9 w-auto md:h-10",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-label="Akkapol Systems logo"
      viewBox="0 0 520 200"
      className={`${className} fill-current`}
    >
      <path d="M25 175 85 25 145 175Z" />
      <path d="M155 25h60l60 150h-60Z" />
      <path d="M295 25h55v150h-55Z" />
      <path d="M370 25h130l-130 130Z" />
      <path d="M370 95 500 175H370Z" />
    </svg>
  );
}
