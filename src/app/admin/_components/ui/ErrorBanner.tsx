export default function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-serif whitespace-pre-line">
      {message}
    </div>
  );
}
