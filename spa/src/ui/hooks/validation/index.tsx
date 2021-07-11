import { asyncForEach, emptyNestedObject } from 'src/utils';
import * as yup from 'yup';
import { DomainValidationType, UseValidationInputType, UseValidationOutputType } from './types';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

export declare type ValidationKeyValuePiarType = {
  key: string
  value: any
}

export const useValidation = <D extends Record<string, unknown>>(input: UseValidationInputType<D>): UseValidationOutputType<D> => {


  const updateValidationAt: (path: string, value: any) => void = (path, value) => {

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
        console.log(error)
        input.setValidationDomain((prev: DomainValidationType<D>) => {
          return set(tempValidationData, path, error.errors[0])
        })
      })
  }

  /**
   * use this if you need to validate multiple fields which depend on each other.
   *
   **/
  const updateValidationAtMultiple: (list: ValidationKeyValuePiarType[]) => void = (list) => {

    const tempValidationData: DomainValidationType<D> = cloneDeep(input.curValidationDomain)

    const tempDomainData: D = cloneDeep(input.curDomain)

    list.forEach((item: ValidationKeyValuePiarType) => set(tempDomainData, item.key, item.value))

    /**
     * for loop with async/await
     *  - you CANNOT USE forEach with await/async.
     *  - you must use 'for (... of ...)'
     *  - ref: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
     **/
    for (const item of list) {
      try {
        input.schema.validateSyncAt(item.key, tempDomainData)
        set(tempValidationData, item.key, "")
      } catch (error) {
        set(tempValidationData, item.key, error.errors[0])
      }
    }

    input.setValidationDomain(tempValidationData)
  }

  const updateAllValidation: () => void = async () => {

    // copy cur domain state to temp validation state
    const tempEmptyValidationData = cloneDeep(input.defaultValidationDomain)
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

    console.log(tempEmptyValidationData)
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
    updateValidationAtMultiple: updateValidationAtMultiple,
    updateAllValidation: updateAllValidation,
    isValidSync: isValidSync,
  }
}

