export default function SubmitButton({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`bg-accent text-white px-8 py-4 font-bold tracking-[0.3em] text-[11px] uppercase transition-all font-serif shadow-lg ${
        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-accent/90'
      }`}
    >
      {isLoading ? '保存中...' : children}
    </button>
  );
}
