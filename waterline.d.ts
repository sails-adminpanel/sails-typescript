import { LifecycleCallbacks, AttributeValidations } from "waterline";
import BluebirdPromise = require('bluebird');

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
type or<T> = {
  /**
   * Performs a logical OR operation on an array of criteria objects.
   * 
   * Example:
   * or: [{name: 'John'}, {age: 21}]
   * Matches records where the name is 'John' OR the age is 21.
   */
  or?: typeof T[]
}

type not<T> = {
  /**
   * Performs a logical NOT operation on the provided criteria.
   *
   * Example:
   * '!': {name: 'John'}
   * Matches records where the name is NOT 'John'.
   */
  "!="?: T
  "!="?: T[]
}


type notId<T> = {
  /**
   * Performs a logical NOT operation on the provided criteria.
   *
   * Example:
   * '!': [1,2,3]
   * Matches records where the id is NOT 1,2,3.
   */
  "!="?: number | string
  "!="?: number | string[]
  "notEqual"?: number | string
  "notEqual"?: (number | string)[]
}

type notEqual<T> = {
  /**
   * Matches records where the attribute is not equal to the provided value.
   *
   * Example:
   * '!=': {age: 21}
   * Matches records where the age is NOT 21.
   */
  '!=': T;
};

type lessThan<T> = {
  /**
   * Matches records where the attribute is less than the provided value.
   *
   * Example:
   * '<': {age: 21}
   * Matches records where the age is less than 21.
   */
  "<": T
}

type lessThanOrEqual<T> = {
  /**
   * Matches records where the attribute is less than or equal to the provided value.
   *
   * Example:
   * '<=': {age: 21}
   * Matches records where the age is less than or equal to 21.
   */
  "<=": T
}

type greaterThan<T> = {
  /**
   * Matches records where the attribute is greater than the provided value.
   *
   * Example:
   * '>': {age: 21}
   * Matches records where the age is greater than 21.
   */
  ">": T
}

type greaterThanOrEqual<T> = {
  /**
   * Matches records where the attribute is greater than or equal to the provided value.
   *
   * Example:
   * '>=': {age: 21}
   * Matches records where the age is greater than or equal to 21.
   */
  ">=": T
}

type nin<T> = {
  /**
   * Matches records where the attribute is not in the provided array of values.
   *
   * Example:
   * nin: {age: [21, 22, 23]}
   * Matches records where the age is NOT 21, 22, or 23.
   */
  nin: T[]
}

type _in<T> = {
  /**
   * Matches records where the attribute is in the provided array of values.
   *
   * Example:
   * in: {age: [21, 22, 23]}
   * Matches records where the age is 21, 22, or 23.
   */
  in: T[]
}

type contains = {
  /**
   * Matches records where the attribute contains the provided substring.
   *
   * Example:
   * contains: {name: 'John'}
   * Matches records where the name contains 'John'.
   */
  contains: string
}

type startsWith = {
  /**
   * Matches records where the attribute starts with the provided substring.
   *
   * Example:
   * startsWith: {name: 'John'}
   * Matches records where the name starts with 'John'.
   */
  startsWith: string
}

type endsWith = {
  /**
   * Matches records where the attribute ends with the provided substring.
   *
   * Example:
   * endsWith: {name: 'John'}
   * Matches records where the name ends with 'John'.
   */
  endsWith: string
}

type SortDirection = 'asc' | 'desc';


// TODO: check how it works
type SortCriteria<T> = {
  /**
   * Specifies the sort direction for the provided attribute.
   *
   * Example:
   * {name: 'asc'}
   * Sorts the records in ascending order by the name attribute.
   */
  [P in keyof T]?: SortDirection;
};


export type CriteriaQuery<T> = {
  /**
   * Specifies the WHERE clause for the query. This can either be a simple key-value object, or a complex query with logical operators.
   */
  where?: WhereCriteriaQuery<T>;

  /**
   * Limits the number of records returned by the query.
   */
  limit?: number;

  /**
   * Specifies the number of records to skip before starting to return records.
   */
  skip?: number;

  /**
   * Specifies the order in which records should be returned.
   */
  sort?: string | SortCriteria<T> | SortCriteria<T>[];
};

export type WhereCriteriaQuery<T> = {
  [P in keyof T]?: T[P] |
  not<T[P]> |
  notId<T> |
  lessThan<T[P]> |
  lessThan<T[P][]> |
  lessThanOrEqual<T[P]> |
  lessThanOrEqual<T[P][]> |
  greaterThanOrEqual<T[P]> |
  greaterThanOrEqual<T[P][]> |
  greaterThan<T[P]> |
  greaterThan<T[P][]> |
  notEqual<T[P]> |
  notEqual<T[P]>[] |
  _in<T[P]> |
  nin<T[P]> |
  contains |
  startsWith |
  endsWith |
  not<T[P][]> |
  or<T>
};


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


