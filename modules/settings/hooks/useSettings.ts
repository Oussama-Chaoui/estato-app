import { useCallback, useEffect, useState, useRef } from 'react';
import useApi from '@/common/hooks/useApi';
import { WEBSITE_FOCUS, WebsiteFocusResponse, SettingsState } from '../defs/types';
import SettingsApiRoutes from '../defs/api-routes';

const useSettings = () => {
  const [state, setState] = useState<SettingsState>({
    websiteFocus: null,
    isLoading: true,
    error: null,
  });

  const fetchApi = useApi();
  const hasInitialized = useRef(false);

  const fetchWebsiteFocus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetchApi<WebsiteFocusResponse>(
        SettingsApiRoutes.GetWebsiteFocus,
        { verbose: false }
      );

      if (response.success && response.data?.websiteFocus) {
        setState(prev => ({
          ...prev,
          websiteFocus: response.data?.websiteFocus as WEBSITE_FOCUS,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.errors?.[0] || 'Failed to fetch website focus',
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Settings error:', error);
      setState(prev => ({
        ...prev,
        error: 'An unexpected error occurred',
        isLoading: false,
      }));
    }
  }, [fetchApi]);

  const setWebsiteFocus = useCallback(async (focus: WEBSITE_FOCUS) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Find the existing setting first
      const readResponse = await fetchApi<{ items: any[] }>(
        SettingsApiRoutes.ReadAll,
        { verbose: false }
      );

      if (readResponse.success && readResponse.data?.items) {
        const websiteFocusSetting = readResponse.data.items.find(
          (setting: any) => setting.key === 'website_focus'
        );

        if (websiteFocusSetting) {
          // Update existing setting
          const updateResponse = await fetchApi(
            SettingsApiRoutes.UpdateOne.replace('{id}', websiteFocusSetting.id.toString()),
            {
              method: 'PUT',
              data: { value: focus },
              verbose: false,
            }
          );

          if (updateResponse.success) {
            setState(prev => ({
              ...prev,
              websiteFocus: focus,
              isLoading: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              error: updateResponse.errors?.[0] || 'Failed to update website focus',
              isLoading: false,
            }));
          }
        } else {
          // Create new setting
          const createResponse = await fetchApi(
            SettingsApiRoutes.CreateOne,
            {
              method: 'POST',
              data: { key: 'website_focus', value: focus },
              verbose: false,
            }
          );

          if (createResponse.success) {
            setState(prev => ({
              ...prev,
              websiteFocus: focus,
              isLoading: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              error: createResponse.errors?.[0] || 'Failed to create website focus setting',
              isLoading: false,
            }));
          }
        }
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to read settings',
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'An unexpected error occurred',
        isLoading: false,
      }));
    }
  }, [fetchApi]);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchWebsiteFocus();
    }
  }, []); // Empty dependency array

  return {
    ...state,
    refetch: fetchWebsiteFocus,
    setWebsiteFocus,
  };
};

export default useSettings; 