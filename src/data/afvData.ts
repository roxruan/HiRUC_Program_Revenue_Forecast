// Parsed from AFV_REPORT CSV files — real HIRUC program data

export type CountyKey = 'hawaii' | 'kauai' | 'maui' | 'oahu';

export interface CountyInfo {
  key: CountyKey;
  name: string;
  shortName: string;
  color: string;
}

export const COUNTIES: CountyInfo[] = [
  { key: 'hawaii', name: "Hawai'i", shortName: "Big Island", color: '#B5563B' },
  { key: 'kauai', name: "Kaua'i", shortName: "Kaua'i", color: '#5B8BAE' },
  { key: 'maui', name: 'Maui', shortName: 'Maui', color: '#C99A3E' },
  { key: 'oahu', name: "O'ahu", shortName: "O'ahu", color: '#2C4A6B' },
];

// ── Annual forecast data (2027–2040) from HIRUC Forecasts CSV ──────────

export interface ForecastRow {
  year: number;
  perMileCount: number;
  perMile: number;
  flatCount: number;
  flat: number | null;
  defaultCount: number;
  default: number | null;
  nonPerMileCount: number | null;
  nonPerMile: number | null;
  hybridPhevCount: number | null;
  hybridPhev: number | null;
  totalHiruc: number;
}

export const FORECAST_YEARS: number[] = Array.from({ length: 14 }, (_, i) => 2027 + i);

export const STATEWIDE_FORECAST: ForecastRow[] = [
  { year: 2027, perMileCount: 15799, perMile: 707149, flatCount: 11992, flat: 599547, defaultCount: 18233, default: 911642, nonPerMileCount: null, nonPerMile: null, hybridPhevCount: 38743, hybridPhev: null, totalHiruc: 2218339 },
  { year: 2028, perMileCount: 17028, perMile: 763233, flatCount: 12903, flat: null, defaultCount: 19678, default: null, nonPerMileCount: 32581, nonPerMile: 2606466, hybridPhevCount: 40269, hybridPhev: null, totalHiruc: 3369699 },
  { year: 2029, perMileCount: 18111, perMile: 812825, flatCount: 13705, flat: null, defaultCount: 20956, default: null, nonPerMileCount: 34661, nonPerMile: 2772916, hybridPhevCount: 41443, hybridPhev: 3315475, totalHiruc: 6901216 },
  { year: 2030, perMileCount: 19056, perMile: 856254, flatCount: 14404, flat: null, defaultCount: 22077, default: null, nonPerMileCount: 36481, nonPerMile: 2918491, hybridPhevCount: 42338, hybridPhev: 3387043, totalHiruc: 7161788 },
  { year: 2031, perMileCount: 19876, perMile: 893971, flatCount: 15009, flat: null, defaultCount: 23051, default: null, nonPerMileCount: 38060, nonPerMile: 3044793, hybridPhevCount: 43015, hybridPhev: 3441172, totalHiruc: 7379936 },
  { year: 2032, perMileCount: 20581, perMile: 926494, flatCount: 15529, flat: null, defaultCount: 23891, default: null, nonPerMileCount: 39420, nonPerMile: 3153616, hybridPhevCount: 43524, hybridPhev: 3481886, totalHiruc: 7561996 },
  { year: 2033, perMileCount: 21184, perMile: 954363, flatCount: 15974, flat: null, defaultCount: 24611, default: null, nonPerMileCount: 40585, nonPerMile: 3246818, hybridPhevCount: 43905, hybridPhev: 3512384, totalHiruc: 7713566 },
  { year: 2034, perMileCount: 21698, perMile: 978120, flatCount: 16352, flat: null, defaultCount: 25225, default: null, nonPerMileCount: 41578, nonPerMile: 3326226, hybridPhevCount: 44190, hybridPhev: 3535161, totalHiruc: 7839508 },
  { year: 2035, perMileCount: 22134, perMile: 998278, flatCount: 16673, flat: null, defaultCount: 25747, default: null, nonPerMileCount: 42420, nonPerMile: 3393583, hybridPhevCount: 44402, hybridPhev: 3552133, totalHiruc: 7943995 },
  { year: 2036, perMileCount: 22502, perMile: 1015317, flatCount: 16944, flat: null, defaultCount: 26187, default: null, nonPerMileCount: 43131, nonPerMile: 3450501, hybridPhevCount: 44559, hybridPhev: 3564759, totalHiruc: 8030577 },
  { year: 2037, perMileCount: 22812, perMile: 1029673, flatCount: 17172, flat: null, defaultCount: 26559, default: null, nonPerMileCount: 43731, nonPerMile: 3498444, hybridPhevCount: 44677, hybridPhev: 3574139, totalHiruc: 8102255 },
  { year: 2038, perMileCount: 23072, perMile: 1041734, flatCount: 17363, flat: null, defaultCount: 26871, default: null, nonPerMileCount: 44234, nonPerMile: 3538716, hybridPhevCount: 44764, hybridPhev: 3581102, totalHiruc: 8161551 },
  { year: 2039, perMileCount: 23290, perMile: 1051843, flatCount: 17524, flat: null, defaultCount: 27132, default: null, nonPerMileCount: 44656, nonPerMile: 3572468, hybridPhevCount: 44828, hybridPhev: 3586266, totalHiruc: 8210577 },
  { year: 2040, perMileCount: 23472, perMile: 1060301, flatCount: 17658, flat: null, defaultCount: 27351, default: null, nonPerMileCount: 45009, nonPerMile: 3600700, hybridPhevCount: 44876, hybridPhev: 3590096, totalHiruc: 8251097 },
];

