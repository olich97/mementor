/**
 * Inversify needs to use the type as identifiers at runtime.
 * In very large applications using strings as the identifiers of the types to be injected by the Inversify can lead to naming collisions.
 * Inversify supports and recommends the usage of Symbols instead of string literals
 * A symbol is a unique and immutable data type and may be used as an identifier for object properties.
 * The symbol object is an implicit object wrapper for the symbol primitive data type.
 * */

interface DI_TYPES {
  MemeRepository: symbol;
  MemeService: symbol;
  StorageService: symbol;
  DatabaseService: symbol;
  ConnectionOptions: symbol;
}

const DI_TYPES: DI_TYPES = {
  MemeRepository: Symbol('MemeRepository'),
  MemeService: Symbol('MemeService'),
  DatabaseService: Symbol('DatabaseService'),
  StorageService: Symbol('StorageService'),
  ConnectionOptions: Symbol('ConnectionOptions'),
};

export default DI_TYPES;
