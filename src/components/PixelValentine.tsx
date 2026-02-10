"use client";

import { useState, useEffect, useRef } from 'react';
import { Music, VolumeX, Settings } from 'lucide-react';

interface Slide {
  id: string;
  background: string;
  content: React.ReactNode;
  buttons?: Array<{
    text: string;
    nextSlide: string | ((state: any) => string);
    variant?: 'primary' | 'secondary';
  }>;
  autoAdvance?: {
    delay: number;
    nextSlide: string;
  };
  soundEffect?: string;
}


const CHARACTER_OPTIONS = [
  {
    id: 'char1',
    name: 'Таня',
    image: '/tanya.png', // ← PNG из public
  },
];



const BACKGROUND_THEMES = [
  { id: 'default', name: 'Стандартная', colors: { pink: '#ffb3d9', blue: '#2d3561' } },
  { id: 'warm', name: 'Теплая', colors: { pink: '#ffcc99', blue: '#663333' } },
  { id: 'cold', name: 'Холодная', colors: { pink: '#ccddff', blue: '#1a2a4a' } },
  { id: 'pastel', name: 'Пастель', colors: { pink: '#ffe5ec', blue: '#d4a5a5' } },
];

const PERS_BY_FLOWER: Record<'pink' | 'white' | 'blue', string> = {
  pink: '/pers-pink.png',
  white: '/pers-white.png',
  blue: '/pers-blue.png',
};

const getPersSrcByFlower = (flower: 'pink' | 'white' | 'blue') => PERS_BY_FLOWER[flower];


