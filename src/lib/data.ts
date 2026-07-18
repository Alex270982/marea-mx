/* MAREA sample data. All prices, yields and fees are illustrative placeholders.
   Yields are projections, not guarantees. */

import type { Locale } from "@/lib/i18n";

export interface Coords {
  lat: number;
  lng: number;
}

export interface DestinationLocale {
  name: string;
  tagline: string;
  story: string;
  highlights: string[];
  neighborhoods: string[];
  market: string;
}

export interface Destination {
  slug: string;
  coords: Coords;
  mapXY: [number, number];
  image: string;
  count: number;
  en: DestinationLocale;
  es: DestinationLocale;
}

export interface AdvisorLocale {
  role: string;
  bio: string;
}

export interface Advisor {
  id: string;
  image: string;
  name: string;
  whatsapp: string;
  email: string;
  en: AdvisorLocale;
  es: AdvisorLocale;
}

export type ListingStatus = "ready" | "turnkey" | "preconstruction";
export type ListingLabel = "lifestyle" | "investment";
export type ListingType =
  | "penthouse"
  | "apartment"
  | "house"
  | "condo"
  | "villa"
  | "estate"
  | "branded"
  | "preconstruction";

export interface ListingLocale {
  name: string;
  summary: string;
  description: string;
  architecture?: string;
}

export interface Listing {
  slug: string;
  destination: string;
  neighborhood: string;
  type: ListingType;
  image: string;
  priceUSD: number;
  beds: number;
  baths: number;
  areaM2: number;
  status: ListingStatus;
  label: ListingLabel;
  beachfront: boolean;
  furnished: boolean;
  yield: number | null;
  feesUSDmo: number;
  delivery: string | null;
  coords: Coords;
  mapXY: [number, number];
  featured: boolean;
  gallery?: string[];
  en: ListingLocale;
  es: ListingLocale;
}

