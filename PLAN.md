wygląd sklepu

Marka: LuxeBag
Hasło: Torebki, które podkreślają Twój styl

Na górze:

pasek „Darmowa dostawa od 199 zł | 30 dni na zwrot”
elegancki navbar z logo
Kategorie, Nowości, Bestsellery, O nas, Kontakt
wyszukiwarka
konto, ulubione i koszyk
przełącznik jasny/ciemny, zgodnie z AGENTS.md
Hero

Duże, niemal fotograficzne hero z kremową torebką ustawioną na kamiennym podeście.

Tekst:

NOWA KOLEKCJA
Torebki, które podkreślają Twój styl

Zobacz kolekcję + Bestsellery

Po prawej subtelna karta opinii klientki oraz delikatny efekt świetlny reagujący na ruch myszy.

Kategorie

Zamiast prostych etykiet ze zdjęcia referencyjnego proponuję większe interaktywne karty:

Kategoria	Przykład
Torebki typu worek	12 modeli
Torebki z klapką	18 modeli
Torebki na ramię	24 modele
Torebki listonoszki	16 modeli
Torby shopper	17 modeli

Po najechaniu zdjęcie delikatnie przybliża się, pojawia się strzałka i karta przechodzi w bardziej elegancki ton.

Dalej na stronie

Proponuję sekcje:

Bestsellery
4–8 produktów z ceną, kolorem, ulubionymi i szybkim dodaniem do koszyka.

Nowości
Duże, editorialowe zdjęcia produktów.

Wybierz według stylu
Minimalistyczne / Eleganckie / Codzienne / Na wieczór / Do pracy.

Dlaczego LuxeBag?

Darmowa dostawa
30 dni na zwrot
Bezpieczne płatności
Gwarancja jakości

Newsletter w stylu ekskluzywnego magazynu modowego.

Mobile

Menu wysuwane płynnie z lewej strony, z dużym logo, kategoriami, ulubionymi, koszykiem i przyciskiem logowania — dokładnie zgodnie z wymaganiem w AGENTS.md.

Warstwa techniczna

Architekturę zaprojektowałbym mniej więcej tak:

app/
├── (shop)/
│   ├── page.tsx
│   ├── kolekcje/
│   ├── produkt/[slug]/
│   ├── koszyk/
│   └── checkout/
├── api/                    # tylko tam, gdzie Server Action nie wystarczy
├── actions/
├── components/
│   ├── navbar/
│   ├── hero/
│   ├── products/
│   ├── categories/
│   ├── cart/
│   └── ui/
├── lib/
│   ├── firebase/
│   ├── validation/
│   └── business/
└── public/
    ├── data/
    └── images/

Dane przykładowe powinny znajdować się w public/data/, a obrazy w public/images/, zgodnie z zasadami projektu.

Efekt wizualny

Przygotowałem również wizualną koncepcję strony w tym kierunku:

Otwórz wizualny projekt strony

Najciekawszym elementem będzie moim zdaniem WebGL shader w hero: bardzo delikatna siatka + gradienty + spotlight przesuwający się za kursorem. Dzięki temu strona będzie wyglądała bardziej jak współczesny butik premium niż typowy sklep internetowy, jednocześnie pozostając zgodna z wymaganiami AGENTS.md.

Przy implementacji należy też rozpocząć od sprawdzenia aktualnej dokumentacji Next.js znajdującej się w node_modules/next/dist/docs/, a następnie przed zadaniem wykonać type-check, lint i kontrolę hydratacji/App Routera — to jest wyraźnie wymagane przez AGENTS.md.