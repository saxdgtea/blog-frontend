"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm text-center max-w-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-600 text-sm mb-5">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}