export interface Poi {
  id: string;
  mapXY: [number, number];
  type: "airport" | "marina" | "beach" | "wellness";
  en: string;
  es: string;
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "cancun",
    coords: { lat: 21.1619, lng: -86.8515 },
    mapXY: [78, 12],
    image: "dest-cancun",
    count: 4,
    en: {
      name: "Cancún",
      tagline: "The established shore",
      story:
        "Cancún is the mature heart of the Mexican Caribbean: an international airport twenty minutes away, marinas, golf, private schools and a waterfront skyline that has quietly grown into real sophistication. Its best addresses face water on both sides, sea at the front, lagoon at the back.",
      highlights: ["International connectivity", "Marina and golf communities", "Established rental market", "Waterfront living"],
      neighborhoods: ["Puerto Cancún", "Zona Hotelera", "Punta Sam", "Residencial Lagunar"],
      market: "Consolidated market with steady institutional-grade inventory and the region's deepest resale liquidity."
    },
    es: {
      name: "Cancún",
      tagline: "La costa consolidada",
      story:
        "Cancún es el corazón maduro del Caribe Mexicano: un aeropuerto internacional a veinte minutos, marinas, golf, colegios privados y un horizonte frente al mar que ha crecido con verdadera sofisticación. Sus mejores direcciones miran al agua por ambos lados, mar al frente y laguna a la espalda.",
      highlights: ["Conectividad internacional", "Comunidades de marina y golf", "Mercado de rentas consolidado", "Vida frente al agua"],
      neighborhoods: ["Puerto Cancún", "Zona Hotelera", "Punta Sam", "Residencial Lagunar"],
      market: "Mercado consolidado con inventario de nivel institucional y la mayor liquidez de reventa de la región."
    }
  },
  {
    slug: "playa-del-carmen",
    coords: { lat: 20.6296, lng: -87.0739 },
    mapXY: [55, 48],
    image: "dest-playa",
    count: 4,
    en: {
      name: "Playa del Carmen",
      tagline: "The walkable cosmopolis",
      story:
        "Playa del Carmen lives on foot: coffee before nine, the sea by ten, dinner three streets from home. A genuinely cosmopolitan town where European café culture meets Caribbean light, with a beachfront that keeps its energy human in scale.",
      highlights: ["Walk-to-everything lifestyle", "Cosmopolitan dining and culture", "Ferry link to Cozumel", "Strong mid-term rental demand"],
      neighborhoods: ["Centro / Quinta", "Playacar", "Coco Beach", "Zazil-Ha"],
      market: "Lifestyle-driven demand with resilient occupancy across vacation and mid-term stays."
    },
    es: {
      name: "Playa del Carmen",
      tagline: "La cosmópolis caminable",
      story:
        "Playa del Carmen se vive a pie: café antes de las nueve, mar a las diez, cena a tres calles de casa. Una ciudad genuinamente cosmopolita donde la cultura de café europea se encuentra con la luz del Caribe, con un frente de playa que mantiene una escala humana.",
      highlights: ["Todo a distancia caminable", "Gastronomía y cultura cosmopolita", "Ferry a Cozumel", "Alta demanda de renta de mediano plazo"],
      neighborhoods: ["Centro / Quinta", "Playacar", "Coco Beach", "Zazil-Ha"],
      market: "Demanda impulsada por estilo de vida, con ocupación resiliente en estancias vacacionales y de mediano plazo."
    }
  },
  {
    slug: "tulum",
    coords: { lat: 20.2114, lng: -87.4654 },
    mapXY: [30, 86],
    image: "dest-tulum",
    count: 4,
    en: {
      name: "Tulum",
      tagline: "Architecture in the jungle",
      story:
        "Tulum turned restraint into an aesthetic: polished concrete under a jungle canopy, pools the color of shadow, architecture that photographs like sculpture. It remains the design capital of the coast, wellness-minded, low-rise and deliberately exclusive.",
      highlights: ["Design-led architecture", "Wellness culture", "Cenotes and biosphere", "New international airport"],
      neighborhoods: ["Aldea Zamá", "La Veleta", "Región 15", "Tankah Bay"],
      market: "Design-premium segment with the region's strongest nightly rates in boutique stock."
    },
    es: {
      name: "Tulum",
      tagline: "Arquitectura en la selva",
      story:
        "Tulum convirtió la sobriedad en estética: concreto pulido bajo el dosel de la selva, albercas color sombra, arquitectura que se fotografía como escultura. Sigue siendo la capital del diseño de la costa, orientada al bienestar, de baja altura y deliberadamente exclusiva.",
      highlights: ["Arquitectura de autor", "Cultura de bienestar", "Cenotes y biosfera", "Nuevo aeropuerto internacional"],
      neighborhoods: ["Aldea Zamá", "La Veleta", "Región 15", "Tankah Bay"],
      market: "Segmento de prima por diseño, con las tarifas nocturnas más altas de la región en inventario boutique."
    }
  }
];

export const ADVISORS: Advisor[] = [
  {
    id: "mariana",
    image: "advisor-mariana",
    name: "Mariana Solís",
    whatsapp: "+52 984 000 0001",
    email: "mariana@marea.mx",
    en: { role: "Senior Advisor, Riviera Maya", bio: "Twelve years advising private buyers across Tulum and Playa del Carmen. Architecture graduate, fluent in English, Spanish and French." },
    es: { role: "Asesora Senior, Riviera Maya", bio: "Doce años asesorando a compradores privados en Tulum y Playa del Carmen. Arquitecta de formación; habla español, inglés y francés." }
  },
  {
    id: "diego",
    image: "advisor-diego",
    name: "Diego Montaño",
    whatsapp: "+52 998 000 0002",
    email: "diego@marea.mx",
    en: { role: "Senior Advisor, Cancún", bio: "Former hotel developer with two decades in the north corridor. Specialist in waterfront and investment acquisitions for international clients." },
    es: { role: "Asesor Senior, Cancún", bio: "Ex desarrollador hotelero con dos décadas en el corredor norte. Especialista en adquisiciones frente al mar y de inversión para clientes internacionales." }
  }
];

