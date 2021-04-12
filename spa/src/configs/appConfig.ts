// global app config
declare type appConfigType = {
  baseUrl: string
  debounceTime: number
}

export const appConfig: appConfigType = {
  baseUrl: "https://ec.stsdevweb.com/v1",
  debounceTime: 500,
}
