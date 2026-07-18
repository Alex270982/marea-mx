/* MAREA interface dictionary. Keys shared by preview and production build. */

export type Locale = "en" | "es";
export const LOCALES: Locale[] = ["en", "es"];

export function isLocale(v: string): v is Locale {
  return v === "en" || v === "es";
}

export interface InvestBlock {
  t: string;
  d: string;
}

export interface Dict {
  brand_tag: string;
  nav: {
    properties: string;
    destinations: string;
    developments: string;
    investment: string;
    journal: string;
    about: string;
    saved: string;
    consult: string;
  };
  hero: {
    scroll: string;
    skip: string;
    statement_a: string;
    statement_b: string;
    support: string;
    loading: string;
    chapters: string[];
  };
  search: {
    title: string;
    buy: string;
    rent: string;
    destination: string;
    any_destination: string;
    type: string;
    any_type: string;
    price: string;
    any_price: string;
    beds: string;
    any_beds: string;
    status: string;
    any_status: string;
    more: string;
    beachfront: string;
    furnished: string;
    investment: string;
    map: string;
    submit: string;
    placeholder_hint: string;
  };
  types: Record<string, string>;
  status: Record<string, string>;
  labels: Record<string, string>;
  featured: {
    eyebrow: string;
    title: string;
    sub: string;
    view: string;
    quick: string;
    save: string;
    saved: string;
    yield_est: string;
    from: string;
  };
  destinations: {
    title: string;
    sub: string;
    explore: string;
    available: string;
    market_view: string;
    neighborhoods: string;
  };
  map: {
    title: string;
    sub: string;
    legend_property: string;
    legend_poi: string;
    open: string;
    travel: string;
    list: string;
    split: string;
    mapv: string;
  };
  invest: {
    eyebrow: string;
    title: string;
    blocks: InvestBlock[];
    disclaimer: string;
  };
  concierge: {
    title: string;
    sub: string;
    cta_consult: string;
    cta_whatsapp: string;
    cta_email: string;
    cta_shortlist: string;
    form_name: string;
    form_email: string;
    form_msg: string;
    form_send: string;
    form_ok: string;
    form_err_name: string;
    form_err_email: string;
    form_err_msg: string;
  };
  listing: {
    overview: string;
    specs: string;
    amenities: string;
    architecture: string;
    location: string;
    nearby: string;
    development: string;
    timeline: string;
    pricing: string;
    costs: string;
    projection: string;
    similar: string;
    advisor: string;
    inquire: string;
    viewing: string;
    brochure: string;
    share: string;
    gallery: string;
    floorplan: string;
    video: string;
    tour: string;
    skip_film: string;
    beds: string;
    baths: string;
    interior: string;
    terrace: string;
    fees: string;
    delivery: string;
    price_usd: string;
    price_mxn: string;
    per_m2: string;
    proj_note: string;
    whatsapp_msg: string;
  };
  searchpage: {
    title: string;
    results: string;
    sort: string;
    sort_rel: string;
    sort_new: string;
    sort_price_a: string;
    sort_price_d: string;
    sort_size: string;
    empty_t: string;
    empty_d: string;
    compare: string;
    comparing: string;
    clear: string;
    alerts: string;
    alerts_ok: string;
    recently: string;
    saved_title: string;
    saved_empty: string;
  };
  footer: {
    tagline: string;
    col_explore: string;
    col_company: string;
    col_legal: string;
    about: string;
    journal: string;
    careers: string;
    contact: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    lang: string;
  };
  misc: {
    back: string;
    close: string;
    all: string;
    prototype: string;
  };
}

