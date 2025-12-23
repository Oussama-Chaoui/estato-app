import { Location } from "../defs/types";
import { getTranslatedText } from "@/modules/properties/utils/translations";
import { ComboboxOption } from "@/components/ui/combobox";

/**
 * Transform locations into combobox options grouped by region
 * This function handles the multilingual structure and deduplicates cities
 */
export function transformLocationsToOptions(
  locations: Location[] | null | undefined,
  getTranslatedText: (text: any, fallback?: string) => string
): ComboboxOption[] {
  if (!locations) return [];
  
  const seen = new Set<string>();
  return locations
    .filter(loc => loc.city && getTranslatedText(loc.city.names)?.trim())
    .sort((a, b) => getTranslatedText(a.city?.names).localeCompare(getTranslatedText(b.city?.names)))
    .filter(loc => {
      const cityName = getTranslatedText(loc.city?.names);
      if (seen.has(cityName)) return false;
      seen.add(cityName);
      return true;
    })
    .map((loc) => ({
      value: getTranslatedText(loc.city?.names),
      label: getTranslatedText(loc.city?.names),
      group: getTranslatedText(loc.city?.region?.names),
    }));
}

/**
 * Get unique cities from locations
 */
export function getUniqueCities(
  locations: Location[] | null | undefined,
  getTranslatedText: (text: any, fallback?: string) => string
): string[] {
  if (!locations) return [];
  
  const seen = new Set<string>();
  return locations
    .filter(loc => loc.city && getTranslatedText(loc.city.names)?.trim())
    .map(loc => getTranslatedText(loc.city?.names))
    .filter(cityName => {
      if (seen.has(cityName)) return false;
      seen.add(cityName);
      return true;
    })
    .sort();
}

/**
 * Get unique regions from locations
 */
export function getUniqueRegions(
  locations: Location[] | null | undefined,
  getTranslatedText: (text: any, fallback?: string) => string
): string[] {
  if (!locations) return [];
  
  const seen = new Set<string>();
  return locations
    .filter(loc => loc.city?.region && getTranslatedText(loc.city.region.names)?.trim())
    .map(loc => getTranslatedText(loc.city?.region?.names))
    .filter(regionName => {
      if (seen.has(regionName)) return false;
      seen.add(regionName);
      return true;
    })
    .sort();
}

/**
 * Get locations grouped by region
 */
export function getLocationsByRegion(
  locations: Location[] | null | undefined,
  getTranslatedText: (text: any, fallback?: string) => string
): Record<string, Location[]> {
  if (!locations) return {};
  
  return locations.reduce((acc, location) => {
    const regionName = getTranslatedText(location.city?.region?.names, 'Unknown Region');
    if (!acc[regionName]) {
      acc[regionName] = [];
    }
    acc[regionName].push(location);
    return acc;
  }, {} as Record<string, Location[]>);
}

/**
 * Get locations for a specific city
 */
export function getLocationsByCity(
  locations: Location[] | null | undefined,
  cityName: string,
  getTranslatedText: (text: any, fallback?: string) => string
): Location[] {
  if (!locations) return [];
  
  return locations.filter(location => 
    getTranslatedText(location.city?.names) === cityName
  );
}

/**
 * Get locations for a specific region
 */
export function getLocationsByRegionName(
  locations: Location[] | null | undefined,
  regionName: string,
  getTranslatedText: (text: any, fallback?: string) => string
): Location[] {
  if (!locations) return [];
  
  return locations.filter(location => 
    getTranslatedText(location.city?.region?.names) === regionName
  );
}
