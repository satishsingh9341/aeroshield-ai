import { IndoorHack } from '../types';

export const INDOOR_HACKS: IndoorHack[] = [
  {
    id: 'cr-box-fan',
    title: 'The Corsi-Rosenthal Box Purifier (DIY)',
    category: 'filtration',
    difficulty: 'DIY Builder',
    cost: '$30 - $70',
    pmReductionPercent: 92,
    badge: 'Gold Standard DIY',
    summary: 'A world-renowned DIY air cleaner combining a 20-inch box fan with 4 or 5 MERV-13 furnace filters taped into a cube. Delivers equal or higher CADR than $500 commercial HEPA units.',
    steps: [
      'Obtain four 20x20x1 or 20x20x2 MERV-13 furnace filters, one 20-inch standard box fan, and standard duct tape.',
      'Orient filter arrows inward towards the center (so air flows into the box, filtered before hitting fan).',
      'Tape the 4 filters into a 4-sided open cube, using cardboard or a 5th filter for the bottom floor.',
      'Place the 20" box fan on top, blowing upwards into the room.',
      'Cut a circular cardboard "shroud" covering the fan corners to eliminate back-pressure vortices (increases airflow by 30%). Tape securely.'
    ],
    scientificMechanism: 'MERV-13 pleats offer massive surface area (~40 sq ft total), dramatically reducing air resistance. This allows high Clean Air Delivery Rates (CADR 350-500 CFM) with low motor strain.',
    proTip: 'A single Comparetto (single-filter wedge) or 4-filter CR Box provides 5+ air changes per hour (ACH) in an average 250 sq ft room for less than $45.',
    warning: 'Never use MERV 8 (too porous for PM2.5) or cheap cardboard tape that dries out. Inspect fan motor after 6 months for dust buildup.'
  },
  {
    id: 'solar-noon-flush',
    title: 'Solar Noon "Micro-Flushing" Protocol',
    category: 'ventilation',
    difficulty: 'Easy',
    cost: '$0 (Free)',
    pmReductionPercent: 65,
    badge: 'Inversion Physics',
    summary: 'Never open windows at 7 AM or 9 PM during winter smog. Instead, use the brief 1:00 PM – 2:30 PM atmospheric mixing window when solar radiation heats the surface and lifts the inversion ceiling.',
    steps: [
      'Monitor your AeroShield hourly forecast for the highest boundary layer ceiling (usually 12:30 PM to 2:30 PM).',
      'Crack windows on opposing sides of the home by 2 inches for precisely 8 to 12 minutes to vent indoor CO2 and TVOCs.',
      'Keep your indoor HEPA or CR Box fan running on HIGH during and for 30 minutes after the flush.',
      'Immediately seal all latches once outdoor solar angles diminish and surface cooling commences.'
    ],
    scientificMechanism: 'Overnight thermal inversion traps emissions within 100-200m of ground. Midday sunlight induces vertical convective mixing, diluting PM2.5 by 40-60% before radiative cooling resets the thermal trap at dusk.',
    proTip: 'Hang a damp cotton towel or high-thread count muslin cloth over the open window crack to act as an inertial particulate impaction barrier.',
    warning: 'If outdoor AQI exceeds 450 even at solar noon, keep windows sealed and rely on indoor plants or CO2 spot ventilation only.'
  },
  {
    id: 'ultrasonic-humidifier-alert',
    title: 'The Ultrasonic Humidifier Mineral Mist Trap',
    category: 'plants-humidity',
    difficulty: 'Easy',
    cost: '$0 (Free)',
    pmReductionPercent: 88,
    badge: 'Critical Awareness',
    summary: 'Ultrasonic humidifiers filled with tap water atomize dissolved calcium and magnesium (TDS) directly into the air, creating airborne particles that laser PM2.5 sensors read as 300+ µg/m³!',
    steps: [
      'Stop using municipal or hard tap water in ultrasonic (cool mist) humidifiers during smog season.',
      'Switch immediately to distilled water, demineralized water, or reverse osmosis (RO) zero-TDS water.',
      'Better alternative: Switch to an Evaporative (wick-based) humidifier or passive radiator water basins, which leave dissolved minerals behind on the wick/tray.',
      'Maintain indoor relative humidity between 40% and 50% to prevent respiratory mucus membranes from drying out.'
    ],
    scientificMechanism: 'Ultrasonic piezoelectric transducers shatter water into 1-5 micron droplets. As water evaporates mid-air, leftover mineral salts become inhalable inorganic PM2.5 particles that trigger lung inflammation.',
    proTip: 'If your indoor laser PM2.5 monitor spikes wildly whenever your humidifier turns on, you are inhaling mineral particulate aerosol!',
    warning: 'Do not run ultrasonic humidifiers overnight in infant bedrooms with untreated tap water.'
  },
  {
    id: 'clean-cooking-vent',
    title: 'Smog-Safe Cooking & Range-Hood Optimization',
    category: 'cooking-clean',
    difficulty: 'Easy',
    cost: '$0 (Free)',
    pmReductionPercent: 75,
    badge: 'Kitchen Health',
    summary: 'Deep frying or searing during smog season generates indoor PM2.5 exceeding 600 µg/m³. Simple culinary adjustments and backdraft suppression protect indoor air without cooling the house.',
    steps: [
      'Always use back burners when cooking on gas or induction: range hoods capture up to 80% on rear burners vs 50% on front.',
      'Turn on range exhaust hood 2 minutes BEFORE striking flame to establish thermal updraft draft.',
      'Avoid deep frying, dry roasting chilies, or wok searing on code-red smog days; favor steaming, boiling, pressure cooking, or enclosed slow ovens.',
      'Keep kitchen door closed to prevent aerosolized cooking oil from entering sleeping quarters.'
    ],
    scientificMechanism: 'Heating cooking oils past smoke points causes thermal pyrolysis, generating acrolein, polycyclic aromatic hydrocarbons (PAHs), and ultrafine particles (<0.1 µm) that penetrate the bloodstream.',
    proTip: 'Covering pots with lids reduces particulate release by over 60% and saves 25% cooking energy/gas.',
    warning: 'Never run a high-CFM exhaust fan in a tightly sealed apartment without a small makeup air crack, otherwise it can pull deadly CO from gas water heaters.'
  },
  {
    id: 'door-sweep-sealing',
    title: 'Wet-Towel Dam & Weather-Stripping Hack',
    category: 'sealing',
    difficulty: 'Easy',
    cost: '$0 (Free)',
    pmReductionPercent: 45,
    badge: 'Budget Insulation',
    summary: 'External gaps under main entry doors and drafty window sashes allow heavy particulate-laden cold air to infiltrate due to the indoor stack effect.',
    steps: [
      'Place a damp, rolled heavy bath towel at the threshold of the main door opening into common hallways or outdoors.',
      'Apply self-adhesive V-strip or foam weatherstripping ($4 at hardware stores) along window jambs.',
      'Tape plastic shrink wrap or bubble wrap over single-pane drafty windows to create an insulating stagnant air layer.',
      'Keep internal room doors closed to zone-off clean filtered bedrooms from drafty foyers.'
    ],
    scientificMechanism: 'Warm indoor air rises and escapes through upper crevices, pulling smoggy outside air inward through low-level door gaps via negative air pressure (the building stack effect).',
    proTip: 'Damp cloth traps settling micro-soot through Brownian diffusion and capillary adhesion much better than dry rubber sweeps.',
  },
  {
    id: 'phytoremediation-humidity',
    title: 'Indoor Botanic Humidity & Dust Buffers',
    category: 'plants-humidity',
    difficulty: 'Moderate',
    cost: '$5 - $20',
    pmReductionPercent: 30,
    badge: 'Living Greenery',
    summary: 'While plants cannot replace mechanical HEPA filters for heavy PM2.5, specific species buffer winter dry air, absorb formaldehyde from sealed spaces, and capture coarse settling dust.',
    steps: [
      'Place 2 to 3 Areca Palms, Snake Plants (Sansevieria), or Spider Plants per 100 sq ft.',
      'Wipe plant leaves weekly with a damp microfiber cloth: electrostatic leaf surfaces trap airborne particulate.',
      'Use porous terracotta pots: they naturally transpire moisture into the room, stabilizing winter humidity around 45%.',
      'Avoid overwatering to prevent soil mold spores (Aspergillus) from degrading indoor air quality.'
    ],
    scientificMechanism: 'Phytoremediation occurs as plant stomata exchange gases, while leaf cuticular waxes adsorb lipophilic airborne hydrocarbons. Transpiration raises relative humidity, causing dust particles to agglomerate and drop out of breathing zone.',
    proTip: 'Snake Plants (Mother-in-Law’s Tongue) perform Crassulacean Acid Metabolism (CAM), meaning they produce oxygen and absorb CO2 at night — ideal for bedrooms.',
  }
];
