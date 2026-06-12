import { MapsCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import {
  Map,
  MapControls,
  MapMarker,
  MapRoute,
  MarkerContent,
} from "@/components/map";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  fetchDrivingRoute,
  geocodeAddress,
  type DrivingRoute,
  type LngLat,
} from "@/lib/geo";

type Endpoint = {
  label: string;
  address: string;
};

type RouteMapProps = {
  origin: Endpoint;
  destination: Endpoint;
  className?: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      origin: LngLat;
      destination: LngLat;
      route: DrivingRoute;
    };

const ROUTE_COLOR = "#0d9479";
const BOX_CLASSES = "h-36 w-full overflow-hidden rounded-2xl";

type Bounds = [LngLat, LngLat];

function boundsOf(coordinates: LngLat[]): Bounds {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of coordinates) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function RouteMap({ origin, destination, className }: RouteMapProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    async function load() {
      const [originCoord, destCoord] = await Promise.all([
        geocodeAddress(origin.address),
        geocodeAddress(destination.address),
      ]);
      if (cancelled) return;
      if (!originCoord || !destCoord) {
        setState({ status: "error" });
        return;
      }
      const route = await fetchDrivingRoute(originCoord, destCoord);
      if (cancelled) return;
      if (!route) {
        setState({ status: "error" });
        return;
      }
      setState({
        status: "ready",
        origin: originCoord,
        destination: destCoord,
        route,
      });
    }

    load().catch(() => {
      if (!cancelled) setState({ status: "error" });
    });

    return () => {
      cancelled = true;
    };
  }, [origin.address, destination.address]);

  if (state.status === "loading") {
    return <Skeleton className={cn(BOX_CLASSES, className)} />;
  }

  if (state.status === "error") {
    return (
      <div
        aria-label="Mapa do trajeto indisponível"
        className={cn(
          "grid place-items-center bg-slate-100 text-muted-foreground",
          BOX_CLASSES,
          className,
        )}
      >
        <div className="flex flex-col items-center gap-1 text-[11px]">
          <HugeiconsIcon icon={MapsCircle01Icon} size={28} strokeWidth={1.5} />
          Mapa indisponível
        </div>
      </div>
    );
  }

  const bounds = boundsOf(state.route.coordinates);
  const distance = state.route.distanceKm.toFixed(1).replace(".", ",");
  const duration = Math.round(state.route.durationMin);

  return (
    <div className={cn("relative", BOX_CLASSES, className)}>
      <Map
        className="size-full"
        bounds={bounds}
        fitBoundsOptions={{ padding: 32 }}
      >
        <MapControls />
        <MapRoute
          coordinates={state.route.coordinates}
          color={ROUTE_COLOR}
          width={4}
          opacity={0.85}
        />
        <MapMarker longitude={state.origin[0]} latitude={state.origin[1]}>
          <MarkerContent>
            <span
              title={origin.label}
              className="block size-3.5 rounded-full border-2 border-white bg-primary shadow"
            />
          </MarkerContent>
        </MapMarker>
        <MapMarker
          longitude={state.destination[0]}
          latitude={state.destination[1]}
        >
          <MarkerContent>
            <span
              title={destination.label}
              className="block size-3.5 rounded-full border-2 border-white bg-foreground shadow"
            />
          </MarkerContent>
        </MapMarker>
      </Map>
      <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-card/90 px-2 py-1 text-[10px] font-bold text-foreground shadow-sm backdrop-blur-sm">
        {distance} km · {duration} min
      </span>
    </div>
  );
}
