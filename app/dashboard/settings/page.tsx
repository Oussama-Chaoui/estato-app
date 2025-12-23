"use client";
import { useSettingsContext } from "@/common/contexts/SettingsContext";
import { WEBSITE_FOCUS } from "@/modules/settings/defs/types";

const SettingsPage = () => {
  const { websiteFocus, isLoading, error, setWebsiteFocus } = useSettingsContext();

  const handleFocusChange = async (focus: WEBSITE_FOCUS) => {
    await setWebsiteFocus(focus);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Website Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Website Focus</h2>
          <p className="text-gray-600 mb-6">
            Control how your website appears to visitors. This setting affects the landing page content and messaging.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(WEBSITE_FOCUS).map((focus) => (
              <button
                key={focus}
                onClick={() => handleFocusChange(focus)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  websiteFocus === focus
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-semibold mb-2">
                  {focus === WEBSITE_FOCUS.DAILY_RENT && 'Daily Rent'}
                  {focus === WEBSITE_FOCUS.RENT && 'Rent'}
                  {focus === WEBSITE_FOCUS.SELLING && 'Selling'}
                  {focus === WEBSITE_FOCUS.ALL && 'All'}
                </div>
                <div className="text-sm text-gray-600">
                  {focus === WEBSITE_FOCUS.DAILY_RENT && 'Vacation rentals and short-term stays'}
                  {focus === WEBSITE_FOCUS.RENT && 'Long-term rental properties'}
                  {focus === WEBSITE_FOCUS.SELLING && 'Properties for sale'}
                  {focus === WEBSITE_FOCUS.ALL && 'All types of properties'}
                </div>
              </button>
            ))}
          </div>
          
          {websiteFocus && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">
                <strong>Current setting:</strong> {websiteFocus}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 