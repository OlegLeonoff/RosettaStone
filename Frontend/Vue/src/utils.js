const log = (...args) => {  
  if(process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

export { log }