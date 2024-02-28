
export type MetaOptions = {
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