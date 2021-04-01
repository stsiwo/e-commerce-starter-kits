import { ObjectSchema } from "yup";
import { Assign, TypeOfShape, ObjectShape, AnyObject } from "yup/lib/object";

export declare type UseValidationPropsType = {
}

export declare type DomainValidationType<D extends Record<string, unknown>> = {
  [P in keyof D]?: string
}

export declare type UseValidationInputType<D extends Record<string, unknown>> = {
  schema: ObjectSchema<Assign<ObjectShape, ObjectShape>, AnyObject, TypeOfShape<Assign<ObjectShape, ObjectShape>>>
  curDomain: D
  curValidationDomain: DomainValidationType<D> 
  setValidationDomain: React.Dispatch<React.SetStateAction<DomainValidationType<D>>>
}

export declare type UseValidationOutputType<D extends Record<string, unknown>> = {
  updateValidationAt: (path: string, value: string) => void
  updateAllValidation: () => void,
  isValidSync: (curDomain: D) => boolean
}