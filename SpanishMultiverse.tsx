import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Map as MapIcon, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  Star, 
  Zap, 
  Target,
  Hash,
  Brain,
  Layers,
  ArrowUp10,
  Sparkles,
  CheckCircle2,
  XCircle,
  Gem
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type GameType = 'hub' | 'numbers' | 'ser-estar' | 'gender' | 'time';

interface Question {
  q: string;
  a: string;
  opts: string[];
  hy: string;
  hint?: string;
}

// --- Data ---

const NUMBERS_DATA: Question[] = [
  { q: "10", a: "Diez", opts: ["Diez", "Dos", "Doce"], hy: "Տասը" },
  { q: "15", a: "Quince", opts: ["Quince", "Cinco", "Cincuenta"], hy: "Տասնհինգ" },
  { q: "20", a: "Veinte", opts: ["Veinte", "Treinta", "Vierte"], hy: "Քսան" },
  { q: "30", a: "Treinta", opts: ["Treinta", "Trece", "Tres"], hy: "Երեսուն" },
  { q: "45", a: "Cuarenta y cinco", opts: ["Cuarenta y cinco", "Cincuenta y cuatro", "Cuarenta"], hy: "Քառասունհինգ" },
  { q: "50", a: "Cincuenta", opts: ["Cincuenta", "Cien", "Cinco"], hy: "Հիսուն" },
  { q: "67", a: "Sesenta y siete", opts: ["Sesenta y siete", "Setenta y seis", "Seis y siete"], hy: "Վաթսունյոթ" },
  { q: "80", a: "Ochenta", opts: ["Ochenta", "Ocho", "Setenta"], hy: "Ութսուն" },
  { q: "100", a: "Cien", opts: ["Cien", "Ciento", "Mil"], hy: "Հարյուր" },
  { q: "125", a: "Ciento veinticinco", opts: ["Ciento veinticinco", "Cinco veinticinco", "Cien veinticinco"], hy: "Հարյուր քսանհինգ" },
  { q: "200", a: "Doscientos", opts: ["Doscientos", "Doscientos mil", "Veintecientos"], hy: "Երկու հարյուր" },
  { q: "500", a: "Quinientos", opts: ["Quinientos", "Cincomil", "Quinientos milk"], hy: "Հինգ հարյուր" },
  { q: "750", a: "Setecientos cincuenta", opts: ["Setecientos cincuenta", "Sietecientos cincuenta", "Setenta cincuenta"], hy: "Յոթ հարյուր հիսուն" },
  { q: "900", a: "Novecientos", opts: ["Novecientos", "Nueveciertos", "Nuevecientos"], hy: "Ինը հարյուր" },
  { q: "1000", a: "Mil", opts: ["Mil", "Milla", "Millón"], hy: "Հազար" }
];

const SER_ESTAR_DATA: Question[] = [
  { q: "Yo ___ feliz hoy.", a: "estoy", opts: ["soy", "estoy"], hy: "Ես այսօր երջանիկ եմ", hint: "Current emotion" },
  { q: "Él ___ de México.", a: "es", opts: ["es", "está"], hy: "Նա Մեքսիկայից է", hint: "Origin" },
  { q: "Nosotros ___ cansados.", a: "estamos", opts: ["somos", "estamos"], hy: "Մենք հոգնած ենք", hint: "Physical state" },
  { q: "La mesa ___ de madera.", a: "es", opts: ["es", "está"], hy: "Սեղանը փայտից է", hint: "Material" },
  { q: "Ustedes ___ en Madrid.", a: "están", opts: ["son", "están"], hy: "Դուք Մադրիդում եք", hint: "Location" },
  { q: "Hoy ___ lunes.", a: "es", opts: ["es", "está"], hy: "Այսօր երկուշաբթի է", hint: "Time/Date" },
  { q: "El coche ___ azul.", a: "es", opts: ["es", "está"], hy: "Մեքենան կապույտ է", hint: "Characteristic" },
  { q: "¿Dónde ___ las llaves?", a: "están", opts: ["son", "están"], hy: "Որտե՞ղ են բանալիները", hint: "Location" },
  { q: "Mi madre ___ enferma.", a: "está", opts: ["es", "está"], hy: "Մայրս հիվանդ է", hint: "Health state" },
  { q: "La fiesta ___ a las 8.", a: "es", opts: ["es", "está"], hy: "Խնջույքը ժամը 8-ին է", hint: "Event occurrence" },
  { q: "Tú ___ muy inteligente.", a: "eres", opts: ["eres", "estás"], hy: "Դու շատ խելացի ես", hint: "Trait" },
  { q: "Madrid ___ en España.", a: "está", opts: ["es", "está"], hy: "Մադրիդը Իսպանիայում է", hint: "Fixed location" },
  { q: "Yo ___ profesor.", a: "soy", opts: ["soy", "estoy"], hy: "Ես ուսուցիչ եմ", hint: "Profession" },
  { q: "La sopa ___ caliente.", a: "está", opts: ["es", "está"], hy: "Ապուրը տաք է", hint: "Condition" },
  { q: "Mis tíos ___ mis amigos.", a: "son", opts: ["son", "están"], hy: "Հորեղբայրներս իմ ընկերներն են", hint: "Relationship" }
];

