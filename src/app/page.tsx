"use client";

import { PixelValentine } from "../components/PixelValentine";

export default function Page() {
  return <PixelValentine />;
}



// =========================================================================
// ▼▼▼ РЕДАКТИРУЙ ТОЛЬКО ЭТОТ СПИСОК ▼▼▼
// =========================================================================
const CHARACTER_OPTIONS = [
  { 
    id: 'char1', 
    name: 'Таня', 
    image: '/tanya.png',           // Путь к PNG персонажа
    background: '/tanya.png',        // Фон для этого персонажа
    text: 'Текст для первого слайда...'
  },
  { 
    id: 'char2', 
    name: '/tanya.png', 
    image: '/tanya,',           // Путь к PNG второго персонажа
    background: '/bg-2.png',        // Фон для второго персонажа
    text: 'Текст про второго...'
  },
  // Ты можешь добавлять сюда новых персонажей
];
// =========================================================================
// ▲▲▲ БОЛЬШЕ НИЧЕГО ТРОГАТЬ НЕ НУЖНО ▲▲▲
// =========================================================================


// --- Этот код сам соберет слайды из твоего списка. Не трогай его. ---
const mySlidesData = CHARACTER_OPTIONS.map(character => ({
  id: character.id,
  background: character.background,
  character: character.image,
  text: character.text,
}));
// ---------------------------------------------------------------------
