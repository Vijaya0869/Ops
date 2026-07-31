import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCheck, FileText, Calculator, Calendar, FileBarChart, Plus, Download } from "lucide-react";
import { useState } from "react";

// Pricing Profile Data interfaces
interface PricingData {
  materialCosts: number;
  laborCosts: number;
  totalCosts: number;
  unit?: string;
}

interface CategoryPricing {
  [key: string]: PricingData;
}

interface PricingProfiles {
  [category: string]: CategoryPricing;
}

// Pricing Profile Data from CMH filled spreadsheet
const pricingProfiles: PricingProfiles = {
  "Prep & Demo": {
    "Permitting & Plan Review": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Architect/Engineering": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Asbestos/Lead Testing": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Abatement (Lead/Asbestos)": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Pest Control": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Mold Remediation": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Demo & Haul-Off": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Dumpster/Roll-off": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
    "Temporary Utilities Setup": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 }
  },
  "Structural & Foundation": {
    "Structural Beams/Headers": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Foundation Crack Injection": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Basement Waterproofing (Interior)": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Basement Waterproofing (Exterior)": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "French Drain/Drain Tile": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Sump Pump Install/Backup": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Egress Window": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Crawlspace Encapsulation/Vapor Barrier": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
    "Floor Joist/Sill Repair": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 }
  },
  "Framing & Envelope": {
    "Framing (Interior/Exterior)": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Sheathing Repair": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Insulation - Attic Blown-In": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sf" },
    "Insulation - Walls": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sf" },
    "Insulation - Crawlspace": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Air Sealing/Weatherization": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Drywall Install & Texture": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sf" },
    "Interior Doors": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "ea" },
    "Trim/Baseboards/Casings": { materialCosts: 0, laborCosts: 0, totalCosts: 0 }
  },
  "Roofing & Gutters": {
    "Roof - Tear Off & Shingles": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sq (100 sqft)" },
    "Roof Sheathing Repair": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sheets" },
    "Flashing/Ice & Water Shield": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Fascia/Soffit Repair": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Gutters & Downspouts": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "lf" },
    "Attic Ventilation": { materialCosts: 0, laborCosts: 0, totalCosts: 0 }
  },
  "Windows & Exterior": {
    "Windows Replacement": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "ea" },
    "Exterior Doors": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "ea" },
    "Siding - Vinyl/Fiber Cement": { materialCosts: 0, laborCosts: 0, totalCosts: 0, unit: "sf" },
    "Exterior Trim": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Masonry/Tuckpointing": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Chimney Liner/Cap": { materialCosts: 0, laborCosts: 0, totalCosts: 0 }
  },
  "Plumbing": {
    "Main Water Line/Shutdown": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Water Heater": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Supply Lines (PEX/Copper)": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Drain/Stack Replacement": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Sewer Scope & Repair": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Fixtures - Kitchen": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Fixtures - Bath": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Sump Discharge Line": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
    "Hose Bibs": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 }
  },
  "Electrical": {
    "Service Panel Upgrade": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "Whole-House Rewire/Circuits": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "GFCI/AFCI Protection": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "Lighting Fixtures": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "Receptacles/Switches": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "Smoke/CO Detectors": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
    "Low-Voltage (Data/Cable)": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 }
  },
  "HVAC": {
    "Furnace": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "AC Condenser": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Heat Pump/Mini-Split": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Ductwork Supply/Returns": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Thermostat": { materialCosts: 0, laborCosts: 0, totalCosts: 0 },
    "Registers/Grilles": { materialCosts: 0, laborCosts: 0, totalCosts: 0 }
  },
  "Interior Finishes": {
    "Painting - Interior": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417 },
    "Flooring - LVP": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417, unit: "sf" },
    "Flooring - Carpet": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417, unit: "sf" },
    "Flooring - Tile": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417, unit: "sf" },
    "Hardwood Refinish": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417, unit: "sf" },
    "Stairs & Railings": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417 },
    "Closet Systems": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417 },
    "Fireplace Update": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417 }
  },
  "Kitchen": {
    "Cabinets": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383, unit: "lf" },
    "Countertops (Granite/Quartz)": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383, unit: "lf" },
    "Backsplash": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383, unit: "sf" },
    "Appliances Package": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383, unit: "set" },
    "Sink/Faucet/Garbage Disposal": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383 }
  },
  "Bathrooms": {
    "Tub/Shower Pan": { materialCosts: 1096.5, laborCosts: 1096.5, totalCosts: 2193 },
    "Tile Surround": { materialCosts: 1096.5, laborCosts: 1096.5, totalCosts: 2193, unit: "sf" },
    "Vanity & Top": { materialCosts: 1096.5, laborCosts: 1096.5, totalCosts: 2193 },
    "Toilet": { materialCosts: 1096.5, laborCosts: 1096.5, totalCosts: 2193 }
  }
};

// Category mapping from inspection to pricing categories
const categoryMapping = {
  "frontGarden": "Prep & Demo",
  "entrance": "Structural & Foundation", 
  "kitchen": "Kitchen",
  "bathroom": "Bathrooms",
  "livingRoom": "Interior Finishes",
  "diningRoom": "Interior Finishes", 
  "bedrooms": "Interior Finishes",
  "hallway": "Interior Finishes",
  "smokeDetectors": "Electrical"
};

