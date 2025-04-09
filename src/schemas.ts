import { z } from "zod";

// Base schemas for common fields
export const BaseSchema = z.object({
  created: z.string().datetime(),
  edited: z.string().datetime(),
  url: z.string().url(),
});

// People (Characters) Schema
export const PeopleSchema = BaseSchema.extend({
  name: z.string(),
  height: z.string(),
  mass: z.string(),
  hair_color: z.string(),
  skin_color: z.string(),
  eye_color: z.string(),
  birth_year: z.string(),
  gender: z.string(),
  homeworld: z.string().url(),
  films: z.array(z.string().url()),
  species: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  starships: z.array(z.string().url()),
});

export type People = z.infer<typeof PeopleSchema>;

// Planets Schema
export const PlanetSchema = BaseSchema.extend({
  name: z.string(),
  rotation_period: z.string(),
  orbital_period: z.string(),
  diameter: z.string(),
  climate: z.string(),
  gravity: z.string(),
  terrain: z.string(),
  surface_water: z.string(),
  population: z.string(),
  residents: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Planet = z.infer<typeof PlanetSchema>;

// Films Schema
export const FilmSchema = BaseSchema.extend({
  title: z.string(),
  episode_id: z.number(),
  opening_crawl: z.string(),
  director: z.string(),
  producer: z.string(),
  release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  characters: z.array(z.string().url()),
  planets: z.array(z.string().url()),
  starships: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  species: z.array(z.string().url()),
});

export type Film = z.infer<typeof FilmSchema>;

// Species Schema
export const SpeciesSchema = BaseSchema.extend({
  name: z.string(),
  classification: z.string(),
  designation: z.string(),
  average_height: z.string(),
  skin_colors: z.string(),
  hair_colors: z.string(),
  eye_colors: z.string(),
  average_lifespan: z.string(),
  homeworld: z.string().url().nullable(),
  language: z.string(),
  people: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Species = z.infer<typeof SpeciesSchema>;

// Vehicles Schema
export const VehicleSchema = BaseSchema.extend({
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  cost_in_credits: z.string(),
  length: z.string(),
  max_atmosphering_speed: z.string(),
  crew: z.string(),
  passengers: z.string(),
  cargo_capacity: z.string(),
  consumables: z.string(),
  vehicle_class: z.string(),
  pilots: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

// Starships Schema
export const StarshipSchema = VehicleSchema.extend({
  hyperdrive_rating: z.string(),
  MGLT: z.string(),
  starship_class: z.string(),
});

export type Starship = z.infer<typeof StarshipSchema>;

// Collection response schema - used for list endpoints
export const CollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(itemSchema),
  });

// Specific collection schemas
export const PeopleCollectionSchema = CollectionSchema(PeopleSchema);
export const PlanetCollectionSchema = CollectionSchema(PlanetSchema);
export const FilmCollectionSchema = CollectionSchema(FilmSchema);
export const SpeciesCollectionSchema = CollectionSchema(SpeciesSchema);
export const VehicleCollectionSchema = CollectionSchema(VehicleSchema);
export const StarshipCollectionSchema = CollectionSchema(StarshipSchema);

// Tool input schemas for single resource retrieval
export const GetPeopleByIdSchema = z.object({
  id: z.string().or(z.number()),
});

export const GetPlanetByIdSchema = z.object({
  id: z.string().or(z.number()),
});

export const GetFilmByIdSchema = z.object({
  id: z.string().or(z.number()),
});

export const GetSpeciesByIdSchema = z.object({
  id: z.string().or(z.number()),
});

export const GetVehicleByIdSchema = z.object({
  id: z.string().or(z.number()),
});

export const GetStarshipByIdSchema = z.object({
  id: z.string().or(z.number()),
});

// Tool input schemas for list endpoints with optional pagination
export const ListResourceSchema = z.object({
  page: z.number().optional().default(1),
  search: z.string().optional(),
});