export const LISTINGS: Listing[] = [
  {
    slug: "penthouse-horizonte",
    destination: "cancun",
    neighborhood: "Punta Cancún",
    type: "penthouse",
    image: "l-horizonte",
    priceUSD: 1950000,
    beds: 3, baths: 3.5, areaM2: 285,
    status: "ready", label: "lifestyle",
    beachfront: true, furnished: true, yield: 7.2,
    feesUSDmo: 1450, delivery: null,
    coords: { lat: 21.135, lng: -86.745 }, mapXY: [83, 16],
    featured: true,
    en: {
      name: "Penthouse Horizonte",
      summary: "A full-floor beachfront penthouse above Punta Cancún, with a private plunge pool and 180 degrees of open Caribbean.",
      description: "Occupying the entire crown of a discreet eleven-residence building, Horizonte opens to the sea on three sides. Interiors in limestone and pale oak defer to the view; the terrace runs the full width of the plan, holding a plunge pool, an outdoor kitchen and evening shade from a sculpted brise-soleil."
    },
    es: {
      name: "Penthouse Horizonte",
      summary: "Penthouse frente al mar de piso completo sobre Punta Cancún, con alberca privada y 180 grados de Caribe abierto.",
      description: "Ocupando toda la corona de un discreto edificio de once residencias, Horizonte se abre al mar por tres lados. Interiores en piedra caliza y roble claro ceden el protagonismo a la vista; la terraza recorre todo el ancho de la planta, con alberca, cocina exterior y la sombra vespertina de un brise-soleil escultórico."
    }
  },
  {
    slug: "residencia-bahia",
    destination: "cancun",
    neighborhood: "Puerto Cancún",
    type: "apartment",
    image: "l-bahia",
    priceUSD: 845000,
    beds: 2, baths: 2, areaM2: 148,
    status: "ready", label: "lifestyle",
    beachfront: false, furnished: false, yield: 6.4,
    feesUSDmo: 620, delivery: null,
    coords: { lat: 21.155, lng: -86.803 }, mapXY: [76, 10],
    featured: false,
    en: {
      name: "Residencia Bahía",
      summary: "A two-bedroom marina residence in Puerto Cancún with a private slip option and golf across the water.",
      description: "Bahía looks straight down the marina channel from a deep shaded balcony. The plan is simple and generous: one wing for living, one for sleeping, both fronted in glass. Residents keep boats below and the beach club five minutes away."
    },
    es: {
      name: "Residencia Bahía",
      summary: "Residencia de dos recámaras en la marina de Puerto Cancún, con opción de amarre privado y golf al otro lado del agua.",
      description: "Bahía mira directamente al canal de la marina desde un balcón profundo y sombreado. La planta es simple y generosa: un ala para estar, otra para dormir, ambas con fachada de cristal. Los residentes guardan sus embarcaciones abajo y el club de playa queda a cinco minutos."
    }
  },
  {
    slug: "casa-sotavento",
    destination: "cancun",
    neighborhood: "Puerto Cancún Golf",
    type: "house",
    image: "l-sotavento",
    priceUSD: 1380000,
    beds: 4, baths: 4.5, areaM2: 420,
    status: "ready", label: "lifestyle",
    beachfront: false, furnished: false, yield: null,
    feesUSDmo: 890, delivery: null,
    coords: { lat: 21.148, lng: -86.812 }, mapXY: [74, 12],
    featured: false,
    en: {
      name: "Casa Sotavento",
      summary: "A low, horizontal family house on the Puerto Cancún fairway, built around a shaded central patio.",
      description: "Sotavento is organized around stillness: a central patio with a single tree, deep roof overhangs, and rooms that borrow green from the fairway beyond. Four suites, a study, and a service apartment complete a plan made for permanent living rather than display."
    },
    es: {
      name: "Casa Sotavento",
      summary: "Casa familiar baja y horizontal sobre el fairway de Puerto Cancún, construida alrededor de un patio central sombreado.",
      description: "Sotavento se organiza en torno a la calma: un patio central con un solo árbol, aleros profundos y habitaciones que toman prestado el verde del fairway. Cuatro suites, un estudio y un departamento de servicio completan una planta pensada para vivir, no para exhibir."
    }
  },
  {
    slug: "suite-laguna-704",
    destination: "cancun",
    neighborhood: "Zona Hotelera",
    type: "condo",
    image: "l-laguna",
    priceUSD: 398000,
    beds: 1, baths: 1.5, areaM2: 84,
    status: "turnkey", label: "investment",
    beachfront: false, furnished: true, yield: 8.1,
    feesUSDmo: 410, delivery: null,
    coords: { lat: 21.113, lng: -86.759 }, mapXY: [81, 20],
    featured: false,
    en: {
      name: "Suite Laguna 704",
      summary: "A turnkey one-bedroom over the Nichupté lagoon, delivered furnished and rental-ready.",
      description: "Suite 704 faces the protected water of the lagoon, where sunsets happen in front of the sofa. Sold fully furnished with hotel-grade finishes, in a tower with rental management on site. A clean first position in the Cancún market."
    },
    es: {
      name: "Suite Laguna 704",
      summary: "Departamento de una recámara llave en mano sobre la laguna Nichupté, entregado amueblado y listo para rentar.",
      description: "La suite 704 mira al agua protegida de la laguna, donde los atardeceres suceden frente al sofá. Se entrega totalmente amueblada con acabados de nivel hotelero, en una torre con administración de rentas en sitio. Una primera posición limpia en el mercado de Cancún."
    }
  },
  {
    slug: "penthouse-quinta-cielo",
    destination: "playa-del-carmen",
    neighborhood: "Centro / Quinta",
    type: "penthouse",
    image: "l-quinta",
    priceUSD: 1120000,
    beds: 3, baths: 3, areaM2: 210,
    status: "ready", label: "lifestyle",
    beachfront: false, furnished: true, yield: 7.8,
    feesUSDmo: 760, delivery: null,
    coords: { lat: 20.628, lng: -87.076 }, mapXY: [56, 47],
    featured: true,
    en: {
      name: "Penthouse Quinta Cielo",
      summary: "A rooftop penthouse two streets from the Quinta, with an infinity pool over the rooftops to the sea.",
      description: "Quinta Cielo trades street energy for sky. Below, the best three blocks of Playa del Carmen; above, a private rooftop with an infinity edge, an outdoor dining pavilion and the sea as a constant horizontal line. Walk everywhere, then come home to quiet."
    },
    es: {
      name: "Penthouse Quinta Cielo",
      summary: "Penthouse en rooftop a dos calles de la Quinta, con alberca infinita sobre los tejados hacia el mar.",
      description: "Quinta Cielo cambia la energía de la calle por el cielo. Abajo, las mejores tres cuadras de Playa del Carmen; arriba, un rooftop privado con borde infinito, un pabellón de comedor exterior y el mar como línea horizontal constante. Camina a todas partes y vuelve a casa al silencio."
    }
  },
  {
    slug: "residencia-litoral",
    destination: "playa-del-carmen",
    neighborhood: "Coco Beach",
    type: "branded",
    image: "l-litoral",
    priceUSD: 2350000,
    beds: 4, baths: 4.5, areaM2: 310,
    status: "preconstruction", label: "lifestyle",
    beachfront: true, furnished: true, yield: 6.8,
    feesUSDmo: 1900, delivery: "Q4 2026",
    coords: { lat: 20.645, lng: -87.058 }, mapXY: [58, 44],
    featured: true,
    en: {
      name: "Residencia Litoral 12B",
      summary: "A beachfront branded residence with five-star service, delivered late 2026.",
      description: "Litoral pairs a private residence with the full apparatus of a five-star operator: concierge, in-residence dining, spa privileges and managed rental when you are away. Residence 12B holds the northwest corner, with a wraparound terrace over the reef break."
    },
    es: {
      name: "Residencia Litoral 12B",
      summary: "Residencia de marca frente al mar con servicio de cinco estrellas, entrega a finales de 2026.",
      description: "Litoral une una residencia privada con todo el aparato de un operador de cinco estrellas: concierge, cena en residencia, privilegios de spa y renta administrada cuando no estás. La residencia 12B ocupa la esquina noroeste, con terraza envolvente sobre el arrecife."
    }
  },
  {
    slug: "jardin-once",
    destination: "playa-del-carmen",
    neighborhood: "Playacar Fase II",
    type: "condo",
    image: "l-jardin",
    priceUSD: 465000,
    beds: 2, baths: 2, areaM2: 122,
    status: "ready", label: "lifestyle",
    beachfront: false, furnished: false, yield: 6.9,
    feesUSDmo: 380, delivery: null,
    coords: { lat: 20.615, lng: -87.085 }, mapXY: [54, 50],
    featured: false,
    en: {
      name: "Jardín Once",
      summary: "A garden condominium under the old trees of Playacar, ten minutes by bicycle from the ferry.",
      description: "Jardín Once belongs to the quiet Playacar of mature trees and morning birdsong. The residence opens entirely to a private garden terrace; the beach path, golf and the Cozumel ferry are all within a short ride."
    },
    es: {
      name: "Jardín Once",
      summary: "Condominio jardín bajo los árboles maduros de Playacar, a diez minutos en bicicleta del ferry.",
      description: "Jardín Once pertenece al Playacar tranquilo de árboles maduros y pájaros por la mañana. La residencia se abre por completo a una terraza jardín privada; el sendero de playa, el golf y el ferry a Cozumel quedan a un paseo corto."
    }
  },
  {
    slug: "patio-norte",
    destination: "playa-del-carmen",
    neighborhood: "Centro Norte",
    type: "preconstruction",
    image: "l-patio",
    priceUSD: 329000,
    beds: 1, baths: 1, areaM2: 68,
    status: "preconstruction", label: "investment",
    beachfront: false, furnished: false, yield: 8.4,
    feesUSDmo: 290, delivery: "Q2 2027",
    coords: { lat: 20.638, lng: -87.068 }, mapXY: [57, 45],
    featured: false,
    en: {
      name: "Patio Norte",
      summary: "Pre-construction residences around a planted courtyard, from $329,000 with developer financing.",
      description: "Patio Norte is built around what Playa does best: shade, patio life, walkability. One and two bedroom plans face a planted central courtyard with a lap pool. Early buyers access developer financing across construction."
    },
    es: {
      name: "Patio Norte",
      summary: "Residencias en preventa alrededor de un patio arbolado, desde $329,000 USD con financiamiento del desarrollador.",
      description: "Patio Norte se construye alrededor de lo que Playa hace mejor: sombra, vida de patio y cercanía a pie. Plantas de una y dos recámaras miran a un patio central arbolado con alberca de nado. Los primeros compradores acceden a financiamiento del desarrollador durante la obra."
    }
  },
  {
    slug: "casa-umbral",
    destination: "tulum",
    neighborhood: "Aldea Zamá",
    type: "villa",
    image: "l-umbral",
    priceUSD: 1275000,
    beds: 3, baths: 3.5, areaM2: 260,
    status: "ready", label: "lifestyle",
    beachfront: false, furnished: true, yield: 7.5,
    feesUSDmo: 540, delivery: null,
    coords: { lat: 20.205, lng: -87.46 }, mapXY: [32, 84],
    featured: true,
    en: {
      name: "Casa Umbral",
      summary: "A sculptural jungle villa in Aldea Zamá, polished concrete under the canopy with a shadow-dark pool.",
      description: "Umbral means threshold: the house is a sequence of them, from bright street to shaded court to the dark stillness of the pool. Board-formed concrete, tzalam wood and handmade pasta tiles carry the architecture; the jungle does the rest."
    },
    es: {
      name: "Casa Umbral",
      summary: "Villa escultórica en la selva de Aldea Zamá, concreto pulido bajo el dosel con una alberca color sombra.",
      description: "Umbral es eso: un umbral tras otro, de la calle luminosa al patio sombreado y a la quietud oscura de la alberca. Concreto cimbrado, madera de tzalam y mosaicos de pasta hechos a mano sostienen la arquitectura; la selva hace el resto."
    }
  },
  {
    slug: "casa-almar",
    destination: "tulum",
    neighborhood: "Tankah Bay",
    type: "estate",
    image: "l-almar",
    priceUSD: 6800000,
    beds: 6, baths: 7, areaM2: 720,
    status: "ready", label: "lifestyle",
    beachfront: true, furnished: true, yield: null,
    feesUSDmo: 3200, delivery: null,
    coords: { lat: 20.234, lng: -87.428 }, mapXY: [36, 80],
    featured: true,
    gallery: ["g-living", "g-bedroom", "g-bath", "g-pool", "g-kitchen"],
    en: {
      name: "Casa Almar",
      summary: "A private beachfront estate on Tankah Bay: 42 meters of sand, six suites, and architecture that disappears into the horizon.",
      description: "Almar occupies its own parcel on the protected curve of Tankah Bay, where the reef keeps the water calm enough to swim at dawn. The house is a set of low pavilions arranged along the dune: a double-height living hall fully open to the sea, six suites each with private outdoor space, a study, a gym pavilion and staff quarters. A 25-meter infinity pool runs parallel to the beach behind a line of old palms. Titled beachfront of this scale, minutes from Tulum, is close to irreplaceable.",
      architecture: "Designed as a family of pavilions rather than a single mass, Almar keeps every room within one step of outdoor air. Structure is board-formed concrete softened by regional limestone; roofs carry deep overhangs calibrated to the June sun. Interiors were executed with a Mexico City studio in limestone, tzalam and hand-troweled plaster."
    },
    es: {
      name: "Casa Almar",
      summary: "Finca privada frente al mar en Bahía Tankah: 42 metros de arena, seis suites y una arquitectura que se disuelve en el horizonte.",
      description: "Almar ocupa su propio predio en la curva protegida de Bahía Tankah, donde el arrecife mantiene el agua tranquila para nadar al amanecer. La casa es un conjunto de pabellones bajos dispuestos a lo largo de la duna: un salón de doble altura totalmente abierto al mar, seis suites cada una con exterior privado, un estudio, un pabellón de gimnasio y área de servicio. Una alberca infinita de 25 metros corre paralela a la playa tras una línea de palmas antiguas. Un frente de playa titulado de esta escala, a minutos de Tulum, es prácticamente irremplazable.",
      architecture: "Concebida como una familia de pabellones y no como una sola masa, Almar mantiene cada habitación a un paso del aire exterior. La estructura es concreto cimbrado suavizado con caliza regional; las cubiertas llevan aleros profundos calibrados al sol de junio. Los interiores se ejecutaron con un estudio de la Ciudad de México en caliza, tzalam y aplanados a llana."
    }
  },
  {
    slug: "residencia-alba",
    destination: "tulum",
    neighborhood: "La Veleta",
    type: "condo",
    image: "l-alba",
    priceUSD: 389000,
    beds: 2, baths: 2, areaM2: 96,
    status: "turnkey", label: "investment",
    beachfront: false, furnished: true, yield: 9.2,
    feesUSDmo: 310, delivery: null,
    coords: { lat: 20.2, lng: -87.47 }, mapXY: [29, 87],
    featured: false,
    en: {
      name: "Residencia Alba 3A",
      summary: "A turnkey wellness residence in La Veleta with a private rooftop plunge pool over the canopy.",
      description: "Alba 3A is delivered furnished, styled and rental-ready in Tulum's strongest boutique corridor. The rooftop holds a private plunge pool facing sunset over an unbroken jungle horizon. On-site management handles everything between your stays."
    },
    es: {
      name: "Residencia Alba 3A",
      summary: "Residencia wellness llave en mano en La Veleta con alberca privada en rooftop sobre el dosel de la selva.",
      description: "Alba 3A se entrega amueblada, ambientada y lista para rentar en el corredor boutique más sólido de Tulum. El rooftop tiene una alberca privada orientada al atardecer sobre un horizonte de selva ininterrumpido. La administración en sitio se encarga de todo entre tus estancias."
    }
  },
  {
    slug: "raiz-tulum",
    destination: "tulum",
    neighborhood: "Región 15",
    type: "preconstruction",
    image: "l-raiz",
    priceUSD: 412000,
    beds: 2, baths: 2, areaM2: 104,
    status: "preconstruction", label: "investment",
    beachfront: false, furnished: false, yield: 8.8,
    feesUSDmo: 350, delivery: "Q1 2028",
    coords: { lat: 20.196, lng: -87.478 }, mapXY: [28, 88],
    featured: false,
    en: {
      name: "Raíz Tulum",
      summary: "Pre-construction eco-residences with living roofs and cenote access, delivery early 2028.",
      description: "Raíz builds with the terrain instead of over it: curved earthen walls, living green roofs, courtyards that harvest rain. Owners share a private cenote garden and a wellness pavilion. Phase one pricing runs to structural completion."
    },
    es: {
      name: "Raíz Tulum",
      summary: "Eco-residencias en preventa con techos vivos y acceso a cenote, entrega a inicios de 2028.",
      description: "Raíz construye con el terreno y no sobre él: muros curvos de tierra, techos verdes vivos, patios que cosechan lluvia. Los propietarios comparten un jardín de cenote privado y un pabellón de bienestar. Los precios de fase uno aplican hasta el cierre estructural."
    }
  }
];