const GENDER_DATA: Question[] = [
  { q: "La ___ (apple)", a: "Manzana", opts: ["Manzana", "Manzano"], hy: "Խնձոր" },
  { q: "El ___ (book)", a: "Libro", opts: ["Libro", "Libra"], hy: "Գիրք" },
  { q: "La ___ (sun - trap!) No, El ___", a: "Sol", opts: ["Sol", "Sola"], hy: "Արև" },
  { q: "La ___ (hand - trap!)", a: "Mano", opts: ["Mana", "Mano"], hy: "Ձեռք" },
  { q: "El ___ (day - trap!)", a: "Día", opts: ["Día", "Die"], hy: "Օր" },
  { q: "La ___ (map - trap!) No, El ___", a: "Mapa", opts: ["Мапа", "Mapo"], hy: "Քարտեզ" },
  { q: "El ___ (water - trap but use El)", a: "Agua", opts: ["Agua", "Ague"], hy: "Ջուր" },
  { q: "La ___ (table)", a: "Mesa", opts: ["Meso", "Mesa"], hy: "Սեղան" },
  { q: "El ___ (child)", a: "Niño", opts: ["Niño", "Niña"], hy: "Տղա" },
  { q: "La ___ (house)", a: "Casa", opts: ["Caso", "Casa"], hy: "Տուն" },
  { q: "El ___ (cat)", a: "Gato", opts: ["Gato", "Gata"], hy: "Կատու (արական)" },
  { q: "La ___ (cat)", a: "Gata", opts: ["Gato", "Gata"], hy: "Կատու (իգական)" },
  { q: "La ___ (freedom)", a: "Libertad", opts: ["Libertad", "Libertado"], hy: "Ազատություն" },
  { q: "El ___ (problem - trap!)", a: "Problema", opts: ["Problem", "Problema"], hy: "Խնդիր" },
  { q: "La ___ (flower)", a: "Flor", opts: ["Flor", "Floro"], hy: "Ծաղիկ" }
];

const TIME_DATA: Question[] = [
  { q: "01:00", a: "Es la una", opts: ["Es la una", "Son las una", "Es la uno"], hy: "Ժամը մեկն է" },
  { q: "02:00", a: "Son las dos", opts: ["Es las dos", "Son las dos", "Son las doce"], hy: "Ժամը երկուսն է" },
  { q: "03:15", a: "Son las tres y cuarto", opts: ["Son las tres y cuarto", "Son las three y quince", "Son las tres y cuarta"], hy: "Երեքն անց տասնհինգ (երեքն ու քառորդ)" },
  { q: "04:30", a: "Son las cuatro y media", opts: ["Son las cuatro y treinta", "Son las cuatro y media", "Son las cuatro y medio"], hy: "Չորսն անց կես" },
  { q: "05:45", a: "Son las seis menos cuarto", opts: ["Son las cinco y cuarenta y cinco", "Son las seis menos cuarto", "Son las cinco menos cuarto"], hy: "Վեցին քառորդ պակաս" },
  { q: "08:05", a: "Son las ocho y cinco", opts: ["Son las ocho y cinco", "Son las siete y cinco", "Son las ocho menos cinco"], hy: "Ութն անց հինգ" },
  { q: "12:00 (Noon)", a: "Es mediodía", opts: ["Es mediodía", "Es medianoche", "Son las doce"], hy: "Կեսօր է" },
  { q: "00:00 (Midnight)", a: "Es medianoche", opts: ["Es mediodía", "Es medianoche", "Son las doce"], hy: "Կեսգիշեր է" },
  { q: "10:10", a: "Son las diez y diez", opts: ["Son las diez y diez", "Son las diez menos diez", "Son las once y diez"], hy: "Տասն անց տաս" },
  { q: "07:50", a: "Son las ocho menos diez", opts: ["Son las siete y cincuenta", "Son las ocho menos diez", "Son las siete menos diez"], hy: "Ութին տաս պակաս" },
  { q: "09:20", a: "Son las nueve y veinte", opts: ["Son las nueve y veinte", "Son las nueve y media", "Son las ocho y veinte"], hy: "Ինն անց քսան" },
  { q: "11:40", a: "Son las doce menos veinte", opts: ["Son las once y forty", "Son las doce menos veinte", "Son las once menos veinte"], hy: "Տասներկուսին քսան պակաս" },
  { q: "01:30", a: "Es la una y media", opts: ["Es la una y media", "Son las una y media", "Es la una y treinta"], hy: "Մեկն անց կես" },
  { q: "06:15", a: "Son las seis y cuarto", opts: ["Son las seis y cuarto", "Son las seis y quince", "Son las seven y cuarto"], hy: "Վեցն անց քառորդ" },
  { q: "02:55", a: "Son las tres menos cinco", opts: ["Son las dos y cincuenta y five", "Son las tres menos cinco", "Son las two menos cinco"], hy: "Երեքին հինգ պակաս" }
];

