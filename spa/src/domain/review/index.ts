/**
 * domain behaviors about review
 *
 **/
export const getStatus: (isVerify: boolean) => string = (isVerify) => {
  return isVerify ? "approved" : "pending"
}
