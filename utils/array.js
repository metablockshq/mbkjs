const partition = (array, n) => array.length ?
      [array.splice(0, n)].concat(partition(array, n)) :
      []

export default {partition}
