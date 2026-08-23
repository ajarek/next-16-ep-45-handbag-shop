"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";

/**
 * Hook do odczytu i zapisu wartości w localStorage.
 * Wykorzystuje useSyncExternalStore — bezpieczny dla SSR (zwraca initialValue po stronie serwera)
 * i nie powoduje ostrzeżeń o setState w useEffect (React 19).
 *
 * @param key - klucz w localStorage
 * @param initialValue - wartość domyślna (zwracana po stronie serwera i przy braku zapisu)
 * @returns [value, setValue] — aktualna wartość i funkcja do jej aktualizacji
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  // Zbiór callbacków nasłuchujących zmian (subskrybentów useSyncExternalStore)
  const callbacks = useRef(new Set<() => void>());

  // Cache: przechowujemy surowy string i sparsowaną wartość,
  // aby getSnapshot zwracał tę samą referencję, gdy dane się nie zmieniły.
  const cacheRef = useRef<{ raw: string | null; parsed: T }>({
    raw: undefined as unknown as string | null,
    parsed: initialValue,
  });

  // Powiadom wszystkich subskrybentów o zmianie
  const emitChange = useCallback(() => {
    callbacks.current.forEach((cb) => cb());
  }, []);

  // Subskrypcja na zdarzenia storage (zmiany z innych kart przeglądarki)
  const subscribe = useCallback(
    (callback: () => void) => {
      callbacks.current.add(callback);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) callback();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        callbacks.current.delete(callback);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key],
  );

  // Odczyt aktualnej wartości z localStorage (wywoływany przez useSyncExternalStore).
  // Wynik jest cacheowany — zwraca tę samą referencję, gdy surowy string się nie zmienił,
  // co zapobiega nieskończonej pętli re-renderów.
  const getSnapshot = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      const cached = cacheRef.current;

      if (raw === cached.raw) {
        return cached.parsed;
      }

      const parsed = raw ? (JSON.parse(raw) as T) : initialValue;
      cacheRef.current = { raw, parsed };
      return parsed;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  // Wartość zwracana po stronie serwera (bezpieczna dla SSR)
  const getServerSnapshot = useCallback((): T => initialValue, [initialValue]);

  // useSyncExternalStore zarządza re-renderami — nie potrzebujemy useState
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Zapis nowej wartości do localStorage i powiadomienie subskrybentów
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolved = newValue instanceof Function ? newValue(value) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // Ignoruj błędy zapisu (np. quota exceeded)
      }
      emitChange();
    },
    [key, value, emitChange],
  );

  return [value, setValue];
}
