const str = (obj: any): string => {
  if (obj?.toString === undefined) {
    return ''
  } else {
    return obj.toString()
  }
}

const lower = (o: any): string => {
  return str(o).toLowerCase()
}

export {
  lower
}

export default str
