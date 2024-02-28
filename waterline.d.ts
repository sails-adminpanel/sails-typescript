import { LifecycleCallbacks, AttributeValidations } from "waterline";
import BluebirdPromise = require('bluebird');
import WhereCriteriaQuery from "./criteria"
import { Rule } from "./criteria";
import { MetaOptions } from "./metaOptions";

export type Callback<T> = (err: Error | null, result: T) => void;


declare global {
  /**
   * The empty interface is used so that it can be used in the project
   */
  interface Models { }

  interface AppCustomJsonTypes { }
}


export type DataStore = {
  manager: any,
  config: any,
  driver: any,
  schema: any
}

/**
 * It uses to detect the collection in the model, this is a stupid thing, but I don't see anything better
 * In theory, you need to get all the Types that were sent to the generic ORM, 
 * and filter those that are in this model, if you know how to do this, open the issue
 */
type NonPrimitiveKeys<T> = {
  [K in keyof T]: T[K] extends (string | number | boolean | symbol | null | undefined | Date) ? never : K;
}[keyof T];

type TypeOrArray<T> = T extends any[] ? T[number] : T


type collectionMember = {
  members(childIds: string[]): Promise<void>;
};

type UpdateBuilder<T> = CRUDBuilder<T> & {
  set: (changes: Partial<T>) => CRUDBuilder<T> & WaterlinePromise<T[]>
}


type WaterlinePromise<T> = BluebirdPromise<T> & {

  exec(cb: Callback<T>): void;

  /**
   * ⚠️ Whenever possible, it is recommended that you use await instead of calling this method.
   * This is an alternative to .exec(). When combined with .catch(), it provides the same functionality.
   * For more information, see the bluebird .then() api docs.
  */
  then(cb: Callback<T>): QueryBuilder<T>;
  catch(cb: (err: Error) => void): QueryBuilder<T>;

};

type CRUDBuilder<T> = WaterlinePromise<T> & {
  /**
   * Tell Waterline (and the underlying database adapter) to send back records that were updated/destroyed/created when performing an .update(), .create(), .createEach() or .destroy() query. Otherwise, no data will be returned (or if you are using callbacks, the second argument to the .exec() callback will be undefined).
   */
  fetch(): CRUDBuilder<T>;
};


//TODO: it found json fields more here types/experiments/extract.ts

type IsInstanceOfModels<T, ProjectModels> = {
  [K in keyof ProjectModels]: T extends ProjectModels[K] | Array<ProjectModels[K]> ? K : never;
}[keyof ProjectModels];


type AssociationKeys<T> = {
  [K in keyof T]: IsInstanceOfModels<T[K], Models> extends never ? never : K;
}[keyof T];

type Primitives = string | number | boolean;

// Filters

type NonPrimitive<T> = T extends object
  ? Exclude<T, string | number | boolean | symbol | null | undefined>
  : never;

type NonPrimitiveArray<T> = T extends (infer U)[]
  ? U extends never ? never : NonPrimitive<U>[]
  : never;

type PrimitiveArray<T> = T extends (infer U)[]
  ? U extends Primitive ? U[] : never
  : never;

type PrimitiveType<T> = T extends Primitive ? T : never;

type Filtered<T> = T extends never[] ? never : T;

// With population
type ArrayOrInstanceModelPopulated<T> = T extends any[] ? { [F in keyof T[0]]: ModelOrPrimitive<T[0][F]> }[] : { [F in keyof T]: ModelOrPrimitive<T[F]> };

type DistributivePrimitive<F> = F extends Primitives ? F : never;

type DistributiveModel<F> = F extends Array<F> ? F[0] extends Models[keyof Models] ? F : never : F;

type ModelOrPrimitive<F> = DistributivePrimitive<F> extends never
  ? DistributiveModel<F>
  : DistributivePrimitive<F>;



// Without population

type ArrayOrInstanceModelUnPopulated<T> = T extends any[] ? { [F in keyof T[0]]: ModelOrPrimitiveFlat<T[0][F]> }[] : { [F in keyof T]: ModelOrPrimitiveFlat<T[F]> };

type DistributiveModelFlat<F> = F extends Array<F> ?
  F[0] extends Models[keyof Models] ?
  F : never : F;

type ModelOrPrimitiveFlat<F> = DistributivePrimitive<F> extends never
  ? DistributiveModelFlat<F>
  : DistributivePrimitive<F>;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

