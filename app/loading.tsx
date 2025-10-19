export default function Loading() {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
}