type MetaOptions = {
  /**
   * When performing .update(), .create(), .createEach(), or .destroy() queries,
   * set this to true to tell the database adapter to send back all records that
   * were updated/destroyed. Otherwise, the second argument to the .exec() callback
   * is undefined. Warning: Enabling this key may cause performance issues for
   * update/destroy queries that affect large numbers of records.
   */
  fetch?: boolean;

  /**
   * If set to true on a .destroy(), this tells Waterline to perform a "virtual cascade"
   * for every deleted record. Thus, deleting a record with a 2-way, plural association
   * (one-to-many or many-to-many) will also cleanly remove all links to other records
   * (by removing join table rows or setting foreign key values to null).
   *
   * This may be desirable if database size is a concern, or if primary keys may be
   * reused for records, but it can negatively impact performance on .destroy() calls
   * since it involves executing more queries.
   *
   * The cascade meta key should only be used with databases like MongoDB that don't
   * support cascading delete as a native feature. If you need cascading delete and your
   * database supports it natively (e.g. MySQL or PostgreSQL), you'll enjoy improved
   * performance by simply adding a CASCADE constraint at the physical layer (e.g.
   * phpMyAdmin, Sequel Pro, mySQL prompt, etc.), rather than relying on Waterline's
   * virtual cascade to take effect at runtime.
   */
  cascade?: boolean;

  /**
   * Set to true to prevent lifecycle callbacks from running during the execution
   * of the query.
   */
  skipAllLifecycleCallbacks?: boolean;

  /**
   * Set to true to skip Waterline's post-query verification pass of any records
   * returned from the adapter(s). Useful for tools like sails-hook-orm's automigrations,
   * or to disable warnings for use cases where you know that pre-existing records in
   * the database do not match your model definitions.
   */
  skipRecordVerification?: boolean;

  /**
   * Set to true to force Waterline to skip expanding the select clause in criteria
   * when it forges stage 3 queries (i.e., the queries that get passed into adapter methods).
   * Normally, if a model declares schema: true, then the S3Q select clause is expanded
   * to an array of column names, even if the S2Q had factory default select/omit clauses
   * (which is also what it would have if no explicit select or omit clauses were included
   * in the original query). Useful for tools like sails-hook-orm's automigrations, where
   * you want temporary access to properties that aren't necessarily in the current set of
   * attribute definitions. Warning: Do not use this flag in your web application backend,
   * or at least ask for help first.
   */
  skipExpandingDefaultSelectClause?: boolean;

  /**
   * Set to true to decrypt any auto-encrypted data in the records.
   */
  decrypt?: boolean;

  /**
   * The id of a custom key to use for encryption for this particular query.
   * (For decryption, the appropriate key is always used based on the data being decrypted.)
   */
  encryptWith?: string;

  /**
   * Set to true to make your query case-insensitive (only for use with the MongoDB adapter).
   */
  makeLikeModifierCaseInsensitive?: boolean;
};


//TODO: it found json fields more here types/experiments/extract.ts

type IsInstanceOfModels<T, ProjectModels> = {
  [K in keyof ProjectModels]: T extends ProjectModels[K] | Array<ProjectModels[K]> ? K : never;
}[keyof ProjectModels];


type AssociationKeys<T> = {
  [K in keyof T]: IsInstanceOfModels<T[K], Models> extends never ? never : K;
}[keyof T];

type NonPrimitive<T> = T extends object
  ? Exclude<T, string | number | boolean | symbol | null | undefined>
  : never;

type NonPrimitiveArray<T> = T extends (infer U)[]
  ? U extends never ? never : NonPrimitive<U>[]
  : never;

type OnlyBaseModelPrimitives<T> = T extends Primitives ? T : never;

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Primitives = string | number | boolean;

type DistributivePrimitive<T> = T extends Primitives ? T : never;

type DistributiveModel<T> = T extends Array<T> ? T[0] extends Models[keyof Models] ? T : never : T;




type ModelOrPrimitive<T> = [DistributivePrimitive<T>] extends [never]
  ? DistributiveModel<T>
  : DistributivePrimitive<T>;

type ArrayOrInstanceModelPopulated<T> = T extends any[] ? { [K in keyof T[0]]: ModelOrPrimitive<T[0][K]> }[] : { [K in keyof T]: ModelOrPrimitive<T[K]> };

type Filtered<T> = T extends never[] ? never : T;


/**
 * Options for executing queries in Waterline.
 */
