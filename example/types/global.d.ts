import * as sailsNamespaceLib  from "sails-typescript";


type SailsConfig = typeof sailsNamespaceLib.default.config & ISailsConfig;


declare global {

  interface ISailsConfig {
  
  }
  
  type RequiredField<T, K extends keyof T> = T & { [P in K]-?: T[P] }
  
  // Remove types from T that are assignable to U
  type Diff<T, U> = T extends U ? never : T;
  // Remove types from T that are not assignable to U
  type Filter<T, U> = T extends U ? T : never;
  
  interface Sails extends _sails.Sails {
    models: any;
    config: SailsConfig;
    log: any;
  }
  // interface _SailsConfig extends sailsConfig {
  //  //[key:string]: any | object;
  // }

  const sails: Sails;
  type ReqType = sails.Request;
  type ResType = sails.Response;
  type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
}

declare global {
	interface ISailsConfig {
		blueprints: {
			actions: boolean
      rest: boolean
      shortcuts: boolean
		}
    policies: {
      [key: string]: string | boolean
    }
    routes: {
      [url: string]: string | { view?: string };
    }
	}
}