export const COUNTY_FORECASTS: Record<CountyKey, ForecastRow[]> = {
  hawaii: [
    { year: 2027, perMileCount: 1487, perMile: 58910, flatCount: 1096, flat: 54787, defaultCount: 1331, default: 66527, nonPerMileCount: null, nonPerMile: null, hybridPhevCount: null, hybridPhev: null, totalHiruc: 180223 },
    { year: 2028, perMileCount: 1558, perMile: 61720, flatCount: 1148, flat: null, defaultCount: 1394, default: null, nonPerMileCount: 2542, nonPerMile: 203360, hybridPhevCount: null, hybridPhev: null, totalHiruc: 265079 },
    { year: 2029, perMileCount: 1607, perMile: 63658, flatCount: 1184, flat: null, defaultCount: 1438, default: null, nonPerMileCount: 2622, nonPerMile: 209748, hybridPhevCount: null, hybridPhev: null, totalHiruc: 273406 },
    { year: 2030, perMileCount: 1640, perMile: 64975, flatCount: 1209, flat: null, defaultCount: 1468, default: null, nonPerMileCount: 2676, nonPerMile: 214087, hybridPhevCount: null, hybridPhev: null, totalHiruc: 279062 },
    { year: 2031, perMileCount: 1663, perMile: 65860, flatCount: 1225, flat: null, defaultCount: 1488, default: null, nonPerMileCount: 2713, nonPerMile: 217003, hybridPhevCount: null, hybridPhev: null, totalHiruc: 282863 },
    { year: 2032, perMileCount: 1677, perMile: 66451, flatCount: 1236, flat: null, defaultCount: 1501, default: null, nonPerMileCount: 2737, nonPerMile: 218950, hybridPhevCount: null, hybridPhev: null, totalHiruc: 285401 },
    { year: 2033, perMileCount: 1687, perMile: 66844, flatCount: 1243, flat: null, defaultCount: 1510, default: null, nonPerMileCount: 2753, nonPerMile: 220243, hybridPhevCount: null, hybridPhev: null, totalHiruc: 287087 },
    { year: 2034, perMileCount: 1694, perMile: 67104, flatCount: 1248, flat: null, defaultCount: 1516, default: null, nonPerMileCount: 2764, nonPerMile: 221100, hybridPhevCount: null, hybridPhev: null, totalHiruc: 288203 },
    { year: 2035, perMileCount: 1698, perMile: 67276, flatCount: 1251, flat: null, defaultCount: 1519, default: null, nonPerMileCount: 2771, nonPerMile: 221666, hybridPhevCount: null, hybridPhev: null, totalHiruc: 288942 },
    { year: 2036, perMileCount: 1701, perMile: 67389, flatCount: 1253, flat: null, defaultCount: 1522, default: null, nonPerMileCount: 2776, nonPerMile: 222040, hybridPhevCount: null, hybridPhev: null, totalHiruc: 289429 },
    { year: 2037, perMileCount: 1703, perMile: 67464, flatCount: 1255, flat: null, defaultCount: 1524, default: null, nonPerMileCount: 2779, nonPerMile: 222287, hybridPhevCount: null, hybridPhev: null, totalHiruc: 289751 },
    { year: 2038, perMileCount: 1704, perMile: 67513, flatCount: 1256, flat: null, defaultCount: 1525, default: null, nonPerMileCount: 2781, nonPerMile: 222449, hybridPhevCount: null, hybridPhev: null, totalHiruc: 289963 },
    { year: 2039, perMileCount: 1705, perMile: 67546, flatCount: 1256, flat: null, defaultCount: 1526, default: null, nonPerMileCount: 2782, nonPerMile: 222557, hybridPhevCount: null, hybridPhev: null, totalHiruc: 290102 },
    { year: 2040, perMileCount: 1706, perMile: 67567, flatCount: 1257, flat: null, defaultCount: 1526, default: null, nonPerMileCount: 2783, nonPerMile: 222627, hybridPhevCount: null, hybridPhev: null, totalHiruc: 290194 },
  ],
  kauai: [
    { year: 2027, perMileCount: 533, perMile: 20516, flatCount: 389, flat: 19431, defaultCount: 518, default: 25908, nonPerMileCount: null, nonPerMile: null, hybridPhevCount: null, hybridPhev: null, totalHiruc: 65855 },
    { year: 2028, perMileCount: 574, perMile: 22101, flatCount: 419, flat: null, defaultCount: 558, default: null, nonPerMileCount: 977, nonPerMile: 78148, hybridPhevCount: null, hybridPhev: null, totalHiruc: 100249 },
    { year: 2029, perMileCount: 609, perMile: 23449, flatCount: 444, flat: null, defaultCount: 592, default: null, nonPerMileCount: 1036, nonPerMile: 82915, hybridPhevCount: null, hybridPhev: null, totalHiruc: 106364 },
    { year: 2030, perMileCount: 638, perMile: 24578, flatCount: 466, flat: null, defaultCount: 621, default: null, nonPerMileCount: 1086, nonPerMile: 86908, hybridPhevCount: null, hybridPhev: null, totalHiruc: 111486 },
    { year: 2031, perMileCount: 662, perMile: 25513, flatCount: 483, flat: null, defaultCount: 644, default: null, nonPerMileCount: 1128, nonPerMile: 90211, hybridPhevCount: null, hybridPhev: null, totalHiruc: 115724 },
    { year: 2032, perMileCount: 682, perMile: 26278, flatCount: 498, flat: null, defaultCount: 664, default: null, nonPerMileCount: 1161, nonPerMile: 92918, hybridPhevCount: null, hybridPhev: null, totalHiruc: 119196 },
    { year: 2033, perMileCount: 698, perMile: 26901, flatCount: 510, flat: null, defaultCount: 679, default: null, nonPerMileCount: 1189, nonPerMile: 95119, hybridPhevCount: null, hybridPhev: null, totalHiruc: 122020 },
    { year: 2034, perMileCount: 711, perMile: 27404, flatCount: 519, flat: null, defaultCount: 692, default: null, nonPerMileCount: 1211, nonPerMile: 96898, hybridPhevCount: null, hybridPhev: null, totalHiruc: 124302 },
    { year: 2035, perMileCount: 722, perMile: 27808, flatCount: 527, flat: null, defaultCount: 702, default: null, nonPerMileCount: 1229, nonPerMile: 98329, hybridPhevCount: null, hybridPhev: null, totalHiruc: 126137 },
    { year: 2036, perMileCount: 730, perMile: 28132, flatCount: 533, flat: null, defaultCount: 711, default: null, nonPerMileCount: 1243, nonPerMile: 99474, hybridPhevCount: null, hybridPhev: null, totalHiruc: 127607 },
    { year: 2037, perMileCount: 737, perMile: 28391, flatCount: 538, flat: null, defaultCount: 717, default: null, nonPerMileCount: 1255, nonPerMile: 100390, hybridPhevCount: null, hybridPhev: null, totalHiruc: 128781 },
    { year: 2038, perMileCount: 742, perMile: 28597, flatCount: 542, flat: null, defaultCount: 722, default: null, nonPerMileCount: 1264, nonPerMile: 101119, hybridPhevCount: null, hybridPhev: null, totalHiruc: 129716 },
    { year: 2039, perMileCount: 747, perMile: 28761, flatCount: 545, flat: null, defaultCount: 726, default: null, nonPerMileCount: 1271, nonPerMile: 101698, hybridPhevCount: null, hybridPhev: null, totalHiruc: 130460 },
    { year: 2040, perMileCount: 750, perMile: 28891, flatCount: 547, flat: null, defaultCount: 730, default: null, nonPerMileCount: 1277, nonPerMile: 102159, hybridPhevCount: null, hybridPhev: null, totalHiruc: 131050 },
  ],
  maui: [
    { year: 2027, perMileCount: 1598, perMile: 60359, flatCount: 1550, flat: 77499, defaultCount: 1695, default: 84764, nonPerMileCount: null, nonPerMile: null, hybridPhevCount: null, hybridPhev: null, totalHiruc: 222622 },
    { year: 2028, perMileCount: 1636, perMile: 61770, flatCount: 1586, flat: null, defaultCount: 1735, default: null, nonPerMileCount: 3321, nonPerMile: 265690, hybridPhevCount: null, hybridPhev: null, totalHiruc: 327460 },
    { year: 2029, perMileCount: 1661, perMile: 62712, flatCount: 1610, flat: null, defaultCount: 1761, default: null, nonPerMileCount: 3372, nonPerMile: 269739, hybridPhevCount: null, hybridPhev: null, totalHiruc: 332451 },
    { year: 2030, perMileCount: 1677, perMile: 63335, flatCount: 1626, flat: null, defaultCount: 1779, default: null, nonPerMileCount: 3405, nonPerMile: 272419, hybridPhevCount: null, hybridPhev: null, totalHiruc: 335754 },
    { year: 2031, perMileCount: 1688, perMile: 63745, flatCount: 1637, flat: null, defaultCount: 1790, default: null, nonPerMileCount: 3427, nonPerMile: 274184, hybridPhevCount: null, hybridPhev: null, totalHiruc: 337929 },
    { year: 2032, perMileCount: 1695, perMile: 64014, flatCount: 1644, flat: null, defaultCount: 1798, default: null, nonPerMileCount: 3442, nonPerMile: 275342, hybridPhevCount: null, hybridPhev: null, totalHiruc: 339356 },
    { year: 2033, perMileCount: 1700, perMile: 64191, flatCount: 1648, flat: null, defaultCount: 1803, default: null, nonPerMileCount: 3451, nonPerMile: 276100, hybridPhevCount: null, hybridPhev: null, totalHiruc: 340290 },
    { year: 2034, perMileCount: 1703, perMile: 64306, flatCount: 1651, flat: null, defaultCount: 1806, default: null, nonPerMileCount: 3457, nonPerMile: 276595, hybridPhevCount: null, hybridPhev: null, totalHiruc: 340901 },
    { year: 2035, perMileCount: 1705, perMile: 64381, flatCount: 1653, flat: null, defaultCount: 1808, default: null, nonPerMileCount: 3461, nonPerMile: 276919, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341300 },
    { year: 2036, perMileCount: 1706, perMile: 64430, flatCount: 1655, flat: null, defaultCount: 1810, default: null, nonPerMileCount: 3464, nonPerMile: 277130, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341560 },
    { year: 2037, perMileCount: 1707, perMile: 64462, flatCount: 1655, flat: null, defaultCount: 1811, default: null, nonPerMileCount: 3466, nonPerMile: 277268, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341730 },
    { year: 2038, perMileCount: 1708, perMile: 64483, flatCount: 1656, flat: null, defaultCount: 1811, default: null, nonPerMileCount: 3467, nonPerMile: 277358, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341841 },
    { year: 2039, perMileCount: 1708, perMile: 64497, flatCount: 1656, flat: null, defaultCount: 1811, default: null, nonPerMileCount: 3468, nonPerMile: 277417, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341913 },
    { year: 2040, perMileCount: 1708, perMile: 64506, flatCount: 1656, flat: null, defaultCount: 1812, default: null, nonPerMileCount: 3468, nonPerMile: 277455, hybridPhevCount: null, hybridPhev: null, totalHiruc: 341961 },
  ],
  oahu: [
    { year: 2027, perMileCount: 12181, perMile: 567365, flatCount: 8957, flat: 447831, defaultCount: 14689, default: 734443, nonPerMileCount: null, nonPerMile: null, hybridPhevCount: null, hybridPhev: null, totalHiruc: 1749640 },
    { year: 2028, perMileCount: 13260, perMile: 617642, flatCount: 9750, flat: null, defaultCount: 15991, default: null, nonPerMileCount: 25741, nonPerMile: 2059268, hybridPhevCount: null, hybridPhev: null, totalHiruc: 2676911 },
    { year: 2029, perMileCount: 14234, perMile: 663006, flatCount: 10466, flat: null, defaultCount: 17165, default: null, nonPerMileCount: 27631, nonPerMile: 2210515, hybridPhevCount: null, hybridPhev: null, totalHiruc: 2873521 },
    { year: 2030, perMileCount: 15101, perMile: 703366, flatCount: 11104, flat: null, defaultCount: 18210, default: null, nonPerMileCount: 29313, nonPerMile: 2345077, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3048443 },
    { year: 2031, perMileCount: 15863, perMile: 738853, flatCount: 11664, flat: null, defaultCount: 19129, default: null, nonPerMileCount: 30792, nonPerMile: 2463395, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3202248 },
    { year: 2032, perMileCount: 16526, perMile: 769750, flatCount: 12152, flat: null, defaultCount: 19929, default: null, nonPerMileCount: 32080, nonPerMile: 2566407, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3336157 },
    { year: 2033, perMileCount: 17099, perMile: 796428, flatCount: 12573, flat: null, defaultCount: 20619, default: null, nonPerMileCount: 33192, nonPerMile: 2655355, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3451784 },
    { year: 2034, perMileCount: 17590, perMile: 819307, flatCount: 12934, flat: null, defaultCount: 21212, default: null, nonPerMileCount: 34145, nonPerMile: 2731633, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3550940 },
    { year: 2035, perMileCount: 18009, perMile: 838813, flatCount: 13242, flat: null, defaultCount: 21717, default: null, nonPerMileCount: 34958, nonPerMile: 2796670, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3635483 },
    { year: 2036, perMileCount: 18364, perMile: 855366, flatCount: 13503, flat: null, defaultCount: 22145, default: null, nonPerMileCount: 35648, nonPerMile: 2851856, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3707222 },
    { year: 2037, perMileCount: 18665, perMile: 869355, flatCount: 13724, flat: null, defaultCount: 22507, default: null, nonPerMileCount: 36231, nonPerMile: 2898499, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3767854 },
    { year: 2038, perMileCount: 18918, perMile: 881140, flatCount: 13910, flat: null, defaultCount: 22812, default: null, nonPerMileCount: 36722, nonPerMile: 2937790, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3818930 },
    { year: 2039, perMileCount: 19130, perMile: 891040, flatCount: 14066, flat: null, defaultCount: 23069, default: null, nonPerMileCount: 37135, nonPerMile: 2970796, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3861836 },
    { year: 2040, perMileCount: 19308, perMile: 899337, flatCount: 14197, flat: null, defaultCount: 23283, default: null, nonPerMileCount: 37481, nonPerMile: 2998460, hybridPhevCount: null, hybridPhev: null, totalHiruc: 3897797 },
  ],
};

