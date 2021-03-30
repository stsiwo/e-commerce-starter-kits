import * as React from 'react';
import * as yup from 'yup';
import { UseValidationInputType, UseValidationOutputType, DomainValidationType } from './types';
import { asyncForEach } from 'src/utils';
 
export const useValidation = <D extends Record<string, unknown>>(input: UseValidationInputType<D>): UseValidationOutputType<D> => {

  const updateValidationAt: (path: string, value: string) => void = (path, value) => {
    input.schema.validateAt(path, {
      ...input.curDomain,
      [path]: value
    })
      .then(() => {
        console.log("passed finally")
        input.setValidationDomain((prev: DomainValidationType<D>) => ({
          ...prev,
          [path]: ""
        }))
      }).catch((error: yup.ValidationError) => {
        console.log("still error")
        input.setValidationDomain((prev: DomainValidationType<D>) => ({
          ...prev,
          [path as keyof DomainValidationType<D>]: error.errors[0]
        }))
      })
  }

  const updateAllValidation: () => void = async () => {

    const tempUserAccountValidationData: DomainValidationType<D> = {}

    const propList = Object.keys(input.curDomain)

    /**
     * should use 'async/await' for 'yup' async validation
     *
     *  - ref: https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
     *
     **/
    await asyncForEach(propList, async (prop: string) => {
      await input.schema.validateAt(prop, input.curDomain).catch((error: yup.ValidationError) => {
        tempUserAccountValidationData[prop as keyof DomainValidationType<D>] = error.errors[0]
      }) 
    })

    input.setValidationDomain(tempUserAccountValidationData)
  }

  const isValidSync: (curDomain: D) => boolean = (curDomain) => {
    return input.schema.isValidSync(curDomain)
  }
    
  return {                 
    updateValidationAt: updateValidationAt,
    updateAllValidation: updateAllValidation,
    isValidSync: isValidSync,
  }
}                          

