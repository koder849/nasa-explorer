import { useEffect, useMemo, useState } from "react";
import ModelViewerR3F from "../components/ModelViewerR3F";

// Comprehensive NASA 3D Models Database
const NASA_3D_MODELS = [
  // ANTENNAS & DISHES
  { id: 1, name: '70-Meter Dish', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/70-meter%20Dish/70%20meter%20dish.glb', category: 'Antennas', description: 'Deep Space Network 70-meter antenna dish used for planetary communications', center: 'Jet Propulsion Laboratory' },
  { id: 2, name: 'Deep Space Network 34-meter', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Deep%20Space%20Network%2034-meter/Deep%20Space%20Network%2034-meter.glb', category: 'Antennas', description: 'DSN 34-meter antenna for space communications', center: 'Jet Propulsion Laboratory' },
  { id: 3, name: 'Deep Space Network 70-meter', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Deep%20Space%20Network%2070-meter/Deep%20Space%20Network%2070-meter.glb', category: 'Antennas', description: 'Large DSN antenna for deep space communication', center: 'Jet Propulsion Laboratory' },
  { id: 4, name: 'Tall Dish', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Tall%20Dish/Tall%20Dish%20(dish).glb', category: 'Antennas', description: 'Tall antenna dish structure', center: 'Jet Propulsion Laboratory' },
  { id: 5, name: 'Radome', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Radome/Radome.glb', category: 'Antennas', description: 'Protective radome covering for antennas', center: 'Jet Propulsion Laboratory' },

  // TELESCOPES & OBSERVATORIES
  { id: 6, name: 'Hubble Space Telescope (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Hubble%20Space%20Telescope%20(A)/Hubble%20Space%20Telescope%20(A).glb', category: 'Telescopes', description: 'Orbiting observatory revealing universe secrets', center: 'Goddard Space Flight Center' },
  { id: 7, name: 'Hubble Space Telescope (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Hubble%20Space%20Telescope%20(B)/Hubble%20Space%20Telescope%20(B).glb', category: 'Telescopes', description: 'Alternative Hubble model view', center: 'Goddard Space Flight Center' },
  { id: 8, name: 'James Webb Space Telescope (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/James%20Webb%20Space%20Telescope%20(A)/James%20Webb%20Space%20Telescope%20(A).glb', category: 'Telescopes', description: 'Next-generation infrared space telescope', center: 'Goddard Space Flight Center' },
  { id: 9, name: 'James Webb Space Telescope (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/James%20Webb%20Space%20Telescope%20(B)/James%20Webb%20Space%20Telescope%20(B).glb', category: 'Telescopes', description: 'JWST alternative configuration', center: 'Goddard Space Flight Center' },
  { id: 10, name: 'Chandra X-ray Observatory', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Chandra%20X-ray%20Observatory/Chandra%20X-ray%20Observatory.glb', category: 'Telescopes', description: 'X-ray observatory studying cosmic phenomena', center: 'Marshall Space Flight Center' },
  { id: 11, name: 'Spitzer Space Telescope', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Spitzer%20Space%20Telescope/Spitzer%20Space%20Telescope.glb', category: 'Telescopes', description: 'Infrared space observatory', center: 'Jet Propulsion Laboratory' },
  { id: 12, name: 'Solar Dynamics Observatory', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Solar%20Dynamics%20Observatory/Solar%20Dynamics%20Observatory.glb', category: 'Telescopes', description: 'Studies the Sun and its dynamic processes', center: 'Goddard Space Flight Center' },
  { id: 13, name: 'Solar and Heliospheric Observatory', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Solar%20and%20Heliospheric%20Observatory/Solar%20and%20Heliospheric%20Observatory.glb', category: 'Telescopes', description: 'Joint ESA/NASA solar observatory', center: 'Goddard Space Flight Center' },
  { id: 14, name: 'Kepler (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Kepler%20(A)/Kepler%20(A).glb', category: 'Telescopes', description: 'Exoplanet discovery mission', center: 'Ames Research Center' },
  { id: 15, name: 'Kepler (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Kepler%20(B)/Kepler%20(B).glb', category: 'Telescopes', description: 'Kepler Space Telescope alternative', center: 'Ames Research Center' },
  { id: 16, name: 'Nancy Grace Roman Space Telescope (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Nancy%20Grace%20Roman%20Space%20Telescope%20(A)/Nancy%20Grace%20Roman%20Space%20Telescope%20(A).glb', category: 'Telescopes', description: 'Future wide-field infrared telescope', center: 'Goddard Space Flight Center' },

  // SPACE STATIONS
  { id: 17, name: 'International Space Station (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/International%20Space%20Station%20(ISS)%20(A)/International%20Space%20Station%20(ISS)%20(A).glb', category: 'Space Stations', description: 'The orbital research laboratory in low-Earth orbit', center: 'Johnson Space Center' },
  { id: 18, name: 'International Space Station (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/International%20Space%20Station%20(ISS)%20(B)/International%20Space%20Station%20(ISS)%20(B).glb', category: 'Space Stations', description: 'ISS alternative representation', center: 'Johnson Space Center' },
  { id: 19, name: 'Skylab Space Station', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Skylab/Skylab.glb', category: 'Space Stations', description: 'Early US space station', center: 'Marshall Space Flight Center' },
  { id: 20, name: 'Mir Space Station', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mir/Mir.glb', category: 'Space Stations', description: 'Russian orbital space station', center: 'Johnson Space Center' },
  { id: 21, name: 'Gateway Core', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Gateway/Gateway%20Core.glb', category: 'Space Stations', description: 'Lunar Gateway station core module', center: 'Marshall Space Flight Center' },

  // SPACECRAFT & PROBES
  { id: 22, name: 'Cassini-Huygens (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Cassini-Huygens%20(A)/Cassini-Huygens%20(A).glb', category: 'Spacecraft', description: 'Saturn exploration spacecraft', center: 'Jet Propulsion Laboratory' },
  { id: 23, name: 'Cassini-Huygens (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Cassini-Huygens%20(B)/Cassini-Huygens%20(B).glb', category: 'Spacecraft', description: 'Cassini alternative configuration', center: 'Jet Propulsion Laboratory' },
  { id: 24, name: 'Parker Solar Probe', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Parker%20Solar%20Probe/Parker%20Solar%20Probe.glb', category: 'Spacecraft', description: 'Sun-studying mission touching solar corona', center: 'Johns Hopkins University APL' },
  { id: 25, name: 'Juno (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Juno%20(A)/Juno%20(A).glb', category: 'Spacecraft', description: 'Jupiter orbital mission', center: 'Jet Propulsion Laboratory' },
  { id: 26, name: 'Juno (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Juno%20(B)/Juno%20(B).glb', category: 'Spacecraft', description: 'Juno spacecraft alternative', center: 'Jet Propulsion Laboratory' },
  { id: 27, name: 'Dawn', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Dawn/Dawn.glb', category: 'Spacecraft', description: 'Asteroid/dwarf planet explorer', center: 'Jet Propulsion Laboratory' },
  { id: 28, name: 'Rosetta', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Rosetta/Rosetta.glb', category: 'Spacecraft', description: 'Comet exploration spacecraft', center: 'European Space Agency' },
  { id: 29, name: 'Stardust', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Stardust/Stardust.glb', category: 'Spacecraft', description: 'Comet sample return mission', center: 'Jet Propulsion Laboratory' },
  { id: 30, name: 'Deep Impact', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Deep%20Impact%20(EPOXI)/Deep%20Impact.glb', category: 'Spacecraft', description: 'Comet impact mission', center: 'Jet Propulsion Laboratory' },
  { id: 31, name: 'Galileo', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Galileo/Galileo.glb', category: 'Spacecraft', description: 'Jupiter orbital and probe mission', center: 'Jet Propulsion Laboratory' },
  { id: 32, name: 'Magellan', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Magellan/Magellan.glb', category: 'Spacecraft', description: 'Venus mapping spacecraft', center: 'Jet Propulsion Laboratory' },
  { id: 33, name: 'MESSENGER', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/MErcury%20Surface%2C%20Space%20ENvironment%2C%20GEochemistry%2C%20and%20Ranging%20(MESSENGER)/MErcury%20Surface%2C%20Space%20ENvironment%2C%20GEochemistry%2C%20and%20Ranging%20(MESSENGER).glb', category: 'Spacecraft', description: 'Mercury orbital mission', center: 'Johns Hopkins University APL' },
  { id: 34, name: 'Voyager Probe (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Voyager%20Probe%20(A)/Voyager%20Probe%20(A).glb', category: 'Spacecraft', description: 'Interstellar probe exploring beyond solar system', center: 'Jet Propulsion Laboratory' },
  { id: 35, name: 'Voyager Probe (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Voyager%20Probe%20(B)/Voyager%20Probe%20(B).glb', category: 'Spacecraft', description: 'Voyager alternative model', center: 'Jet Propulsion Laboratory' },
  { id: 36, name: 'Pioneer 10', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Pioneer%2010/Pioneer%2010.glb', category: 'Spacecraft', description: 'Historic deep space probe', center: 'Ames Research Center' },
  { id: 37, name: 'Deep Space 1', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Deep%20Space%201/Deep%20Space%201.glb', category: 'Spacecraft', description: 'Advanced technology demonstration mission', center: 'Jet Propulsion Laboratory' },
  { id: 38, name: 'NEAR Shoemaker', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/NEAR%20Shoemaker/NEAR%20Shoemaker.glb', category: 'Spacecraft', description: 'Asteroid reconnaissance mission', center: 'Johns Hopkins University APL' },
  { id: 39, name: 'OSIRIS-REx', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Origins%2C%20Spectral%20Interpretation%2C%20Resource%20Identification%2C%20and%20Security%20-%20Regolith%20Explorer%20(OSIRIS-REx)/OSIRIS-REx.glb', category: 'Spacecraft', description: 'Asteroid sample return mission', center: 'Goddard Space Flight Center' },

  // MARS MISSIONS
  { id: 40, name: 'Curiosity Rover (MSL)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Curiosity%20Rover%20(MSL)/Curiosity%20Rover%20(MSL)%20(Clean).glb', category: 'Mars', description: 'Mars Science Laboratory rover', center: 'Jet Propulsion Laboratory' },
  { id: 41, name: 'Mars 2020 Perseverance Rover', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%202020%20Perseverance%20Rover/Mars%202020%20Perseverance%20Rover.glb', category: 'Mars', description: 'Mars rover seeking signs of ancient microbial life', center: 'Jet Propulsion Laboratory' },
  { id: 42, name: 'Ingenuity Mars Helicopter', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Ingenuity%20Mars%20Helicopter/Ingenuity%20Mars%20Helicopter.glb', category: 'Mars', description: 'First aircraft to fly on another planet', center: 'Jet Propulsion Laboratory' },
  { id: 43, name: 'Mars Exploration Rover - Opportunity', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb', category: 'Mars', description: 'MER-B solar-powered rover', center: 'Jet Propulsion Laboratory' },
  { id: 44, name: 'Viking Lander', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Viking%20Lander/Viking%20Lander.glb', category: 'Mars', description: 'First spacecraft to land safely on Mars', center: 'Jet Propulsion Laboratory' },
  { id: 45, name: 'Mars Global Surveyor', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Global%20Surveyor/Mars%20Global%20Surveyor.glb', category: 'Mars', description: 'Mars orbital mapper spacecraft', center: 'Jet Propulsion Laboratory' },
  { id: 46, name: 'Mars Odyssey', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Odyssey/Mars%20Odyssey.glb', category: 'Mars', description: 'Mars thermal imaging orbiter', center: 'Jet Propulsion Laboratory' },
  { id: 47, name: 'Mars Reconnaissance Orbiter (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Reconnaissance%20Orbiter%20(MRO)%20(A)/Mars%20Reconnaissance%20Orbiter%20(MRO)%20(A).glb', category: 'Mars', description: 'Mars high-resolution imaging orbiter', center: 'Jet Propulsion Laboratory' },
  { id: 48, name: 'Mars Reconnaissance Orbiter (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Reconnaissance%20Orbiter%20(MRO)%20(B)/Mars%20Reconnaissance%20Orbiter%20(MRO)%20(B).glb', category: 'Mars', description: 'MRO alternative view', center: 'Jet Propulsion Laboratory' },
  { id: 49, name: 'Mars Atmosphere and Volatile EvolutioN (MAVEN)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mars%20Atmosphere%20and%20Volatile%20EvolutioN%20(MAVEN)%20(A)/Mars%20Atmosphere%20and%20Volatile%20EvolutioN%20(MAVEN)%20(A).glb', category: 'Mars', description: 'Mars atmospheric mission', center: 'Goddard Space Flight Center' },

  // SATELLITES & EARTH OBSERVATION
  { id: 50, name: 'Terra', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Terra/Terra.glb', category: 'Satellites', description: 'Earth observing satellite', center: 'Goddard Space Flight Center' },
  { id: 51, name: 'Aqua (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Aqua%20(A)/Aqua%20(A).glb', category: 'Satellites', description: 'Water cycle and climate monitoring', center: 'Goddard Space Flight Center' },
  { id: 52, name: 'Aqua (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Aqua%20(B)/Aqua%20(B).glb', category: 'Satellites', description: 'Aqua satellite alternative', center: 'Goddard Space Flight Center' },
  { id: 53, name: 'Aqua (C)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Aqua%20(C)/Aqua%20(C).glb', category: 'Satellites', description: 'Aqua configuration variant', center: 'Goddard Space Flight Center' },
  { id: 54, name: 'Aura (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Aura%20(A)/Aura%20(A).glb', category: 'Satellites', description: 'Atmospheric chemistry satellite', center: 'Goddard Space Flight Center' },
  { id: 55, name: 'Landsat 7', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Landsat%207/Landsat%207.glb', category: 'Satellites', description: 'Landsat Earth observation satellite', center: 'Goddard Space Flight Center' },
  { id: 56, name: 'Landsat 8', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Landsat%208/Landsat%208.glb', category: 'Satellites', description: 'Advanced Landsat imaging satellite', center: 'Goddard Space Flight Center' },
  { id: 57, name: 'SeaStar', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/SeaStar/SeaStar.glb', category: 'Satellites', description: 'Ocean color monitoring satellite', center: 'Goddard Space Flight Center' },
  { id: 58, name: 'Quick Scatterometer (QuikSCAT)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Quick%20Scatterometer%20(QuikSCAT)/Quick%20Scatterometer%20(QuikSCAT).glb', category: 'Satellites', description: 'Ocean wind measurement satellite', center: 'Jet Propulsion Laboratory' },
  { id: 59, name: 'Orbiting Carbon Observatory 2', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Orbiting%20Carbon%20Observatory%20(OCO)%202/Orbiting%20Carbon%20Observatory%20(OCO)%202.glb', category: 'Satellites', description: 'Atmospheric carbon dioxide monitor', center: 'Jet Propulsion Laboratory' },
  { id: 60, name: 'Global Precipitation Measurement', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Global%20Precipitation%20Measurement/Global%20Precipitation%20Measurement.glb', category: 'Satellites', description: 'Precipitation measurement satellite', center: 'Goddard Space Flight Center' },
  { id: 61, name: 'Tropical Rainfall Measuring Mission', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Tropical%20Rainfall%20Measuring%20Mission%20(TRMM)/Tropical%20Rainfall%20Measuring%20Mission%20(TRMM).glb', category: 'Satellites', description: 'Tropical rainfall monitoring mission', center: 'Goddard Space Flight Center' },
  { id: 62, name: 'Suomi NPP', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Suomi%20National%20Polar-orbiting%20Partnership%20(Suomi%20NPP)/Suomi%20National%20Polar-orbiting%20Partnership%20(Suomi%20NPP).glb', category: 'Satellites', description: 'Polar-orbiting weather satellite', center: 'Goddard Space Flight Center' },
  { id: 63, name: 'Jason 1', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Jason%201/Jason%201.glb', category: 'Satellites', description: 'Ocean altimetry satellite', center: 'Jet Propulsion Laboratory' },
  { id: 64, name: 'TOPEX-Poseidon', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/TOPEX-Poseidon/TOPEX-Poseidon.glb', category: 'Satellites', description: 'Ocean surface topography mission', center: 'Jet Propulsion Laboratory' },
  { id: 65, name: 'CloudSat (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/CloudSat%20(A)/CloudSat%20(A).glb', category: 'Satellites', description: 'Cloud profiling radar satellite', center: 'Jet Propulsion Laboratory' },
  { id: 66, name: 'CALIPSO', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Cloud-Aerosol%20Lidar%20and%20Infrared%20Pathfinder%20Satellite%20(CALIPSO)/Cloud-Aerosol%20Lidar%20and%20Infrared%20Pathfinder%20Satellite%20(CALIPSO).glb', category: 'Satellites', description: 'Cloud and aerosol lidar satellite', center: 'Goddard Space Flight Center' },

  // TRACKING SATELLITES
  { id: 67, name: 'Tracking and Data Relay Satellites (TDRS) (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Tracking%20and%20Data%20Relay%20Satellites%20(TDRS)%20(A)/Tracking%20and%20Data%20Relay%20Satellites%20(TDRS)%20(A).glb', category: 'Satellites', description: 'Communication relay satellite', center: 'Goddard Space Flight Center' },
  { id: 68, name: 'Geostationary Operational Environmental Satellites', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Geostationary%20Operational%20Environmental%20Satellites/Geostationary%20Operational%20Environmental%20Satellites.glb', category: 'Satellites', description: 'Geostationary weather satellite', center: 'Goddard Space Flight Center' },
  { id: 69, name: 'Polar Operational Environmental Satellite', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Polar%20Operational%20Environmental%20Satellite%20(POES)/Polar%20Operational%20Environmental%20Satellite%20(POES).glb', category: 'Satellites', description: 'Polar-orbiting weather satellite', center: 'Goddard Space Flight Center' },

  // ASTEROIDS
  { id: 70, name: '1999 RQ36 Asteroid', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/1999%20RQ36%20asteroid/1999%20RQ36%20asteroid.glb', category: 'Asteroids', description: 'Near-Earth asteroid Bennu', center: 'Goddard Space Flight Center' },

  // ROCKETS & LAUNCH VEHICLES
  { id: 71, name: 'Saturn V', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Saturn%20V/Saturn%20V.glb', category: 'Rockets', description: 'Legendary rocket that took astronauts to the Moon', center: 'Marshall Space Flight Center' },
  { id: 72, name: 'Space Launch System Block 1', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Launch%20System%20Block%201/Space%20Launch%20System%20Block%201.glb', category: 'Rockets', description: 'Next-generation heavy lift launch vehicle', center: 'Marshall Space Flight Center' },
  { id: 73, name: 'Ares 1 (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Ares%201%20(A)/Ares%201%20(A).glb', category: 'Rockets', description: 'Ares crew launch vehicle', center: 'Marshall Space Flight Center' },
  { id: 74, name: 'Explorer Jupiter-C Rocket', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Explorer%20Jupiter-C%20Rocket/Explorer%20Jupiter-C%20Rocket.glb', category: 'Rockets', description: 'Early American launch vehicle', center: 'Marshall Space Flight Center' },

  // SPACE SHUTTLE
  { id: 75, name: 'Space Shuttle (A)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20(A)/Space%20Shuttle%20(A).glb', category: 'Shuttle', description: 'Reusable space shuttle orbiter', center: 'Johnson Space Center' },
  { id: 76, name: 'Space Shuttle (B)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20(B)/Space%20Shuttle%20(B).glb', category: 'Shuttle', description: 'Space Shuttle alternative configuration', center: 'Johnson Space Center' },
  { id: 77, name: 'Space Shuttle (C)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20(C)/Space%20Shuttle%20(C).glb', category: 'Shuttle', description: 'Space Shuttle variant', center: 'Johnson Space Center' },
  { id: 78, name: 'Space Shuttle (D)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20(D)/Space%20Shuttle%20(D).glb', category: 'Shuttle', description: 'Space Shuttle detailed model', center: 'Johnson Space Center' },
  { id: 79, name: 'Space Shuttle Canadarm', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Shuttle%20Remote%20Manipulator%20System%20(Canadarm)/Space%20Shuttle%20Remote%20Manipulator%20System%20(Canadarm).glb', category: 'Shuttle', description: 'Shuttle robotic arm', center: 'Johnson Space Center' },

  // CAPSULES & MODULES
  { id: 80, name: 'Apollo Lunar Module', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Apollo%20Lunar%20Module/Apollo%20Lunar%20Module.glb', category: 'Capsules', description: 'Historic spacecraft that landed astronauts on the Moon', center: 'Johnson Space Center' },
  { id: 81, name: 'Apollo Soyuz', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Apollo%20Soyuz/Apollo%20Soyuz.glb', category: 'Capsules', description: 'Historic US-Soviet joint mission', center: 'Johnson Space Center' },
  { id: 82, name: 'Gemini', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Gemini/Gemini.glb', category: 'Capsules', description: 'Gemini spacecraft for orbital missions', center: 'Johnson Space Center' },
  { id: 83, name: 'Atlas 6 (Friendship 7)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Atlas%206%20(Friendship%207)/Atlas%206%20(Friendship%207).glb', category: 'Capsules', description: 'John Glenn\'s Mercury capsule', center: 'Johnson Space Center' },
  { id: 84, name: 'Redstone 3 (Freedom 7)', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Redstone%203%20(Freedom%207)/Redstone%203%20(Freedom%207).glb', category: 'Capsules', description: 'Alan Shepard\'s suborbital capsule', center: 'Johnson Space Center' },

  // SPACESUITS & EQUIPMENT
  { id: 85, name: 'Advanced Crew Escape Suit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Advanced%20Crew%20Escape%20Suit/Advanced%20Crew%20Escape%20Suit.glb', category: 'Equipment', description: 'Modern crew escape suit', center: 'Johnson Space Center' },
  { id: 86, name: 'Extravehicular Mobility Unit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Extravehicular%20Mobility%20Unit/Extravehicular%20Mobility%20Unit.glb', category: 'Equipment', description: 'Pressurized suit for spacewalks', center: 'Johnson Space Center' },
  { id: 87, name: 'Gemini Spacesuit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Gemini%20Spacesuit/Gemini%20Spacesuit.glb', category: 'Equipment', description: 'Historic Gemini-era spacesuit', center: 'Johnson Space Center' },
  { id: 88, name: 'Mercury Spacesuit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mercury%20Spacesuit/Mercury%20Spacesuit.glb', category: 'Equipment', description: 'Early Mercury program spacesuit', center: 'Johnson Space Center' },
  { id: 89, name: 'Mark III Spacesuit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mark%20III%20Spacesuit/Mark%20III%20Spacesuit.glb', category: 'Equipment', description: 'Advanced spacesuit prototype', center: 'Johnson Space Center' },
  { id: 90, name: 'Z2 Spacesuit', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Z2%20Spacesuit/Z2%20Spacesuit.glb', category: 'Equipment', description: 'Next-generation spacesuit design', center: 'Johnson Space Center' },

  // TOOLS & EQUIPMENT
  { id: 91, name: 'Astronaut', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Astronaut/Astronaut.glb', category: 'Equipment', description: 'Astronaut figure model', center: 'Johnson Space Center' },
  { id: 92, name: 'Hammer', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Hammer/Hammer.glb', category: 'Equipment', description: 'EVA hammer tool', center: 'Johnson Space Center' },
  { id: 93, name: 'Wrench', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Wrench/Wrench.glb', category: 'Equipment', description: 'EVA wrench tool', center: 'Johnson Space Center' },
  { id: 94, name: 'Pistol Grip Tool', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Pistol%20Grip%20Tool/Pistol%20Grip%20Tool.glb', category: 'Equipment', description: 'Power tool for spacewalks', center: 'Johnson Space Center' },
  { id: 95, name: 'Ratchet', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Ratchet/Ratchet.glb', category: 'Equipment', description: 'EVA ratchet tool', center: 'Johnson Space Center' },

  // ROVERS & ROBOTS
  { id: 96, name: 'Robonaut 2', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Robonaut%202/Robonaut%202.glb', category: 'Equipment', description: 'Humanoid robot for space operations', center: 'Johnson Space Center' },
  { id: 97, name: 'RASSOR', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Regolith%20Advanced%20Surface%20Systems%20Operations%20Robot%20(RASSOR)/Regolith%20Advanced%20Surface%20Systems%20Operations%20Robot%20(RASSOR).glb', category: 'Equipment', description: 'Lunar mining robot concept', center: 'Kennedy Space Center' },
  { id: 98, name: 'Space Exploration Vehicle', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Space%20Exploration%20Vehicle/Space%20Exploration%20Vehicle.glb', category: 'Equipment', description: 'Lunar surface exploration vehicle', center: 'Johnson Space Center' },

  // CUBESATS
  { id: 99, name: 'CubeSat - 1 RU Generic', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/CubeSat%20-%201%20RU%20Generic/CubeSat%20-%201%20RU%20Generic.glb', category: 'CubeSats', description: 'Generic 1U CubeSat model', center: 'Ames Research Center' },
  { id: 100, name: 'CubeSat - 2 RU Generic', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/CubeSat%20-%202%20RU%20Generic/CubeSat%20-%202%20RU%20Generic.glb', category: 'CubeSats', description: 'Generic 2U CubeSat model', center: 'Ames Research Center' },

  // GROUND FACILITIES
  { id: 101, name: 'Vehicle Assembly Building', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Vehicle%20Assembly%20Building%20(VAB)/Vehicle%20Assembly%20Building%20(VAB).glb', category: 'Facilities', description: 'Massive vehicle assembly facility', center: 'Kennedy Space Center' },
  { id: 102, name: 'Headquarters Building', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Headquarters%20Building/Headquarters%20Building.glb', category: 'Facilities', description: 'NASA headquarters building', center: 'Headquarters' },
  { id: 103, name: 'JSC Mission Control Room', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/JSC%20Mission%20Control%20Room/JSC%20Mission%20Control%20Room.glb', category: 'Facilities', description: 'Mission control operations center', center: 'Johnson Space Center' },
  { id: 104, name: 'Mobile Launcher', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Mobile%20Launcher/Mobile%20Launcher%20(assembled).glb', category: 'Facilities', description: 'Mobile launcher platform', center: 'Kennedy Space Center' },

  // FUTURE & EXPERIMENTAL
  { id: 105, name: 'Advanced Technology Large-Aperture Space Telescope', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Advanced%20Technology%20Large-Aperture%20Space%20Telescope%20(ATLAST)/Advanced%20Technology%20Large-Aperture%20Space%20Telescope%20(ATLAST).glb', category: 'Concepts', description: 'Future large aperture space telescope concept', center: 'Goddard Space Flight Center' },
  { id: 106, name: 'Constellation-X', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Constellation-X/Constellation-X.glb', category: 'Concepts', description: 'X-ray observatory concept', center: 'Goddard Space Flight Center' },
  { id: 107, name: 'Solar Sail Concept', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/Solar%20Sail%20Concept/Solar%20Sail%20Concept.glb', category: 'Concepts', description: 'Solar sail propulsion concept', center: 'Jet Propulsion Laboratory' },
  { id: 108, name: 'X-57', url: 'https://raw.githubusercontent.com/nasa/NASA-3D-Resources/master/3D%20Models/X-57/X-57.glb', category: 'Concepts', description: 'Electric experimental aircraft', center: 'Langley Research Center' },
];

const CATEGORIES = ["All", ...new Set(NASA_3D_MODELS.map((m) => m.category))];

export default function Models3D() {
  const [selectedModel, setSelectedModel] = useState(NASA_3D_MODELS[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortKey, setSortKey] = useState("alpha");
  const [pinnedIds, setPinnedIds] = useState([]);
  const [actionFeedback, setActionFeedback] = useState("");

  const filteredModels = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return NASA_3D_MODELS.filter((model) => {
      const categoryMatch =
        selectedCategory === "All" || model.category === selectedCategory;
      const searchMatch =
        !term ||
        model.name.toLowerCase().includes(term) ||
        model.description.toLowerCase().includes(term) ||
        model.center.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchTerm]);

  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  const orderedModels = useMemo(() => {
    const sorted = [...filteredModels].sort((a, b) => {
      if (sortKey === "alpha") return a.name.localeCompare(b.name);
      if (sortKey === "alpha-desc") return b.name.localeCompare(a.name);
      if (sortKey === "category") return a.category.localeCompare(b.category);
      return a.center.localeCompare(b.center);
    });
    const pinned = sorted.filter((model) => pinnedSet.has(model.id));
    const rest = sorted.filter((model) => !pinnedSet.has(model.id));
    return [...pinned, ...rest];
  }, [filteredModels, sortKey, pinnedSet]);

  const stats = useMemo(
    () => [
      { label: "Total Models", value: NASA_3D_MODELS.length },
      { label: "Results", value: orderedModels.length },
      { label: "Category", value: selectedCategory },
      { label: "Active Center", value: selectedModel.center },
    ],
    [orderedModels.length, selectedCategory, selectedModel.center]
  );

  const togglePin = (id) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(selectedModel.url);
      setActionFeedback("Link copied");
    } catch (error) {
      console.error("Clipboard copy failed", error);
      setActionFeedback("Copy unavailable");
    }
  };

  useEffect(() => {
    if (!actionFeedback) return;
    const timeout = setTimeout(() => setActionFeedback(""), 2200);
    return () => clearTimeout(timeout);
  }, [actionFeedback]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              NASA 3D Resources
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Interactive hardware library
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore spacecraft, telescopes, and ground assets pulled straight
              from NASA&apos;s repository. Filter, sort, and pin frequently used
              models for faster access.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              GLB assets
            </span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
              {NASA_3D_MODELS.length}+ entries
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <p className="text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr),minmax(280px,0.7fr)]">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden"
          >
            Browse model list ({orderedModels.length})
          </button>

          <div className="panel rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  Active model
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-slate-900">
                  {selectedModel.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedModel.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    {selectedModel.category}
                  </span>
                  <span className="rounded-full border border-slate-200 px-3 py-1">
                    {selectedModel.center}
                  </span>
                  {pinnedSet.has(selectedModel.id) && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                      Pinned
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setIsFullScreen(true)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-900 disabled:border-slate-100 disabled:text-slate-400"
                  disabled={isFullScreen}
                >
                  {isFullScreen ? "Fullscreen" : "Expand viewer"}
                </button>
                <button
                  type="button"
                  onClick={() => togglePin(selectedModel.id)}
                  className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-900"
                >
                  {pinnedSet.has(selectedModel.id) ? "Unpin model" : "Pin to top"}
                </button>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-900/10 bg-slate-900/80">
              <ModelViewerR3F
                modelUrl={selectedModel.url}
                modelName={selectedModel.name}
                containerClassName="h-[420px] w-full sm:h-[520px] lg:h-[620px]"
                onFullScreenChange={setIsFullScreen}
                forceFullScreen={isFullScreen}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900"
              >
                Copy link
              </button>
              <a
                href={selectedModel.url}
                download={selectedModel.name}
                className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 font-semibold text-white"
              >
                Download GLB
              </a>
              <a
                href={selectedModel.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900"
              >
                Open raw file ↗
              </a>
              {actionFeedback && (
                <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {actionFeedback}
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                NASA center
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {selectedModel.center}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Identify who produced or maintains the hardware.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Category
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {selectedModel.category}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Use categories to group antennas, telescopes, rovers, and more.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Tip: Press <span className="font-semibold">H</span> inside the viewer to
            reveal lighting, camera, and post-processing controls. Pin repeat
            assets on the right to keep them at the top.
          </div>
        </div>

        <aside
          className={`panel rounded-2xl border border-slate-200 bg-white p-4 ${
            sidebarOpen ? "block" : "hidden"
          } lg:block`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Model browser
              </p>
              <p className="text-sm text-slate-600">
                {orderedModels.length} results
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-xs text-slate-500 lg:hidden"
            >
              Close
            </button>
          </div>

          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-500">Search</label>
            <input
              type="text"
              placeholder="Search by name, description, or center"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500">Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    selectedCategory === category
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500">Sort</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { key: "alpha", label: "A → Z" },
                { key: "alpha-desc", label: "Z → A" },
                { key: "category", label: "Category" },
                { key: "center", label: "NASA center" },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortKey(option.key)}
                  className={`rounded-lg border px-3 py-2 ${
                    sortKey === option.key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {pinnedIds.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              {pinnedIds.length} pinned model{pinnedIds.length > 1 ? "s" : ""} surface at the top of the list.
            </div>
          )}

          <div className="mt-4 h-[560px] space-y-2 overflow-y-auto pr-1">
            {orderedModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left text-sm ${
                  selectedModel.id === model.id
                    ? "border-slate-900 bg-slate-900/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-900">{model.name}</p>
                  <p className="text-xs text-slate-500">{model.category}</p>
                  <p className="text-[11px] text-slate-400">{model.center}</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    togglePin(model.id);
                  }}
                  className={`text-base ${
                    pinnedSet.has(model.id) ? "text-amber-500" : "text-slate-400"
                  }`}
                  aria-label="Toggle pin"
                >
                  {pinnedSet.has(model.id) ? "★" : "☆"}
                </button>
              </button>
            ))}
            {orderedModels.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No models found. Adjust filters or search terms.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