type OmitCollection<T> = {
  [F in keyof T]: 
    T[F] extends Primitives ? T[F] :
      T[F] extends DefaultJsonType ? T[F] : 
        T[F] extends AppCustomJsonTypes[] ? T[F]: "OmitCollection has filtred populate "
}




/**


 ██████╗ ██╗   ██╗███████╗██████╗ ██╗   ██╗    ██████╗ ██╗   ██╗██╗██╗     ██████╗ ███████╗██████╗ 
██╔═══██╗██║   ██║██╔════╝██╔══██╗╚██╗ ██╔╝    ██╔══██╗██║   ██║██║██║     ██╔══██╗██╔════╝██╔══██╗
██║   ██║██║   ██║█████╗  ██████╔╝ ╚████╔╝     ██████╔╝██║   ██║██║██║     ██║  ██║█████╗  ██████╔╝
██║▄▄ ██║██║   ██║██╔══╝  ██╔══██╗  ╚██╔╝      ██╔══██╗██║   ██║██║██║     ██║  ██║██╔══╝  ██╔══██╗
╚██████╔╝╚██████╔╝███████╗██║  ██║   ██║       ██████╔╝╚██████╔╝██║███████╗██████╔╝███████╗██║  ██║
 ╚══▀▀═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝       ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝
                                                                                                   
 */


/**
 * Options for executing queries in Waterline.
 */
type QueryBuilder<T> = WaterlinePromise<ArrayOrInstanceModelPopulated<OmitCollection<T>>> & {
  where(condition: any): QueryBuilder<T>;
  limit(lim: number): QueryBuilder<T>;
  skip(num: number): QueryBuilder<T>;
  // TODO: impl String _or_ Array of Dictionary
  //  sort(criteria: M<T>): QueryBuilder<T>;
  //  sort(criteria: M<T>[]): QueryBuilder<T>;
  sort(sortClause: string): QueryBuilder<T>;
  paginate(pagination?: { page: number; limit: number }): QueryBuilder<T>;

  // base population
  // populate<K extends AssociationKeys<T>, M extends T[K], N = Omit<T, K> & { [P in K]: PopulizedModel<NonPrimitive<M>> }>(association: K): QueryBuilder<N>;

  populate<
    L = T extends object[] ? T[0] : T,

    // TODO: for some reason everyone ends up in K, but only associations should
    K extends AssociationKeys<L>,

    FieldType extends L[K],

    PopulizedField = FieldType extends Array<any> ? Filtered<NonPrimitiveArray<FieldType>> : Filtered<NonPrimitive<FieldType>>,

    ResultType = Omit<L, K> & { [P in K]: PopulizedField }
  >(association: K, filter?: "todo"): QueryBuilder<T extends object[] ? ResultType[] : ResultType>;

  /**
   * @deprecated
   */
  average(attribute: keyof T): QueryBuilder<T>;

  /**
   * Provide additional options to Waterline when executing a query instance.
   * 
   */
  meta(options: MetaOptions): QueryBuilder<T>;

  /**
   * Capture and intercept the specified error, automatically modifying and re-throwing it, or specifying a new error to be thrown instead. (Still throws.)
  */
  intercept?(criteria: string | string[], handler: Function | string)

  validate<A extends keyof M>(params: A, type: M[A]): Promise<void>;
  /**
   * Decrypt any auto-encrypted attributes in the records returned for this particular query.
   * with:
   * ```
   * await User.find({fullName: 'Finn Mertens'}).decrypt();  
   * =>  
   * [ { id: 4, fullName: 'Finn Mertens', ssn: '555-55-5555' } ]
   * 
   * ```
   * without
   * ```
   * await User.find({fullName: 'Finn Mertens'});
   * =>
   * [ { id: 4, fullName: 'Finn Mertens', ssn: 'YWVzLTI1Ni1nY20kJGRlZmF1bHQ=$F4Du3CAHtmUNk1pn$hMBezK3lwJ2BhOjZ$6as+eXnJDfBS54XVJgmPsg' } ]
   * ```
   * 
   * 
   */
  decrypt(): QueryBuilder<T>;

  /**
   * Tolerate (swallow) the specified error, and return a new result value (or undefined) instead. (Don't throw.)
   * @param  filter The code of the error that you want to intercept, or a dictionary of criteria for identifying the error to intercept.
   * @param handler An optional procedural parameter, called automatically by Sails if the anticipated error is thrown. It receives the argument specified in the "Handler" usage table below. If specified, the handler should return a value that will be used as the result. If omitted, the anticipated error will be swallowed and the result of the query will be undefined.
   */
  tolerate(filter?: string | string[], handler?: (err: Error) => void)

  /**
   * This is an alternative to .exec().
   */
  toPromise(): QueryBuilder<T>;

  /**
   * Specify an existing database connection to use for this query.
   */
  usingConnection(connection: any): QueryBuilder<T>;
};

