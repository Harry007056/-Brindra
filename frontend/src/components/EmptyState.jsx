export default function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-text">
      <svg
        className="w-24 h-24 mb-4 text-secondary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0a2 2 0 01-2 2H7a2 2 0 01-2-2v-4a2 2 0 012-2h10a2 2 0 012 2v4z"
        />
      </svg>
      <p className="text-lg">{message}</p>
    </div>
  );
}