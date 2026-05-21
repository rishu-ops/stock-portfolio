export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#262d35]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-bold">
            <span className="text-indigo-400">FinApp</span>
            <span className="text-gray-400"> Finance</span>
          </span>
          <span className="text-gray-600">·</span>
          <span>© {year} All rights reserved</span>
        </div>

        <p className="max-w-md sm:text-right text-gray-500">
          Data shown is mocked for demonstration purposes only. Not financial
          advice.
        </p>
      </div>
    </footer>
  );
}