// ── Monthly actual data (Jul 2025 – Jun 2026) from Original Data CSV ───

export interface MonthlyRow {
  month: string;
  label: string;
  county: CountyKey | 'total';
  hirucFees: number;
  perMileCount: number;
  perMile: number;
  flatCount: number;
  flat: number;
  defaultCount: number;
  default: number;
  afvFees: number;
  afvCount: number;
  combined: number;
}

export const MONTHLY_DATA: MonthlyRow[] = [
  { month: '2025-07', label: 'Jul 2025', county: 'hawaii', hirucFees: 1670.42, perMileCount: 9, perMile: 420.42, flatCount: 1, flat: 50, defaultCount: 24, default: 1200, afvFees: 3050, afvCount: 61, combined: 4720.42 },
  { month: '2025-07', label: 'Jul 2025', county: 'kauai', hirucFees: 474.03, perMileCount: 2, perMile: 74.03, flatCount: 0, flat: 0, defaultCount: 8, default: 400, afvFees: 1350, afvCount: 27, combined: 1824.03 },
  { month: '2025-07', label: 'Jul 2025', county: 'maui', hirucFees: 3262.13, perMileCount: 7, perMile: 262.13, flatCount: 3, flat: 150, defaultCount: 57, default: 2850, afvFees: 4150, afvCount: 83, combined: 7412.13 },
  { month: '2025-07', label: 'Jul 2025', county: 'oahu', hirucFees: 8227.61, perMileCount: 60, perMile: 2377.61, flatCount: 28, flat: 1400, defaultCount: 89, default: 4450, afvFees: 24700, afvCount: 490, combined: 32927.61 },
  { month: '2025-07', label: 'Jul 2025', county: 'total', hirucFees: 13634.19, perMileCount: 78, perMile: 3134.19, flatCount: 32, flat: 1600, defaultCount: 178, default: 8900, afvFees: 33250, afvCount: 661, combined: 46884.19 },
  { month: '2025-08', label: 'Aug 2025', county: 'hawaii', hirucFees: 8736.15, perMileCount: 65, perMile: 2586.15, flatCount: 59, flat: 2950, defaultCount: 64, default: 3200, afvFees: 2800, afvCount: 56, combined: 11536.15 },
  { month: '2025-08', label: 'Aug 2025', county: 'kauai', hirucFees: 3001.36, perMileCount: 25, perMile: 1151.36, flatCount: 16, flat: 800, defaultCount: 21, default: 1050, afvFees: 500, afvCount: 10, combined: 3501.36 },
  { month: '2025-08', label: 'Aug 2025', county: 'maui', hirucFees: 11321.06, perMileCount: 117, perMile: 4521.06, flatCount: 47, flat: 2350, defaultCount: 89, default: 4450, afvFees: 2000, afvCount: 40, combined: 13321.06 },
  { month: '2025-08', label: 'Aug 2025', county: 'oahu', hirucFees: 83176.37, perMileCount: 520, perMile: 21426.37, flatCount: 403, flat: 20150, defaultCount: 832, default: 41600, afvFees: 17550, afvCount: 347, combined: 100726.37 },
  { month: '2025-08', label: 'Aug 2025', county: 'total', hirucFees: 106234.94, perMileCount: 727, perMile: 29684.94, flatCount: 525, flat: 26250, defaultCount: 1006, default: 50300, afvFees: 22850, afvCount: 453, combined: 129084.94 },
  { month: '2025-09', label: 'Sep 2025', county: 'hawaii', hirucFees: 6661.94, perMileCount: 59, perMile: 2311.94, flatCount: 37, flat: 1850, defaultCount: 50, default: 2500, afvFees: 2150, afvCount: 43, combined: 8811.94 },
  { month: '2025-09', label: 'Sep 2025', county: 'kauai', hirucFees: 2457.74, perMileCount: 27, perMile: 1007.74, flatCount: 9, flat: 450, defaultCount: 20, default: 1000, afvFees: 650, afvCount: 13, combined: 3107.74 },
  { month: '2025-09', label: 'Sep 2025', county: 'maui', hirucFees: 9671.86, perMileCount: 81, perMile: 3071.86, flatCount: 57, flat: 2850, defaultCount: 75, default: 3750, afvFees: 2100, afvCount: 42, combined: 11771.86 },
  { month: '2025-09', label: 'Sep 2025', county: 'oahu', hirucFees: 69920.09, perMileCount: 398, perMile: 16370.09, flatCount: 341, flat: 17050, defaultCount: 730, default: 36500, afvFees: 15500, afvCount: 308, combined: 85420.09 },
  { month: '2025-09', label: 'Sep 2025', county: 'total', hirucFees: 88711.63, perMileCount: 565, perMile: 22761.63, flatCount: 444, flat: 22200, defaultCount: 875, default: 43750, afvFees: 20400, afvCount: 406, combined: 109111.63 },
  { month: '2025-10', label: 'Oct 2025', county: 'hawaii', hirucFees: 8537.16, perMileCount: 88, perMile: 3537.16, flatCount: 38, flat: 1900, defaultCount: 62, default: 3100, afvFees: 2350, afvCount: 47, combined: 10887.16 },
  { month: '2025-10', label: 'Oct 2025', county: 'kauai', hirucFees: 3087.21, perMileCount: 25, perMile: 887.21, flatCount: 17, flat: 850, defaultCount: 27, default: 1350, afvFees: 500, afvCount: 10, combined: 3587.21 },
  { month: '2025-10', label: 'Oct 2025', county: 'maui', hirucFees: 11772.74, perMileCount: 118, perMile: 4572.74, flatCount: 63, flat: 3150, defaultCount: 81, default: 4050, afvFees: 2350, afvCount: 46, combined: 14122.74 },
  { month: '2025-10', label: 'Oct 2025', county: 'oahu', hirucFees: 92651.42, perMileCount: 633, perMile: 31051.42, flatCount: 477, flat: 23850, defaultCount: 755, default: 37750, afvFees: 16350, afvCount: 319, combined: 109001.42 },
  { month: '2025-10', label: 'Oct 2025', county: 'total', hirucFees: 116048.53, perMileCount: 864, perMile: 40048.53, flatCount: 595, flat: 29750, defaultCount: 925, default: 46250, afvFees: 21550, afvCount: 422, combined: 137598.53 },
  { month: '2025-11', label: 'Nov 2025', county: 'hawaii', hirucFees: 9357.54, perMileCount: 98, perMile: 3757.54, flatCount: 46, flat: 2300, defaultCount: 66, default: 3300, afvFees: 1650, afvCount: 33, combined: 11007.54 },
  { month: '2025-11', label: 'Nov 2025', county: 'kauai', hirucFees: 3868.51, perMileCount: 32, perMile: 1268.51, flatCount: 18, flat: 900, defaultCount: 34, default: 1700, afvFees: 250, afvCount: 5, combined: 4118.51 },
  { month: '2025-11', label: 'Nov 2025', county: 'maui', hirucFees: 12259.01, perMileCount: 112, perMile: 4309.01, flatCount: 68, flat: 3400, defaultCount: 91, default: 4550, afvFees: 2000, afvCount: 40, combined: 14259.01 },
  { month: '2025-11', label: 'Nov 2025', county: 'oahu', hirucFees: 92214.56, perMileCount: 648, perMile: 31564.56, flatCount: 486, flat: 24300, defaultCount: 727, default: 36350, afvFees: 13300, afvCount: 258, combined: 105514.56 },
  { month: '2025-11', label: 'Nov 2025', county: 'total', hirucFees: 117699.62, perMileCount: 890, perMile: 40899.62, flatCount: 618, flat: 30900, defaultCount: 918, default: 45900, afvFees: 17200, afvCount: 336, combined: 134899.62 },
  { month: '2025-12', label: 'Dec 2025', county: 'hawaii', hirucFees: 8019.37, perMileCount: 72, perMile: 2869.37, flatCount: 47, flat: 2350, defaultCount: 56, default: 2800, afvFees: 2450, afvCount: 49, combined: 10469.37 },
  { month: '2025-12', label: 'Dec 2025', county: 'kauai', hirucFees: 3576.11, perMileCount: 34, perMile: 1326.11, flatCount: 14, flat: 700, defaultCount: 31, default: 1550, afvFees: 450, afvCount: 9, combined: 4026.11 },
  { month: '2025-12', label: 'Dec 2025', county: 'maui', hirucFees: 14208.12, perMileCount: 98, perMile: 4008.12, flatCount: 106, flat: 5300, defaultCount: 98, default: 4900, afvFees: 1900, afvCount: 36, combined: 16108.12 },
  { month: '2025-12', label: 'Dec 2025', county: 'oahu', hirucFees: 74678.13, perMileCount: 492, perMile: 23228.13, flatCount: 392, flat: 19600, defaultCount: 637, default: 31850, afvFees: 14350, afvCount: 278, combined: 89028.13 },
  { month: '2025-12', label: 'Dec 2025', county: 'total', hirucFees: 100481.73, perMileCount: 696, perMile: 31431.73, flatCount: 559, flat: 27950, defaultCount: 822, default: 41100, afvFees: 19150, afvCount: 372, combined: 119631.73 },
  { month: '2026-01', label: 'Jan 2026', county: 'hawaii', hirucFees: 8780.45, perMileCount: 74, perMile: 2880.45, flatCount: 51, flat: 2550, defaultCount: 67, default: 3350, afvFees: 1850, afvCount: 37, combined: 10630.45 },
  { month: '2026-01', label: 'Jan 2026', county: 'kauai', hirucFees: 3784.11, perMileCount: 35, perMile: 1384.11, flatCount: 23, flat: 1150, defaultCount: 25, default: 1250, afvFees: 450, afvCount: 9, combined: 4234.11 },
  { month: '2026-01', label: 'Jan 2026', county: 'maui', hirucFees: 13642.37, perMileCount: 102, perMile: 3592.37, flatCount: 119, flat: 5950, defaultCount: 82, default: 4100, afvFees: 1550, afvCount: 30, combined: 15192.37 },
  { month: '2026-01', label: 'Jan 2026', county: 'oahu', hirucFees: 82985.12, perMileCount: 579, perMile: 27685.12, flatCount: 462, flat: 23100, defaultCount: 644, default: 32200, afvFees: 17050, afvCount: 335, combined: 100035.12 },
  { month: '2026-01', label: 'Jan 2026', county: 'total', hirucFees: 109192.05, perMileCount: 790, perMile: 35542.05, flatCount: 655, flat: 32750, defaultCount: 818, default: 40900, afvFees: 20900, afvCount: 411, combined: 130092.05 },
  { month: '2026-02', label: 'Feb 2026', county: 'hawaii', hirucFees: 8165.22, perMileCount: 83, perMile: 3065.22, flatCount: 51, flat: 2550, defaultCount: 49, default: 2550, afvFees: 1900, afvCount: 38, combined: 10065.22 },
  { month: '2026-02', label: 'Feb 2026', county: 'kauai', hirucFees: 3371.15, perMileCount: 38, perMile: 1371.15, flatCount: 20, flat: 1000, defaultCount: 19, default: 1000, afvFees: 250, afvCount: 5, combined: 3621.15 },
  { month: '2026-02', label: 'Feb 2026', county: 'maui', hirucFees: 11696.87, perMileCount: 101, perMile: 4796.87, flatCount: 69, flat: 3450, defaultCount: 91, default: 3450, afvFees: 1750, afvCount: 35, combined: 13446.87 },
  { month: '2026-02', label: 'Feb 2026', county: 'oahu', hirucFees: 90811.87, perMileCount: 608, perMile: 43211.87, flatCount: 476, flat: 23800, defaultCount: 732, default: 23800, afvFees: 17400, afvCount: 341, combined: 108211.87 },
  { month: '2026-02', label: 'Feb 2026', county: 'total', hirucFees: 114045.11, perMileCount: 830, perMile: 52445.11, flatCount: 616, flat: 30800, defaultCount: 891, default: 30800, afvFees: 21300, afvCount: 419, combined: 135345.11 },
  { month: '2026-03', label: 'Mar 2026', county: 'hawaii', hirucFees: 8524.50, perMileCount: 80, perMile: 2424.50, flatCount: 61, flat: 3050, defaultCount: 42, default: 3050, afvFees: 2550, afvCount: 51, combined: 11074.50 },
  { month: '2026-03', label: 'Mar 2026', county: 'kauai', hirucFees: 3448.80, perMileCount: 27, perMile: 1248.80, flatCount: 22, flat: 1100, defaultCount: 27, default: 1100, afvFees: 600, afvCount: 12, combined: 4048.80 },
  { month: '2026-03', label: 'Mar 2026', county: 'maui', hirucFees: 11372.53, perMileCount: 105, perMile: 3672.53, flatCount: 77, flat: 3850, defaultCount: 69, default: 3850, afvFees: 2500, afvCount: 49, combined: 13872.53 },
  { month: '2026-03', label: 'Mar 2026', county: 'oahu', hirucFees: 76236.29, perMileCount: 698, perMile: 40136.29, flatCount: 361, flat: 18050, defaultCount: 519, default: 18050, afvFees: 17500, afvCount: 342, combined: 93736.29 },
  { month: '2026-03', label: 'Mar 2026', county: 'total', hirucFees: 99582.12, perMileCount: 910, perMile: 47482.12, flatCount: 521, flat: 26050, defaultCount: 657, default: 26050, afvFees: 23150, afvCount: 454, combined: 122732.12 },
  { month: '2026-04', label: 'Apr 2026', county: 'hawaii', hirucFees: 8749.58, perMileCount: 105, perMile: 4349.58, flatCount: 44, flat: 2200, defaultCount: 49, default: 2200, afvFees: 2200, afvCount: 44, combined: 10949.58 },
  { month: '2026-04', label: 'Apr 2026', county: 'kauai', hirucFees: 3430.19, perMileCount: 39, perMile: 1230.19, flatCount: 22, flat: 1100, defaultCount: 16, default: 1100, afvFees: 650, afvCount: 13, combined: 4080.19 },
  { month: '2026-04', label: 'Apr 2026', county: 'maui', hirucFees: 11338.24, perMileCount: 111, perMile: 2938.24, flatCount: 84, flat: 4200, defaultCount: 63, default: 4200, afvFees: 1750, afvCount: 35, combined: 13088.24 },
  { month: '2026-04', label: 'Apr 2026', county: 'oahu', hirucFees: 81909.64, perMileCount: 702, perMile: 40509.64, flatCount: 414, flat: 20700, defaultCount: 585, default: 20700, afvFees: 15500, afvCount: 305, combined: 97409.64 },
  { month: '2026-04', label: 'Apr 2026', county: 'total', hirucFees: 105427.65, perMileCount: 957, perMile: 49027.65, flatCount: 564, flat: 28200, defaultCount: 713, default: 28200, afvFees: 20100, afvCount: 397, combined: 125527.65 },
  { month: '2026-05', label: 'May 2026', county: 'hawaii', hirucFees: 7385.55, perMileCount: 77, perMile: 3085.55, flatCount: 43, flat: 2150, defaultCount: 43, default: 2150, afvFees: 2800, afvCount: 56, combined: 10185.55 },
  { month: '2026-05', label: 'May 2026', county: 'kauai', hirucFees: 3505.27, perMileCount: 38, perMile: 1205.27, flatCount: 23, flat: 1150, defaultCount: 20, default: 1150, afvFees: 700, afvCount: 14, combined: 4205.27 },
  { month: '2026-05', label: 'May 2026', county: 'maui', hirucFees: 11123.85, perMileCount: 121, perMile: 4023.85, flatCount: 71, flat: 3550, defaultCount: 63, default: 3550, afvFees: 1400, afvCount: 28, combined: 12523.85 },
  { month: '2026-05', label: 'May 2026', county: 'oahu', hirucFees: 88618.51, perMileCount: 819, perMile: 52418.51, flatCount: 362, flat: 18100, defaultCount: 641, default: 18100, afvFees: 14850, afvCount: 292, combined: 103468.51 },
  { month: '2026-05', label: 'May 2026', county: 'total', hirucFees: 110633.18, perMileCount: 1055, perMile: 60733.18, flatCount: 499, flat: 24950, defaultCount: 767, default: 24950, afvFees: 19750, afvCount: 390, combined: 130383.18 },
  { month: '2026-06', label: 'Jun 2026', county: 'hawaii', hirucFees: 9070.31, perMileCount: 100, perMile: 3870.31, flatCount: 42, flat: 2100, defaultCount: 50, default: 3100, afvFees: 1800, afvCount: 40, combined: 10870.31 },
  { month: '2026-06', label: 'Jun 2026', county: 'kauai', hirucFees: 3564.16, perMileCount: 39, perMile: 1114.16, flatCount: 22, flat: 1100, defaultCount: 24, default: 1350, afvFees: 750, afvCount: 15, combined: 4314.16 },
  { month: '2026-06', label: 'Jun 2026', county: 'maui', hirucFees: 14175.98, perMileCount: 125, perMile: 4675.98, flatCount: 68, flat: 5100, defaultCount: 73, default: 4400, afvFees: 1800, afvCount: 36, combined: 15975.98 },
  { month: '2026-06', label: 'Jun 2026', county: 'oahu', hirucFees: 87394.17, perMileCount: 825, perMile: 31844.17, flatCount: 408, flat: 18100, defaultCount: 722, default: 37450, afvFees: 15250, afvCount: 295, combined: 102644.17 },
  { month: '2026-06', label: 'Jun 2026', county: 'total', hirucFees: 114204.62, perMileCount: 1089, perMile: 41504.62, flatCount: 540, flat: 26400, defaultCount: 869, default: 46050, afvFees: 19600, afvCount: 386, combined: 133804.62 },
];