type RecordHandler<M> = (record: M) => Promise<M>;
type BatchHandler<M> = (records: M[]) => Promise<M>;

interface StreamBuilder<M> {
  eachRecord(handler: RecordHandler<M>): Promise<M>;
  eachBatch(handler: BatchHandler<M>): Promise<M>;
}


type RequiredField<T, K extends keyof T> = T & { [P in K]-?: T[P] }

// TODO: add types for full mode by sails.models[X]
export type Model<M> = Omit<M, "attributes"> & ORMModel<Pick<M, "attributes">>

/**
 * 

    ██╗    ██╗██╗         ███╗   ███╗ ██████╗ ██████╗ ███████╗██╗     
    ██║    ██║██║         ████╗ ████║██╔═══██╗██╔══██╗██╔════╝██║     
    ██║ █╗ ██║██║         ██╔████╔██║██║   ██║██║  ██║█████╗  ██║     
    ██║███╗██║██║         ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝  ██║     
    ╚███╔███╔╝███████╗    ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗███████╗
     ╚══╝╚══╝ ╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
                                                                      
 */


/**
 * Waterline model
 */
export interface ORMModel<
  M,
  Attr = Partial<ModelTypeDetection<M['attributes']>> & ModelTimestamps,
  PK = Attr[M['primaryKey'] extends never ? 'id' : M['primaryKey']],
  TypeOfPK = Attr extends { [K in PK]: infer PKType } ? PKType : never,
  /**
   * List of required keys
   */
  C = RequiredKeys<M['attributes']>
