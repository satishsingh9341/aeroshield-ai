import { CleanAirHaven, CommunityAlert } from '../types';

export const COMMUNITY_ALERTS: CommunityAlert[] = [
  {
    id: 'alt-1',
    title: 'Severe Evening Inversion Peak Trapping Alert',
    neighborhood: 'South City & Metro Belt',
    type: 'inversion-peak',
    severity: 'emergency',
    timestamp: '25 min ago',
    description: 'Ground radiation cooling has dropped the boundary layer ceiling to 110 meters. Stagnant particulate concentration is rising rapidly (AQI 440+). Close all windows, stop outdoor runs.',
    actionRequested: 'Turn purifiers to Medium/High. Notify elderly neighbors with asthma.',
    upvotes: 42
  },
  {
    id: 'alt-2',
    title: 'Open Leaf & Waste Burning Spotted',
    neighborhood: 'North Sector Park Perimeter',
    type: 'waste-fire',
    severity: 'warning',
    timestamp: '1 hour ago',
    description: 'Municipal sweepers burning piled leaves near block 4. Dense acrid smoke blowing toward elementary school apartments.',
    actionRequested: 'Diplomatic intervention alert dispatched to Resident Welfare Association. Please douse or report to hotline 1800-SMOG.',
    upvotes: 29
  },
  {
    id: 'alt-3',
    title: 'School Bus / Metro Commute Pool (Morning Batch)',
    neighborhood: 'Greenwood & Sector 14',
    type: 'carpool-offer',
    severity: 'info',
    timestamp: '2 hours ago',
    description: 'Grouping 4 families into one electric minivan commute to reduce 3 separate SUV trips and keep kids in HEPA-filtered cabin.',
    actionRequested: '2 seats remaining. Departs 07:45 AM. Reach out via pod chat.',
    upvotes: 18
  },
  {
    id: 'alt-4',
    title: 'Clean Air Haven Open: Central Civic Library',
    neighborhood: 'Downtown Cultural District',
    type: 'clean-air-haven',
    severity: 'info',
    timestamp: 'Today 09:00 AM',
    description: 'Equipped with dual commercial MERV-14 HVAC + active carbon scrubbers. Indoor AQI maintained under 35. Heated study spaces & senior reading lounge.',
    actionRequested: 'Free admission for families escaping drafty apartments.',
    upvotes: 56
  }
];

