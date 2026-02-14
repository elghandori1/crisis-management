import { mockPlaceSeverities, severityConfig, type SeverityLevel } from "@/data/mockData";
import { BarChart3, AlertTriangle, Clock, MapPin } from "lucide-react";

const SeverityDistribution = () => {
  const sorted = [...mockPlaceSeverities].sort((a, b) => {
    if (a.isAlertZone && !b.isAlertZone) return -1;
    if (!a.isAlertZone && b.isAlertZone) return 1;
    return b.critical - a.critical || b.totalActiveCases - a.totalActiveCases;
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">Severity Distribution</h1>
          <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
            BY PLACE
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sorted.map((place) => {
            const total = place.totalActiveCases || 1;
            return (
              <div
                key={place.placeName}
                className={`card-glow rounded-lg bg-card p-5 ${
                  place.isAlertZone ? "border-severity-critical/40" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-foreground text-sm">{place.placeName}</h3>
                  </div>
                  {place.isAlertZone && (
                    <span className="severity-badge-critical px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> ALERT ZONE
                    </span>
                  )}
                </div>

                {/* Severity bars */}
                <div className="space-y-2 mb-4">
                  {(["critical", "severe", "moderate", "mild"] as SeverityLevel[]).map((s) => {
                    const count = place[s];
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-[10px] w-16 text-muted-foreground uppercase tracking-wider">{s}</span>
                        <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: severityConfig[s].color,
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-foreground w-8 text-right">{count}</span>
                        <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{pct.toFixed(0)}%</span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase block">Total</span>
                      <span className="stat-value text-base">{place.totalActiveCases}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Avg Response</span>
                        <span className={`stat-value text-base ${
                          place.avgResponseTimeMinutes > 15 ? "text-severity-critical" :
                          place.avgResponseTimeMinutes > 10 ? "text-severity-severe" : "text-severity-mild"
                        }`}>
                          {place.avgResponseTimeMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {place.latitude.toFixed(2)}°N {Math.abs(place.longitude).toFixed(2)}°W
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeverityDistribution;