export function PixelValentine() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
const [bgmStarted, setBgmStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState('slide1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const [envelopeOpened, setEnvelopeOpened] = useState(false); // ОДИН РАЗ

  const [selectedPath, setSelectedPath] = useState<'left' | 'right' | null>(null);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const [musicEnabled, setMusicEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [bearDistracted, setBearDistracted] = useState(false);
  const [bunnyFreed, setBunnyFreed] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(BACKGROUND_THEMES[0]);

const ensureBgmStarted = async () => {
  const el = bgmRef.current;
  if (!el) return;
  if (bgmStarted) return;

  try {
    el.loop = true;
    el.volume = 0.35;
    await el.play();
    setBgmStarted(true);
    setMusicEnabled(true);
  } catch {
    // браузер может блокировать до первого клика, это нормально
  }
};

const toggleBgm = async () => {
  const el = bgmRef.current;
  if (!el) return;

  if (!bgmStarted) {
    await ensureBgmStarted();
    return;
  }

  if (el.paused) {
    try {
      await el.play();
      setMusicEnabled(true);
    } catch {}
  } else {
    el.pause();
    setMusicEnabled(false);
  }
};

 const playSound = (soundType: string) => {
  ensureBgmStarted();
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.value = 0.1;
    
    switch (soundType) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;
      case 'transition':
        oscillator.frequency.value = 400;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'success':
        oscillator.frequency.value = 1000;
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'soft':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.4);
        break;
    }
  };

  const goToSlide = (slideId: string) => {
    playSound('transition');
    setIsTransitioning(true);
    setShowButtons(false);
    setTimeout(() => {
      setCurrentSlide(slideId);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    const currentSlideData = slides[currentSlide];
    
    if (currentSlideData.buttons) {
const hasTypewriter =
  currentSlide === 'slide2' ||
  currentSlide === 'slide3' ||
  currentSlide === 'slide4' ||
  currentSlide === 'slide5-left' ||
  currentSlide === 'slide5-right' ||
  currentSlide === 'slide6-left' ||
  currentSlide === 'slide7-left' ||
  currentSlide === 'slide8-left' ||
  currentSlide === 'slide7-right' ||
  currentSlide === 'slide8-right' ||
  currentSlide === 'slide6-1' ||
  currentSlide === 'slide6-2' ||
  currentSlide === 'slide6-3';
      
      if (!hasTypewriter && !isTransitioning) {
        setTimeout(() => setShowButtons(true), 100);
      }
    }
  }, [currentSlide, isTransitioning]);

  const slides: Record<string, Slide> = {
    slide1: {
      id: 'slide1',
  background: 'intro-image-bg',
        content: (
        <div className="slide-content">
          <div className="falling-petals">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="petal"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
          <h1 className="pixel-text welcome-text">💗💗💗Тане💗💗💗</h1>
        </div>
      ),
      buttons: [{ text: 'Старт', nextSlide: 'slide2', variant: 'primary' }],
    },
    slide2: {
      id: 'slide2',
      background: 'adventure-bg',
      content: (
        <div className="slide-content">
              <div className="text-gradient-backdrop" />
          <div className="horizon-line" />
          <TypewriterText
            text="Ты готова к приключению?"
            onComplete={() => setTimeout(() => setShowButtons(true), 1500)}
          />
        </div>
      ),
      buttons: [
        { text: 'ДА!', nextSlide: 'slide2-5', variant: 'primary' },
        { text: 'Нет...', nextSlide: 'slide3', variant: 'secondary' },
      ],
    },
'slide2-5': {
  id: 'slide2-5',
  background: 'adventure-bg',
  content: (
    <div className="slide-content slide2-5-scene">
      <div className="slide2-5-gradient" />
      <div className="horizon-line" />

      <div className="slide2-5-title">
        <TypewriterText
          text="Выбери персонажа"
          onComplete={() => setTimeout(() => setShowButtons(true), 500)}
        />
      </div>

      {showButtons && (
        <div className="character-selection-fullbody slide2-5-characters">
          {CHARACTER_OPTIONS.map((char) => (
            <div
              key={char.id}
              className={`character-fullbody ${selectedCharacter === char.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedCharacter(char.id);
                playSound('click');
              }}
            >
              <img src={char.image} alt={char.name} className="character-png" />
            </div>
          ))}
        </div>
      )}
    </div>
  ),
  buttons: selectedCharacter
    ? [{ text: 'Продолжить', nextSlide: 'slide4', variant: 'primary' }]
    : undefined,
},
    slide3: {
      id: 'slide3',
      background: 'intro-image-bg',
      content: (
        
<div className="slide-content slide3-center">
  <div className="horizon-line" />
  <div className="firefly" />

  <img
    src="/sad.gif" // или png, если передумаешь
    alt="sad moment"
    className="slide3-gif"
    draggable={false}
  />

  <TypewriterText
    text="Ну ладно. А всё-таки?"
    onComplete={() => setTimeout(() => setShowButtons(true), 800)}
  />
</div>
      ),
      buttons: [
        { text: '♡ Да...', nextSlide: 'slide2-5', variant: 'primary' },
      ],
    },
    slide4: {
      id: 'slide4',
background: 'fork-bg',      
content: (
        <div className="slide-content">
          <div className="intro-text-container">
                      <div className="vn-focus">
            <TypewriterText
              text="Ты открываешь глаза и видишь развилку..."
              onComplete={() => {
                setTimeout(() => {
                  const container = document.querySelector('.fork-container') as HTMLElement;
                  if (container) container.style.opacity = '1';
                }, 500);
              }}
            /></div>
          </div>
          <div className="fork-container" style={{ opacity: 0, transition: 'opacity 1s ease' }}>
            <div
              className="path-left pixel-forest-preview"
              onClick={() => {
                setSelectedPath('left');
                playSound('soft');
                goToSlide('slide5-left');
              }}
            >
              <div className="forest-trees" />
              <div className="red-glow" />
            </div>
            <div className="path-divider" />
            <div
              className="path-right pixel-meadow-preview"
              onClick={() => {
                setSelectedPath('right');
                playSound('soft');
                goToSlide('slide5-right');
              }}
            >
              <div className="meadow-flowers" />
              <div className="meadow-butterflies">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="butterfly" style={{ animationDelay: `${i * 0.5}s` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="fork-hint">
            <div className="arrow-left">←</div>
            <div className="arrow-right">→</div>
          </div>
          <p className="whisper-text">...куда пойдёшь?</p>
        </div>
      ),
    },
    'slide5-left': {
      id: 'slide5-left',
      background: 'lost-bg',
      content: (
        <div className="slide-content">
 <div className="pixel-character-img trembling">
  <img src="/chel.png" alt="lost character" className="pixel-character-png" />
</div>
<div className="dialogue-box">
            <TypewriterText
              text="Я заблудился 🥺 Помоги мне добраться до дома..."
              onComplete={() => {
                setTimeout(() => {
                  const dialogueBox = document.querySelector('.dialogue-box');
                  setTimeout(() => setShowButtons(true), 1500);
                }, 1500);
              }}
            />
          </div>
          <TypewriterText
            text=""
            onComplete={() => setTimeout(() => setShowButtons(true), 800)}
          />
        </div>
      ),
      buttons: [{ text: 'Пойдем вместе', nextSlide: 'slide6-left', variant: 'primary' }],
    },
    'slide6-left': {
      id: 'slide6-left',
      background: 'dark-forest-close',
content: (
  <div className="slide-content">
    {/* Медведь всегда существует, меняется только класс */}
    <div className={`pixel-bear ${bearDistracted ? 'walking-away' : 'trembling'}`}>
      <img src="/bear.png" alt="bear" />
    </div>

    {!bearDistracted && (
      <>
         <div
      className={`pixel-meat ${bearDistracted ? 'glow-strong' : ''}`}
      onClick={() => {
        setBearDistracted(true);
        playSound('success');
        setTimeout(() => setShowButtons(true), 2000);
      }}
    >
      <img src="/meat.png" alt="meat" />
    </div>
              <div className="dialogue-box">
            <TypewriterText
              text="На нас напал МЕДВЕДЬ!"
              onComplete={() => {
                setTimeout(() => {
                  const dialogueBox = document.querySelector('.dialogue-box');
                  if (dialogueBox) {
                    dialogueBox.innerHTML = '<p class="pixel-text typewriter">Его нужно отвлечь. Что же делать?</p>';
                  }
                  setTimeout(() => setShowButtons(true), 1500);
                }, 1500);
              }}
            />
          </div>
  <TypewriterText text="" />
    <TypewriterText text=" " />
  </>
)}

    {bearDistracted && (
      <>
        <div className="paw-prints" />
        <TypewriterText
          text="Медведь уходит..."
          onComplete={() => setTimeout(() => setShowButtons(true), 1000)}
        />
      </>
    )}
  </div>
),
      buttons: bearDistracted
        ? [{ text: 'Идти дальше', nextSlide: 'slide7-left', variant: 'primary' }]
        : undefined,
    },
    'slide7-left': {
      id: 'slide7-left',
      background: 'calm-bg',
      content: (
        <div className="slide-content">
          <div className="light-rays" />
          <div className="firefly" style={{ top: '50%', left: '50%' }} />
          <div className="dialogue-box">
            <TypewriterText
              text="Страшно?"
              onComplete={() => {
                setTimeout(() => {
                  const dialogueBox = document.querySelector('.dialogue-box');
                  if (dialogueBox) {
                    dialogueBox.innerHTML = '<p class="pixel-text typewriter">С тобой - нет...</p>';
                  }
                  setTimeout(() => setShowButtons(true), 1500);
                }, 1500);
              }}
            />
          </div>
        </div>
      ),
      buttons: [{ text: 'Продолжить', nextSlide: 'slide8-left', variant: 'primary' }],
    },
    'slide8-left': {
      id: 'slide8-left',
      background: 'thorns-png',
      content: (
        <idv className="slide-content">
          <div className="vn-focus">
      <TypewriterText
            text="Вы проходите сквозь лес..."
            onComplete={() => setTimeout(() => setShowButtons(true), 800)}
          />

</div>
            
        </idv>
      ),
      buttons: [{ text: 'Идти', nextSlide: 'slide9', variant: 'primary' }],
    },
'slide5-right': {
  id: 'slide5-right',
  background: 'right-turn-bg',
  content: (
    <div className="slide-content slide5-right-scene">
      <div className="falling-petals">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="petal pink"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${6 + Math.random() * 3}s`,
              opacity: 0.5 + Math.random() * 0.4,
              transform: `scale(${0.7 + Math.random() * 0.6})`,
            }}
          />
        ))}
      </div>

      <img
        src="/pers.png"
        alt="character"
        className="slide5-right-character"
        draggable={false}
      />

      <div className="dialogue-box">
        <TypewriterText
          text="Пойдём, покажу кое-что..."
          onComplete={() => setTimeout(() => setShowButtons(true), 800)}
        />
      </div>
    </div>
  ),
  buttons: [{ text: 'Идти', nextSlide: 'slide6-right', variant: 'primary' }],
},
'slide6-right': {
  id: 'slide6-right',
  background: 'slide6-right-bg',
  content: (
    <div className="slide-content">
      <div className="flower-choices">
        <button
          className="flower-btn"
          onClick={() => {
            setSelectedFlower('pink');
            playSound('soft');
            goToSlide('slide6-1');
          }}
          aria-label="Pink flower"
          type="button"
        >
          <img src="/flower-pink.png" alt="pink flower" draggable={false} />
        </button>

        <button
          className="flower-btn"
          onClick={() => {
            setSelectedFlower('white');
            playSound('soft');
            goToSlide('slide6-2');
          }}
          aria-label="White flower"
          type="button"
        >
          <img src="/flower-white.png" alt="white flower" draggable={false} />
        </button>

        <button
          className="flower-btn"
          onClick={() => {
            setSelectedFlower('blue');
            playSound('soft');
            goToSlide('slide6-3');
          }}
          aria-label="Blue flower"
          type="button"
        >
          <img src="/flower-blue.png" alt="blue flower" draggable={false} />
        </button>
      </div>

      <p className="whisper-text">Смотри какие красивые...</p>
    </div>
  ),
},

'slide6-1': {
  id: 'slide6-1',
  background: 'slide6-right-bg',
  content: (
    <div className="slide-content">
      <img
        src={getPersSrcByFlower('pink')}
        alt="pers pink"
        className="slide6-pers"
        draggable={false}
      />

      <div className="dialogue-box">
        <TypewriterText
          text="Спасибо, мне идет!"
          onComplete={() => setTimeout(() => setShowButtons(true), 600)}
        />
      </div>
    </div>
  ),
  buttons: [{ text: 'Продолжить', nextSlide: 'slide7-right', variant: 'primary' }],
},

'slide6-2': {
  id: 'slide6-2',
  background: 'slide6-right-bg',
  content: (
    <div className="slide-content">
      <img
        src={getPersSrcByFlower('white')}
        alt="pers white"
        className="slide6-pers"
        draggable={false}
      />

      <div className="dialogue-box">
        <TypewriterText
          text="Спасибо, мне идет!"
          onComplete={() => setTimeout(() => setShowButtons(true), 600)}
        />
      </div>
    </div>
  ),
  buttons: [{ text: 'Продолжить', nextSlide: 'slide7-right', variant: 'primary' }],
},

'slide6-3': {
  id: 'slide6-3',
  background: 'slide6-right-bg',
  content: (
    <div className="slide-content">
      <img
        src={getPersSrcByFlower('blue')}
        alt="pers blue"
        className="slide6-pers"
        draggable={false}
      />

      <div className="dialogue-box">
        <TypewriterText
          text="Спасибо, мне идет!"
          onComplete={() => setTimeout(() => setShowButtons(true), 600)}
        />
      </div>
    </div>
  ),
  buttons: [{ text: 'Продолжить', nextSlide: 'slide7-right', variant: 'primary' }],
},

'slide7-right': {
  id: 'slide7-right',
  background: 'slide7-right-bg',
  content: (
    <div className="slide-content">
      {!bunnyFreed && (
        <>
          <button
            type="button"
            className="slide7-cage-btn"
            onClick={() => {
              setBunnyFreed(true);
              playSound('success');
              setTimeout(() => setShowButtons(true), 800);
            }}
            aria-label="Open cage"
          >
            <img
              src="/cage.png"
              alt="cage"
              className="slide7-cage shaking"
              draggable={false}
            />
          </button>

          <p className="whisper-text whisper-bunny">Зайчик в ловушке...</p>
        </>
      )}

      {bunnyFreed && (
        <>
          <img
            src="/bunny-free.png"
            alt="bunny free"
            className="slide7-bunny slide7-bunny-free"
            draggable={false}
          />

   
        </>
      )}
    </div>
  ),
  buttons: bunnyFreed
    ? [{ text: 'Продолжить', nextSlide: 'slide8-right', variant: 'primary' }]
    : undefined,
},
    'slide8-right': {
      id: 'slide8-right',
      background: 'slide8-right-bg',
      content: (
        <div className="slide-content">
          <div className="pixel-chsaracter" style={{ background: selectedCharacter ? CHARACTER_OPTIONS.find(c => c.id === selectedCharacter)?.color : '#000000' }} />
          <div className="dialogue-box">
            <TypewriterText
              text="Тебе туда..."
              onComplete={() => setTimeout(() => setShowButtons(true), 1500)}
            />
          </div>
        </div>
      ),
      buttons: [{ text: 'Идти', nextSlide: 'slide9', variant: 'primary' }],
    },
slide9: {
  id: 'slide9',
  background: 'pink-bg',
  content: (
    <div className="slide-content tree-scene">
      <img
        src="/tree.png"
        alt="tree"
        className="tree-zoom"
        draggable={false}
      />
    </div>
  ),
  autoAdvance: { delay: 3000, nextSlide: 'slide10' },
},
slide10: {
  id: 'slide10',
  background: 'tree-close-bg',
  content: (
    <div className="slide-content letter-scene slide10-petals">
      <div className="falling-petals slide10-falling">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="petal pink"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${7 + Math.random() * 4}s`,
              opacity: 0.6 + Math.random() * 0.35,
              transform: `scale(${0.8 + Math.random() * 0.8})`,
            }}
          />
        ))}
      </div>

<div
  className={`envelope ${envelopeOpened ? 'opened' : 'closed'}`}
  onClick={() => {
    if (!envelopeOpened) {
      setEnvelopeOpened(true);
      setShowButtons(true);
      playSound('success');
    }
  }}
>
  <img
    className="envelope-closed"
    src="/envelope-closed.png"
    alt="closed"
  />
  <img
    className="envelope-open"
    src="/envelope-open.png"
    alt="open"
  />
</div>


      {showButtons && (
        <div className="dialogue-box final">
          <TypewriterText text="Спасибо, что нашла мое письмо. Будешь моей валентинкой?" />
        </div>
      )}
    </div>
  ),
  buttons: showButtons
    ? [
        { text: 'Да ♡', nextSlide: 'slide-yes', variant: 'primary' },
        { text: 'Нет...', nextSlide: 'slide-confirm', variant: 'secondary' },
      ]
    : undefined,
},
    'slide-confirm': {
      id: 'slide-confirm',
      background: 'final-bg',
      content: (
        <div className="slide-content">
          <div className="cherry-blossom-tree">
            <div className="falling-petals">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="petal pink"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="dialogue-box final">
            <TypewriterText
              text="Ты уверена в этом?"
              onComplete={() => setTimeout(() => setShowButtons(true), 1000)}
            />
          </div>
        </div>
      ),
      buttons: [
        { text: 'Да...', nextSlide: 'slide-yes', variant: 'primary' },
        { text: 'Нет, я подумаю', nextSlide: 'slide10', variant: 'secondary' },
      ],
    },
    'slide-yes': {
      id: 'slide-yes',
      background: 'final-bg',
      content: (
<div className="slide-content">
  <div className="slide-content">

  <div className="corner-show">
    <div className="emitter tl">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={`tl-${i}`} className="corner-heart" />
      ))}
    </div>

    <div className="emitter tr">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={`tr-${i}`} className="corner-heart" />
      ))}
    </div>

    <div className="emitter bl">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={`bl-${i}`} className="corner-heart" />
      ))}
    </div>

    <div className="emitter br">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={`br-${i}`} className="corner-heart" />
      ))}
    </div>
  </div>

  {/* дальше твой текущий slide yes */}
  ...
</div>

  <div className="cherry-blossom-tree">
    <div className="falling-petals celebration">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="petal pink"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>

    <div className="heart-explosion">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="pixel-heart"
          style={{ '--angle': `${i * 45}deg` } as React.CSSProperties}
        />
      ))}
    </div>
  </div>

  {/* КОТ СВЕРХУ */}
<img
  src="/cat.gif"
  alt="cat"
  className="final-cat-top"
/>

  <div className="dialogue-box final celebration-text">
    <TypewriterText text="💗 Ура Таня, теперь ты моя валентинка! 💗" />
  </div>
</div>
      ),
    },
  };

  const currentSlideData = slides[currentSlide];

  useEffect(() => {
    if (currentSlideData.autoAdvance) {
      const timer = setTimeout(() => {
        goToSlide(currentSlideData.autoAdvance!.nextSlide);
      }, currentSlideData.autoAdvance.delay);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

useEffect(() => {
  if (currentSlide === 'slide10') {
    setEnvelopeOpened(false);
    setShowButtons(false);
  }
}, [currentSlide]);

  useEffect(() => {
    document.documentElement.style.setProperty('--pixel-pink', selectedTheme.colors.pink);
    document.documentElement.style.setProperty('--pixel-blue', selectedTheme.colors.blue);
  }, [selectedTheme]);

  return (
 <div className="pixel-valentine">
  <audio ref={bgmRef} src="/bgm.mp3" preload="auto" />
      <div className="controls-panel">
<button
  className="control-button"
  onClick={async () => {
    playSound('click');
    await toggleBgm();
  }}
  aria-label="Toggle music"
>
  {musicEnabled ? <Music size={16} /> : <VolumeX size={16} />}
</button>
        
        <button
          className="control-button"
          onClick={() => {
            setShowSettings(!showSettings);
            playSound('click');
          }}
          aria-label="Settings"
        >
          <Settings size={16} />
        </button>
      </div>

      {showSettings && (
        <div className="settings-modal" onClick={() => setShowSettings(false)}>
          <div className="settings-content" onClick={(e) => e.stopPropagation()}>
            <h3>Настройки</h3>
            
            <div className="setting-group">
              <label>Звуки:</label>
              <button
                className={`toggle-button ${soundEnabled ? 'active' : ''}`}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  playSound('click');
                }}
              >
                {soundEnabled ? 'Вкл' : 'Выкл'}
              </button>
            </div>

            <div className="setting-group">
              <label>Тема фона:</label>
              <div className="theme-options">
                {BACKGROUND_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    className={`theme-option ${selectedTheme.id === theme.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedTheme(theme);
                      playSound('click');
                    }}
                  >
                    <div className="theme-preview" style={{ background: `linear-gradient(135deg, ${theme.colors.pink}, ${theme.colors.blue})` }} />
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="close-button" onClick={() => setShowSettings(false)}>
              Закрыть
            </button>
          </div>
        </div>
      )}

 <div
  className={`slide-wrapper ${currentSlideData.background} ${isTransitioning ? 'transitioning' : ''}`}
>
  {currentSlideData.content}
</div>


      {currentSlideData.buttons && showButtons && (
        <div className="button-container">
          {currentSlideData.buttons.map((button, index) => (
            <button
              key={index}
              className={`pixel-button ${button.variant || 'primary'}`}
              onClick={() => {
                playSound('click');
                const nextSlide =
                  typeof button.nextSlide === 'function'
                    ? button.nextSlide({ selectedPath, selectedFlower })
                    : button.nextSlide;
                goToSlide(nextSlide);
              }}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypewriterText({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="pixel-text typewriter">
      {displayText.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </p>
  );
}