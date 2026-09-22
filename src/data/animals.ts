export interface Animal {
  /** Also the image filename in src/assets/animals (without extension). */
  id: string
  name: string
  scientificName: string
  description: string
  fact: string
}

export const animals: Animal[] = [
  {
    id: 'red-fox',
    name: 'Red fox',
    scientificName: 'Vulpes vulpes',
    description:
      'The most widespread wild carnivore on Earth, found across the Northern Hemisphere and introduced to Australia.',
    fact: 'When pouncing on prey under snow, red foxes strike far more often when facing roughly north-east, suggesting they use Earth’s magnetic field to aim.',
  },
  {
    id: 'axolotl',
    name: 'Axolotl',
    scientificName: 'Ambystoma mexicanum',
    description:
      'A salamander that never grows up: it keeps its feathery gills and lives in water its whole life. In the wild it is found only around Mexico City.',
    fact: 'It can regrow lost limbs, parts of its spinal cord and heart, and even parts of its brain.',
  },
  {
    id: 'lion',
    name: 'Lion',
    scientificName: 'Panthera leo',
    description:
      'The only truly social big cat, living in prides of related females, their cubs and a few males.',
    fact: 'Lions can spend up to 20 hours a day resting or sleeping.',
  },
  {
    id: 'common-octopus',
    name: 'Common octopus',
    scientificName: 'Octopus vulgaris',
    description:
      'A master of disguise that can change the colour and texture of its skin in a fraction of a second.',
    fact: 'It has three hearts and blue blood, and most of its neurons are in its arms rather than its head.',
  },
  {
    id: 'snowy-owl',
    name: 'Snowy owl',
    scientificName: 'Bubo scandiacus',
    description:
      'A large Arctic owl with thick feathers covering even its feet, built to survive temperatures far below freezing.',
    fact: 'Unlike most owls it hunts by day. In the Arctic summer the sun never sets, so it has little choice.',
  },
  {
    id: 'platypus',
    name: 'Platypus',
    scientificName: 'Ornithorhynchus anatinus',
    description:
      'One of the only mammals that lays eggs. It hunts with its eyes, ears and nostrils shut, sensing prey through electroreceptors in its bill.',
    fact: 'Under UV light, platypus fur glows blue-green.',
  },
  {
    id: 'bengal-tiger',
    name: 'Bengal tiger',
    scientificName: 'Panthera tigris tigris',
    description:
      'The most numerous tiger subspecies, living mainly in India. Tigers are the largest cats in the world.',
    fact: 'A tiger’s stripes aren’t just on its fur: its skin is striped too.',
  },
  {
    id: 'mantis-shrimp',
    name: 'Peacock mantis shrimp',
    scientificName: 'Odontodactylus scyllarus',
    description:
      'A colourful crustacean with some of the most complex eyes known, using up to 16 types of photoreceptors. Humans have three types of colour receptors.',
    fact: 'Its punch is so fast it makes the water around it boil into tiny bubbles, which collapse and hit the prey a second time.',
  },
  {
    id: 'emperor-penguin',
    name: 'Emperor penguin',
    scientificName: 'Aptenodytes forsteri',
    description:
      'The largest penguin. Males keep a single egg warm on their feet through the Antarctic winter, going about two months without food.',
    fact: 'It can dive deeper than 500 m and hold its breath for over 20 minutes.',
  },
  {
    id: 'sloth',
    name: 'Brown-throated sloth',
    scientificName: 'Bradypus variegatus',
    description:
      'A three-toed sloth from Central and South America that climbs down from the trees only about once a week, to go to the toilet.',
    fact: 'Algae grows in its fur, giving it a greenish tint that helps it hide in the canopy.',
  },
  {
    id: 'african-elephant',
    name: 'African bush elephant',
    scientificName: 'Loxodonta africana',
    description:
      'The largest living land animal. Adult males can weigh over 6 tonnes.',
    fact: 'Elephants can pick up the rumbles of distant herds through the ground, sensing the vibrations with their feet and trunks.',
  },
  {
    id: 'poison-dart-frog',
    name: 'Golden poison frog',
    scientificName: 'Phyllobates terribilis',
    description:
      'A tiny frog from the rainforests of Colombia’s Pacific coast and one of the most poisonous animals on Earth.',
    fact: 'A single wild frog carries enough poison to kill about ten adults, but captive-bred ones are harmless because the toxin comes from their wild diet.',
  },
  {
    id: 'giraffe',
    name: 'Giraffe',
    scientificName: 'Giraffa camelopardalis',
    description:
      'The tallest animal on Earth, reaching around 5.5 m. Its dark tongue is about 45 cm long.',
    fact: 'Despite its huge neck, a giraffe has just seven neck vertebrae, the same number as you.',
  },
  {
    id: 'red-panda',
    name: 'Red panda',
    scientificName: 'Ailurus fulgens',
    description:
      'A tree-dwelling mammal from the Himalayas. It isn’t a close relative of the giant panda: it is the only living member of its own family.',
    fact: 'It has a “false thumb”, an extended wrist bone that helps it grip bamboo.',
  },
  {
    id: 'arctic-wolf',
    name: 'Arctic wolf',
    scientificName: 'Canis lupus arctos',
    description:
      'A white-coated subspecies of the grey wolf that lives in the High Arctic, where the sun doesn’t rise for months in winter.',
    fact: 'A wolf’s howl can carry up to 10 km through forest, and even further across open tundra.',
  },
  {
    id: 'flamingo',
    name: 'American flamingo',
    scientificName: 'Phoenicopterus ruber',
    description:
      'Feeds with its head upside down, pumping water through comb-like plates in its bill to filter out food.',
    fact: 'Flamingos aren’t born pink. Chicks are grey, and the colour comes from pigments in the algae and shrimp they eat.',
  },
  {
    id: 'cheetah',
    name: 'Cheetah',
    scientificName: 'Acinonyx jubatus',
    description:
      'The fastest land animal, reaching around 100 km/h in short bursts.',
    fact: 'Cheetahs can’t roar. Instead they purr, chirp and make bird-like sounds.',
  },
  {
    id: 'panther-chameleon',
    name: 'Panther chameleon',
    scientificName: 'Furcifer pardalis',
    description:
      'A brightly coloured lizard from Madagascar whose eyes can move independently of each other.',
    fact: 'Chameleons change colour mainly to communicate and control their temperature, not to hide. They do it by rearranging tiny crystals in their skin.',
  },
  {
    id: 'koala',
    name: 'Koala',
    scientificName: 'Phascolarctos cinereus',
    description:
      'Lives almost entirely on eucalyptus leaves, which are poor in nutrients, so it sleeps up to 20 hours a day to save energy.',
    fact: 'Koala fingerprints are so similar to human ones that they are hard to tell apart even under a microscope.',
  },
  {
    id: 'hummingbird',
    name: 'Ruby-throated hummingbird',
    scientificName: 'Archilochus colubris',
    description:
      'Weighs about 3 g, yet many fly nonstop across the Gulf of Mexico each autumn, a trip of around 800 km.',
    fact: 'Hummingbirds are the only birds that can fly backwards.',
  },
  {
    id: 'sea-otter',
    name: 'Sea otter',
    scientificName: 'Enhydra lutris',
    description:
      'One of the few tool-using mammals: it floats on its back and cracks shellfish open with a rock on its chest.',
    fact: 'It has the densest fur of any animal, around 150,000 hairs per square centimetre.',
  },
  {
    id: 'capybara',
    name: 'Capybara',
    scientificName: 'Hydrochoerus hydrochaeris',
    description:
      'The largest rodent in the world, a semi-aquatic grazer from South America with slightly webbed feet.',
    fact: 'It eats its own droppings to get a second round of nutrients out of the tough grass it feeds on.',
  },
]
