import { useState, useEffect } from 'react';

const LogoLoading = () => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0; // Reset for continuous loop
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900">
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary-400 rounded-full animate-pulse opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Main content container */}
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Logo integrated into circular design */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 rounded-full opacity-20 blur-xl animate-pulse"></div>

                         {/* Rotating rings with logo in center */}
             <div className="relative flex items-center justify-center">
               <div className="w-32 h-32 border-2 border-primary-400/30 rounded-full animate-spin-slow"></div>
               <div className="absolute w-40 h-40 border border-primary-300/20 rounded-full animate-spin-reverse"></div>
               
               {/* Logo in the center */}
               <div className="absolute w-24 h-24 flex items-center justify-center">
                 <img 
                   src="/logo.png" 
                   alt="logo" 
                   className="w-24 h-24 object-contain"
                   style={{ transition: 'none' }}
                 />
               </div>
             </div>
          </div>

          {/* Enhanced loading dots */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="relative">
                <div
                  className="w-3 h-3 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-bounce opacity-80"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.4s'
                  }}
                />
                <div
                  className="absolute inset-0 w-3 h-3 bg-primary-400 rounded-full animate-ping opacity-30"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Orbital elements */}
          <div className="absolute -top-20 -left-20">
            <div className="w-8 h-8 border-2 border-primary-400/40 rounded-full animate-orbit-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20">
            <div className="w-6 h-6 border border-primary-300/40 rounded-full animate-orbit-2">
              <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="absolute top-16 -right-24">
            <div className="w-4 h-4 bg-primary-500/30 rounded-full animate-float"></div>
          </div>

          <div className="absolute -bottom-16 -left-24">
            <div className="w-3 h-3 bg-primary-400/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes orbit-1 {
          0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
        }
        
        @keyframes orbit-2 {
          0% { transform: rotate(0deg) translateX(25px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(25px) rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        
        .animate-orbit-1 {
          animation: orbit-1 4s linear infinite;
        }
        
        .animate-orbit-2 {
          animation: orbit-2 5s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default LogoLoading;