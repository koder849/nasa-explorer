import { useState, useMemo } from 'react';
import ModelViewerR3F from '../components/ModelViewerR3F';

const NASA_3D_MODELS = [
  {
    id: 1,
    name: '70-Meter Dish',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/70-meter%20Dish/70%20meter%20dish.glb',
    category: 'Antennas',
    description: 'Deep Space Network 70-meter antenna dish used for planetary communications',
    center: 'Jet Propulsion Laboratory',
  },
  {
    id: 2,
    name: 'International Space Station',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/International%20Space%20Station%20(ISS)%20(A)/ISS_32_with_vehicles_22-Sep-2011.glb',
    category: 'Spacecraft',
    description: 'The orbital research laboratory maintained in low-Earth orbit',
    center: 'Johnson Space Center',
  },
  {
    id: 3,
    name: 'Saturn V Rocket',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Saturn%20V/Saturn%20V%20rocket.glb',
    category: 'Rockets',
    description: 'Legendary rocket that took astronauts to the Moon',
    center: 'Marshall Space Flight Center',
  },
  {
    id: 4,
    name: 'Space Shuttle',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20(A)/Space%20Shuttle.glb',
    category: 'Spacecraft',
    description: 'Reusable space shuttle for orbital missions',
    center: 'Johnson Space Center',
  },
  {
    id: 5,
    name: 'Cassini-Huygens',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Cassini-Huygens%20(A)/Cassini-Huygens_Deorbit_5.glb',
    category: 'Spacecraft',
    description: 'Spacecraft that explored Saturn and its moons for 13 years',
    center: 'Jet Propulsion Laboratory',
  },
  {
    id: 6,
    name: 'Apollo Lunar Module',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Apollo%20Lunar%20Module/Apollo%20Lunar%20Module.glb',
    category: 'Spacecraft',
    description: 'Historic spacecraft that landed astronauts on the Moon',
    center: 'Johnson Space Center',
  },
  {
    id: 7,
    name: 'Space Suit (Extravehicular)',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Extravehicular%20Mobility%20Unit/EMU.glb',
    category: 'Equipment',
    description: 'Pressurized suit worn by astronauts during spacewalks',
    center: 'Johnson Space Center',
  },
  {
    id: 8,
    name: 'Skylab Space Station',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Skylab/Skylab.glb',
    category: 'Spacecraft',
    description: 'Early space station used for scientific experiments',
    center: 'Marshall Space Flight Center',
  },
  {
    id: 9,
    name: 'Voyager Probe',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Voyager%20Probe%20(A)/Voyager.glb',
    category: 'Spacecraft',
    description: 'Interstellar probe exploring beyond our solar system',
    center: 'Jet Propulsion Laboratory',
  },
  {
    id: 10,
    name: 'Pioneer 10 Probe',
    url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Pioneer%2010/Pioneer%2010.glb',
    category: 'Spacecraft',
    description: 'Historic deep space probe launched in 1972',
    center: 'Ames Research Center',
  },
];

const CATEGORIES = ['All', ...new Set(NASA_3D_MODELS.map((m) => m.category))];

export default function Models3D() {
  const [selectedModel, setSelectedModel] = useState(NASA_3D_MODELS[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sceneMode, setSceneMode] = useState('water'); // Default to water scene

  const filteredModels = useMemo(() => {
    return NASA_3D_MODELS.filter((model) => {
      const categoryMatch = selectedCategory === 'All' || model.category === selectedCategory;
      const searchMatch =
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="space-y-6">
            {isFullScreen ? (
        // Fullscreen 3D viewer
        <ModelViewerR3F
          modelUrl={selectedModel.url}
          modelName={selectedModel.name}
          isFullScreen={true}
          onFullScreenChange={setIsFullScreen}
          onSceneChange={setSceneMode}
        />
      ) : (
        <>
          <section className="panel border border-white/10 p-5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.4em] text-chrome-500">3D Models</p>
                <h2 className="text-2xl font-semibold text-white">NASA 3D Resources</h2>
                <p className="text-sm text-chrome-300">
                  Explore interactive 3D models of spacecraft, telescopes, rovers, and more from NASA&apos;s collection.
                  Switch between scenes, models, and environments using the Leva control panel (press H).
                </p>
              </div>
              <label className="text-sm text-white">
                <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-chrome-500">Search models</span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-void-900 px-4 py-2 text-white outline-none transition placeholder:text-chrome-600 focus:border-ion-400"
                />
              </label>
            </div>
          </section>

          {/* 3D Viewer */}
          <ModelViewerR3F
            modelUrl={selectedModel.url}
            modelName={selectedModel.name}
            isFullScreen={false}
            onFullScreenChange={setIsFullScreen}
            onSceneChange={setSceneMode}
          />

          {/* Model Info */}
          <div className="panel border border-white/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedModel.name}</h3>
                <p className="mt-2 text-sm text-chrome-300">{selectedModel.description}</p>
                <div className="mt-3 flex gap-3 text-xs text-chrome-500">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{selectedModel.category}</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{selectedModel.center}</span>
                </div>
              </div>
              <a
                href={selectedModel.url}
                download={selectedModel.name}
                className="flex-shrink-0 px-4 py-2 rounded-2xl border border-ion-400 bg-ion-400/10 text-sm font-semibold text-ion-100 transition hover:bg-ion-400/20"
              >
                ⬇ Download GLB
              </a>
            </div>
          </div>

          {/* Category Filter */}
          <div className="panel border border-white/10 p-5">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-chrome-500">Filter by category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-ion-400/20 border border-ion-400 text-ion-100'
                      : 'bg-white/5 border border-white/10 text-chrome-400 hover:border-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-chrome-500">{filteredModels.length} models available</p>
          </div>

          {/* Model Gallery */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-chrome-500">Model gallery</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`group rounded-2xl border p-4 text-left transition ${
                    selectedModel.id === model.id
                      ? 'border-ion-400 bg-ion-400/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <p className="font-semibold text-white group-hover:text-ion-100">{model.name}</p>
                  <p className="mt-1 text-xs text-chrome-500">{model.category}</p>
                </button>
              ))}
            </div>
            {filteredModels.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-chrome-400">
                No models match your search. Try a different query or filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