export const CLEAN_AIR_HAVENS: CleanAirHaven[] = [
  // Delhi NCR
  {
    id: 'delhi-haven-1',
    name: 'Delhi Central Civic & Cultural Library',
    address: '42 Barakhamba Road, Connaught Place, New Delhi',
    type: 'Public Library',
    filtration: 'Commercial MERV-14 + Activated Carbon Bank',
    indoorAqi: 28,
    capacity: '180 people',
    amenities: ['Free High-Speed Wi-Fi', 'Children Reading Nook', 'Quiet Workspaces', 'Heated Drinking Water'],
    openHours: '08:00 AM – 09:00 PM',
    cityId: 'delhi'
  },
  {
    id: 'delhi-haven-2',
    name: 'India Habitat Centre Clean-Air Atrium',
    address: 'Lodhi Road, New Delhi',
    type: 'Civic Center',
    filtration: 'Multi-stage Positive Pressure HEPA + Fresh Air Scrubbers',
    indoorAqi: 24,
    capacity: '250 people',
    amenities: ['Indoor Garden Sanctuary', 'Emergency Nebulizer Station', 'Senior Loungers', 'Free Herbal Tea'],
    openHours: '07:30 AM – 09:30 PM',
    cityId: 'delhi'
  },
  {
    id: 'delhi-haven-3',
    name: 'GreenLife Community Wellness Hub',
    address: 'Sector 15, Rohini, New Delhi',
    type: 'Community Hall',
    filtration: 'Custom 8x Corsi-Rosenthal System + HEPA 13',
    indoorAqi: 32,
    capacity: '90 people',
    amenities: ['Indoor Children Play Zone', 'Air Quality Telemetry Screen', 'Filtered Water Dispenser'],
    openHours: '08:00 AM – 08:30 PM',
    cityId: 'delhi'
  },

  // Milan
  {
    id: 'milan-haven-1',
    name: 'Biblioteca Sormani Clean Air Commons',
    address: 'Corso di Porta Vittoria 6, Milano',
    type: 'Public Library',
    filtration: 'Central HVAC with MERV-14 & Molecular VOC Scrubber',
    indoorAqi: 18,
    capacity: '140 people',
    amenities: ['Quiet Study Desks', 'High-Speed Wi-Fi', 'Reading Room for Seniors', 'Espresso Corner'],
    openHours: '09:00 AM – 07:30 PM',
    cityId: 'milan'
  },
  {
    id: 'milan-haven-2',
    name: 'Palazzo Reale Indoor Cultural Haven',
    address: 'Piazza del Duomo 12, Milano',
    type: 'Civic Center',
    filtration: 'Museum-grade High Efficiency Particulate Filtration (HEPA H14)',
    indoorAqi: 14,
    capacity: '200 people',
    amenities: ['Museum Lounges', 'Climate Controlled Atrium', 'Wheelchair Accessible'],
    openHours: '10:00 AM – 07:30 PM',
    cityId: 'milan'
  },

  // Beijing
  {
    id: 'beijing-haven-1',
    name: 'National Library of China Clean Air Wing',
    address: '33 Zhongguancun South Ave, Haidian, Beijing',
    type: 'Public Library',
    filtration: 'Industrial Dual Positive-Pressure HEPA & Formaldehyde Catalyst',
    indoorAqi: 15,
    capacity: '400 people',
    amenities: ['Silent Study Zones', 'Hot Water Stations', 'Children Research Section', 'Nap Pods'],
    openHours: '09:00 AM – 09:00 PM',
    cityId: 'beijing'
  },
  {
    id: 'beijing-haven-2',
    name: 'Chaoyang Community Cultural Center',
    address: '17 Jintai Road, Chaoyang District, Beijing',
    type: 'Community Hall',
    filtration: 'Dual MERV-13 + Primary Electrostatic Filter Stack',
    indoorAqi: 22,
    capacity: '160 people',
    amenities: ['Elderly Chess & Activity Room', 'Pediatric Play Space', 'Free Drinking Water'],
    openHours: '08:30 AM – 08:00 PM',
    cityId: 'beijing'
  },

  // Salt Lake City
  {
    id: 'slc-haven-1',
    name: 'Salt Lake City Main Public Library',
    address: '210 E 400 S, Salt Lake City, UT',
    type: 'Public Library',
    filtration: 'LEED Certified MERV-14 Displacement Ventilation with Carbon Banks',
    indoorAqi: 16,
    capacity: '350 people',
    amenities: ['Sunlit Multi-story Atrium', 'Children Library', 'Study Rooms', 'Filtered Water Refills'],
    openHours: '10:00 AM – 08:00 PM',
    cityId: 'salt-lake'
  },
  {
    id: 'slc-haven-2',
    name: 'Utah Cultural Celebration Center',
    address: '1355 W 3100 S, West Valley City, UT',
    type: 'Community Hall',
    filtration: 'Commercial Rooftop HEPA Units with Continuous PM Monitoring',
    indoorAqi: 20,
    capacity: '220 people',
    amenities: ['Community Warming Room', 'Senior Social Lounge', 'Art Gallery Space'],
    openHours: '08:00 AM – 06:00 PM',
    cityId: 'salt-lake'
  },

  // London
  {
    id: 'london-haven-1',
    name: 'British Library St. Pancras Clean Air Suite',
    address: '96 Euston Road, London NW1 2DB',
    type: 'Public Library',
    filtration: 'Conservation-grade MERV-15 HVAC with NO2/SO2 Chemical Filters',
    indoorAqi: 12,
    capacity: '500 people',
    amenities: ['Quiet Study Carrels', 'Free Wi-Fi', 'Public Exhibition Galleries', 'Cafe Facilities'],
    openHours: '09:30 AM – 08:00 PM',
    cityId: 'london'
  },

  // Lahore
  {
    id: 'lahore-haven-1',
    name: 'Quaid-e-Azam Library (Bagh-e-Jinnah)',
    address: 'Mall Road, Jubilee Town, Lahore',
    type: 'Public Library',
    filtration: 'Commercial Air Scrubbing Units with H13 HEPA Banks',
    indoorAqi: 35,
    capacity: '200 people',
    amenities: ['Historical Reading Halls', 'Inversion Haven Lounge', 'Nebulizer Support First-Aid'],
    openHours: '08:00 AM – 08:00 PM',
    cityId: 'lahore'
  },

  // Krakow
  {
    id: 'krakow-haven-1',
    name: 'Wojewódzka Biblioteka Publiczna w Krakowie',
    address: 'Rajska 1, 31-124 Kraków',
    type: 'Public Library',
    filtration: 'High-Efficiency Particulate Air Purification with Carbon Sorption',
    indoorAqi: 19,
    capacity: '180 people',
    amenities: ['Modern Reading Rooms', 'Co-working Pods', 'Children Corner', 'Tea Room'],
    openHours: '08:00 AM – 07:00 PM',
    cityId: 'krakow'
  },

  // Ulaanbaatar
  {
    id: 'ub-haven-1',
    name: 'National Library of Mongolia Warm Clean Haven',
    address: 'Chinggis Avenue 4, Ulaanbaatar',
    type: 'Public Library',
    filtration: 'Triple-Stage Heavy Particulate + HEPA H14 Cold-Climate Air Exchange',
    indoorAqi: 26,
    capacity: '220 people',
    amenities: ['Heated Sanctuary Rooms', 'Thermal Air Lock Foyer', 'Hot Milk Tea Bar'],
    openHours: '08:30 AM – 08:30 PM',
    cityId: 'ulaanbaatar'
  }
];