> {

  /**
   * Create a new record in the database. 
   * This is used to insert a new record into a database table or collection.
   */
  create?(params: RequiredField<Attr, C>): CRUDBuilder<ArrayOrInstanceModelPopulated<Attr>>

  /**
   * Create multiple new records in the database at once. 
   * This is used to insert multiple records into a database table or collection in a single operation.
   */
  create?(params: RequiredField<Attr[], C>): CRUDBuilder<ArrayOrInstanceModelPopulated<Attr>>;


  /**
   * Create each of the new records in the database. 
   * This is used to insert each record into a database table or collection.
   */
  createEach?(params: RequiredField<M[], C>): CRUDBuilder<ArrayOrInstanceModelPopulated<Attr[]>>;

  /**
   * Find records that match the specified criteria.
   */
  find?(primaryKey?: TypeOfPK): QueryBuilder<Attr[]>;
  find?(criteria?: CriteriaQuery<Attr>): QueryBuilder<Attr[]>;
  find?(where?: WhereCriteriaQuery<Attr>): QueryBuilder<Attr[]>;

  /**
   * Find a single record that matches the specified criteria.
   */
  findOne?(primaryKey?: TypeOfPK): QueryBuilder<Attr>;
  findOne?(criteria?: CriteriaQuery<Attr>): QueryBuilder<Attr>;
  findOne?(where?: WhereCriteriaQuery<Attr>): QueryBuilder<Attr>;

  /**
   * Finds a record matching the provided criteria, or creates one if no record was found.
   */
  findOrCreate?(primaryKey?: TypeOfPK, values?: RequiredField<Attr>): QueryBuilder<Attr>;
  findOrCreate?(criteria?: CriteriaQuery<Attr>, values?: RequiredField<Attr>): QueryBuilder<Attr>;
  findOrCreate?(where?: WhereCriteriaQuery<Attr>, values?: RequiredField<Attr>): QueryBuilder<Attr>;

  /**
   * Updates records that match the specified criteria.
   * It applies the provided changes to all matching records.
   */
  update?(primaryKey: TypeOfPK, changes: Partial<Attr>): UpdateBuilder<Attr[]>;
  update?(criteria: CriteriaQuery<Attr>, changes: Partial<Attr>): QueryBuilder<Attr[]>;
  update?(where: WhereCriteriaQuery<Attr>, changes: Partial<Attr>): QueryBuilder<Attr[]>;

  /**
   * Updates a single record that matches the specified criteria.
   */
  updateOne?(criteria: CriteriaQuery<Partial<Attr>>, changes: Partial<Attr>): QueryBuilder<Attr>;
  updateOne?(where: WhereCriteriaQuery<Partial<Attr>>, changes: Partial<Attr>): QueryBuilder<Attr>;
  updateOne?(primaryKey: TypeOfPK, changes: Partial<Attr>): QueryBuilder<Attr>;

  /**
   * Begins an update operation that can have additional changes applied before execution.
   */
  update?(primaryKey: TypeOfPK): UpdateBuilder<Attr>;
  update?(where: WhereCriteriaQuery<Attr>): UpdateBuilder<Attr>;
  update?(criteria: CriteriaQuery<Attr>): UpdateBuilder<Attr>;


  updateOne?(criteria: CriteriaQuery<Attr>): UpdateBuilder<Attr>;
  updateOne?(where: WhereCriteriaQuery<Attr>): UpdateBuilder<Attr>;
  updateOne?(primaryKey: TypeOfPK): UpdateBuilder<Attr>;

  /**
   * Deletes records that match the specified criteria.
   */
  destroy?(criteria: CriteriaQuery<Attr>): CRUDBuilder<Attr[]>;
  destroy?(where: WhereCriteriaQuery<Attr>): CRUDBuilder<Attr[]>;
  destroy?(primaryKey: TypeOfPK): CRUDBuilder<Attr[]>;

  /**
   * Deletes a single record that matches the specified criteria.
   */
  destroyOne?(criteria: CriteriaQuery<Attr>[]): CRUDBuilder<Attr[]>;
  destroyOne?(where: WhereCriteriaQuery<Attr>[]): CRUDBuilder<Attr[]>;
  destroyOne?(primaryKey: TypeOfPK): CRUDBuilder<Attr[]>;

  /**
   * Count the number of records that match the specified criteria.
   */
  count?(criteria?: CriteriaQuery<Attr>): WaterlinePromise<number>;
  count?(where?: WhereCriteriaQuery<Attr>): WaterlinePromise<number>;
  count?(primaryKey?: TypeOfPK): WaterlinePromise<number>;

  /**
   * Allows raw SQL queries to be sent directly to the underlying database.
   */
  query?(sqlQuery: string, cb: Callback<Attr>): void;
  query?(sqlQuery: string, data: any, cb: Callback<Attr>): void;

  /**
   * Allows you to run a native query directly on the underlying adapter.
   */
  native?(cb: (err: Error, collection: any) => void): void;

  /**
   * Allows you to stream records from the database using Node.js streams.
   */
  stream?(criteria: CriteriaQuery<Attr>): StreamBuilder<Attr>;
  stream?(where: WhereCriteriaQuery<Attr>): StreamBuilder<Attr>;
  stream?(primaryKey: TypeOfPK): StreamBuilder<Attr>;

  /**
   * Adds one or more records to a collection association.
   */
  addToCollection?(parentId: string | number | string[] | number[], association: NonPrimitiveKeys<Attr>, childIds: string[] | number[]): Promise<void>;

  /**
   * Removes one or more records from a collection association.
   */
  removeFromCollection?(parentId: string | number | string[] | number[], association: NonPrimitiveKeys<Attr>, childIds: string[] | number[]): Promise<void>;

  /**
   * Replaces the records in a collection association.
   */
  replaceCollection?(parentId: string | number | string[] | number[], association: NonPrimitiveKeys<Attr>, childIds: string[] | number[]): Promise<void>;

  /**
   * Returns the datastore object that the model is using.
   */
  getDatastore?(): WaterlinePromise<DataStore>;

  /**
   * Calculates the sum of the specified attribute for the records that match the specified criteria.
   */
  sum?(attribute: NumericKeys<Attr>): number | null;

  /**
   * Get the aggregate mean of the specified attribute across all matching records.
   */
  avg?(numericAttrName: keyof NumericKeys<Attr>, criteria: CriteriaQuery<Attr>): WaterlinePromise<number | null>;
  avg?(numericAttrName: keyof NumericKeys<Attr>, where: WhereCriteriaQuery<Attr>): WaterlinePromise<number | null>;
  avg?(numericAttrName: keyof NumericKeys<Attr>, primaryKey: TypeOfPK): WaterlinePromise<number | null>;

  /**
   * Validates a potential record to check for attribute requirements, uniqueness, and record validations.
   */
  validate?<A extends keyof M>(params: A, type: M[A]): void;

  /**
   * This method allows you to use archiving. It's a safe way to delete records by marking them as archived.
   */
  archive?(criteria: CriteriaQuery<Attr>): WaterlinePromise<Attr[]>;

  /**
   * This method allows you to fetch archived records.
   */
  archived?(): WaterlinePromise<Attr[]>;

  /**
   * This method allows you to lease records to prevent concurrent modifications.
   */
  lease?(leaseCriteria: any): WaterlinePromise<Attr>;
}

