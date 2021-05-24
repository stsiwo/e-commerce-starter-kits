import { ObjectSchema } from "yup";
import { Assign, TypeOfShape, ObjectShape, AnyObject } from "yup/lib/object";

export declare type UseValidationPropsType = {
}

export declare type DomainValidationType<D extends Record<string, unknown>> = {
  [P in keyof D]?: any // string or nested validation object
}

export declare type UseValidationInputType<D extends Record<string, unknown>> = {
  schema: ObjectSchema<Assign<ObjectShape, ObjectShape>, AnyObject, TypeOfShape<Assign<ObjectShape, ObjectShape>>>
  curDomain: D
  curValidationDomain: DomainValidationType<D> 
  setValidationDomain: React.Dispatch<React.SetStateAction<DomainValidationType<D>>>
  defaultValidationDomain: DomainValidationType<D>
}

export declare type UseValidationOutputType<D extends Record<string, unknown>> = {
  updateValidationAt: (path: string, value: any) => void
  updateAllValidation: () => void,
  isValidSync: (curDomain: D) => boolean
}
