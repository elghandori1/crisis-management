import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { EmergencyCase, severityConfig } from "@/data/mockData";

interface MapViewProps {
  cases: EmergencyCase[];
  onCaseClick: (c: EmergencyCase) => void;
}

const createSeverityIcon = (severity: EmergencyCase["severity"]) => {
  const colors: Record<string, string> = {
    critical: "#ef4444",
    severe: "#f97316",
    moderate: "#eab308",
    mild: "#22c55e",
  };
  const color = colors[severity];
  const size = severity === "critical" ? 16 : 12;

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      box-shadow:0 0 ${severity === 'critical' ? '12' : '8'}px ${color}88;
      border:2px solid ${color}cc;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapView = ({ cases, onCaseClick }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [31.6295, -7.9811],
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.MarkerClusterGroup) map.removeLayer(layer);
    });

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });

    cases.forEach((c) => {
      const marker = L.marker([c.latitude, c.longitude], {
        icon: createSeverityIcon(c.severity),
      });

      const sev = severityConfig[c.severity];
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px;">
          <div style="font-size:11px;font-weight:700;margin-bottom:6px;">${sev.emoji} ${sev.label.toUpperCase()}</div>
          <div style="font-size:12px;font-weight:600;margin-bottom:4px;">${c.placeName}</div>
          <div style="font-size:11px;color:#999;">Age ${c.patientAge} · ${c.signsAndSymptoms.slice(0, 2).join(", ")}</div>
          <div style="font-size:10px;color:#666;margin-top:4px;font-family:JetBrains Mono,monospace;">${c.id}</div>
        </div>
      `);

      marker.on("click", () => onCaseClick(c));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
  }, [cases, onCaseClick]);

  return <div ref={containerRef} className="w-full h-full rounded-lg" />;
};

export default MapView;
