import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from "./tsconfig.paths.json";

export default {
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  preset: 'ts-jest',
};