// ── Annual summary data from Bar Charts CSV ────────────────────────────

export interface AnnualSummary {
  period: string;
  perMile: number;
  flat: number;
  defaultFee: number;
  afv: number;
  hiruc: number;
  combined: number;
}

export const ANNUAL_BY_COUNTY: Record<CountyKey, { y2025: AnnualSummary; y2026: AnnualSummary; combined: AnnualSummary }> = {
  hawaii: {
    y2025: { period: '2025', perMile: 15482.58, flat: 11400, defaultFee: 16100, afv: 14450, hiruc: 42982.58, combined: 57432.58 },
    y2026: { period: '2026 (Jan–Jun)', perMile: 20475.61, flat: 14600, defaultFee: 15600, afv: 13100, hiruc: 50675.61, combined: 63775.61 },
    combined: { period: '2025–2026', perMile: 35958.19, flat: 26000, defaultFee: 31700, afv: 27550, hiruc: 93658.19, combined: 121208.19 },
  },
  kauai: {
    y2025: { period: '2025', perMile: 5714.96, flat: 3700, defaultFee: 7050, afv: 3700, hiruc: 16464.96, combined: 20165 },
    y2026: { period: '2026 (Jan–Jun)', perMile: 7803.68, flat: 6600, defaultFee: 6700, afv: 3400, hiruc: 21103.68, combined: 24503.68 },
    combined: { period: '2025–2026', perMile: 13518.64, flat: 10300, defaultFee: 13750, afv: 7100, hiruc: 37568.64, combined: 44669 },
  },
  maui: {
    y2025: { period: '2025', perMile: 20744.92, flat: 17200, defaultFee: 24550, afv: 14500, hiruc: 62494.92, combined: 76994.92 },
    y2026: { period: '2026 (Jan–Jun)', perMile: 24449.84, flat: 26100, defaultFee: 22800, afv: 10750, hiruc: 73349.84, combined: 84099.84 },
    combined: { period: '2025–2026', perMile: 45194.76, flat: 43300, defaultFee: 47350, afv: 25250, hiruc: 135844.76, combined: 161094.76 },
  },
  oahu: {
    y2025: { period: '2025', perMile: 126018.18, flat: 106350, defaultFee: 188500, afv: 101750, hiruc: 420868.18, combined: 522618.18 },
    y2026: { period: '2026 (Jan–Jun)', perMile: 192605.6, flat: 121850, defaultFee: 193500, afv: 97550, hiruc: 507955.6, combined: 605505.6 },
    combined: { period: '2025–2026', perMile: 318623.78, flat: 228200, defaultFee: 382000, afv: 199300, hiruc: 928823.78, combined: 1128123.78 },
  },
};

