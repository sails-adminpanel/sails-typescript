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

export type Rule =
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
