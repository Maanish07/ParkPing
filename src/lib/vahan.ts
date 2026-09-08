export interface VehicleDetails {
  vehicleNumber: string;
  maker: string;
  model: string;
  vehicleType: 'car' | 'suv' | 'hatchback' | 'bike' | 'ev';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
  rtoLocation: string;
  state: string;
  registrationDate: string;
  insuranceValidUntil: string;
  pucValidUntil: string;
  color: string;
  ownerMaskedName: string;
}

const RTO_MAP: Record<string, { state: string; rto: string }> = {
  DL01: { state: 'Delhi', rto: 'Mall Road RTO, North Delhi' },
  DL02: { state: 'Delhi', rto: 'IP Depot RTO, New Delhi' },
  DL03: { state: 'Delhi', rto: 'Sheikh Sarai RTO, South Delhi' },
  DL04: { state: 'Delhi', rto: 'Janakpuri RTO, West Delhi' },
  DL05: { state: 'Delhi', rto: 'Loni Road RTO, North East Delhi' },
  DL06: { state: 'Delhi', rto: 'Sarai Kale Khan RTO, Central Delhi' },
  DL07: { state: 'Delhi', rto: 'Mayur Vihar RTO, East Delhi' },
  DL08: { state: 'Delhi', rto: 'Wazirpur RTO, North West Delhi' },
  DL09: { state: 'Delhi', rto: 'Palam RTO, South West Delhi' },
  DL10: { state: 'Delhi', rto: 'Raja Garden RTO, West Delhi' },
  DL11: { state: 'Delhi', rto: 'Rohini RTO, North West Delhi' },
  DL12: { state: 'Delhi', rto: 'Vasant Vihar RTO, South Delhi' },
  MH01: { state: 'Maharashtra', rto: 'Mumbai Central RTO, Tardeo' },
  MH02: { state: 'Maharashtra', rto: 'Mumbai West RTO, Andheri' },
  MH03: { state: 'Maharashtra', rto: 'Mumbai East RTO, Wadala' },
  MH04: { state: 'Maharashtra', rto: 'Thane RTO' },
  MH12: { state: 'Maharashtra', rto: 'Pune Central RTO' },
  MH14: { state: 'Maharashtra', rto: 'Pimpri-Chinchwad RTO' },
  MH20: { state: 'Maharashtra', rto: 'Aurangabad RTO' },
  MH31: { state: 'Maharashtra', rto: 'Nagpur RTO' },
  MH47: { state: 'Maharashtra', rto: 'Borivali RTO, Mumbai' },
  KA01: { state: 'Karnataka', rto: 'Koramangala RTO, Bangalore Central' },
  KA02: { state: 'Karnataka', rto: 'Rajajinagar RTO, Bangalore West' },
  KA03: { state: 'Karnataka', rto: 'Indiranagar RTO, Bangalore East' },
  KA04: { state: 'Karnataka', rto: 'Yeshwantpur RTO, Bangalore North' },
  KA05: { state: 'Karnataka', rto: 'Jayanagar RTO, Bangalore South' },
  KA50: { state: 'Karnataka', rto: 'Yelahanka RTO, Bangalore' },
  KA51: { state: 'Karnataka', rto: 'Electronic City RTO, Bangalore' },
  KA53: { state: 'Karnataka', rto: 'KR Puram RTO, Bangalore' },
  HR26: { state: 'Haryana', rto: 'Gurgaon (North) RTO' },
  HR51: { state: 'Haryana', rto: 'Faridabad RTO' },
  HR70: { state: 'Haryana', rto: 'Chandigarh / Panchkula RTO' },
  HR98: { state: 'Haryana', rto: 'Gurgaon (Badshahpur) RTO' },
  UP16: { state: 'Uttar Pradesh', rto: 'Noida RTO, Gautam Buddha Nagar' },
  UP14: { state: 'Uttar Pradesh', rto: 'Ghaziabad RTO' },
  UP32: { state: 'Uttar Pradesh', rto: 'Lucknow RTO' },
  UP78: { state: 'Uttar Pradesh', rto: 'Kanpur RTO' },
  GJ01: { state: 'Gujarat', rto: 'Ahmedabad (Subhash Bridge) RTO' },
  GJ27: { state: 'Gujarat', rto: 'Ahmedabad (Vastral) RTO' },
  GJ05: { state: 'Gujarat', rto: 'Surat RTO' },
  GJ06: { state: 'Gujarat', rto: 'Vadodara RTO' },
  TN01: { state: 'Tamil Nadu', rto: 'Chennai Central (Ayanavaram) RTO' },
  TN09: { state: 'Tamil Nadu', rto: 'Chennai West (K.K. Nagar) RTO' },
  TN07: { state: 'Tamil Nadu', rto: 'Chennai South (Thiruvanmiyur) RTO' },
  TS07: { state: 'Telangana', rto: 'Ranga Reddy / Gachibowli, Hyderabad' },
  TS09: { state: 'Telangana', rto: 'Khairatabad, Hyderabad Central' },
  WB02: { state: 'West Bengal', rto: 'Kolkata Central RTO' },
  RJ14: { state: 'Rajasthan', rto: 'Jaipur (South) RTO' },
};