// Function to get pricing for a specific task
const getPricingForTask = (category: string, task: string): PricingData => {
  const pricingCategory = categoryMapping[category] || "Interior Finishes";
  const categoryPricing = pricingProfiles[pricingCategory];
  
  // Try to find exact match first
  let pricing = Object.entries(categoryPricing).find(([key]) => 
    key.toLowerCase().includes(task.toLowerCase()) || 
    task.toLowerCase().includes(key.toLowerCase())
  )?.[1];
  
  // If no match found, use default pricing based on category
  if (!pricing) {
    const defaultPricing: { [key: string]: PricingData } = {
      "Prep & Demo": { materialCosts: 2965, laborCosts: 2965, totalCosts: 5930 },
      "Structural & Foundation": { materialCosts: 13332.5, laborCosts: 13332.5, totalCosts: 26665 },
      "Plumbing": { materialCosts: 1154, laborCosts: 1154, totalCosts: 2308 },
      "Electrical": { materialCosts: 4126.25, laborCosts: 4126.25, totalCosts: 8252.5 },
      "Interior Finishes": { materialCosts: 18208.5, laborCosts: 18208.5, totalCosts: 36417 },
      "Kitchen": { materialCosts: 2691.5, laborCosts: 2691.5, totalCosts: 5383 },
      "Bathrooms": { materialCosts: 1096.5, laborCosts: 1096.5, totalCosts: 2193 }
    };
    pricing = defaultPricing[pricingCategory] || defaultPricing["Interior Finishes"];
  }
  
  // Ensure we always return a valid PricingData object
  return pricing || { materialCosts: 1000, laborCosts: 1000, totalCosts: 2000 };
};

