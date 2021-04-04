import { asyncForEach, emptyNestedObject } from 'src/utils';
import * as yup from 'yup';
import { DomainValidationType, UseValidationInputType, UseValidationOutputType } from './types';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export const useValidation = <D extends Record<string, unknown>>(input: UseValidationInputType<D>): UseValidationOutputType<D> => {

  const updateValidationAt: (path: string, value: string) => void = (path, value) => {

    const tempValidationData: DomainValidationType<D> = cloneDeep(input.curValidationDomain)

    const tempDomainData: D = cloneDeep(input.curDomain)

    // set cur entered value to tempDomainData
    set(tempDomainData, path, value)


    input.schema.validateAt(path, tempDomainData)
      .then(() => {
        console.log("passed finally")
        input.setValidationDomain((prev: DomainValidationType<D>) => {
          return set(tempValidationData, path, "")
        })
      }).catch((error: yup.ValidationError) => {
        console.log("still error")
        input.setValidationDomain((prev: DomainValidationType<D>) => {
          return set(tempValidationData, path, error.errors[0])
        })
      })
  }

  const updateAllValidation: () => void = async () => {

    // copy cur domain state to temp validation state
    const tempValidationData = cloneDeep(input.curDomain)
    console.log(tempValidationData)

    // make value of all properties 
    const tempEmptyValidationData = emptyNestedObject(tempValidationData)
    console.log(tempEmptyValidationData)

    console.log("error object")
    await input.schema.validate(input.curDomain, { abortEarly: false })
      .then(() => {
        // success
      })
      .catch((error) => {
        error.inner.forEach((e: any) => {
          console.log("path: " + e.path)
          console.log("message: " + e.message)
          set(tempEmptyValidationData, e.path, e.message);
        })

      })

    /**
     * should use 'async/await' for 'yup' async validation
     *
     *  - ref: https://gist.github.com/Atinux/fd2bcce63e44a7d3addddc166ce93fb2
     *
     **/
    //await asyncForEach(propList, async (prop: string) => {
    //  await input.schema.validateAt(prop, input.curDomain).catch((error: yup.ValidationError) => {
    //    tempUserAccountValidationData[prop as keyof DomainValidationType<D>] = error.errors[0]
    //  })
    //})

    input.setValidationDomain(tempEmptyValidationData as DomainValidationType<D>)
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