type QueryBuilder<T> = WaterlinePromise<ArrayOrInstanceModelPopulated<T>> & {
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

    // почемуто все попадают в K
    K extends AssociationKeys<L>,

    FieldType extends L[K],

    // Types for model and collectons detect
    F = FieldType extends object[] ? M[0] : M,

    PopulizedField = Filtered<NonPrimitiveArray<FieldType>>,

    N = Omit<L, K> & { [P in K]: PopulizedField}
  >(association: K, filter?: "todo"): QueryBuilder<T extends object[] ? N[] : N>;

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


export type Model<M> = Omit<M, "primaryKey" | "attributes"> & ORMModel<Pick<M, "primaryKey" | "attributes">>

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


type Rule =
  | {
    /**
     * A value such that when it is provided as the first argument to the custom function, the function returns true.
     * 
     * Applicable Attribute Type(s): Any
     */
    custom: (value: any) => boolean
  }
  | {
    /**
     * A value that, when parsed as a date, refers to a moment after the configured JavaScript Date instance.
     * 
     * Applicable Attribute Type(s): String, Number
     */
    isAfter: Date
  }
  | {
    /**
     * A value that, when parsed as a date, refers to a moment before the configured JavaScript Date instance.
     * 
     * Applicable Attribute Type(s): String, Number
     */
    isBefore: Date
  }
  | {
    /**
     * A value that is true or false.
     * 
     * Applicable Attribute Type(s): JSON, Ref
     */
    isBoolean: boolean
  }
  | {
    /**
     * A value that is a credit card number.
     * 
     * Applicable Attribute Type(s): String
     * 
     * Notes: Do not store credit card numbers in your database unless your app is PCI compliant! If you want to allow users to store credit card information, a safe alternative is to use a payment API like Stripe.
     */
    isCreditCard: boolean
  }
  | {
    /**
     * A value that looks like an email address.
     * 
     * Applicable Attribute Type(s): String
     */
    isEmail: boolean
  }
  | {
    /**
     * A string that is a hexadecimal color.
     * 
     * Applicable Attribute Type(s): String
     */
    isHexColor: boolean
  }
  | {
    /**
     * A value that is in the specified array of allowed strings.
     * 
     * Applicable Attribute Type(s): String
     */
    isIn: string[]
  }
  | {
    /**
     * A number that is an integer (a whole number).
     * 
     * Applicable Attribute Type(s): Number
     */
    isInteger: boolean
  }
  | {
    /**
     * A value that is a valid IP address (v4 or v6).
     * 
     * Applicable Attribute Type(s): String
     */
    isIP: boolean
  }
  | {
    /**
     * A value that is not an empty string.
     * 
     * Applicable Attribute Type(s): JSON, Ref
     */
    isNotEmptyString: boolean
  }
  | {
    /**
     * A value that is not in the configured array.
     * 
     * Applicable Attribute Type(s): String
     */
    isNotIn: string[]
  }
  | {
    /**
     * A value that is a JavaScript number.
     * 
     * Applicable Attribute Type(s): JSON, Ref
     */
    isNumber: boolean
  }
  | {
    /**
     * A value that is a string.
     * 
     * Applicable Attribute Type(s): JSON, Ref
     */
    isString: boolean
  }
  | {
    /**
     * A value that looks like a URL.
     * 
     * Applicable Attribute Type(s): String
     */
    isURL: boolean
  }
  | {
    /**
     * A value that looks like a UUID (v3, v4, or v5).
     * 
     * Applicable Attribute Type(s): String
     */
    isUUID: boolean
  }
  | {
    /**
     * A number that is less than or equal to the configured number.
     * 
     * Applicable Attribute Type(s): Number
     */
    max: number
  }
  | {
    /**
     * A number that is greater than or equal to the configured number.
     * 
     * Applicable Attribute Type(s): Number
     */
    min: number
  }
  | {
    /**
     * A string that has no more than the configured number of characters.
     * 
     * Applicable Attribute Type(s): String
     */
    maxLength: number
  }
  | {
    /**
     * A string that has at least the configured number of characters.
     * 
     * Applicable Attribute Type(s): String
     */
    minLength: number
  }
  | {
    /**
     * A string that matches the configured regular expression.
     * 
     * Applicable Attribute Type(s): String
     */
    regex: RegExp
  };


export type CustomAttribute<T> = T

type AttributeType = 'string' | 'number' | 'boolean' | 'json' | 'ref';

type SimpleAttribute = AttributeType;

export type Attribute = SimpleAttribute
  | BaseAttribute
  | OneToOneAttribute
  | OneToManyAttribute
  | ManyToManyAttribute
  | Rule

type ModelRelationType<T> = T extends keyof Models ? Models[T] | string : T;

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