const SAMPLE_VEHICLES: Record<string, Partial<VehicleDetails>> = {
  'DL01AB1234': {
    maker: 'Hyundai Motor India',
    model: 'Creta 1.5 SX (O) Diesel',
    vehicleType: 'suv',
    fuelType: 'Diesel',
    color: 'Polar White',
    ownerMaskedName: 'R**** S*****',
  },
  'MH02CD5678': {
    maker: 'Honda Cars India',
    model: 'City 1.5 i-VTEC ZX',
    vehicleType: 'car',
    fuelType: 'Petrol',
    color: 'Crystal Black Pearl',
    ownerMaskedName: 'A**** K****',
  },
  'KA03EF9012': {
    maker: 'Tata Motors',
    model: 'Nexon EV Empowered Plus',
    vehicleType: 'ev',
    fuelType: 'Electric',
    color: 'Daytona Grey',
    ownerMaskedName: 'P**** S*****',
  },
  'HR26XY7777': {
    maker: 'Mahindra & Mahindra',
    model: 'Thar LX Hard Top 4x4',
    vehicleType: 'suv',
    fuelType: 'Diesel',
    color: 'Rocky Beige',
    ownerMaskedName: 'V**** Y****',
  },
  'UP16MN4321': {
    maker: 'Maruti Suzuki India',
    model: 'Swift ZXi Plus AMT',
    vehicleType: 'hatchback',
    fuelType: 'Petrol',
    color: 'Solid Fire Red',
    ownerMaskedName: 'S**** G*****',
  },
  'MH12AB9999': {
    maker: 'Kia Motors India',
    model: 'Seltos GTX Plus 1.5 Turbo',
    vehicleType: 'suv',
    fuelType: 'Petrol',
    color: 'Imperial Blue',
    ownerMaskedName: 'M**** P****',
  }
};

const RANDOM_MAKERS = [
  { maker: 'Hyundai', models: ['Creta SX', 'Venue SX', 'i20 Asta', 'Verna SX'], type: 'suv' as const, fuel: 'Petrol' as const },
  { maker: 'Tata Motors', models: ['Nexon Creative', 'Harrier Fearless', 'Punch Accomplished', 'Safari Dark'], type: 'suv' as const, fuel: 'Diesel' as const },
  { maker: 'Maruti Suzuki', models: ['Swift ZXi', 'Brezza ZXi', 'Baleno Alpha', 'Grand Vitara Zeta'], type: 'car' as const, fuel: 'Petrol' as const },
  { maker: 'Kia Motors', models: ['Seltos HTX', 'Sonet GTX', 'Carens Luxury'], type: 'suv' as const, fuel: 'Diesel' as const },
  { maker: 'Honda', models: ['City VX', 'Elevate ZX', 'Amaze VX'], type: 'car' as const, fuel: 'Petrol' as const },
  { maker: 'Mahindra', models: ['Scorpio-N Z8L', 'XUV700 AX7', 'Thar 4WD'], type: 'suv' as const, fuel: 'Diesel' as const },
  { maker: 'Toyota', models: ['Innova Hycross ZX', 'Fortuner 4x4', 'Urban Cruiser Taisor'], type: 'suv' as const, fuel: 'Hybrid' as const },
];

/**
 * Automatically fetch vehicle details from registration plate number.
 */
export async function fetchVehicleDetails(plateRaw: string): Promise<VehicleDetails> {
  const cleanPlate = plateRaw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Extract state & RTO code prefix (e.g. DL01, MH12)
  const rtoPrefix = cleanPlate.slice(0, 4);
  const rtoInfo = RTO_MAP[rtoPrefix] || {
    state: cleanPlate.slice(0, 2) === 'DL' ? 'Delhi' : (cleanPlate.slice(0, 2) === 'MH' ? 'Maharashtra' : 'India'),
    rto: `${cleanPlate.slice(0, 4)} Regional Transport Office`,
  };

  // Check sample match
  if (SAMPLE_VEHICLES[cleanPlate]) {
    const sample = SAMPLE_VEHICLES[cleanPlate];
    return {
      vehicleNumber: formatIndianPlate(cleanPlate),
      maker: sample.maker || 'Automobile Manufacturer',
      model: sample.model || 'Motor Vehicle',
      vehicleType: sample.vehicleType || 'car',
      fuelType: sample.fuelType || 'Petrol',
      rtoLocation: rtoInfo.rto,
      state: rtoInfo.state,
      registrationDate: '14-Mar-2022',
      insuranceValidUntil: '13-Mar-2027',
      pucValidUntil: '20-Oct-2026',
      color: sample.color || 'White',
      ownerMaskedName: sample.ownerMaskedName || 'V****** O****',
    };
  }

  // Derive pseudo-realistic deterministic vehicle details from plate characters
  let charSum = 0;
  for (let i = 0; i < cleanPlate.length; i++) {
    charSum += cleanPlate.charCodeAt(i);
  }
  const makerObj = RANDOM_MAKERS[charSum % RANDOM_MAKERS.length];
  const modelName = makerObj.models[charSum % makerObj.models.length];

  return {
    vehicleNumber: formatIndianPlate(cleanPlate),
    maker: makerObj.maker,
    model: `${makerObj.maker} ${modelName}`,
    vehicleType: makerObj.type,
    fuelType: makerObj.fuel,
    rtoLocation: rtoInfo.rto,
    state: rtoInfo.state,
    registrationDate: '18-Aug-2023',
    insuranceValidUntil: '17-Aug-2027',
    pucValidUntil: '15-Dec-2026',
    color: (['Pearl White', 'Metallic Grey', 'Silky Silver', 'Phantom Black', 'Fiery Red'])[charSum % 5],
    ownerMaskedName: 'V****** O****',
  };
}

function formatIndianPlate(raw: string): string {
  const match = raw.match(/^([A-Z]{2})([0-9]{1,2})([A-Z]{0,3})([0-9]{1,4})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
  }
  return raw;
}