export const POIS: Poi[] = [
  { id: "cun-airport", mapXY: [70, 16], type: "airport", en: "Cancún Intl. Airport", es: "Aeropuerto Intl. de Cancún" },
  { id: "tul-airport", mapXY: [22, 94], type: "airport", en: "Tulum Intl. Airport", es: "Aeropuerto Intl. de Tulum" },
  { id: "marina", mapXY: [75, 9], type: "marina", en: "Puerto Cancún Marina", es: "Marina Puerto Cancún" },
  { id: "ferry", mapXY: [57, 49], type: "marina", en: "Cozumel Ferry", es: "Ferry a Cozumel" },
  { id: "reef", mapXY: [40, 76], type: "beach", en: "Sian Ka'an Biosphere", es: "Biosfera de Sian Ka'an" },
  { id: "cenotes", mapXY: [38, 70], type: "wellness", en: "Cenote corridor", es: "Corredor de cenotes" }
];

export const AMENITIES: Record<string, Record<Locale, string[]>> = {
  "penthouse-horizonte": { en: ["Private plunge pool", "Full-floor plan, private elevator", "Outdoor kitchen and bar", "Beach club access", "2 parking bays + storage", "Concierge and 24h security"], es: ["Alberca privada", "Planta completa con elevador privado", "Cocina exterior y bar", "Acceso a club de playa", "2 cajones y bodega", "Concierge y seguridad 24h"] },
  "residencia-bahia": { en: ["Marina slip option", "Golf membership access", "Gym and lap pool", "Deep shaded balcony", "Pet friendly", "24h security"], es: ["Opción de amarre en marina", "Acceso a membresía de golf", "Gimnasio y alberca de nado", "Balcón profundo y sombreado", "Acepta mascotas", "Seguridad 24h"] },
  "casa-sotavento": { en: ["Central shaded patio", "Study and service apartment", "Fairway frontage", "Solar pre-installation", "Double-height entry", "Gated community"], es: ["Patio central sombreado", "Estudio y cuarto de servicio", "Frente al fairway", "Preinstalación solar", "Acceso a doble altura", "Comunidad cerrada"] },
  "suite-laguna-704": { en: ["Delivered furnished", "On-site rental management", "Lagoon-view pool deck", "Co-working lounge", "Hotel-grade finishes", "24h security"], es: ["Entregada amueblada", "Administración de rentas en sitio", "Terraza de alberca con vista a laguna", "Sala de co-working", "Acabados de nivel hotelero", "Seguridad 24h"] },
  "penthouse-quinta-cielo": { en: ["Private rooftop with infinity pool", "Outdoor dining pavilion", "Two streets from the Quinta", "Furnished by studio", "Elevator to residence", "Storage and parking"], es: ["Rooftop privado con alberca infinita", "Pabellón de comedor exterior", "A dos calles de la Quinta", "Amueblado por estudio", "Elevador a la residencia", "Bodega y estacionamiento"] },
  "residencia-litoral": { en: ["Five-star operator services", "In-residence dining", "Spa and wellness privileges", "Managed rental program", "Wraparound reef-view terrace", "Owner's lounge"], es: ["Servicios de operador cinco estrellas", "Cena en residencia", "Privilegios de spa y bienestar", "Programa de renta administrada", "Terraza envolvente con vista al arrecife", "Salón de propietarios"] },
  "jardin-once": { en: ["Private garden terrace", "Mature tree canopy", "Golf and beach path access", "Bicycle storage", "Low HOA fees", "Gated Playacar Fase II"], es: ["Terraza jardín privada", "Arbolado maduro", "Acceso a golf y sendero de playa", "Estacionamiento de bicicletas", "Cuota de mantenimiento baja", "Playacar Fase II cerrado"] },
  "patio-norte": { en: ["Planted central courtyard", "25 m lap pool", "Rooftop solarium", "Developer financing", "Delivery Q2 2027", "Walk-to-everything location"], es: ["Patio central arbolado", "Alberca de nado de 25 m", "Solárium en azotea", "Financiamiento del desarrollador", "Entrega Q2 2027", "Todo a distancia caminable"] },
  "casa-umbral": { en: ["Shadow-dark pool and court", "Board-formed concrete", "Tzalam wood carpentry", "Outdoor shower garden", "Furnished, turnkey", "Aldea Zamá services"], es: ["Alberca color sombra y patio", "Concreto cimbrado", "Carpintería de tzalam", "Regadera exterior en jardín", "Amueblada, llave en mano", "Servicios de Aldea Zamá"] },
  "casa-almar": { en: ["42 m titled beachfront", "25 m infinity pool", "Six suites, all outdoor-connected", "Gym pavilion and study", "Staff quarters and service court", "Reef-protected swimming bay"], es: ["42 m de frente de playa titulado", "Alberca infinita de 25 m", "Seis suites conectadas al exterior", "Pabellón de gimnasio y estudio", "Área de servicio independiente", "Bahía protegida por arrecife"] },
  "residencia-alba": { en: ["Private rooftop plunge pool", "Delivered styled and furnished", "On-site management", "Wellness pavilion access", "Jungle-horizon sunset view", "Strong rental history"], es: ["Alberca privada en rooftop", "Entregada amueblada y ambientada", "Administración en sitio", "Acceso a pabellón de bienestar", "Atardecer sobre la selva", "Historial de renta sólido"] },
  "raiz-tulum": { en: ["Living green roofs", "Private cenote garden", "Rainwater harvesting", "Wellness pavilion", "Phase-one pricing", "Delivery Q1 2028"], es: ["Techos verdes vivos", "Jardín de cenote privado", "Cosecha de agua de lluvia", "Pabellón de bienestar", "Precios de fase uno", "Entrega Q1 2028"] }
};

export function getListing(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function destName(slug: string, locale: Locale): string {
  const d = getDestination(slug);
  return d ? d[locale].name : slug;
}

export function advisorFor(l: Listing): Advisor {
  return ADVISORS[l.destination === "cancun" ? 1 : 0];
}

export function similarListings(l: Listing): Listing[] {
  return LISTINGS.filter(
    (x) => x.slug !== l.slug && (x.destination === l.destination || x.type === l.type)
  ).slice(0, 3);
}

export function galleryKeys(l: Listing): string[] {
  const g = l.gallery ? [l.image, ...l.gallery] : [l.image, "g-living", "g-pool"];
  return g.filter((v, i, a) => a.indexOf(v) === i);
}