export const ANNUAL_TOTALS: { y2025: AnnualSummary; y2026: AnnualSummary; combined: AnnualSummary } = {
  y2025: { period: '2025', perMile: 167960.64, flat: 138650, defaultFee: 236200, afv: 134400, hiruc: 542810.64, combined: 677210.64 },
  y2026: { period: '2026 (Jan–Jun)', perMile: 245334.73, flat: 169150, defaultFee: 238600, afv: 124800, hiruc: 653084.73, combined: 777884.73 },
  combined: { period: '2025–2026', perMile: 413295.37, flat: 307800, defaultFee: 474800, afv: 259200, hiruc: 1195895.37, combined: 1455095.37 },
};

// ── Big Island fee-type distribution from Pie Charts CSV ────────────────

export interface BigIslandPie {
  period: string;
  total: number;
  perMile: number;
  flat: number;
  defaultFee: number;
}

export const BIG_ISLAND_PIE: BigIslandPie[] = [
  { period: '2025', total: 15482.58, perMile: 11400, flat: 16100, defaultFee: 0 },
  { period: '2026', total: 20475.61, perMile: 14600, flat: 15600, defaultFee: 0 },
  { period: 'Total', total: 35958.19, perMile: 26000, flat: 31700, defaultFee: 0 },
];

