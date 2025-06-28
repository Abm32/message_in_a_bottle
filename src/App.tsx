import React, { useState, useEffect } from 'react';
import { Bottle as BottleType, CreateBottleData } from './types/Bottle';
import { useBottles } from './hooks/useBottles';
import { processFiles } from './utils/fileUtils';
import { addDaysToDate } from './utils/dateUtils';
import { BottleCard } from './components/BottleCard';
import { CreateBottle } from './components/CreateBottle';
import { ViewBottle } from './components/ViewBottle';
import { Plus, Waves, MessageCircle, Menu } from 'lucide-react';

function App() {
  const { bottles, addBottle, deleteBottle, unlockBottle, refreshBottleStatus } = useBottles();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<BottleType | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Refresh bottle status every minute
    const interval = setInterval(refreshBottleStatus, 60000);
    return () => clearInterval(interval);
  }, [refreshBottleStatus]);

  // Prevent zoom on double tap for iOS
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchend', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  const handleCreateBottle = async (data: CreateBottleData) => {
    const attachments = await processFiles(data.attachments);
    const now = new Date();
    const unlockDate = addDaysToDate(now, data.delayDays);
    
    const bottle: BottleType = {
      id: crypto.randomUUID(),
      title: data.title,
      message: data.message,
      attachments,
      createdAt: now,
      unlockDate,
      isUnlocked: false,
      delayDays: data.delayDays
    };
    
    addBottle(bottle);
  };

  const handleViewBottle = (bottle: BottleType) => {
    if (bottle.isUnlocked) {
      setSelectedBottle(bottle);
    }
  };

  const unlockedBottles = bottles.filter(bottle => bottle.isUnlocked);
  const lockedBottles = bottles.filter(bottle => !bottle.isUnlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 touch-manipulation">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Mobile-optimized Header */}
        <header className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="text-4xl sm:text-5xl animate-bounce flex-shrink-0">🌊</div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold text-slate-100 mb-1 sm:mb-2 truncate">
                    Message in a Bottle
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-lg hidden sm:block">
                    Send messages to your future self
                  </p>
                  <p className="text-slate-400 text-xs sm:hidden">
                    Messages to your future self
                  </p>
                </div>
              </div>
              
              {/* Mobile Create Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base flex-shrink-0"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Create Bottle</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {bottles.length === 0 ? (
              <div className="text-center py-12 sm:py-20 px-4">
                <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 opacity-60">🍾</div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-300 mb-3 sm:mb-4">
                  No bottles yet
                </h2>
                <p className="text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  Create your first message bottle and send a surprise to your future self!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25 mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Create Your First Bottle</span>
                </button>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-12">
                {/* Unlocked Bottles */}
                {unlockedBottles.length > 0 && (
                  <section>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 px-1">
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                        Ready to Read ({unlockedBottles.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {unlockedBottles.map(bottle => (
                        <BottleCard
                          key={bottle.id}
                          bottle={bottle}
                          onView={handleViewBottle}
                          onDelete={deleteBottle}
                          onUnlock={unlockBottle}
                          onStatusChange={refreshBottleStatus}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Locked Bottles */}
                {lockedBottles.length > 0 && (
                  <section>
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 px-1">
                      <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
                        Floating at Sea ({lockedBottles.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {lockedBottles.map(bottle => (
                        <BottleCard
                          key={bottle.id}
                          bottle={bottle}
                          onView={handleViewBottle}
                          onDelete={deleteBottle}
                          onUnlock={unlockBottle}
                          onStatusChange={refreshBottleStatus}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-4 sm:hidden z-40">
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Modals */}
      <CreateBottle
        isVisible={showCreateForm}
        onCreateBottle={handleCreateBottle}
        onClose={() => setShowCreateForm(false)}
      />
      
      <ViewBottle
        bottle={selectedBottle}
        onClose={() => setSelectedBottle(null)}
      />
    </div>
  );
}

export default App;