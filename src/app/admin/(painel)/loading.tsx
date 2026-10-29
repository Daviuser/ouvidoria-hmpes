import { CardsSkeleton } from "@/components/ui/Skeletons";

export default function Loading() {
  return (
    <>
      <div className="skeleton mb-6 h-8 w-56" />
      <CardsSkeleton />
    </>
  );
}
