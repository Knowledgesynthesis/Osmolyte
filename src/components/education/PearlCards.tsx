import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { pearls } from '@/data';
import { motion } from 'framer-motion';

export const PearlCards = () => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clinical Pearls & Mnemonics</h2>
        <Badge>
          {pearls.length} pearls
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pearls.map((pearl) => {
          const isFlipped = flippedCards.has(pearl.id);

          return (
            <motion.div
              key={pearl.id}
              className="perspective-1000 h-48"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative w-full h-full cursor-pointer"
                onClick={() => toggleCard(pearl.id)}
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card */}
                <div
                  className={`absolute w-full h-full rounded-lg p-4 bg-gradient-to-br ${
                    pearl.category === 'diagnosis'
                      ? 'from-blue-100 to-blue-200'
                      : pearl.category === 'management'
                      ? 'from-emerald-100 to-emerald-200'
                      : pearl.category === 'pitfall'
                      ? 'from-red-100 to-red-200'
                      : 'from-purple-100 to-purple-200'
                  } border-2 ${
                    pearl.category === 'diagnosis'
                      ? 'border-blue-300'
                      : pearl.category === 'management'
                      ? 'border-emerald-300'
                      : pearl.category === 'pitfall'
                      ? 'border-red-300'
                      : 'border-purple-300'
                  } shadow-md flex flex-col justify-between`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                >
                  <div>
                    <Badge variant="default" className="mb-2">
                      {pearl.category}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2">{pearl.title}</h3>
                    {pearl.mnemonic && (
                      <p className="text-sm font-semibold italic">
                        "{pearl.mnemonic}"
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 text-center">
                    Click to flip
                  </p>
                </div>

                {/* Back of card */}
                <div
                  className="absolute w-full h-full rounded-lg p-4 bg-white border-2 border-slate-300 shadow-md overflow-auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {pearl.content}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Level: {pearl.level}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 text-center mt-3">
                    Click to flip back
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
