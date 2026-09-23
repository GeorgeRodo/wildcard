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
  {
    id: 'polar-bear',
    name: 'Polar bear',
    scientificName: 'Ursus maritimus',
    description:
      'The largest land carnivore, built for the sea ice, with paws up to 30 cm across that spread its weight and work as paddles.',
    fact: 'Its fur isn’t white. The hairs are hollow and see-through, and the skin underneath is black.',
  },
  {
    id: 'arctic-fox',
    name: 'Arctic fox',
    scientificName: 'Vulpes lagopus',
    description:
      'A small fox of the northern tundra whose coat turns from brown in summer to thick white in winter.',
    fact: 'It can cope with temperatures down to about −50 °C, the warmest coat of any Arctic animal.',
  },
  {
    id: 'moose',
    name: 'Moose',
    scientificName: 'Alces alces',
    description:
      'The largest deer, standing up to 2 m at the shoulder. It wades and dives for water plants in summer.',
    fact: 'Bulls drop their antlers every winter and grow a new set, up to 1.8 m across, in a single summer.',
  },
  {
    id: 'american-bison',
    name: 'American bison',
    scientificName: 'Bison bison',
    description:
      'North America’s largest land animal. Herds were hunted to near extinction in the 1800s and have since been brought back.',
    fact: 'Despite weighing up to a tonne, it can run at 55 km/h and jump obstacles nearly 2 m high.',
  },
  {
    id: 'raccoon',
    name: 'Raccoon',
    scientificName: 'Procyon lotor',
    description:
      'A clever night-time forager that has taken happily to towns and cities across North America and Europe.',
    fact: 'Its front paws are extraordinarily sensitive, and wetting them makes its sense of touch sharper still.',
  },
  {
    id: 'fennec-fox',
    name: 'Fennec fox',
    scientificName: 'Vulpes zerda',
    description:
      'The smallest fox in the world, weighing about 1 kg, at home in the sand of the Sahara.',
    fact: 'Its oversized ears aren’t just for listening. They shed body heat, working like radiators.',
  },
  {
    id: 'meerkat',
    name: 'Meerkat',
    scientificName: 'Suricata suricatta',
    description:
      'Lives in tight-knit groups in southern Africa, where one member stands guard while the others dig for food.',
    fact: 'Meerkats are resistant to scorpion venom, and adults teach pups how to handle a scorpion safely.',
  },
  {
    id: 'honey-badger',
    name: 'Honey badger',
    scientificName: 'Mellivora capensis',
    description:
      'A famously fearless digger that will raid beehives and see off animals far larger than itself.',
    fact: 'Its skin is thick and so loose that when something grabs it, it can twist around inside its own hide and bite back.',
  },
  {
    id: 'wombat',
    name: 'Common wombat',
    scientificName: 'Vombatus ursinus',
    description:
      'A stocky Australian burrower with a backwards-facing pouch, so digging doesn’t fill it with soil.',
    fact: 'Its droppings come out cube-shaped, squared off inside the intestine so they don’t roll off the rocks it marks.',
  },
  {
    id: 'red-kangaroo',
    name: 'Red kangaroo',
    scientificName: 'Osphranter rufus',
    description:
      'The largest marsupial. Hopping stores energy in its tendons, so going faster costs it almost nothing extra.',
    fact: 'It can’t walk backwards: its big feet and stiff tail get in the way.',
  },
  {
    id: 'tasmanian-devil',
    name: 'Tasmanian devil',
    scientificName: 'Sarcophilus harrisii',
    description:
      'The largest carnivorous marsupial, found only in Tasmania, and a noisy squabbler over carcasses.',
    fact: 'For its size it has one of the strongest bites of any mammal, and it eats bone and fur as well as meat.',
  },
  {
    id: 'kea',
    name: 'Kea',
    scientificName: 'Nestor notabilis',
    description:
      'The only alpine parrot in the world, living in the mountains of New Zealand’s South Island and notorious for stripping rubber from parked cars.',
    fact: 'Keas have a warbling “play call” that puts other keas in the mood to play, the first known case of a contagious emotional call outside mammals.',
  },
  {
    id: 'atlantic-puffin',
    name: 'Atlantic puffin',
    scientificName: 'Fratercula arctica',
    description:
      'Spends most of the year out at sea, coming ashore in summer to nest in burrows on cliff tops.',
    fact: 'Backwards-pointing spines on its tongue let it hold a dozen fish crosswise in its beak while still catching more.',
  },
  {
    id: 'peregrine-falcon',
    name: 'Peregrine falcon',
    scientificName: 'Falco peregrinus',
    description:
      'Found on every continent except Antarctica, and increasingly nesting on city skyscrapers instead of cliffs.',
    fact: 'It is the fastest animal alive, diving at over 320 km/h, with baffles in its nostrils so the air doesn’t burst its lungs.',
  },
  {
    id: 'secretary-bird',
    name: 'Secretary bird',
    scientificName: 'Sagittarius serpentarius',
    description:
      'A long-legged bird of prey that hunts on foot across the African savanna instead of from the air.',
    fact: 'It kills snakes by stamping on them, striking with about five times its own body weight in a hundredth of a second.',
  },
  {
    id: 'toco-toucan',
    name: 'Toco toucan',
    scientificName: 'Ramphastos toco',
    description:
      'The largest toucan, with a bill a third the length of its body that is mostly hollow and very light.',
    fact: 'That huge bill is a radiator: the bird pumps blood through it to dump heat, like an elephant’s ears.',
  },
  {
    id: 'komodo-dragon',
    name: 'Komodo dragon',
    scientificName: 'Varanus komodoensis',
    description:
      'The largest lizard alive, up to 3 m long, living on a handful of Indonesian islands.',
    fact: 'It has venom glands in its lower jaw, and its bite stops its prey’s blood from clotting.',
  },
  {
    id: 'green-sea-turtle',
    name: 'Green sea turtle',
    scientificName: 'Chelonia mydas',
    description:
      'The only sea turtle that grazes on seagrass and algae as an adult, which is what tints its fat green.',
    fact: 'The temperature of the nest decides the hatchlings’ sex: warmer sand produces females.',
  },
  {
    id: 'leafy-seadragon',
    name: 'Leafy seadragon',
    scientificName: 'Phycodurus eques',
    description:
      'A relative of the seahorse from southern Australia, covered in leaf-shaped flaps that mimic drifting seaweed.',
    fact: 'The male carries the eggs, holding about 250 of them on the underside of his tail until they hatch.',
  },
  {
    id: 'moon-jelly',
    name: 'Moon jelly',
    scientificName: 'Aurelia aurita',
    description:
      'A common jellyfish found in coastal waters worldwide, drifting with the current and feeding on plankton.',
    fact: 'It has no brain, heart or blood, and is about 95% water.',
  },
  {
    id: 'clownfish',
    name: 'Clownfish',
    scientificName: 'Amphiprion ocellaris',
    description:
      'Lives among the stinging tentacles of a sea anemone, protected by a mucus coating that stops it being stung.',
    fact: 'Every clownfish is born male. When the group’s female dies, the dominant male turns into a female.',
  },
  {
    id: 'whale-shark',
    name: 'Whale shark',
    scientificName: 'Rhincodon typus',
    description:
      'The largest fish in the sea at up to 18 m, and a harmless filter feeder that strains plankton from the water.',
    fact: 'Its pattern of spots is unique to each shark, so researchers identify individuals from photographs.',
  },
  {
    id: 'monarch-butterfly',
    name: 'Monarch butterfly',
    scientificName: 'Danaus plexippus',
    description:
      'Feeds only on milkweed as a caterpillar, which makes it poisonous to birds for the rest of its life.',
    fact: 'Its migration to Mexico takes several generations, yet the great-grandchildren find the same few forests.',
  },
  {
    id: 'leafcutter-ant',
    name: 'Leafcutter ant',
    scientificName: 'Atta cephalotes',
    description:
      'Carves up leaves and carries the pieces underground in columns, running some of the largest colonies on Earth.',
    fact: 'It doesn’t eat the leaves. It farms them, growing a fungus on the cuttings and eating that instead.',
  },
  {
    id: 'orangutan',
    name: 'Bornean orangutan',
    scientificName: 'Pongo pygmaeus',
    description:
      'The largest tree-dwelling animal, with an arm span of over 2 m, building a fresh nest to sleep in each night.',
    fact: 'When it rains, orangutans have been seen holding big leaves over their heads as umbrellas.',
  },
  {
    id: 'snow-leopard',
    name: 'Snow leopard',
    scientificName: 'Panthera uncia',
    description:
      'A big cat of the high mountains of Central Asia, rarely seen, with fur so thick it covers the soles of its paws.',
    fact: 'It can’t roar, and its metre-long tail doubles as balance on cliffs and as a scarf when it sleeps.',
  },
  {
    id: 'zebra',
    name: 'Plains zebra',
    scientificName: 'Equus quagga',
    description:
      'The most common zebra, living in family groups across eastern and southern Africa. No two are striped alike.',
    fact: 'The stripes seem to be insect repellent: biting flies approach striped hides as often as plain ones, but fail to land on them.',
  },
  {
    id: 'hippopotamus',
    name: 'Hippopotamus',
    scientificName: 'Hippopotamus amphibius',
    description:
      'Spends its days in rivers and lakes and comes out at night to graze. Despite its bulk it can outrun a person over short distances.',
    fact: 'It sweats a reddish oil that works as both sunscreen and antiseptic, which is why hippos look like they are bleeding.',
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    scientificName: 'Panthera onca',
    description:
      'The biggest cat in the Americas, and an unusually strong swimmer that hunts caimans and turtles in the water.',
    fact: 'It kills by biting straight through the skull, and its bite is the strongest of any big cat for its size.',
  },
  {
    id: 'humpback-whale',
    name: 'Humpback whale',
    scientificName: 'Megaptera novaeangliae',
    description:
      'Migrates up to 8,000 km between feeding and breeding grounds, and herds fish by blowing curtains of bubbles.',
    fact: 'Males sing long, structured songs that keep changing, and the new version spreads across a whole ocean population.',
  },
  {
    id: 'manatee',
    name: 'West Indian manatee',
    scientificName: 'Trichechus manatus',
    description:
      'A slow, wholly vegetarian sea mammal that grazes seagrass in warm shallow water and must surface to breathe.',
    fact: 'Its closest living relatives are elephants, and like them it replaces its worn teeth throughout its life.',
  },
  {
    id: 'orca',
    name: 'Orca',
    scientificName: 'Orcinus orca',
    description:
      'The largest dolphin, hunting in family groups led by the oldest female, with techniques passed down the generations.',
    fact: 'Each pod has its own dialect of calls, different enough that researchers can tell pods apart by sound alone.',
  },
  {
    id: 'giant-anteater',
    name: 'Giant anteater',
    scientificName: 'Myrmecophaga tridactyla',
    description:
      'Walks on its knuckles to keep its digging claws sharp, and sleeps curled under its own bushy tail.',
    fact: 'It has no teeth at all. Its 60 cm tongue flicks in and out about 150 times a minute to gather ants.',
  },
  {
    id: 'armadillo',
    name: 'Nine-banded armadillo',
    scientificName: 'Dasypus novemcinctus',
    description:
      'Armoured in bony plates, it can cross a river either by floating, having gulped air, or by walking along the bottom.',
    fact: 'It nearly always gives birth to four identical young, all from a single egg.',
  },
  {
    id: 'ostrich',
    name: 'Ostrich',
    scientificName: 'Struthio camelus',
    description:
      'The largest and fastest bird on land, running at 70 km/h on two toes and kicking hard enough to injure a lion.',
    fact: 'Each eye is about 5 cm across and weighs more than its brain.',
  },
  {
    id: 'ring-tailed-lemur',
    name: 'Ring-tailed lemur',
    scientificName: 'Lemur catta',
    description:
      'The most ground-dwelling lemur, found only in Madagascar, and fond of sunbathing upright with its arms out.',
    fact: 'Males hold “stink fights”: they rub scent onto their tails and waft it at each other until one backs down.',
  },
  {
    id: 'hedgehog',
    name: 'European hedgehog',
    scientificName: 'Erinaceus europaeus',
    description:
      'Carries about 5,000 spines, rolls into a ball when threatened and sleeps through the winter.',
    fact: 'Meeting a strong new smell, it chews until it froths and then spreads the foam over its own spines. Nobody is sure why.',
  },
  {
    id: 'dung-beetle',
    name: 'Dung beetle',
    scientificName: 'Deltochilum mexicanum',
    description:
      'Rolls balls of dung away from the pile to bury as food, burying more of it than any other group of insects.',
    fact: 'It keeps to a straight line by reading the sky, and one African species steers by the Milky Way.',
  },
]
