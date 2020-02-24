const enumerate = arrMissingParms => {
    let str = '';
    const length = arrMissingParms.length;
    arrMissingParms.forEach((element, i) => {
        str += element;
        if(i < length - 2) {
            str += ', '
        }
        else {
            if(i < length - 1) {
                str += ' and '
            }
        }
    });
    return str;
}

const buildMissingParamsString = arr => {
    let missingParams = [];
    arr.forEach(elem => {
            if(!elem[0]) { 
                missingParams.push(elem[1]) 
        }});
    return missingParams.length === 0 ? '' : 'missing ' + enumerate(missingParams);
}

module.exports = buildMissingParamsString;