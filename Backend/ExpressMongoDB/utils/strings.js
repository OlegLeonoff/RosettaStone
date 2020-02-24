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

// const { email, password } = req.body;
// const errorStr = buildMissingParamsString({ email, password }); -> 'missing email and password'


const getMissingParams = paramsObj => {	
    return Object.keys(paramsObj).filter(key => !paramsObj[key]);
}

const buildMissingParamsString = paramsObj => {
    let missingParams = getMissingParams(paramsObj);
    return missingParams.length === 0 ? '' : 'missing ' + enumerate(missingParams);
}

module.exports = buildMissingParamsString;