export const I18N: Record<Locale, Dict> = {
  en: {
    brand_tag: "Exceptional properties. Extraordinary places.",
    nav: { properties: "Properties", destinations: "Destinations", developments: "Developments", investment: "Investment", journal: "Journal", about: "About", saved: "Saved", consult: "Private Consultation" },
    hero: {
      scroll: "Scroll to explore",
      skip: "Skip intro",
      statement_a: "Find your place",
      statement_b: "in the Mexican Caribbean.",
      support: "Curated homes, residences and investment opportunities in Cancún, Playa del Carmen and Tulum.",
      loading: "Preparing your arrival",
      chapters: ["The approach", "The threshold", "The living hall", "The water"]
    },
    search: {
      title: "Begin with what matters",
      buy: "Buy", rent: "Rent",
      destination: "Destination", any_destination: "All destinations",
      type: "Property type", any_type: "All types",
      price: "Price range", any_price: "Any price",
      beds: "Bedrooms", any_beds: "Any",
      status: "Delivery", any_status: "Any status",
      more: "Refine",
      beachfront: "Beachfront", furnished: "Furnished", investment: "Investment grade",
      map: "Search by map",
      submit: "Explore properties",
      placeholder_hint: "A concierge search: choose only what matters to you and we will interpret the rest."
    },
    types: { penthouse: "Penthouse", apartment: "Apartment", house: "House", condo: "Condominium", villa: "Villa", estate: "Estate", branded: "Branded residence", preconstruction: "Pre-construction" },
    status: { ready: "Ready to move in", turnkey: "Turnkey", preconstruction: "Pre-construction" },
    labels: { lifestyle: "Lifestyle", investment: "Investment" },
    featured: { eyebrow: "A curated selection", title: "Twelve addresses, chosen slowly", sub: "We list little and visit everything. Each residence below earned its place.", view: "View residence", quick: "Quick view", save: "Save", saved: "Saved", yield_est: "est. yield", from: "From" },
    destinations: { title: "Three coasts, three temperaments", sub: "The Mexican Caribbean is not one market. Choose your temperament first; the property follows.", explore: "Explore", available: "available residences", market_view: "Market overview", neighborhoods: "Neighborhoods" },
    map: { title: "The coast, annotated", sub: "Every listing, placed. Travel times, beaches, marinas and the places that make a location worth its price.", legend_property: "Residence", legend_poi: "Landmark", open: "Open full map", travel: "Travel-time context", list: "List", split: "Split", mapv: "Map" },
    invest: {
      eyebrow: "Capital in the Caribbean",
      title: "Own well. Let it work.",
      blocks: [
        { t: "Rental potential", d: "Nightly and mid-term demand across the corridor supports projected gross yields of 6 to 9 percent on well-bought stock. All figures are estimates, never guarantees." },
        { t: "Capital appreciation", d: "Land discipline, airport capacity and the Maya Train continue to reprice the coast. We track resale spreads by micro-location." },
        { t: "Pre-construction", d: "Developer pricing typically steps up 10 to 20 percent between launch and delivery. We only present developers whose previous buildings we can walk." },
        { t: "Turnkey and managed", d: "Furnished, operated, reported. For owners who want a statement, not a second job." },
        { t: "Legal clarity", d: "Fideicomiso trusts, escrow, closing costs and annual obligations, explained in plain language before you commit to anything." },
        { t: "After the purchase", d: "Property management, rental programs and resale strategy from the same advisor who sold you the home." }
      ],
      disclaimer: "Projections are illustrative, based on current market observation, and are not a guarantee of future performance."
    },
    concierge: {
      title: "Tell us what you are looking for.",
      sub: "Our local advisors will curate a private selection for you.",
      cta_consult: "Schedule a private consultation",
      cta_whatsapp: "WhatsApp",
      cta_email: "Email us",
      cta_shortlist: "Request a curated shortlist",
      form_name: "Your name", form_email: "Email", form_msg: "What are you looking for?", form_send: "Send to an advisor",
      form_ok: "Received. An advisor will write to you within one working day.",
      form_err_name: "Please tell us your name.", form_err_email: "That email does not look complete.", form_err_msg: "A sentence or two helps us curate well."
    },
    listing: {
      overview: "Overview", specs: "Key specifications", amenities: "Amenities", architecture: "Architecture and design",
      location: "Location", nearby: "Nearby", development: "Development details", timeline: "Delivery timeline",
      pricing: "Pricing", costs: "Estimated costs", projection: "Investment projection", similar: "Similar residences",
      advisor: "Your advisor", inquire: "Inquire", viewing: "Schedule a private viewing", brochure: "Download brochure",
      share: "Share", gallery: "Gallery", floorplan: "Floor plan", video: "Film", tour: "3D tour", skip_film: "Skip flight",
      beds: "Bedrooms", baths: "Bathrooms", interior: "Interior", terrace: "Terrace", fees: "Maintenance", delivery: "Delivery",
      price_usd: "Price (USD)", price_mxn: "approx. MXN", per_m2: "per m²",
      proj_note: "Projection uses current comparable nightly rates at 62% occupancy, net of operating costs. Illustrative only.",
      whatsapp_msg: "Hello, I am interested in"
    },
    searchpage: {
      title: "Properties", results: "residences", sort: "Sort", sort_rel: "Relevance", sort_new: "Newest", sort_price_a: "Price, low to high", sort_price_d: "Price, high to low", sort_size: "Size",
      empty_t: "Nothing matches that combination yet.", empty_d: "Loosen one filter, or tell our concierge what you are seeking and we will search privately.",
      compare: "Compare", comparing: "Comparing", clear: "Clear filters", alerts: "Save this search", alerts_ok: "Search saved. We will alert you to new matches.",
      recently: "Recently viewed", saved_title: "Saved residences", saved_empty: "Nothing saved yet. Tap the mark on any residence to keep it here."
    },
    footer: {
      tagline: "Exceptional properties. Extraordinary places.",
      col_explore: "Explore", col_company: "Studio", col_legal: "Legal",
      about: "About MAREA", journal: "Journal", careers: "Careers", contact: "Contact",
      privacy: "Privacy", terms: "Terms", disclaimer: "All sample data on this prototype is illustrative. Financial figures are projections, not guarantees.",
      lang: "Language"
    },
    misc: { back: "Back", close: "Close", all: "All", prototype: "Design prototype. Sample listings with illustrative data." }
  },
  es: {
    brand_tag: "Propiedades excepcionales. Lugares extraordinarios.",
    nav: { properties: "Propiedades", destinations: "Destinos", developments: "Desarrollos", investment: "Inversión", journal: "Journal", about: "Nosotros", saved: "Guardadas", consult: "Consulta Privada" },
    hero: {
      scroll: "Desliza para explorar",
      skip: "Saltar intro",
      statement_a: "Encuentra tu lugar",
      statement_b: "en el Caribe Mexicano.",
      support: "Una selección de casas, residencias y oportunidades de inversión en Cancún, Playa del Carmen y Tulum.",
      loading: "Preparando tu llegada",
      chapters: ["La llegada", "El umbral", "El salón", "El agua"]
    },
    search: {
      title: "Empieza por lo esencial",
      buy: "Comprar", rent: "Rentar",
      destination: "Destino", any_destination: "Todos los destinos",
      type: "Tipo de propiedad", any_type: "Todos los tipos",
      price: "Rango de precio", any_price: "Cualquier precio",
      beds: "Recámaras", any_beds: "Cualquiera",
      status: "Entrega", any_status: "Cualquier estatus",
      more: "Refinar",
      beachfront: "Frente al mar", furnished: "Amueblada", investment: "Grado de inversión",
      map: "Buscar por mapa",
      submit: "Explorar propiedades",
      placeholder_hint: "Búsqueda de concierge: elige solo lo que te importa y nosotros interpretamos el resto."
    },
    types: { penthouse: "Penthouse", apartment: "Departamento", house: "Casa", condo: "Condominio", villa: "Villa", estate: "Finca", branded: "Residencia de marca", preconstruction: "Preventa" },
    status: { ready: "Entrega inmediata", turnkey: "Llave en mano", preconstruction: "Preventa" },
    labels: { lifestyle: "Estilo de vida", investment: "Inversión" },
    featured: { eyebrow: "Una selección curada", title: "Doce direcciones, elegidas sin prisa", sub: "Listamos poco y visitamos todo. Cada residencia aquí se ganó su lugar.", view: "Ver residencia", quick: "Vista rápida", save: "Guardar", saved: "Guardada", yield_est: "rend. est.", from: "Desde" },
    destinations: { title: "Tres costas, tres temperamentos", sub: "El Caribe Mexicano no es un solo mercado. Elige primero tu temperamento; la propiedad llega después.", explore: "Explorar", available: "residencias disponibles", market_view: "Panorama de mercado", neighborhoods: "Zonas" },
    map: { title: "La costa, anotada", sub: "Cada propiedad, ubicada. Tiempos de traslado, playas, marinas y los lugares que hacen que una ubicación valga su precio.", legend_property: "Residencia", legend_poi: "Referencia", open: "Abrir mapa completo", travel: "Tiempos de traslado", list: "Lista", split: "Mixta", mapv: "Mapa" },
    invest: {
      eyebrow: "Capital en el Caribe",
      title: "Compra bien. Deja que trabaje.",
      blocks: [
        { t: "Potencial de renta", d: "La demanda nocturna y de mediano plazo en el corredor sostiene rendimientos brutos proyectados de 6 a 9 por ciento en inventario bien comprado. Todas las cifras son estimaciones, nunca garantías." },
        { t: "Plusvalía", d: "La disciplina de suelo, la capacidad aeroportuaria y el Tren Maya siguen revalorizando la costa. Seguimos los diferenciales de reventa por microubicación." },
        { t: "Preventa", d: "El precio de desarrollador suele subir de 10 a 20 por ciento entre lanzamiento y entrega. Solo presentamos desarrolladores cuyos edificios anteriores podemos recorrer." },
        { t: "Llave en mano y administradas", d: "Amuebladas, operadas, con reportes. Para propietarios que quieren un estado de cuenta, no un segundo trabajo." },
        { t: "Claridad legal", d: "Fideicomiso, escrow, costos de cierre y obligaciones anuales, explicados en lenguaje claro antes de comprometerte a nada." },
        { t: "Después de la compra", d: "Administración, programas de renta y estrategia de reventa con el mismo asesor que te vendió la casa." }
      ],
      disclaimer: "Las proyecciones son ilustrativas, basadas en observación actual del mercado, y no garantizan rendimientos futuros."
    },
    concierge: {
      title: "Cuéntanos qué estás buscando.",
      sub: "Nuestros asesores locales prepararán una selección privada para ti.",
      cta_consult: "Agendar una consulta privada",
      cta_whatsapp: "WhatsApp",
      cta_email: "Escríbenos",
      cta_shortlist: "Solicitar una selección curada",
      form_name: "Tu nombre", form_email: "Correo", form_msg: "¿Qué estás buscando?", form_send: "Enviar a un asesor",
      form_ok: "Recibido. Un asesor te escribirá en un día hábil.",
      form_err_name: "Cuéntanos tu nombre.", form_err_email: "Ese correo no parece completo.", form_err_msg: "Una o dos frases nos ayudan a curar mejor."
    },
    listing: {
      overview: "Descripción", specs: "Especificaciones", amenities: "Amenidades", architecture: "Arquitectura y diseño",
      location: "Ubicación", nearby: "Cerca", development: "Detalles del desarrollo", timeline: "Calendario de entrega",
      pricing: "Precios", costs: "Costos estimados", projection: "Proyección de inversión", similar: "Residencias similares",
      advisor: "Tu asesor", inquire: "Contactar", viewing: "Agendar visita privada", brochure: "Descargar brochure",
      share: "Compartir", gallery: "Galería", floorplan: "Planta", video: "Film", tour: "Recorrido 3D", skip_film: "Saltar recorrido",
      beds: "Recámaras", baths: "Baños", interior: "Interior", terrace: "Terraza", fees: "Mantenimiento", delivery: "Entrega",
      price_usd: "Precio (USD)", price_mxn: "aprox. MXN", per_m2: "por m²",
      proj_note: "La proyección usa tarifas nocturnas comparables actuales al 62% de ocupación, neta de costos operativos. Solo ilustrativa.",
      whatsapp_msg: "Hola, me interesa"
    },
    searchpage: {
      title: "Propiedades", results: "residencias", sort: "Ordenar", sort_rel: "Relevancia", sort_new: "Más recientes", sort_price_a: "Precio, menor a mayor", sort_price_d: "Precio, mayor a menor", sort_size: "Superficie",
      empty_t: "Nada coincide con esa combinación todavía.", empty_d: "Suaviza un filtro, o cuéntale a nuestro concierge qué buscas y buscaremos en privado.",
      compare: "Comparar", comparing: "Comparando", clear: "Limpiar filtros", alerts: "Guardar esta búsqueda", alerts_ok: "Búsqueda guardada. Te avisaremos de nuevas coincidencias.",
      recently: "Vistas recientemente", saved_title: "Residencias guardadas", saved_empty: "Nada guardado aún. Toca la marca en cualquier residencia para conservarla aquí."
    },
    footer: {
      tagline: "Propiedades excepcionales. Lugares extraordinarios.",
      col_explore: "Explora", col_company: "Estudio", col_legal: "Legal",
      about: "Sobre MAREA", journal: "Journal", careers: "Carreras", contact: "Contacto",
      privacy: "Privacidad", terms: "Términos", disclaimer: "Todos los datos de muestra en este prototipo son ilustrativos. Las cifras financieras son proyecciones, no garantías.",
      lang: "Idioma"
    },
    misc: { back: "Volver", close: "Cerrar", all: "Todas", prototype: "Prototipo de diseño. Propiedades de muestra con datos ilustrativos." }
  }
};

/** Illustrative rate for optional MXN display. */
export const FX_MXN = 18.4;

export function dict(locale: Locale): Dict {
  return I18N[locale];
}
