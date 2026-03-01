export default function ProjectDetails() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-[#4C566A]">Project Alpha</h1>
      <p className="text-[#8B8E7E] mb-4">Detailed description of the project goes here.</p>
      <p className="text-sm mb-2 text-[#8B8E7E]">Team: Team A</p>
      <p className="text-sm mb-4 text-[#8B8E7E]">Members: Alice, Bob</p>
      <div className="bg-[#F8F9F6] rounded-lg p-4 shadow mb-4 border border-[#E0DDD4]/50">
        <h2 className="font-semibold text-[#4C566A]">Related Messages</h2>
        <p className="text-xs text-[#8B8E7E]">(preview of messages...)</p>
      </div>
      <div className="space-x-2">
        <button className="py-1 px-3 bg-[#A3BE8C] text-[#4C566A] rounded hover:bg-[#5E81AC] transition">Edit</button>
        <button className="py-1 px-3 bg-[#E07A5F] text-white rounded hover:bg-[#D4694F] transition">Delete</button>
      </div>
    </div>
  );
}