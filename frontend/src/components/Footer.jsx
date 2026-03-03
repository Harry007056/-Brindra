const footerSections = [
  {
    title: 'Product',
    links: ['Features', 'Projects', 'Messages', 'Files'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Partners'],
  },
  {
    title: 'Resources',
    links: ['Help Center', 'Documentation', 'Release Notes', 'Status'],
  },
  {
    title: 'Contact',
    links: ['support@brindra.com', '+1 (800) 555-0147', 'Mon-Fri 9AM-6PM', 'Remote Worldwide'],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white px-4 py-5 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {footerSections.map((section) => (
          <section key={section.title}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-accent-warm-grey">{section.title}</h3>
            <ul className="mt-2 space-y-1.5">
              {section.links.map((item) => (
                <li key={item} className="text-xs text-text-default">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D9E1D7] pt-3 text-xs">
        <p className="text-text-default">(c) {year} Brindra. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Privacy</button>
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Terms</button>
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Security</button>
          <button className="text-primary-dusty-blue hover:text-primary-soft-sky">Support</button>
        </div>
      </div>
    </footer>
  );
}
