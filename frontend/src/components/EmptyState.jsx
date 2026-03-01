import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'Nothing here yet.' }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-[#88C0D0]/40 bg-background-warm-off-white p-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft-sky/20 text-primary-dusty-blue">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-accent-warm-grey">{message}</p>
    </div>
  );
}
