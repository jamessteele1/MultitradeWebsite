export const SCOPE_DISCLAIMER =
  "This is a preliminary recommendation only. Final scope is subject to MBH review, site conditions, availability, and project requirements.";

export const MBH_RULES = {
  officeCapacity: {
    small: "3x3m Office = around 1 desk/person for planning.",
    medium: "6x3m Office = around 2-3 desks/people for planning.",
    large: "12x3m Office = around 5-6 desks/people for planning.",
  },
  cribCapacity: {
    small: "3x3m Crib Room = up to ~4 people.",
    medium: "6x3m Crib Room = up to ~12 people.",
    large: "12x3m Crib Room = up to ~24 people.",
    selfContained: "6.6x3m and 7.2x3m self-contained cribs are practical for around 12 people.",
  },
  thresholds: {
    officeDesksSingleModuleMax: 6,
    cribSeatsSingleModuleMax: 24,
  },
  complexNote:
    "Complexes are combinations of 12x3 modules (commonly 12x6, 12x9, 12x12+) and are more installation-heavy than single-floor modules, including additional demobilisation complexity.",
  electrical: {
    standard15Amp: "Buildings 6x3m or less generally come with a 15amp plug input.",
    largerBuilding: "Buildings over 6x3m may terminate to an external junction box or be upgraded to a 32amp plug input.",
    plugUpgrade: "A 32amp plug input upgrade is available for larger buildings where relevant, particularly when generator power is intended.",
    generatorPolicy: "MBH does not hire generators and does not provide generator leads.",
  },
  logistics: {
    craneMinimum: "A 25T Franna is the smallest crane typically used for lifting buildings.",
    craneByClient: "Crane is by client for setups requiring crane lifts.",
    wastePumpOut: "MBH does not pump out waste tanks; waste pump-out is by client.",
  },
};
