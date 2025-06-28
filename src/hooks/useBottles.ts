import { useState, useEffect } from 'react';
import { Bottle } from '../types/Bottle';

const STORAGE_KEY = 'message-bottles';

export const useBottles = () => {
  const [bottles, setBottles] = useState<Bottle[]>([]);

  useEffect(() => {
    loadBottles();
  }, []);

  const loadBottles = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedBottles: Bottle[] = JSON.parse(stored).map((bottle: any) => ({
          ...bottle,
          createdAt: new Date(bottle.createdAt),
          unlockDate: new Date(bottle.unlockDate),
          isUnlocked: new Date() >= new Date(bottle.unlockDate)
        }));
        setBottles(parsedBottles);
      }
    } catch (error) {
      console.error('Error loading bottles:', error);
    }
  };

  const saveBottles = (newBottles: Bottle[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBottles));
      setBottles(newBottles);
    } catch (error) {
      console.error('Error saving bottles:', error);
    }
  };

  const addBottle = (bottle: Bottle) => {
    const newBottles = [...bottles, bottle];
    saveBottles(newBottles);
  };

  const deleteBottle = (id: string) => {
    const newBottles = bottles.filter(bottle => bottle.id !== id);
    saveBottles(newBottles);
  };

  const unlockBottle = (id: string) => {
    const newBottles = bottles.map(bottle =>
      bottle.id === id ? { ...bottle, isUnlocked: true } : bottle
    );
    saveBottles(newBottles);
  };

  const refreshBottleStatus = () => {
    const now = new Date();
    const updatedBottles = bottles.map(bottle => ({
      ...bottle,
      isUnlocked: bottle.isUnlocked || now >= bottle.unlockDate
    }));
    
    const hasChanges = updatedBottles.some((bottle, index) => 
      bottle.isUnlocked !== bottles[index].isUnlocked
    );
    
    if (hasChanges) {
      saveBottles(updatedBottles);
    }
  };

  return {
    bottles,
    addBottle,
    deleteBottle,
    unlockBottle,
    refreshBottleStatus
  };
};