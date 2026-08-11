import EventForm from "@/app/admin/_components/EventForm";
import EventsSubNav from "@/app/admin/_components/EventsSubNav";

export default function NewEventPage() {
  return (
    <div className="space-y-8">
      <EventsSubNav />
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-serif font-bold text-foreground tracking-[0.1em]">新規イベントを追加</h1>
        <EventForm />
      </div>
    </div>
  );
}