// --- Components ---

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export default function SpanishMultiverse() {
  const [activeGame, setActiveGame] = useState<GameType>('hub');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [stats, setStats] = useState({ numbers: 0, serEstar: 0, gender: 0, time: 0 });

  const getActiveData = (): Question[] => {
    switch (activeGame) {
      case 'numbers': return NUMBERS_DATA;
      case 'ser-estar': return SER_ESTAR_DATA;
      case 'gender': return GENDER_DATA;
      case 'time': return TIME_DATA;
      default: return [];
    }
  };

  const activeData = getActiveData();
  const currentEx = activeData[currentIdx];

  const handleAnswer = (answer: string) => {
    if (feedback !== 'none') return;
    
    const isCorrect = answer.toLowerCase() === currentEx.a.toLowerCase();
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 100);
      speak(currentEx.a);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      
      setTimeout(() => {
        if (currentIdx < activeData.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setFeedback('none');
          // Update stats
          setStats(prev => ({
            ...prev,
            [activeGame === 'ser-estar' ? 'serEstar' : activeGame]: Math.max((prev as any)[activeGame === 'ser-estar' ? 'serEstar' : activeGame], currentIdx + 1)
          }));
        } else {
          setStats(prev => ({
            ...prev,
            [activeGame === 'ser-estar' ? 'serEstar' : activeGame]: activeData.length
          }));
          setActiveGame('hub');
          setCurrentIdx(0);
          setFeedback('none');
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback('none'), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-amber-500/30 overflow-x-hidden flex flex-col">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-amber-500/10 blur-[120px] rounded-full" />
      </div>

      <nav className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-3xl px-6 py-4 flex justify-between items-center sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center font-black italic shadow-2xl">M</div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Multiverse<span className="text-amber-500">Quest</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-stone-900 px-6 py-2 rounded-full border border-white/5 flex items-center gap-3">
             <Trophy size={16} className="text-amber-500" />
             <span className="font-black italic text-lg">{score}</span>
          </div>
          {activeGame !== 'hub' && (
             <button 
              onClick={() => { setActiveGame('hub'); setCurrentIdx(0); setFeedback('none'); }}
              className="p-2.5 rounded-full bg-stone-900 border border-white/5 text-stone-400 hover:text-white transition-colors"
             >
               <MapIcon size={18} />
             </button>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col">
          <AnimatePresence mode="wait">
            
            {activeGame === 'hub' && (
              <motion.div 
                key="hub" 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12 py-10"
              >
                <div className="text-center space-y-4">
                   <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                     Spanish <br /> <span className="text-amber-500">Academy</span>
                   </h2>
                   <p className="text-stone-500 font-bold italic uppercase tracking-widest text-sm">Վարպետացե՛ք լեզվի հիմունքներին ինտերակտիվ խաղերի միջոցով</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   <GameCard 
                      icon={<Hash className="text-blue-500" />}
                      title="Números"
                      desc="1-ից 1000 թվերը"
                      progress={stats.numbers}
                      total={15}
                      onClick={() => { setActiveGame('numbers'); setCurrentIdx(0); }}
                   />
                   <GameCard 
                      icon={<Brain className="text-amber-500" />}
                      title="Ser vs Estar"
                      desc="Բայերի ճիշտ օգտագործումը"
                      progress={stats.serEstar}
                      total={15}
                      onClick={() => { setActiveGame('ser-estar'); setCurrentIdx(0); }}
                   />
                   <GameCard 
                      icon={<Layers className="text-emerald-500" />}
                      title="Género"
                      desc="Արական և Իգական սեռեր"
                      progress={stats.gender}
                      total={15}
                      onClick={() => { setActiveGame('gender'); setCurrentIdx(0); }}
                   />
                   <GameCard 
                      icon={<RotateCcw className="text-indigo-500" />}
                      title="La Hora"
                      desc="Ի՞նչ ժամն է:"
                      progress={stats.time}
                      total={15}
                      onClick={() => { setActiveGame('time'); setCurrentIdx(0); }}
                   />
                </div>
              </motion.div>
            )}

            {activeGame !== 'hub' && (
              <motion.div 
                key="game-room"
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                className="flex-1 flex flex-col items-center justify-center gap-12 py-12"
              >
                 <div className="text-center space-y-6 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-amber-500">
                       Room: {activeGame.replace('-', ' ').toUpperCase()} • {currentIdx + 1}/15
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                       {currentEx.q.includes('___') ? (
                         <>
                           {currentEx.q.split('___')[0]}
                           <span className="text-amber-500 underline decoration-stone-800 mx-2">{feedback === 'correct' ? currentEx.a : '___'}</span>
                           {currentEx.q.split('___')[1]}
                         </>
                       ) : currentEx.q}
                    </h2>
                    <p className="text-xl font-bold text-stone-400 italic mb-4">{currentEx.hy}</p>
                    {currentEx.hint && <p className="text-stone-500 italic text-sm">{currentEx.hint}</p>}
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
                    {currentEx.opts.map((opt) => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAnswer(opt)}
                        disabled={feedback !== 'none'}
                        className={`p-8 rounded-[40px] border-4 font-black text-2xl uppercase italic tracking-tighter transition-all ${
                          feedback === 'correct' && opt.toLowerCase() === currentEx.a.toLowerCase()
                            ? 'bg-emerald-600 border-white text-white shadow-3xl scale-110 z-10'
                            : feedback === 'wrong' && opt.toLowerCase() !== currentEx.a.toLowerCase()
                            ? 'bg-red-600 border-white text-white opacity-50'
                            : 'bg-stone-900 border-white/10 hover:border-amber-500/40 text-stone-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </motion.button>
                    ))}
                 </div>

                 <div className="w-full max-w-xl h-1.5 bg-stone-900 rounded-full overflow-hidden mt-8">
                    <motion.div 
                      key={activeGame}
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIdx + 1) / 15) * 100}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-red-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    />
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
      </main>

      {/* Ambient Footer */}
      <footer className="p-8 pb-12 flex flex-col items-center gap-4 opacity-30 mt-auto">
         <Gem size={24} className="text-amber-500 animate-pulse" />
         <p className="text-[10px] font-black uppercase tracking-[1em]">Adventure OS v4.0</p>
      </footer>
    </div>
  );
}

function GameCard({ icon, title, desc, progress, total, onClick }: any) {
  const isComplete = progress === total;
  
  return (
    <motion.button 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-stone-900 border-4 p-8 rounded-[50px] text-left space-y-6 transition-all relative overflow-hidden group shadow-2xl ${isComplete ? 'border-emerald-500/50' : 'border-stone-800 hover:border-amber-500/30'}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
        {isComplete ? <CheckCircle2 className="text-emerald-500" /> : icon}
      </div>
      <div>
        <h3 className="text-2xl font-black italic tracking-tight uppercase leading-none mb-2">{title}</h3>
        <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">{desc}</p>
      </div>
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(progress/total)*100}%` }} />
        </div>
        <div className="flex justify-between items-center">
           <p className="text-[10px] font-black uppercase text-stone-600">{progress}/{total} Done</p>
           {isComplete && <Sparkles size={12} className="text-emerald-500" />}
        </div>
      </div>
    </motion.button>
  );
}
