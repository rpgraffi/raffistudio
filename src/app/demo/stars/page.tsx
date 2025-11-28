import { StarRating } from "@/components/ui/StarRating";

export default function StarsDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-100 p-12 flex flex-col gap-12 items-start">
      <h1 className="text-3xl font-bold text-neutral-800">Star Rating Demo</h1>

      <div className="space-y-2">
        <p className="font-medium">Rating: 4.5 (Large)</p>
        <div className="w-96">
          <StarRating rating={4.5} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Rating: 3.2 (Medium)</p>
        <div className="w-64">
          <StarRating rating={3.2} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Rating: 1.8 (Small)</p>
        <div className="w-32">
          <StarRating rating={1.8} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Rating: 5.0</p>
        <div className="w-64">
          <StarRating rating={5} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Rating: 0.5</p>
        <div className="w-64">
          <StarRating rating={0.5} />
        </div>
      </div>
    </div>
  );
}