export interface OneToOneAttribute {
  model: keyof Models;
};

export type OneToManyAttribute = {
  collection: keyof Models;
  via: string;
};

export type ManyToManyAttribute = {
  collection: keyof Models;
  via: string;
  dominant?: boolean | undefined;
};


/**
 * @link https://sailsjs.com/documentation/concepts/models-and-orm/attributes
*/
interface BaseAttribute {
  type: AttributeType;

  /**
   * @deprecated in sails v1
  */
  primaryKey?: boolean | undefined;

  /**
   * Set unique ORM checks
  */
  unique?: boolean | undefined;
  required?: boolean | undefined;
  isIn?: Array<string | number> | undefined | const;
  size?: number | undefined;
  columnName?: string | undefined;
  index?: boolean | undefined;
  allowNull?: boolean | undefined;
  validations?: AttributeValidations | undefined;
  autoCreatedAt?: boolean | undefined;
  autoUpdatedAt?: boolean | undefined;
  updatedAt?: boolean | undefined;
  createdAt?: boolean | undefined;

  /**
   * Sets up the attribute as an auto-increment key. When a new record is added to the model, if a value for this attribute is not specified, it will be generated by incrementing the most recent record's value by one. Note: attributes that specify autoIncrement should always be of type: 'number'. Also bear in mind that the level of support varies across different datastores. 
  */
  autoIncrement?: boolean | undefined;


  /**
   * Setting encrypt allows you to decide whether this attribute should be automatically encrypted. If set to true, when a record is retrieved, it will still contain the encrypted value for this attribute unless .decrypt() is used.
    */
  encrypt?: boolean | undefined;

  // TODO: add detect validation compatible https://sailsjs.com/documentation/concepts/models-and-orm/validations

}

export type CustomAttribute<T> = T

type AttributeType = 'string' | 'number' | 'boolean' | 'json' | 'ref';

type SimpleAttribute = AttributeType;

export type Attribute = SimpleAttribute
  | BaseAttribute
  | OneToOneAttribute
  | OneToManyAttribute
  | ManyToManyAttribute
  | Rule

type ModelRelationType<T> = T extends keyof Models ? Models[T] | string | number : T;
//type CollectionRelationType<T> = T extends keyof Models ? `${Models[T]}['primaryKey'] | string[] : T;
type CollectionRelationType<T> = T extends keyof Models ? Models[T][] | string[] | number[] : T;

type AssignCustomType<K> = K extends keyof AppCustomJsonTypes ? AppCustomJsonTypes[K] : DefaultJsonType[] | DefaultJsonType;

export type Attributes = {
  [key: string]: Attribute;
};

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ModelTypeRaw<ConstAttrs> = {
  [K in keyof ConstAttrs]: AttributeTypeDetection<ConstAttrs[K], K>;
};

/**
 * Recognizes model fields by types from constants
 * ConstAttrs - The constant that comes in attibuts of Model
 */
export type ModelTypeDetection<ConstAttrs> = ModelTypeRaw<Writeable<ConstAttrs>> & ModelTimestamps

/**
 * Attribute type detection
 * F - Key of fields
 * T - Value
 */
type AttributeTypeDetection<T, F> =
  T extends BaseAttribute ? (T['type'] extends 'string' ?
    // check isIn string 
    T['isIn'] extends readonly string[] ? StringArrayToUnion<T['isIn']> : string
    : T['type'] extends 'number' ? number
    : T['type'] extends 'boolean' ? boolean
    : T['type'] extends 'json' ? AssignCustomType<F>
    : never)

  // Model relation
  : T extends { model: string } ? T['model'] extends `${keyof Models}` ? ModelRelationType<T['model']> : never

  // Collection relation
  : T extends { collection: string } ? T['collection'] extends `${keyof Models}` ? CollectionRelationType<T['collection']> : never :

  T extends AttributeType ?
  (T extends 'string' ? string
    : T extends 'number' ? number
    : T extends 'boolean' ? boolean
    : T extends 'json' ? DefaultJsonType | DefaultJsonType[]
    : never) : never


// Required keys

export type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never;
}[keyof T];

export type StringArrayToUnion<T> = T extends ReadonlyArray<infer U> ? U : T;

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

type DefaultJsonType = {
  [key: string]: string | string[] | number | number[] | boolean | null
}

export type ModelTimestamps = {
  createdAt?: number | undefined;
  updatedAt?: number | undefined;
}