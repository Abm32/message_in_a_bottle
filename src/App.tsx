import React, { useState, useEffect } from 'react';
import { Bottle as BottleType, CreateBottleData } from './types/Bottle';
import { useBottles } from './hooks/useBottles';
import { processFiles } from './utils/fileUtils';
import { addDaysToDate } from './utils/dateUtils';
import { BottleCard } from './components/BottleCard';
import { CreateBottle } from './components/CreateBottle';
import { ViewBottle } from './components/ViewBottle';
import { Plus, Waves, MessageCircle } from 'lucide-react';

function App() {
  const { bottles, addBottle, deleteBottle, unlockBottle, refreshBottleStatus } = useBottles();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<BottleType | null>(null);

  useEffect(() => {
    // Refresh bottle status every minute
    const interval = setInterval(refreshBottleStatus, 60000);
    return () => clearInterval(interval);
  }, [refreshBottleStatus]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-5xl animate-bounce">🌊</div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-100 mb-2">
                    Message in a Bottle
                  </h1>
                  <p className="text-slate-400 text-lg">
                    Send messages to your future self
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Bottle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {bottles.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6 opacity-60">🍾</div>
                <h2 className="text-2xl font-semibold text-slate-300 mb-4">
                  No bottles yet
                </h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Create your first message bottle and send a surprise to your future self!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/25 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Bottle</span>
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Unlocked Bottles */}
                {unlockedBottles.length > 0 && (
                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <MessageCircle className="w-6 h-6 text-emerald-400" />
                      <h2 className="text-2xl font-bold text-slate-100">
                        Ready to Read ({unlockedBottles.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center space-x-3 mb-6">
                      <Waves className="w-6 h-6 text-cyan-400" />
                      <h2 className="text-2xl font-bold text-slate-100">
                        Floating at Sea ({lockedBottles.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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