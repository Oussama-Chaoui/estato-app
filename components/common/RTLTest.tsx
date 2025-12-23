'use client';

import { useDirection } from '@/common/contexts/DirectionContext';
import { useRTLIcon } from '@/common/utils/rtl';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const RTLTest = () => {
  const { direction, isRTL } = useDirection();
  const { flipIcon, getArrowClass } = useRTLIcon();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">RTL Test Component</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Current Direction:</p>
          <p className="font-semibold">{direction.toUpperCase()} {isRTL ? '(RTL)' : '(LTR)'}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Directional Icons:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowLeft className={flipIcon("w-5 h-5")} />
              <span>Left Arrow</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className={flipIcon("w-5 h-5")} />
              <span>Right Arrow</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Navigation Icons:</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ChevronLeft className={`w-5 h-5 ${getArrowClass('left')}`} />
              <span>Previous</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className={`w-5 h-5 ${getArrowClass('right')}`} />
              <span>Next</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Positioning Test:</p>
          <div className="relative h-20 bg-gray-100 rounded border">
            <div className="absolute top-2 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              Left Position
            </div>
            <div className="absolute top-2 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs">
              Right Position
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2">Text Alignment:</p>
          <div className="space-y-2">
            <p className="text-left bg-gray-100 p-2 rounded">Left aligned text</p>
            <p className="text-right bg-gray-100 p-2 rounded">Right aligned text</p>
            <p className="text-center bg-gray-100 p-2 rounded">Center aligned text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTLTest;
