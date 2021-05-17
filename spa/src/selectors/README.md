# Selecoters

## pure selectors

## reselect (3rd party library)

### Cache Features & Sharing The Same Reselector

  - Reselect library decide if it should use cache or not is based on the input of reselector function. if the input was not changed, it returned cache, otherwise, recalculate.

    - How Reselect Decide If A State Is Updated Or Not.

      - As far as I debug, reselector does reference comparison (shallow comparison) e.g., just check the object id in terms of immutability.

        - IMPORTANT NOTE:

          - if one of the child prop is updated but not a whole state itself, reselector return false negative. 

            ex)
                query: {
                  prop1: ...,
                  prop2: ...,
                }

                even if you change the 'prop1', an argument of 'query' (e.g., parent) selector for any memorized selector still return the cached value. this is because the 'query' is not updated entirely.

  - you can return new object or mutated object, it does not affect the cache feature. the cache is based on the input of the reselector function (see above statement). 

  - it has cache (size 1) capability. so if its particular portion of state tree hasn't change, it returns cached value. However, if multiple component instances use the same memorized selector instance, you CAN'T use this cache features. since the memorized selector recognized that revieved arguments are different every time when it is called. Therefore, you have to give a copy of momerized selector to each component instance. (I'm not sure it is true when using redux-saga though)

  - you don't need to use memorized selecotr inside redux-saga (read here: https://alexnitta.com/understanding-reselect-and-re-reselect/)