// ── Derived helpers ────────────────────────────────────────────────────

export const MONTHLY_LABELS: string[] = [...new Set(MONTHLY_DATA.map((r) => r.label))];

export function monthlyByCounty(county: CountyKey): { label: string; hiruc: number; afv: number; combined: number }[] {
  return MONTHLY_DATA
    .filter((r) => r.county === county)
    .map((r) => ({ label: r.label, hiruc: r.hirucFees, afv: r.afvFees, combined: r.combined }));
}

export function monthlyTotals(): { label: string; hiruc: number; afv: number; combined: number }[] {
  return MONTHLY_DATA
    .filter((r) => r.county === 'total')
    .map((r) => ({ label: r.label, hiruc: r.hirucFees, afv: r.afvFees, combined: r.combined }));
}

// Convert forecast dollars to $M
export function forecastToMillions(rows: ForecastRow[]): number[] {
  return rows.map((r) => +(r.totalHiruc / 1_000_000).toFixed(2));
}

export function countyForecastMillions(key: CountyKey): number[] {
  return forecastToMillions(COUNTY_FORECASTS[key]);
}

export function statewideForecastMillions(): number[] {
  return forecastToMillions(STATEWIDE_FORECAST);
}

// County share of statewide total (based on 2027 forecast)
export function countyShare(key: CountyKey): number {
  const total = STATEWIDE_FORECAST[0].totalHiruc;
  return COUNTY_FORECASTS[key][0].totalHiruc / total;
}

