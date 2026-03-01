export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-text-default">© {year} Brindra. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Privacy</button>
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Terms</button>
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Support</button>
        </div>
      </div>
    </footer>
  );
}
