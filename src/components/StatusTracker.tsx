"use client";

const STAGES = [
  { id: "designing", label: "Consultation & Design" },
  { id: "fabric_sourced", label: "Fabric Sourcing" },
  { id: "construction", label: "Construction" },
  { id: "fitting", label: "Fitting Phase" },
  { id: "ready", label: "Ready for Pickup" },
];

export default function StatusTracker({ currentStatus }: { currentStatus: string }) {
  // Find the index of the current stage to calculate progress
  const currentIdx = STAGES.findIndex((s) => s.id === currentStatus);
  const progressPercentage = ((currentIdx + 1) / STAGES.length) * 100;

  return (
    <div className="w-full py-12 px-4">
      {/* Progress Bar Container */}
      <div className="relative h-[2px] w-full bg-black/5 mb-12">
        {/* Active Progress Line */}
        <div 
          className="absolute top-0 left-0 h-full bg-black transition-all duration-1000 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Stage Nodes */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={stage.id} className="relative flex flex-col items-center">
                {/* Node Circle */}
                <div 
                  className={`w-3 h-3 rounded-full border transition-all duration-500 ${
                    isCompleted 
                      ? "bg-black border-black scale-110" 
                      : "bg-white border-black/10"
                  } ${isCurrent ? "ring-4 ring-black/5" : ""}`}
                />
                
                {/* Label */}
                <div className={`absolute top-6 whitespace-nowrap text-[8px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${
                  isCurrent ? "text-black" : "text-black/20"
                }`}>
                  {stage.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}