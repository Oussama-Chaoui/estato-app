import { Id } from "@/common/defs/types";
import useItems, {
  UseItemsHook,
  UseItemsOptions,
  defaultOptions,
  ItemsResponse,
  GridLinkOperator,
} from "@/common/hooks/useItems";
import { CreateOneInput, Property, UpdateOneInput, FURNISHING_STATUS, PROPERTY_STATUS } from "../../defs/types";
import ApiRoutes from "@/common/defs/api-routes";
import useApi, { ApiResponse, FetchApiOptions } from "@/common/hooks/useApi";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

export interface AvailabilityEntry {
  startDate: string;
  endDate: string;
  clientId?: Id;
}

export interface AvailabilityResponse {
  year: number;
  month: number;
  availability: AvailabilityEntry[];
}

export interface SearchPropertiesResponse {
  items: Property[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

export interface UsePropertiesHook
  extends UseItemsHook<Property, CreateOneInput, UpdateOneInput> {
  getAvailability: (
    id: Id,
    year?: number,
    month?: number,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<AvailabilityResponse>>;
  searchPropertiesByfilters: (
    inputs: {
      location?: string;
      checkIn?: Date;
      checkOut?: Date;
      availableFrom?: Date;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      bathrooms?: number;
      amenities?: string[];
      furnishingStatus?: FURNISHING_STATUS;
      websiteFocus?: WEBSITE_FOCUS;
    },
    page?: number,
    pageSize?: number,
    options?: FetchApiOptions
  ) => Promise<ApiResponse<SearchPropertiesResponse>>;
  readAllFeatured: (websiteFocus: WEBSITE_FOCUS | null) => Promise<ItemsResponse<Property>>;
}

export type UseProperties = (
  opts?: UseItemsOptions
) => UsePropertiesHook;

const useProperties: UseProperties = (
  opts: UseItemsOptions = defaultOptions
) => {
  const apiRoutes = ApiRoutes.Properties;
  const useItemsHook = useItems<Property, CreateOneInput, UpdateOneInput>(
    apiRoutes,
    opts
  );
  const fetchApi = useApi();

  const getAvailability = async (
    id: Id,
    year?: number,
    month?: number,
    options?: FetchApiOptions
  ) => {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth() + 1;
    const endpoint =
      apiRoutes.Availability.replace("{id}", id.toString()) +
      `?year=${y}&month=${m}`;

    return fetchApi<AvailabilityResponse>(endpoint, {
      method: "GET",
      ...options,
    });
  };

  const searchPropertiesByfilters = async (
    inputs: {
      location?: string;
      checkIn?: Date;
      checkOut?: Date;
      availableFrom?: Date;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
      minArea?: number;
      maxArea?: number;
      bedrooms?: number;
      bathrooms?: number;
      garages?: number;
      floors?: number;
      amenities?: string[];
      furnishingStatus?: FURNISHING_STATUS;
      websiteFocus?: WEBSITE_FOCUS;
    },
    page?: number,
    pageSize?: number,
    options?: FetchApiOptions
  ) => {
    // Build query parameters for pagination
    const queryParams = new URLSearchParams();
    if (page) queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('per_page', pageSize.toString());

    const url = queryParams.toString()
      ? `${apiRoutes.SearchByFilters}?${queryParams.toString()}`
      : apiRoutes.SearchByFilters;

    return fetchApi<SearchPropertiesResponse>(url, {
      method: "POST",
      data: inputs,
      ...options,
    });
  };

  const readAllFeatured = async (websiteFocus: WEBSITE_FOCUS | null) => {
    // Build filter based on website focus
    const filterItems = [
      {
        columnField: 'featured',
        operatorValue: 'equals',
        value: 1,
      },
      {
        columnField: 'status',
        operatorValue: 'isAnyOf',
        value: `${PROPERTY_STATUS.FOR_SALE},${PROPERTY_STATUS.FOR_RENT},${PROPERTY_STATUS.RENTED}`,
      },
    ];

    // Add website focus specific filters
    if (websiteFocus === WEBSITE_FOCUS.DAILY_RENT) {
      filterItems.push({
        columnField: 'daily_price_enabled',
        operatorValue: 'equals',
        value: 1,
      });
    } else if (websiteFocus === WEBSITE_FOCUS.RENT) {
      filterItems.push({
        columnField: 'monthly_price_enabled',
        operatorValue: 'equals',
        value: 1,
      });
    } else if (websiteFocus === WEBSITE_FOCUS.SELLING) {
      filterItems.push({
        columnField: 'sale_price',
        operatorValue: 'gte',
        value: 1,
      });
    }
    // For ALL focus, we filter by featured=true and exclude SOLD properties

    return useItemsHook.readAll(1, 4, undefined, {
      linkOperator: GridLinkOperator.And,
      items: filterItems,
    });
  };

  const hook: UsePropertiesHook = {
    ...useItemsHook,
    getAvailability,
    searchPropertiesByfilters,
    readAllFeatured,
  };

  return hook;
};

export default useProperties;
