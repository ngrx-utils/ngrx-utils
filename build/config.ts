export interface PackageDescription {
  name: string;
  hasTestingModule: boolean;
  bundle: boolean;
}

export interface Config {
  packages: PackageDescription[];
  scope: string;
}

export const packages: PackageDescription[] = [
  {
    name: 'store',
    hasTestingModule: false,
    bundle: true
  },
  {
    name: 'effects',
    hasTestingModule: false,
    bundle: true
  },
  {
    name: 'cli',
    hasTestingModule: false,
    bundle: true
  }
];