// FY labels for forecast (FY27 through FY40)
export const FY_LABELS: string[] = FORECAST_YEARS.map((y) => `FY${String(y).slice(2)}`);

// FY26 actual (from monthly data, Jul 2025–Jun 2026 total)
export const FY26_ACTUAL = MONTHLY_DATA
  .filter((r) => r.county === 'total')
  .reduce((sum, r) => sum + r.hirucFees, 0);

export const FY26_ACTUAL_BY_COUNTY: Record<CountyKey, number> = {
  hawaii: MONTHLY_DATA.filter((r) => r.county === 'hawaii').reduce((s, r) => s + r.hirucFees, 0),
  kauai: MONTHLY_DATA.filter((r) => r.county === 'kauai').reduce((s, r) => s + r.hirucFees, 0),
  maui: MONTHLY_DATA.filter((r) => r.county === 'maui').reduce((s, r) => s + r.hirucFees, 0),
  oahu: MONTHLY_DATA.filter((r) => r.county === 'oahu').reduce((s, r) => s + r.hirucFees, 0),
};

export const FY26_AFV = MONTHLY_DATA
  .filter((r) => r.county === 'total')
  .reduce((sum, r) => sum + r.afvFees, 0);

export const FY26_COMBINED = MONTHLY_DATA
  .filter((r) => r.county === 'total')
  .reduce((sum, r) => sum + r.combined, 0);
