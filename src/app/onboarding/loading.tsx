export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-10">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="bg-muted h-9 w-64 animate-pulse rounded-md" />
          <div className="bg-muted h-4 w-80 animate-pulse rounded-md" />
        </div>
        <div className="bg-muted h-8 w-32 animate-pulse rounded-md" />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-muted h-10 animate-pulse rounded-md" />
        ))}
      </div>

      <div className="border-border rounded-lg border p-6">
        <div className="bg-muted h-6 w-44 animate-pulse rounded-md" />
        <div className="bg-muted mt-2 h-4 w-72 animate-pulse rounded-md" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-muted h-11 w-full animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