const DocumentsPage = () => {
  const [selectedBedrooms, setSelectedBedrooms] = useState("1");
  const [contractorType, setContractorType] = useState("gc");
  const [gcInfo, setGcInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });
  const [tradeInfo, setTradeInfo] = useState({
    plumber: { name: "", phone: "", email: "" },
    electrician: { name: "", phone: "", email: "" },
    hvac: { name: "", phone: "", email: "" },
    flooring: { name: "", phone: "", email: "" },
    painter: { name: "", phone: "", email: "" },
    carpenter: { name: "", phone: "", email: "" }
  });
  const [inspectionData, setInspectionData] = useState({
    propertyDetails: {
      date: { value: "", status: "good", needsRepair: false },
      address: { value: "", status: "good", needsRepair: false },
      ownerName: { value: "", status: "good", needsRepair: false },
      phone: { value: "", status: "good", needsRepair: false },
      yearBuilt: { value: "", status: "good", needsRepair: false },
      squareFootage: { value: "", status: "good", needsRepair: false },
      bedrooms: { value: "", status: "good", needsRepair: false },
      bathrooms: { value: "", status: "good", needsRepair: false },
      garage: { value: "", status: "good", needsRepair: false },
      carport: { value: "", status: "good", needsRepair: false },
      pool: { value: "", status: "good", needsRepair: false }
    },
    frontGarden: {
      hasGarden: { value: "", status: "good", needsRepair: false },
      clearOfRubbish: { value: "", status: "good", needsRepair: false },
    },
    entrance: {
      stepsStairs: { value: "", status: "excellent", needsRepair: false },
      pathway: { value: "", status: "excellent", needsRepair: false },
      drains: { value: "", status: "excellent", needsRepair: false },
      roofCondition: { value: "", status: "excellent", needsRepair: false },
      frontGutters: { value: "", status: "excellent", needsRepair: false },
      frontBrickwork: { value: "", status: "excellent", needsRepair: false },
      structuralMovement: { value: "", status: "good", needsRepair: false },
    },
    kitchen: {
      windows: { value: "", status: "excellent", needsRepair: false },
      wallCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
      unitsCondition: { value: "", status: "excellent", needsRepair: false },
      numBaseUnits: { value: "", status: "good", needsRepair: false },
      numWallUnits: { value: "", status: "good", needsRepair: false },
      worktopCondition: { value: "", status: "excellent", needsRepair: false },
      sink: { value: "", status: "excellent", needsRepair: false },
      numSockets: { value: "", status: "good", needsRepair: false },
      cooker: { value: "", status: "good", needsRepair: false },
      cookerChain: { value: "", status: "good", needsRepair: false },
      extractorFan: { value: "", status: "excellent", needsRepair: false },
      washingMachine: { value: "", status: "excellent", needsRepair: false },
      microwave: { value: "", status: "excellent", needsRepair: false },
      tumbleDryer: { value: "", status: "excellent", needsRepair: false },
      cookerOven: { value: "", status: "excellent", needsRepair: false },
      fridgeFreezer: { value: "", status: "excellent", needsRepair: false },
      doorFrame: { value: "", status: "excellent", needsRepair: false },
      doorCloses: { value: "", status: "good", needsRepair: false },
      fireHourDoor: { value: "", status: "good", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    },
    bathroom: {
      windows: { value: "", status: "excellent", needsRepair: false },
      doorFrame: { value: "", status: "excellent", needsRepair: false },
      doorCloses: { value: "", status: "good", needsRepair: false },
      wallCondition: { value: "", status: "excellent", needsRepair: false },
      wallTilesCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
      bath: { value: "", status: "excellent", needsRepair: false },
      bathSealant: { value: "", status: "excellent", needsRepair: false },
      sink: { value: "", status: "excellent", needsRepair: false },
      sinkSealant: { value: "", status: "excellent", needsRepair: false },
      shower: { value: "", status: "excellent", needsRepair: false },
      showerSealant: { value: "", status: "excellent", needsRepair: false },
      mixerTap: { value: "", status: "excellent", needsRepair: false },
      showerAttachments: { value: "", status: "excellent", needsRepair: false },
      extractorFan: { value: "", status: "excellent", needsRepair: false },
      condensationMould: { value: "", status: "good", needsRepair: false },
      waterPressure: { value: "", status: "excellent", needsRepair: false },
      toiletPanSystem: { value: "", status: "excellent", needsRepair: false },
      flooring: { value: "", status: "excellent", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    },
    livingRoom: {
      windows: { value: "", status: "excellent", needsRepair: false },
      curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
      curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
      carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
      majorStainsDamage: { value: "", status: "good", needsRepair: false },
      wallCondition: { value: "", status: "excellent", needsRepair: false },
      numSockets: { value: "", status: "good", needsRepair: false },
      numLightSwitches: { value: "", status: "good", needsRepair: false },
      ceilingCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
      radiatorGCH: { value: "", status: "good", needsRepair: false },
      wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
      gasFire: { value: "", status: "good", needsRepair: false },
      electricFire: { value: "", status: "good", needsRepair: false },
      doorOpensCloses: { value: "", status: "good", needsRepair: false },
      furnitureList: { value: "", status: "good", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    },
    diningRoom: {
      windows: { value: "", status: "excellent", needsRepair: false },
      curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
      curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
      carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
      majorStainsDamage: { value: "", status: "good", needsRepair: false },
      wallCondition: { value: "", status: "excellent", needsRepair: false },
      numSockets: { value: "", status: "good", needsRepair: false },
      numLightSwitches: { value: "", status: "good", needsRepair: false },
      ceilingCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
      radiatorGCH: { value: "", status: "good", needsRepair: false },
      wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
      gasFire: { value: "", status: "good", needsRepair: false },
      electricFire: { value: "", status: "good", needsRepair: false },
      doorOpensCloses: { value: "", status: "good", needsRepair: false },
      furnitureList: { value: "", status: "good", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    },
    bedrooms: {
      bedroom1: {
        roomSize: { value: "", status: "good", needsRepair: false },
        windows: { value: "", status: "excellent", needsRepair: false },
        curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
        curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
        carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
        majorStainsDamage: { value: "", status: "good", needsRepair: false },
        wallCondition: { value: "", status: "excellent", needsRepair: false },
        wallDefects: { value: "", status: "good", needsRepair: false },
        numSockets: { value: "", status: "good", needsRepair: false },
        numLightSwitches: { value: "", status: "good", needsRepair: false },
        ceilingCondition: { value: "", status: "excellent", needsRepair: false },
        ceilingDefects: { value: "", status: "good", needsRepair: false },
        ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
        radiatorGCH: { value: "", status: "good", needsRepair: false },
        wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
        doorOpensCloses: { value: "", status: "good", needsRepair: false },
        furnitureList: { value: "", status: "good", needsRepair: false },
        defectsDetails: { value: "", status: "good", needsRepair: false },
      },
      bedroom2: {
        roomSize: { value: "", status: "good", needsRepair: false },
        windows: { value: "", status: "excellent", needsRepair: false },
        curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
        curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
        carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
        majorStainsDamage: { value: "", status: "good", needsRepair: false },
        wallCondition: { value: "", status: "excellent", needsRepair: false },
        wallDefects: { value: "", status: "good", needsRepair: false },
        numSockets: { value: "", status: "good", needsRepair: false },
        numLightSwitches: { value: "", status: "good", needsRepair: false },
        ceilingCondition: { value: "", status: "excellent", needsRepair: false },
        ceilingDefects: { value: "", status: "good", needsRepair: false },
        ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
        radiatorGCH: { value: "", status: "good", needsRepair: false },
        wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
        doorOpensCloses: { value: "", status: "good", needsRepair: false },
        furnitureList: { value: "", status: "good", needsRepair: false },
        defectsDetails: { value: "", status: "good", needsRepair: false },
      },
      bedroom3: {
        roomSize: { value: "", status: "good", needsRepair: false },
        windows: { value: "", status: "excellent", needsRepair: false },
        curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
        curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
        carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
        majorStainsDamage: { value: "", status: "good", needsRepair: false },
        wallCondition: { value: "", status: "excellent", needsRepair: false },
        wallDefects: { value: "", status: "good", needsRepair: false },
        numSockets: { value: "", status: "good", needsRepair: false },
        numLightSwitches: { value: "", status: "good", needsRepair: false },
        ceilingCondition: { value: "", status: "excellent", needsRepair: false },
        ceilingDefects: { value: "", status: "good", needsRepair: false },
        ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
        radiatorGCH: { value: "", status: "good", needsRepair: false },
        wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
        doorOpensCloses: { value: "", status: "good", needsRepair: false },
        furnitureList: { value: "", status: "good", needsRepair: false },
        defectsDetails: { value: "", status: "good", needsRepair: false },
      },
      bedroom4: {
        roomSize: { value: "", status: "good", needsRepair: false },
        windows: { value: "", status: "excellent", needsRepair: false },
        curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
        curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
        carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
        majorStainsDamage: { value: "", status: "good", needsRepair: false },
        wallCondition: { value: "", status: "excellent", needsRepair: false },
        wallDefects: { value: "", status: "good", needsRepair: false },
        numSockets: { value: "", status: "good", needsRepair: false },
        numLightSwitches: { value: "", status: "good", needsRepair: false },
        ceilingCondition: { value: "", status: "excellent", needsRepair: false },
        ceilingDefects: { value: "", status: "good", needsRepair: false },
        ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
        radiatorGCH: { value: "", status: "good", needsRepair: false },
        wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
        doorOpensCloses: { value: "", status: "good", needsRepair: false },
        furnitureList: { value: "", status: "good", needsRepair: false },
        defectsDetails: { value: "", status: "good", needsRepair: false },
      },
      bedroom5: {
        roomSize: { value: "", status: "good", needsRepair: false },
        windows: { value: "", status: "excellent", needsRepair: false },
        curtainsBlinds: { value: "", status: "excellent", needsRepair: false },
        curtainTrackFittings: { value: "", status: "excellent", needsRepair: false },
        carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
        majorStainsDamage: { value: "", status: "good", needsRepair: false },
        wallCondition: { value: "", status: "excellent", needsRepair: false },
        wallDefects: { value: "", status: "good", needsRepair: false },
        numSockets: { value: "", status: "good", needsRepair: false },
        numLightSwitches: { value: "", status: "good", needsRepair: false },
        ceilingCondition: { value: "", status: "excellent", needsRepair: false },
        ceilingDefects: { value: "", status: "good", needsRepair: false },
        ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
        radiatorGCH: { value: "", status: "good", needsRepair: false },
        wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
        doorOpensCloses: { value: "", status: "good", needsRepair: false },
        furnitureList: { value: "", status: "good", needsRepair: false },
        defectsDetails: { value: "", status: "good", needsRepair: false },
      },
    },
    hallway: {
      windows: { value: "", status: "excellent", needsRepair: false },
      carpetsLaminate: { value: "", status: "excellent", needsRepair: false },
      majorStainsDamage: { value: "", status: "good", needsRepair: false },
      wallCondition: { value: "", status: "excellent", needsRepair: false },
      wallDefects: { value: "", status: "good", needsRepair: false },
      numSockets: { value: "", status: "good", needsRepair: false },
      numLightSwitches: { value: "", status: "good", needsRepair: false },
      ceilingCondition: { value: "", status: "excellent", needsRepair: false },
      ceilingDefects: { value: "", status: "good", needsRepair: false },
      ceilingClearPolystyrene: { value: "", status: "good", needsRepair: false },
      radiatorGCH: { value: "", status: "good", needsRepair: false },
      wallMountedElectricHeater: { value: "", status: "good", needsRepair: false },
      frontDoorFrame: { value: "", status: "excellent", needsRepair: false },
      frontDoorCloses: { value: "", status: "good", needsRepair: false },
      staircaseCondition: { value: "", status: "excellent", needsRepair: false },
      handrail: { value: "", status: "excellent", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    },
    smokeDetectors: {
      sd1: {
        location: { value: "", status: "good", needsRepair: false },
        batteryOperated: { value: "", status: "good", needsRepair: false },
        dateTested: { value: "", status: "good", needsRepair: false },
        working: { value: "", status: "good", needsRepair: false },
      },
      sd2: {
        location: { value: "", status: "good", needsRepair: false },
        batteryOperated: { value: "", status: "good", needsRepair: false },
        dateTested: { value: "", status: "good", needsRepair: false },
        working: { value: "", status: "good", needsRepair: false },
      },
      sd3: {
        location: { value: "", status: "good", needsRepair: false },
        batteryOperated: { value: "", status: "good", needsRepair: false },
        dateTested: { value: "", status: "good", needsRepair: false },
        working: { value: "", status: "good", needsRepair: false },
      },
      sd4: {
        location: { value: "", status: "good", needsRepair: false },
        batteryOperated: { value: "", status: "good", needsRepair: false },
        dateTested: { value: "", status: "good", needsRepair: false },
        working: { value: "", status: "good", needsRepair: false },
      },
      sd5: {
        location: { value: "", status: "good", needsRepair: false },
        batteryOperated: { value: "", status: "good", needsRepair: false },
        dateTested: { value: "", status: "good", needsRepair: false },
        working: { value: "", status: "good", needsRepair: false },
      },
    },
    utilities: {
      gasMeter: { value: "", status: "good", needsRepair: false },
      electricMeter: { value: "", status: "good", needsRepair: false },
      fuseBox: { value: "", status: "good", needsRepair: false },
      stopcocks: { value: "", status: "good", needsRepair: false },
    },
    rearGarden: {
      condition: { value: "", status: "excellent", needsRepair: false },
      clearOfRubbish: { value: "", status: "good", needsRepair: false },
      fences: { value: "", status: "excellent", needsRepair: false },
      sheds: { value: "", status: "excellent", needsRepair: false },
      shedsClearOfGoods: { value: "", status: "good", needsRepair: false },
      stepsStairCondition: { value: "", status: "excellent", needsRepair: false },
      pathwayCondition: { value: "", status: "excellent", needsRepair: false },
      drains: { value: "", status: "excellent", needsRepair: false },
      gutters: { value: "", status: "excellent", needsRepair: false },
      defectsDetails: { value: "", status: "good", needsRepair: false },
    }
  });

  // Generate SOW data dynamically from inspection data
  const generateSOWFromInspection = () => {
    const sowItems = [];
    let taskId = 1;

    Object.entries(inspectionData).forEach(([category, items]) => {
      if (category === 'bedrooms') {
        // Handle bedroom structure
        Object.entries(items).forEach(([bedroomKey, bedroomData]) => {
          Object.entries(bedroomData as any).forEach(([item, data]: [string, any]) => {
            if (data.needsRepair) {
              const pricing = getPricingForTask(category, item);
              const taskName = `${bedroomKey} - ${item.replace(/([A-Z])/g, ' $1').trim()}`;
              sowItems.push({
                id: taskId++,
                category: categoryMapping[category] || "Interior Finishes",
                task: taskName,
                tradeType: getTradeTypeFromCategory(category, item),
                duration: getDurationFromTask(item),
                laborCost: pricing.laborCosts,
                materialCost: pricing.materialCosts,
                status: "pending"
              });
            }
          });
        });
      } else if (category === 'smokeDetectors') {
        // Handle smoke detectors structure
        Object.entries(items).forEach(([detectorKey, detectorData]) => {
          Object.entries(detectorData as any).forEach(([item, data]: [string, any]) => {
            if (data.needsRepair) {
              const pricing = getPricingForTask(category, item);
              const taskName = `${detectorKey} - ${item.replace(/([A-Z])/g, ' $1').trim()}`;
              sowItems.push({
                id: taskId++,
                category: categoryMapping[category] || "Electrical",
                task: taskName,
                tradeType: "electrician",
                duration: "1 day",
                laborCost: pricing.laborCosts,
                materialCost: pricing.materialCosts,
                status: "pending"
              });
            }
          });
        });
      } else if (category !== 'propertyDetails') {
        // Handle regular flat structure
        Object.entries(items as any).forEach(([item, data]: [string, any]) => {
          if (data.needsRepair) {
            const pricing = getPricingForTask(category, item);
            const taskName = `${category} - ${item.replace(/([A-Z])/g, ' $1').trim()}`;
            sowItems.push({
              id: taskId++,
              category: categoryMapping[category] || "Interior Finishes",
              task: taskName,
              tradeType: getTradeTypeFromCategory(category, item),
              duration: getDurationFromTask(item),
              laborCost: pricing.laborCosts,
              materialCost: pricing.materialCosts,
              status: "pending"
            });
          }
        });
      }
    });

    // Add some default SOW items from CMH pricing profile for demonstration
    const defaultItems = [
      { category: "Kitchen", task: "Replace cabinets", tradeType: "carpenter", pricing: pricingProfiles.Kitchen.Cabinets },
      { category: "Kitchen", task: "Install countertops", tradeType: "carpenter", pricing: pricingProfiles.Kitchen["Countertops (Granite/Quartz)"] },
      { category: "Bathrooms", task: "Bathroom renovation", tradeType: "plumber", pricing: pricingProfiles.Bathrooms["Tub/Shower Pan"] },
      { category: "Electrical", task: "Service Panel Upgrade", tradeType: "electrician", pricing: pricingProfiles.Electrical["Service Panel Upgrade"] },
      { category: "Plumbing", task: "Water Heater Installation", tradeType: "plumber", pricing: pricingProfiles.Plumbing["Water Heater"] }
    ];

    defaultItems.forEach((item, index) => {
      sowItems.push({
        id: taskId++,
        category: item.category,
        task: item.task,
        tradeType: item.tradeType,
        duration: getDurationFromTask(item.task),
        laborCost: item.pricing.laborCosts,
        materialCost: item.pricing.materialCosts,
        status: "pending"
      });
    });

    return sowItems;
  };

  const getTradeTypeFromCategory = (category: string, item: string) => {
    const tradeMapping = {
      "kitchen": "carpenter",
      "bathroom": "plumber", 
      "livingRoom": "painter",
      "diningRoom": "painter",
      "bedrooms": "painter",
      "hallway": "painter",
      "smokeDetectors": "electrician",
      "utilities": "electrician",
      "frontGarden": "carpenter",
      "entrance": "carpenter",
      "rearGarden": "carpenter"
    };
    
    // Check for specific items that might need different trades
    if (item.toLowerCase().includes('electrical') || item.toLowerCase().includes('socket') || item.toLowerCase().includes('switch')) {
      return "electrician";
    }
    if (item.toLowerCase().includes('plumb') || item.toLowerCase().includes('water') || item.toLowerCase().includes('sink')) {
      return "plumber";
    }
    if (item.toLowerCase().includes('paint') || item.toLowerCase().includes('wall') || item.toLowerCase().includes('ceiling')) {
      return "painter";
    }
    if (item.toLowerCase().includes('floor') || item.toLowerCase().includes('carpet')) {
      return "flooring";
    }
    
    return tradeMapping[category] || "carpenter";
  };

  const getDurationFromTask = (item: string) => {
    // Simple duration estimation based on task type
    if (item.toLowerCase().includes('paint')) return "2-3 days";
    if (item.toLowerCase().includes('floor')) return "3-4 days";
    if (item.toLowerCase().includes('electrical')) return "1-2 days";
    if (item.toLowerCase().includes('plumb')) return "1-2 days";
    if (item.toLowerCase().includes('door') || item.toLowerCase().includes('window')) return "1 day";
    if (item.toLowerCase().includes('cabinet')) return "5-7 days";
    if (item.toLowerCase().includes('countertop')) return "2-3 days";
    return "1-2 days";
  };

  const [sowData, setSowData] = useState(generateSOWFromInspection());

  const budgetProfiles = {
    low: { multiplier: 0.8, description: "Basic finishes, standard materials" },
    medium: { multiplier: 1.0, description: "Mid-grade finishes, quality materials" },
    high: { multiplier: 1.3, description: "Premium finishes, high-end materials" }
  };

  const [selectedProfile, setSelectedProfile] = useState("medium");

  const totalLaborCost = sowData.reduce((sum, item) => sum + item.laborCost, 0);
  const totalMaterialCost = sowData.reduce((sum, item) => sum + item.materialCost, 0);
  const profileMultiplier = budgetProfiles[selectedProfile].multiplier;
  const adjustedTotal = (totalLaborCost + totalMaterialCost) * profileMultiplier;

  const getContractorName = (task) => {
    if (contractorType === "gc") {
      return ""; // No contractor name for GC
    } else {
      // Get contractor name from trade info based on trade type
      const tradeName = tradeInfo[task.tradeType]?.name;
      return tradeName || "Not assigned";
    }
  };

  const getTaskStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "outline", label: "Pending" },
      "in-progress": { variant: "default", label: "In Progress" },
      completed: { variant: "secondary", label: "Completed" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Documents & Workflow
            </h1>
            <p className="text-muted-foreground">
              End-to-end property management from inspection to completion
            </p>
          </div>

          <Tabs defaultValue="inspection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="inspection" className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Inspection
              </TabsTrigger>
              <TabsTrigger value="sow" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Scope of Work
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Budgeting
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileBarChart className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>

            {/* Step 1: Inspection Checklist */}
            <TabsContent value="inspection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Property Inspection Checklist
                  </CardTitle>
                  <CardDescription>
                    Comprehensive property assessment - items marked for repair will auto-generate SOW tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Details Section - Input Fields Only */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Property Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {Object.entries(inspectionData.propertyDetails).map(([field, data]) => (
                         <div key={field} className="space-y-2">
                           <Label className="capitalize font-medium">
                             {field.replace(/([A-Z])/g, ' $1').trim()}
                           </Label>
                           {field === 'bedrooms' ? (
                             <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select number of bedrooms" />
                               </SelectTrigger>
                               <SelectContent>
                                 <SelectItem value="1">1 Bedroom</SelectItem>
                                 <SelectItem value="2">2 Bedrooms</SelectItem>
                                 <SelectItem value="3">3 Bedrooms</SelectItem>
                                 <SelectItem value="4">4 Bedrooms</SelectItem>
                                 <SelectItem value="5">5 Bedrooms</SelectItem>
                               </SelectContent>
                             </Select>
                           ) : (
                             <Input 
                               placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                               value={data.value}
                               onChange={(e) => {
                                 setInspectionData(prev => ({
                                   ...prev,
                                   propertyDetails: {
                                     ...prev.propertyDetails,
                                     [field]: { ...data, value: e.target.value }
                                   }
                                 }));
                               }}
                             />
                           )}
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Inspection Categories - Checkbox Items */}
                  {Object.entries(inspectionData).filter(([category]) => category !== 'propertyDetails').map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize text-foreground">
                        {category === 'frontGarden' ? 'Front Garden' : 
                         category === 'livingRoom' ? 'Living Room' : 
                         category === 'diningRoom' ? 'Dining Room' : 
                         category === 'rearGarden' ? 'Rear Garden' : 
                         category === 'smokeDetectors' ? 'Smoke Detectors' : 
                         category}
                      </h3>
                      
                       {/* Handle nested bedrooms structure */}
                       {category === 'bedrooms' ? (
                         <div className="space-y-6">
                           {Object.entries(items).slice(0, parseInt(selectedBedrooms)).map(([bedroomKey, bedroomData]) => (
                             <div key={bedroomKey} className="space-y-4">
                               <h4 className="text-md font-medium capitalize text-foreground">
                                 {bedroomKey.replace(/([A-Z])/g, ' $1').trim()}
                               </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(bedroomData as any).map(([item, data]: [string, any]) => (
                                  <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1 space-y-3">
                                      <Label className="capitalize font-medium text-sm">
                                        {item.replace(/([A-Z])/g, ' $1').trim()}
                                      </Label>
                                      <div className="flex items-center gap-3">
                                        <div className="min-w-[120px]">
                                          <Select 
                                            value={data.status} 
                                            onValueChange={(value) => {
                                              const needsRepair = value === 'fair' || value === 'poor';
                                              setInspectionData(prev => ({
                                                ...prev,
                                                bedrooms: {
                                                  ...prev.bedrooms,
                                                  [bedroomKey]: {
                                                    ...(prev.bedrooms as any)[bedroomKey],
                                                    [item]: { ...data, status: value, needsRepair }
                                                  }
                                                }
                                              }));
                                            }}
                                          >
                                            <SelectTrigger className="h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="excellent">Excellent</SelectItem>
                                              <SelectItem value="good">Good</SelectItem>
                                              <SelectItem value="fair">Fair</SelectItem>
                                              <SelectItem value="poor">Poor</SelectItem>
                                              <SelectItem value="none">None/N/A</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox 
                                            checked={data.needsRepair}
                                            disabled={data.status === 'excellent' || data.status === 'good'}
                                            onCheckedChange={(checked) => {
                                              setInspectionData(prev => ({
                                                ...prev,
                                                bedrooms: {
                                                  ...prev.bedrooms,
                                                  [bedroomKey]: {
                                                    ...(prev.bedrooms as any)[bedroomKey],
                                                    [item]: { ...data, needsRepair: checked }
                                                  }
                                                }
                                              }));
                                            }}
                                          />
                                          <span className="text-xs text-muted-foreground">Add to SOW</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : category === 'smokeDetectors' ? (
                        /* Handle nested smoke detectors structure */
                        <div className="space-y-4">
                          {Object.entries(items).map(([detectorKey, detectorData]) => (
                            <div key={detectorKey} className="space-y-4">
                              <h4 className="text-md font-medium uppercase text-foreground">{detectorKey}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.entries(detectorData as any).map(([item, data]: [string, any]) => (
                                  <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1 space-y-3">
                                      <Label className="capitalize font-medium text-sm">
                                        {item.replace(/([A-Z])/g, ' $1').trim()}
                                      </Label>
                                      <div className="flex items-center gap-3">
                                        <div className="min-w-[120px]">
                                          <Select 
                                            value={data.status} 
                                            onValueChange={(value) => {
                                              const needsRepair = value === 'fair' || value === 'poor';
                                              setInspectionData(prev => ({
                                                ...prev,
                                                smokeDetectors: {
                                                  ...prev.smokeDetectors,
                                                  [detectorKey]: {
                                                    ...(prev.smokeDetectors as any)[detectorKey],
                                                    [item]: { ...data, status: value, needsRepair }
                                                  }
                                                }
                                              }));
                                            }}
                                          >
                                            <SelectTrigger className="h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="excellent">Excellent</SelectItem>
                                              <SelectItem value="good">Good</SelectItem>
                                              <SelectItem value="fair">Fair</SelectItem>
                                              <SelectItem value="poor">Poor</SelectItem>
                                              <SelectItem value="none">None/N/A</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox 
                                            checked={data.needsRepair}
                                            disabled={data.status === 'excellent' || data.status === 'good'}
                                            onCheckedChange={(checked) => {
                                              setInspectionData(prev => ({
                                                ...prev,
                                                smokeDetectors: {
                                                  ...prev.smokeDetectors,
                                                  [detectorKey]: {
                                                    ...(prev.smokeDetectors as any)[detectorKey],
                                                    [item]: { ...data, needsRepair: checked }
                                                  }
                                                }
                                              }));
                                            }}
                                          />
                                          <span className="text-xs text-muted-foreground">Add to SOW</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Handle regular flat structure */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {Object.entries(items).map(([item, data]) => (
                            <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1 space-y-3">
                                <Label className="capitalize font-medium text-sm">
                                  {item.replace(/([A-Z])/g, ' $1').trim()}
                                </Label>
                                <div className="flex items-center gap-3">
                                  <div className="min-w-[120px]">
                                    <Select 
                                      value={data.status} 
                                      onValueChange={(value) => {
                                        const needsRepair = value === 'fair' || value === 'poor';
                                        setInspectionData(prev => ({
                                          ...prev,
                                          [category]: {
                                            ...prev[category],
                                            [item]: { ...data, status: value, needsRepair }
                                          }
                                        }));
                                      }}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="excellent">Excellent</SelectItem>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="poor">Poor</SelectItem>
                                        <SelectItem value="none">None/N/A</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox 
                                      checked={data.needsRepair}
                                      disabled={data.status === 'excellent' || data.status === 'good'}
                                      onCheckedChange={(checked) => {
                                        setInspectionData(prev => ({
                                          ...prev,
                                          [category]: {
                                            ...prev[category],
                                            [item]: { ...data, needsRepair: checked }
                                          }
                                        }));
                                      }}
                                    />
                                    <span className="text-xs text-muted-foreground">Add to SOW</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                   <div className="flex justify-end">
                     <Button 
                       className="flex items-center gap-2"
                       onClick={() => setSowData(generateSOWFromInspection())}
                     >
                       <Plus className="h-4 w-4" />
                       Generate SOW from Checklist with CMH Pricing
                     </Button>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2: Scope of Work */}
            <TabsContent value="sow" className="space-y-6">
              {/* Property Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Property Address</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.address.value || "Not specified"}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Square Footage</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.squareFootage.value || "Not specified"}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bedrooms</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.bedrooms.value || selectedBedrooms}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Bathrooms</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.bathrooms.value || "Not specified"}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Garage</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.garage.value || "Not specified"}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Year Built</Label>
                      <div className="text-sm">{inspectionData.propertyDetails.yearBuilt.value || "Not specified"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contractor/Trades Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Contractor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Work Type</Label>
                    <Select value={contractorType} onValueChange={setContractorType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gc">General Contractor</SelectItem>
                        <SelectItem value="trades">Individual Trades</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {contractorType === "gc" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>GC Name</Label>
                        <Input 
                          value={gcInfo.name}
                          onChange={(e) => setGcInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter GC name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input 
                          value={gcInfo.phone}
                          onChange={(e) => setGcInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input 
                          value={gcInfo.address}
                          onChange={(e) => setGcInfo(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Enter address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input 
                          value={gcInfo.email}
                          onChange={(e) => setGcInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(tradeInfo).map(([trade, info]) => (
                        <div key={trade} className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-3 capitalize">{trade}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <Label className="text-sm">Name</Label>
                              <Input 
                                value={info.name}
                                onChange={(e) => setTradeInfo(prev => ({ 
                                  ...prev, 
                                  [trade]: { ...prev[trade], name: e.target.value }
                                }))}
                                placeholder="Enter name"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Phone</Label>
                              <Input 
                                value={info.phone}
                                onChange={(e) => setTradeInfo(prev => ({ 
                                  ...prev, 
                                  [trade]: { ...prev[trade], phone: e.target.value }
                                }))}
                                placeholder="Enter phone"
                                className="h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-sm">Email</Label>
                              <Input 
                                value={info.email}
                                onChange={(e) => setTradeInfo(prev => ({ 
                                  ...prev, 
                                  [trade]: { ...prev[trade], email: e.target.value }
                                }))}
                                placeholder="Enter email"
                                className="h-8"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Scope of Work (Auto-Generated)
                  </CardTitle>
                  <CardDescription>
                    Tasks auto-generated from inspection checklist items marked for repair
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Task Description</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Labor Cost</TableHead>
                        <TableHead>Material Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sowData.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <Badge variant="outline">{task.category}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{task.task}</TableCell>
                          <TableCell>{getContractorName(task)}</TableCell>
                          <TableCell>{task.duration}</TableCell>
                          <TableCell>${task.laborCost.toLocaleString()}</TableCell>
                          <TableCell>${task.materialCost.toLocaleString()}</TableCell>
                          <TableCell>{getTaskStatusBadge(task.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                   <div className="mt-4 flex justify-between items-center">
                     <div className="text-sm text-muted-foreground">
                       {sowData.length} tasks • {sowData.filter(t => t.status === 'completed').length} completed
                     </div>
                     <Button className="flex items-center gap-2">
                       <Plus className="h-4 w-4" />
                       Add Custom Task
                     </Button>
                   </div>
                   
                   {/* CMH Pricing Profile Summary */}
                   <div className="mt-6 p-4 bg-muted rounded-lg">
                     <h4 className="font-medium mb-3">CMH Pricing Profile Applied</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                       <div>
                         <span className="text-muted-foreground">Total Labor:</span>
                         <div className="font-medium">${sowData.reduce((sum, item) => sum + item.laborCost, 0).toLocaleString()}</div>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Total Materials:</span>
                         <div className="font-medium">${sowData.reduce((sum, item) => sum + item.materialCost, 0).toLocaleString()}</div>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Total Cost:</span>
                         <div className="font-medium text-primary">${sowData.reduce((sum, item) => sum + item.laborCost + item.materialCost, 0).toLocaleString()}</div>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Pricing Source:</span>
                         <div className="font-medium">CMH Database</div>
                       </div>
                     </div>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3: Budgeting */}
            <TabsContent value="budget" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Cost Automation & Budgeting
                    </CardTitle>
                    <CardDescription>
                      Auto-calculated budget based on SOW with finish level profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label>Select Finish Profile</Label>
                      <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Finish - {budgetProfiles.low.description}</SelectItem>
                          <SelectItem value="medium">Medium Finish - {budgetProfiles.medium.description}</SelectItem>
                          <SelectItem value="high">High Finish - {budgetProfiles.high.description}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Base Labor Cost</Label>
                        <Input value={`$${totalLaborCost.toLocaleString()}`} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label>Base Material Cost</Label>
                        <Input value={`$${totalMaterialCost.toLocaleString()}`} readOnly />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Profile Multiplier</Label>
                      <Input value={`${profileMultiplier}x`} readOnly />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Labor</span>
                        <span>${(totalLaborCost * profileMultiplier).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Materials</span>
                        <span>${(totalMaterialCost * profileMultiplier).toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total Budget</span>
                          <span className="text-primary">${adjustedTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Labor vs Materials</span>
                      </div>
                      <Progress value={(totalLaborCost / (totalLaborCost + totalMaterialCost)) * 100} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Labor {Math.round((totalLaborCost / (totalLaborCost + totalMaterialCost)) * 100)}%</span>
                        <span>Materials {Math.round((totalMaterialCost / (totalLaborCost + totalMaterialCost)) * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Step 4: Project Gantt Chart */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Project Timeline & Dependencies
                  </CardTitle>
                  <CardDescription>
                    Gantt chart visualization with task dependencies and scheduling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sowData.map((task, index) => (
                      <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <div className="flex-1">
                          <div className="font-medium">{task.task}</div>
                          <div className="text-sm text-muted-foreground">{getContractorName(task)} • {task.duration}</div>
                        </div>
                        <div className="w-48">
                          <Progress value={task.status === 'completed' ? 100 : task.status === 'in-progress' ? 50 : 0} />
                        </div>
                        <div className="text-sm text-muted-foreground w-20">
                          {task.status === 'completed' ? '100%' : task.status === 'in-progress' ? '50%' : '0%'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Project Dependencies</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>• Structural work must complete before systems</div>
                      <div>• Drywall repair before painting</div>
                      <div>• Flooring after all other interior work</div>
                      <div>• Final inspections after all work completion</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 5: Reporting */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileBarChart className="h-5 w-5" />
                      Property Rehab Summary
                    </CardTitle>
                    <CardDescription>
                      Complete project overview from inspection to budget
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Tasks:</span>
                        <div className="font-medium">{sowData.length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <div className="font-medium">{sowData.filter(t => t.status === 'completed').length}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Budget:</span>
                        <div className="font-medium">${adjustedTotal.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span>
                        <div className="font-medium">{Math.round((sowData.filter(t => t.status === 'completed').length / sowData.length) * 100)}%</div>
                      </div>
                    </div>
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Property Summary (PDF)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Budget vs Actual Report</CardTitle>
                    <CardDescription>
                      Track actual costs against budgeted amounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budgeted:</span>
                        <span className="font-medium">${adjustedTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Actual Spent:</span>
                        <span className="font-medium">${(adjustedTotal * 0.85).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variance:</span>
                        <span className="font-medium text-success">-${(adjustedTotal * 0.15).toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={85} />
                    <div className="text-sm text-muted-foreground text-center">85% of budget utilized</div>
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Budget Report (Excel)
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gantt Progress Report</CardTitle>
                    <CardDescription>
                      Timeline and milestone tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Start:</span>
                        <span className="font-medium">Jan 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Completion:</span>
                        <span className="font-medium">Mar 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Days Remaining:</span>
                        <span className="font-medium">32 days</span>
                      </div>
                    </div>
                    <Progress value={45} />
                    <div className="text-sm text-muted-foreground text-center">45% timeline complete</div>
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Schedule Report
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Investor Update</CardTitle>
                    <CardDescription>
                      Comprehensive project status for stakeholders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div>✅ Inspection completed</div>
                      <div>✅ SOW approved</div>
                      <div>✅ Budget finalized</div>
                      <div>🔄 Construction in progress</div>
                      <div>⏳ Final walkthrough pending</div>
                    </div>
                    <Button className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Generate Investor Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;