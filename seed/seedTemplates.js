require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const InspectionTemplate = require('../models/InspectionTemplate.model');

const templates = [
  // ─── PLANT ───
  {
    equipmentCategory: 'Plant',
    equipmentName: 'Concrete Batching Plants',
    questions: [
      { questionNumber: 1, questionText: 'Frame condition' },
      { questionNumber: 2, questionText: 'Walkways & railings' },
      { questionNumber: 3, questionText: 'Fire extinguisher availability' },
      { questionNumber: 4, questionText: 'Conveyor belts – tension and alignment' },
      { questionNumber: 5, questionText: 'Pulleys condition' },
      { questionNumber: 6, questionText: 'Motor function' },
      { questionNumber: 7, questionText: 'Aggregate bins – gates & liners' },
      { questionNumber: 8, questionText: 'Vibration motors in bins' },
      { questionNumber: 9, questionText: 'Mixer blades' },
      { questionNumber: 10, questionText: 'Mixer drum rotation' },
      { questionNumber: 11, questionText: 'Mixer motor operation' },
      { questionNumber: 12, questionText: 'Electrical panel & sensors' },
      { questionNumber: 13, questionText: 'Alarms & emergency stop' },
      { questionNumber: 14, questionText: 'Weighing system – cement accuracy' },
      { questionNumber: 15, questionText: 'Weighing system – water accuracy' },
      { questionNumber: 16, questionText: 'Weighing system – aggregate accuracy' },
      { questionNumber: 17, questionText: 'Admixture dosing accuracy' },
      { questionNumber: 18, questionText: 'Lubrication points' },
      { questionNumber: 19, questionText: 'Wear plates' },
      { questionNumber: 20, questionText: 'Mixer blades' },
    ]
  },
  
  {
    equipmentCategory: 'Plant',
    equipmentName: 'Asphalt Batching Plants',
    questions: [
      { questionNumber: 1, questionText: 'Frame condition' },
      { questionNumber: 2, questionText: 'Platforms' },
      { questionNumber: 3, questionText: 'Fire safety devices' },
      { questionNumber: 4, questionText: 'Cold aggregate bins' },
      { questionNumber: 5, questionText: 'Feeders & conveyors' },
      { questionNumber: 6, questionText: 'Screens condition' },
      { questionNumber: 7, questionText: 'Dryer drum condition' },
      { questionNumber: 8, questionText: 'Burner operation' },
      { questionNumber: 9, questionText: 'Fuel supply system' },
      { questionNumber: 10, questionText: 'Hot aggregate elevator & screening' },
      { questionNumber: 11, questionText: 'Mixer blades & drum' },
      { questionNumber: 12, questionText: 'Electrical panels & sensors' },
      { questionNumber: 13, questionText: 'Alarms & emergency stop' },
      { questionNumber: 14, questionText: 'Asphalt, bitumen, filler dosing accuracy' },
      { questionNumber: 15, questionText: 'Screws, belts, and mixer wear parts' },
    ]
  },
  {
    equipmentCategory: 'Plant',
    equipmentName: 'Crushing & Screening Plant',
    questions: [
      { questionNumber: 1, questionText: 'Frame condition' },
      { questionNumber: 2, questionText: 'Safety guards & railings' },
      { questionNumber: 3, questionText: 'Feed hopper condition' },
      { questionNumber: 4, questionText: 'Conveyor belts – alignment & motor' },
      { questionNumber: 5, questionText: 'Crusher unit – jaw/cone/impactor' },
      { questionNumber: 6, questionText: 'Crusher wear parts' },
      { questionNumber: 7, questionText: 'Screening unit – screens' },
      { questionNumber: 8, questionText: 'Screening vibration system' },
      { questionNumber: 9, questionText: 'Dust control – fans & filters' },
      { questionNumber: 10, questionText: 'Electrical panels & sensors' },
      { questionNumber: 11, questionText: 'Alarms & emergency stop' },
      { questionNumber: 12, questionText: 'Crusher liners & wear plates' },
      { questionNumber: 13, questionText: 'Bearings' },
      { questionNumber: 14, questionText: 'Conveyor belts' },
    ]
  },


  // ─── WHEELED MACHINES ───
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Mobile Concrete Batching Plants',
    questions: [
      { questionNumber: 1, questionText: 'Check chassis and frame for cracks or deformation' },
      { questionNumber: 2, questionText: 'Inspect mixing drum condition and drive mechanism' },
      { questionNumber: 3, questionText: 'Check aggregate bins, weights and gates' },
      { questionNumber: 4, questionText: 'Inspect hydraulic system hoses, cylinders and fluid level' },
      { questionNumber: 5, questionText: 'Check tire condition, pressure and wheel nuts' },
      { questionNumber: 6, questionText: 'Inspect towing hitch and safety chains' },
      { questionNumber: 7, questionText: 'Check electrical system, wiring and controls' },
      { questionNumber: 8, questionText: 'Inspect engine / power unit oil level and condition' },
      { questionNumber: 9, questionText: 'Check water storage tank and pump' },
      { questionNumber: 10, questionText: 'Verify all safety guards and emergency stops' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Transit Mixers',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect drum rotation mechanism (hydraulic or mechanical)' },
      { questionNumber: 3, questionText: 'Inspect drum blades / fins for wear or damage' },
      { questionNumber: 4, questionText: 'Check water tank, pump and metering system' },
      { questionNumber: 5, questionText: 'Inspect discharge chute and washout system' },
      { questionNumber: 6, questionText: 'Check tires, wheel nuts and pressures' },
      { questionNumber: 7, questionText: 'Inspect hydraulic system for leaks' },
      { questionNumber: 8, questionText: 'Check service and parking brakes' },
      { questionNumber: 9, questionText: 'Inspect all lights and signals (headlights, beacons, reverse alarm)' },
      { questionNumber: 10, questionText: 'Check cabin and seat belt condition' },
      { questionNumber: 11, questionText: 'Inspect body and frame for damage or corrosion' },
      { questionNumber: 12, questionText: 'Check coolant level and radiator condition' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Concrete Pump Trucks',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic system for leaks (hoses, cylinders, fittings)' },
      { questionNumber: 3, questionText: 'Inspect placing boom sections, pins and joints' },
      { questionNumber: 4, questionText: 'Check boom folding and unfolding operation' },
      { questionNumber: 5, questionText: 'Inspect concrete pipeline, clamps and rubber hoses' },
      { questionNumber: 6, questionText: 'Check hopper, agitator and grill guard' },
      { questionNumber: 7, questionText: 'Inspect pump unit (pistons, spectacle plate and cutting ring)' },
      { questionNumber: 8, questionText: 'Check outrigger legs, pads and safety locks' },
      { questionNumber: 9, questionText: 'Inspect remote control system and emergency manual override' },
      { questionNumber: 10, questionText: 'Check tires, wheel nuts and braking system' },
      { questionNumber: 11, questionText: 'Verify safety devices (end hose safety cable, anti-two-block)' },
      { questionNumber: 12, questionText: 'Check all lights and reverse alarm' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Backhoe Loaders',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system for leaks' },
      { questionNumber: 4, questionText: 'Inspect backhoe bucket teeth and cutting edge' },
      { questionNumber: 5, questionText: 'Check boom, dipper arm and bucket pins / bushings' },
      { questionNumber: 6, questionText: 'Inspect loader bucket, cutting edge and pins' },
      { questionNumber: 7, questionText: 'Check tires and wheel nuts / pressures' },
      { questionNumber: 8, questionText: 'Inspect service and parking brakes' },
      { questionNumber: 9, questionText: 'Check all lights, horn and reverse alarm' },
      { questionNumber: 10, questionText: 'Inspect ROPS / FOPS structure for damage' },
      { questionNumber: 11, questionText: 'Check seat belt condition and operation' },
      { questionNumber: 12, questionText: 'Inspect engine air filter condition' },
      { questionNumber: 13, questionText: 'Check coolant level and radiator' },
      { questionNumber: 14, questionText: 'Inspect transmission for leaks and operation' },
      { questionNumber: 15, questionText: 'Check stabilizer legs and pins' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Wheel Loaders',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system' },
      { questionNumber: 4, questionText: 'Inspect bucket teeth, cutting edge and bucket body' },
      { questionNumber: 5, questionText: 'Check boom arms, tipping links and bucket pins' },
      { questionNumber: 6, questionText: 'Inspect tires for wear, damage and pressure' },
      { questionNumber: 7, questionText: 'Check service and parking brakes' },
      { questionNumber: 8, questionText: 'Inspect all lights, horn and reverse alarm' },
      { questionNumber: 9, questionText: 'Check ROPS / FOPS structure' },
      { questionNumber: 10, questionText: 'Inspect seat belt condition' },
      { questionNumber: 11, questionText: 'Check cooling system (coolant level and radiator)' },
      { questionNumber: 12, questionText: 'Inspect articulation joint, steering and pivot pins' },
      { questionNumber: 13, questionText: 'Check transmission oil level' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Motor Graders',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system' },
      { questionNumber: 4, questionText: 'Inspect moldboard (blade) condition and cutting edge wear' },
      { questionNumber: 5, questionText: 'Check circle drive motor and ring gear condition' },
      { questionNumber: 6, questionText: 'Inspect saddle, drawbar and blade lift cylinders' },
      { questionNumber: 7, questionText: 'Check scarifier / ripper teeth and frame (if fitted)' },
      { questionNumber: 8, questionText: 'Inspect front push blade (if fitted)' },
      { questionNumber: 9, questionText: 'Check tires, wheel nuts and pressures' },
      { questionNumber: 10, questionText: 'Inspect service and parking brakes' },
      { questionNumber: 11, questionText: 'Check all lights, horn and reverse alarm' },
      { questionNumber: 12, questionText: 'Inspect cab and ROPS structure' },
      { questionNumber: 13, questionText: 'Check seat belt and operator controls' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Road Roller - Single Drum',
    questions: [
      { questionNumber: 1, questionText: 'Condition of frame' },
      { questionNumber: 2, questionText: 'Condition of cabin/operator platform' },
      { questionNumber: 3, questionText: 'Condition of seatbelt' },
      { questionNumber: 4, questionText: 'Condition of lights' },
      { questionNumber: 5, questionText: 'Availability of fire extinguisher' },
      { questionNumber: 6, questionText: 'Hydraulic hoses condition' },
      { questionNumber: 7, questionText: 'Check for hydraulic leaks' },
      { questionNumber: 8, questionText: 'Articulation joint condition' },
      { questionNumber: 9, questionText: 'Steering mechanism' },
      { questionNumber: 10, questionText: 'Engine oil level' },
      { questionNumber: 11, questionText: 'Engine performance' },
      { questionNumber: 12, questionText: 'Fuel system condition' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Road Roller - Double Drum',
    questions: [
      { questionNumber: 1, questionText: 'Condition of frame' },
      { questionNumber: 2, questionText: 'Condition of cabin/operator platform' },
      { questionNumber: 3, questionText: 'Condition of seatbelt' },
      { questionNumber: 4, questionText: 'Condition of lights' },
      { questionNumber: 5, questionText: 'Availability of fire extinguisher' },
      { questionNumber: 6, questionText: 'Hydraulic hoses condition' },
      { questionNumber: 7, questionText: 'Check for hydraulic leaks' },
      { questionNumber: 8, questionText: 'Articulation joint condition' },
      { questionNumber: 9, questionText: 'Steering mechanism' },
      { questionNumber: 10, questionText: 'Engine oil level' },
      { questionNumber: 11, questionText: 'Engine performance' },
      { questionNumber: 12, questionText: 'Fuel system condition' },
      { questionNumber: 13, questionText: 'Front drum condition' },
      { questionNumber: 14, questionText: 'Rear drum condition' },
      { questionNumber: 15, questionText: 'Front drum vibration system' },
      { questionNumber: 16, questionText: 'Rear drum vibration system' },
      { questionNumber: 17, questionText: 'Brakes' },
      { questionNumber: 18, questionText: 'Scraper bars condition' },
      { questionNumber: 19, questionText: 'Water spray system (for asphalt)' },
      { questionNumber: 20, questionText: 'Vibration bearings' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Road Roller - Pneumatic Tyre',
    questions: [
      { questionNumber: 1, questionText: 'Condition of frame' },
      { questionNumber: 2, questionText: 'Condition of cabin/operator platform' },
      { questionNumber: 3, questionText: 'Condition of seatbelt' },
      { questionNumber: 4, questionText: 'Condition of lights' },
      { questionNumber: 5, questionText: 'Availability of fire extinguisher' },
      { questionNumber: 6, questionText: 'Hydraulic hoses condition' },
      { questionNumber: 7, questionText: 'Check for hydraulic leaks' },
      { questionNumber: 8, questionText: 'Steering system' },
      { questionNumber: 9, questionText: 'Ballast compartment condition' },
      { questionNumber: 10, questionText: 'Engine oil level' },
      { questionNumber: 11, questionText: 'Engine performance' },
      { questionNumber: 12, questionText: 'Fuel system condition' },
      { questionNumber: 13, questionText: 'Front tires condition' },
      { questionNumber: 14, questionText: 'Rear tires condition' },
      { questionNumber: 15, questionText: 'Tire pressure (all tires)' },
      { questionNumber: 16, questionText: 'Tire alignment' },
      { questionNumber: 17, questionText: 'Brakes' },
      { questionNumber: 18, questionText: 'Suspension system' },
      { questionNumber: 19, questionText: 'Water spray system' },
    ]
  },

  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Mobile Cranes',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic system (hoses, cylinders) for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system' },
      { questionNumber: 4, questionText: 'Inspect boom sections, pins, locking devices and boom tip' },
      { questionNumber: 5, questionText: 'Check wire rope condition (broken wires, kinks, corrosion, lubrication)' },
      { questionNumber: 6, questionText: 'Inspect hook block, hook latch and swivel' },
      { questionNumber: 7, questionText: 'Verify load chart is present, legible and correct' },
      { questionNumber: 8, questionText: 'Check outrigger beams, pads and safety locks' },
      { questionNumber: 9, questionText: 'Inspect anti-two-block (ATB) device' },
      { questionNumber: 10, questionText: 'Check slew ring, slew drive and slew brake' },
      { questionNumber: 11, questionText: 'Inspect load moment indicator (LMI) / rated capacity limiter (RCL)' },
      { questionNumber: 12, questionText: 'Check hoist, derricking and slew brakes' },
      { questionNumber: 13, questionText: 'Inspect all lights, horn and travel alarm' },
      { questionNumber: 14, questionText: 'Check tire condition and pressures' },
      { questionNumber: 15, questionText: 'Verify operator cabin and seat belt condition' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Dump Trucks / Tipper Trucks',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Check fuel level and fuel system for leaks' },
      { questionNumber: 3, questionText: 'Inspect hydraulic tipping system for leaks' },
      { questionNumber: 4, questionText: 'Check tipper body condition (cracks, welds, floor)' },
      { questionNumber: 5, questionText: 'Inspect hinge pins, body support prop and latches' },
      { questionNumber: 6, questionText: 'Check tires, wheel nuts and pressures' },
      { questionNumber: 7, questionText: 'Inspect service and parking brakes' },
      { questionNumber: 8, questionText: 'Check all lights, horn and reverse alarm' },
      { questionNumber: 9, questionText: 'Inspect tailgate condition and locking mechanism' },
      { questionNumber: 10, questionText: 'Check cab, seat belt and ROPS structure' },
      { questionNumber: 11, questionText: 'Inspect mudguards and safety chains' },
      { questionNumber: 12, questionText: 'Check coolant level and radiator condition' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Articulated Dump Trucks',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system' },
      { questionNumber: 4, questionText: 'Inspect articulation joint and oscillation pivot pins / bearings' },
      { questionNumber: 5, questionText: 'Check body hinge pins, support prop and tailgate' },
      { questionNumber: 6, questionText: 'Inspect all-wheel drive (AWD) system and transfer case' },
      { questionNumber: 7, questionText: 'Check tires and wheel nuts on all axles' },
      { questionNumber: 8, questionText: 'Inspect service and parking brakes (all axles)' },
      { questionNumber: 9, questionText: 'Check all lights, horn and reverse alarm' },
      { questionNumber: 10, questionText: 'Inspect cab, ROPS structure and seat belt' },
      { questionNumber: 11, questionText: 'Check transmission oil level and operation' },
      { questionNumber: 12, questionText: 'Inspect cooling system condition' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Mobile Lighting Towers',
    questions: [
      { questionNumber: 1, questionText: 'Check fuel level and tank for leaks' },
      { questionNumber: 2, questionText: 'Inspect engine oil level and condition' },
      { questionNumber: 3, questionText: 'Check generator output voltage and frequency' },
      { questionNumber: 4, questionText: 'Inspect telescoping mast condition, winch and locking pin' },
      { questionNumber: 5, questionText: 'Check all lamp heads – bulbs and housing condition' },
      { questionNumber: 6, questionText: 'Inspect electrical output cables and connection points' },
      { questionNumber: 7, questionText: 'Check stabilizer legs / outrigger pads' },
      { questionNumber: 8, questionText: 'Inspect trailer frame and towing hitch' },
      { questionNumber: 9, questionText: 'Check battery and battery charging system' },
      { questionNumber: 10, questionText: 'Inspect for fuel, oil and exhaust leaks' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Portable Air Compressors',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Check fuel level and tank for leaks' },
      { questionNumber: 3, questionText: 'Inspect air filter element condition' },
      { questionNumber: 4, questionText: 'Check pressure safety relief valve operation' },
      { questionNumber: 5, questionText: 'Inspect pressure gauge for accuracy and damage' },
      { questionNumber: 6, questionText: 'Check air discharge hoses and fittings for leaks' },
      { questionNumber: 7, questionText: 'Inspect oil separator / air filter condition' },
      { questionNumber: 8, questionText: 'Check belt drive or coupling condition (if applicable)' },
      { questionNumber: 9, questionText: 'Inspect discharge valve and drain valve operation' },
      { questionNumber: 10, questionText: 'Check for air, oil and fuel leaks overall' },
      { questionNumber: 11, questionText: 'Inspect trailer frame, hitch and tires (if trailer-mounted)' },
    ]
  },
  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Drum Mix Asphalt Plants',
    questions: [
      { questionNumber: 1, questionText: 'Check engine / burner fuel system for leaks' },
      { questionNumber: 2, questionText: 'Inspect drum condition, flights (lifters) and shell' },
      { questionNumber: 3, questionText: 'Check feed conveyor belts and drive components' },
      { questionNumber: 4, questionText: 'Inspect aggregate cold feed bins and variable speed feeders' },
      { questionNumber: 5, questionText: 'Check bitumen storage tanks and heating system' },
      { questionNumber: 6, questionText: 'Inspect mixing drum seals and end trunnions' },
      { questionNumber: 7, questionText: 'Check baghouse / dust collection filters and hopper' },
      { questionNumber: 8, questionText: 'Inspect reclaimed asphalt pavement (RAP) system (if fitted)' },
      { questionNumber: 9, questionText: 'Inspect control cabin instrumentation and operation' },
      { questionNumber: 10, questionText: 'Check all safety systems and emergency stops' },
    ]
  },

  // ─── TRACKED MACHINES ───
  {
    equipmentCategory: 'Tracked Machines',
    equipmentName: 'Hydraulic Excavators',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system for leaks' },
      { questionNumber: 4, questionText: 'Inspect undercarriage: tracks, track shoes and track tension' },
      { questionNumber: 5, questionText: 'Inspect undercarriage: rollers (top and bottom), idlers and sprockets' },
      { questionNumber: 6, questionText: 'Check bucket teeth, side cutters and cutting edge wear' },
      { questionNumber: 7, questionText: 'Inspect boom, arm (stick) and bucket pins / bushings' },
      { questionNumber: 8, questionText: 'Check hydraulic cylinders (boom, arm, bucket) for leaks' },
      { questionNumber: 9, questionText: 'Inspect slew ring and slew drive mechanism' },
      { questionNumber: 10, questionText: 'Check quick coupler (if fitted) and safety pin' },
      { questionNumber: 11, questionText: 'Inspect cab, ROPS / FOPS structure' },
      { questionNumber: 12, questionText: 'Check seat belt condition and operation' },
      { questionNumber: 13, questionText: 'Inspect all lights, horn and travel alarm' },
      { questionNumber: 14, questionText: 'Check airfilter condition and cooling system' },
      { questionNumber: 15, questionText: 'Verify safety devices: gate interlock, overload alarm, camera (if fitted)' },
    ]
  },
  {
    equipmentCategory: 'Tracked Machines',
    equipmentName: 'Bulldozer (Dozer)',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check fuel level and fuel system for leaks' },
      { questionNumber: 4, questionText: 'Inspect undercarriage: tracks, track tension and track shoes' },
      { questionNumber: 5, questionText: 'Inspect undercarriage: rollers, idlers and sprockets for wear' },
      { questionNumber: 6, questionText: 'Check blade (dozer blade) condition, cutting edge and end bits' },
      { questionNumber: 7, questionText: 'Inspect blade push arms, tilt and lift cylinders' },
      { questionNumber: 8, questionText: 'Check ripper assembly, teeth and hydraulic cylinder (if fitted)' },
      { questionNumber: 9, questionText: 'Inspect cab and ROPS / FOPS structure' },
      { questionNumber: 10, questionText: 'Check seat belt condition and operation' },
      { questionNumber: 11, questionText: 'Inspect all lights, horn and track alarm' },
      { questionNumber: 12, questionText: 'Check final drives for oil leaks' },
      { questionNumber: 13, questionText: 'Inspect cooling system (coolant level and radiator)' },
      { questionNumber: 14, questionText: 'Check air filter condition' },
    ]
  },

  // ─── STATIC EQUIPMENT ───
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Diesel Generators',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level and condition' },
      { questionNumber: 2, questionText: 'Check fuel level and tank / fuel lines for leaks' },
      { questionNumber: 3, questionText: 'Inspect coolant level and radiator condition' },
      { questionNumber: 4, questionText: 'Check air filter condition' },
      { questionNumber: 5, questionText: 'Inspect battery terminals and connection tightness' },
      { questionNumber: 6, questionText: 'Check battery charge level' },
      { questionNumber: 7, questionText: 'Verify output voltage, frequency and current (under load)' },
      { questionNumber: 8, questionText: 'Check safety shutdown devices (low oil, high temp, overspeed)' },
      { questionNumber: 9, questionText: 'Inspect exhaust system, silencer and exhaust pipe supports' },
      { questionNumber: 10, questionText: 'Check fuel filter condition and sediment bowl' },
      { questionNumber: 11, questionText: 'Inspect alternator / generator end, brushes and AVR' },
      { questionNumber: 12, questionText: 'Check earthing / grounding connections' },
      { questionNumber: 13, questionText: 'Inspect control panel instruments, gauges and indicators' },
      { questionNumber: 14, questionText: 'Check load terminals, cable connections and gland seals' },
      { questionNumber: 15, questionText: 'Inspect overall frame, anti-vibration mounts and canopy (if fitted)' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Stationary Concrete Pumps',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level (diesel) or verify electrical supply and connections' },
      { questionNumber: 2, questionText: 'Inspect hydraulic oil level and system for leaks' },
      { questionNumber: 3, questionText: 'Check S-valve, spectacle plate and cutting ring for wear' },
      { questionNumber: 4, questionText: 'Inspect pistons / cylinders and piston wear rings' },
      { questionNumber: 5, questionText: 'Check hopper condition and grill guard' },
      { questionNumber: 6, questionText: 'Inspect agitator blades and drive motor' },
      { questionNumber: 7, questionText: 'Check pipeline, clamps and rubber hose condition' },
      { questionNumber: 8, questionText: 'Inspect pressure safety valve and pressure gauges' },
      { questionNumber: 9, questionText: 'Check lubrication system (water box and grease lubrication)' },
      { questionNumber: 10, questionText: 'Test remote control system and emergency manual operation' },
      { questionNumber: 11, questionText: 'Check emergency stop function' },
      { questionNumber: 12, questionText: 'Inspect frame, anchor points and mounting' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Placing Boom Pumps',
    questions: [
      { questionNumber: 1, questionText: 'Inspect foundation / base mounting bolts and anchoring' },
      { questionNumber: 2, questionText: 'Check mast (column) condition and bolted connections' },
      { questionNumber: 3, questionText: 'Inspect all boom sections, pins and pivot joints' },
      { questionNumber: 4, questionText: 'Check hydraulic system for leaks (hoses, cylinders, fittings)' },
      { questionNumber: 5, questionText: 'Inspect slewing / rotation mechanism and drive' },
      { questionNumber: 6, questionText: 'Check pipeline along boom, clamps and rubber hose' },
      { questionNumber: 7, questionText: 'Inspect end hose condition and end hose safety cable' },
      { questionNumber: 8, questionText: 'Check hydraulic power unit oil level' },
      { questionNumber: 9, questionText: 'Inspect safety overload protection and limit switches' },
      { questionNumber: 10, questionText: 'Check electrical connections, control box and remote control' },
      { questionNumber: 11, questionText: 'Test emergency stop function' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Dewatering Pumps / Water Pumps',
    questions: [
      { questionNumber: 1, questionText: 'Check engine oil level (diesel engine driven)' },
      { questionNumber: 2, questionText: 'Check fuel level and fuel tank / lines for leaks' },
      { questionNumber: 3, questionText: 'Inspect pump casing for cracks, corrosion or damage' },
      { questionNumber: 4, questionText: 'Check suction hose / pipe, strainer and connections' },
      { questionNumber: 5, questionText: 'Inspect discharge hose / pipe and fittings' },
      { questionNumber: 6, questionText: 'Check mechanical seals or packing gland for leaks' },
      { questionNumber: 7, questionText: 'Inspect impeller (if accessible) for wear or blockage' },
      { questionNumber: 8, questionText: 'Check pressure gauge and flow meter (if fitted)' },
      { questionNumber: 9, questionText: 'Inspect foot valve / non-return valve' },
      { questionNumber: 10, questionText: 'Check priming system operation' },
      { questionNumber: 11, questionText: 'Inspect exhaust system (diesel engine)' },
      { questionNumber: 12, questionText: 'Verify start / stop controls and hour meter reading' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Passenger Hoists',
    questions: [
      { questionNumber: 1, questionText: 'Inspect mast / guide rail sections, bolts and mast ties' },
      { questionNumber: 2, questionText: 'Check cabin / car condition, floor, walls and door operation' },
      { questionNumber: 3, questionText: 'Inspect safety device (centrifugal governor / overspeed device)' },
      { questionNumber: 4, questionText: 'Check upper and lower limit switches and overrun buffers' },
      { questionNumber: 5, questionText: 'Inspect drive motor, gearbox and brake' },
      { questionNumber: 6, questionText: 'Check rack and pinion condition and lubrication' },
      { questionNumber: 7, questionText: 'Inspect electrial system, wiring, contactors and controls' },
      { questionNumber: 8, questionText: 'Check landing gate interlocks at all levels' },
      { questionNumber: 9, questionText: 'Inspect emergency lowering device' },
      { questionNumber: 10, questionText: 'Check rated capacity / maximum load markings' },
      { questionNumber: 11, questionText: 'Inspect anchoring and structure ties to building / scaffold' },
      { questionNumber: 12, questionText: 'Test communication system (intercom / phone) and alarm' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Tower Cranes',
    questions: [
      { questionNumber: 1, questionText: 'Inspect mast / tower sections, bolted connections and splices' },
      { questionNumber: 2, questionText: 'Check jib (boom) and counter jib condition and pins' },
      { questionNumber: 3, questionText: 'Inspect hoist wire rope (broken wires, kinks, wear, lubrication)' },
      { questionNumber: 4, questionText: 'Check luffing rope and slewing ropes (if luffing jib type)' },
      { questionNumber: 5, questionText: 'Inspect hook block, hook, hook latch and swivel' },
      { questionNumber: 6, questionText: 'Check slew ring, slew drive and slew brake' },
      { questionNumber: 7, questionText: 'Inspect trolley and trolley travel drive mechanism (if top-slewing)' },
      { questionNumber: 8, questionText: 'Check anti-collision devices and zoning limiters (if fitted)' },
      { questionNumber: 9, questionText: 'Inspect load moment indicator (LMI) / rated capacity limiter' },
      { questionNumber: 10, questionText: 'Check anemometer and high wind speed alarm' },
      { questionNumber: 11, questionText: 'Inspect operator cabin, controls and seat belt' },
      { questionNumber: 12, questionText: 'Check electrical system, panels and earthing' },
      { questionNumber: 13, questionText: 'Inspect anchoring / foundation bolts and base frame' },
      { questionNumber: 14, questionText: 'Verify anti-two-block device operation' },
      { questionNumber: 15, questionText: 'Check hoist, slew and trolley brakes' },
    ]
  }, //(not static)
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Construction Material Hoists',
    questions: [
      { questionNumber: 1, questionText: 'Inspect mast / guide structure, bolts and mast ties' },
      { questionNumber: 2, questionText: 'Check platform / car condition, floor and gates' },
      { questionNumber: 3, questionText: 'Inspect upper and lower limit switches and overtravel buffers' },
      { questionNumber: 4, questionText: 'Check drive motor, gearbox and holding brake' },
      { questionNumber: 5, questionText: 'Inspect wire rope / chain drive system, sheaves and anchorage' },
      { questionNumber: 6, questionText: 'Check landing platform gates and interlocks at each level' },
      { questionNumber: 7, questionText: 'Inspect rated capacity (SWL) markings and load indicator' },
      { questionNumber: 8, questionText: 'Check electrical system: wiring, contactors and safety circuits' },
      { questionNumber: 9, questionText: 'Test emergency stop and manual lowering device' },
      { questionNumber: 10, questionText: 'Inspect anchoring framework and structure ties' },
    ]
  },
  {
    equipmentCategory: 'Static Equipment',
    equipmentName: 'Generator / Water Pump',
    questions: [
      { questionNumber: 1, questionText: 'Frame condition' },
      { questionNumber: 2, questionText: 'Guards & walkways' },
      { questionNumber: 3, questionText: 'Emergency stop' },
      { questionNumber: 4, questionText: 'Engine oil level' },
      { questionNumber: 5, questionText: 'Fuel system condition' },
      { questionNumber: 6, questionText: 'Filters' },
      { questionNumber: 7, questionText: 'Hoses & connections' },
      { questionNumber: 8, questionText: 'Start / stop operation' },
      { questionNumber: 9, questionText: 'Output performance' },
      { questionNumber: 10, questionText: 'Alarms' },
      { questionNumber: 11, questionText: 'Belts' },
      { questionNumber: 12, questionText: 'Bearings' },
      { questionNumber: 13, questionText: 'Impellers' },
      { questionNumber: 14, questionText: 'Filters' },
    ]
  },

  {
    equipmentCategory: 'Wheeled Machines',
    equipmentName: 'Asphalt Paver',
    questions: [
      { questionNumber: 1, questionText: 'Condition of frame' },
      { questionNumber: 2, questionText: 'Condition of platforms' },
      { questionNumber: 3, questionText: 'Safety devices' },
      { questionNumber: 4, questionText: 'Hydraulic system' },
      { questionNumber: 5, questionText: 'Screed condition' },
      { questionNumber: 6, questionText: 'Auger condition' },
      { questionNumber: 7, questionText: 'Conveyor belts' },
      { questionNumber: 8, questionText: 'Engine oil level' },
      { questionNumber: 9, questionText: 'Engine performance' },
      { questionNumber: 10, questionText: 'Screed plates' },
      { questionNumber: 11, questionText: 'Augers' },
      { questionNumber: 12, questionText: 'Conveyor belts' },
    ]
  },

];

const seedTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    await InspectionTemplate.deleteMany({});
    console.log('🗑️  Cleared existing templates');

    await InspectionTemplate.insertMany(templates);
    console.log(`✅ Seeded ${templates.length} inspection templates successfully`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedTemplates();
