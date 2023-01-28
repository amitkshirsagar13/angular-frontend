// allowedFilters
const ASCII_FILTER: any = {
    ALPHABETS: {
        range: [
            {
                min: 65, max:90
            },
            {
                min: 97, max:122
            }
        ]
    },
    NUMBERS: {
        range: [
            {
                min: 48, 
                max: 57,
            }
        ]
    },
    NUMBERSWITHDECIMAL: {
        imports: ['NUMBERS'],
        range: [],
        allowedAsciiList: [46]
    },
    ALPHANUMERICS: {
        imports: ['ALPHABETS', 'NUMBERS'],
        range: []
    }
}

export const executeFilters = (event: any, filters: any): Boolean => {
    let isAllowedStroke: Boolean = true;
    if(!filters) {
        return true;
    }
    
    const allowedFilterNames = Object.keys(ASCII_FILTER);
    const verifiedFilters: string[] = [];
    filters?.imports.map((filter: string)=> filter.toUpperCase()).forEach((filter: string) => {
        if(!allowedFilterNames.includes(filter)) {
            console.warn(`Filter ${filter} is not allowed as ASCII filter ${allowedFilterNames}`);
        } else {
            verifiedFilters.push(filter);
        }
    });

    filters.allowedAsciiList = filters.hasOwnProperty('allowedAsciiList') ? filters.allowedAsciiList : [];
    filters.excludedAsciiList = filters.hasOwnProperty('excludedAsciiList') ? filters.excludedAsciiList : [];
    if(verifiedFilters || filters.allowedAsciiList || filters.excludeAsciiList) {
        isAllowedStroke = false;
        verifiedFilters.every((filter) => {
            const asciiFilter = {...ASCII_FILTER[filter]};
            asciiFilter.allowedAsciiList = asciiFilter.hasOwnProperty('allowedAsciiList') ? [...asciiFilter?.allowedAsciiList, ...filters.allowedAsciiList]: [...filters.allowedAsciiList];
            asciiFilter.excludedAsciiList = asciiFilter.hasOwnProperty('excludedAsciiList') ? [...asciiFilter?.excludedAsciiList, ...filters.excludedAsciiList]: [...filters.excludedAsciiList];
            isAllowedStroke = isAllowKeystroke(event, asciiFilter);
            if(isAllowedStroke) {
                return false;
            }
            return true;
        })
    }
    return isAllowedStroke;
}

const isAllowKeystroke = (event:any, filter: any): Boolean => {
    const keyCode = event.keyCode;
    console.debug(`keyCode: ${keyCode}`);
    let allowKeyStroke: Boolean = true;
    if(filter) {
        allowKeyStroke = false;
        const finalFilter: any = prepareFinalFilter(filter);
        if(finalFilter.range) {
            if(finalFilter.range) {
                finalFilter.range.every((range: any)=> {
                    allowKeyStroke = ((!range.min || range.min <= keyCode) && (!range.max ||range.max >= keyCode));
                    if(allowKeyStroke) {
                        return false;
                    }
                    return true;
                });
            }
            if(!allowKeyStroke) {
                allowKeyStroke = finalFilter.allowedAsciiList.includes(keyCode);
            }
            if(allowKeyStroke) {
                allowKeyStroke = !finalFilter.excludedAsciiList.includes(keyCode);
            }
        }
    }
    return allowKeyStroke;
}

const prepareFinalFilter = (filter: any, finalFilter: any = {}) => {
    finalFilter = {
        range:[],
        allowedAsciiList: [],
        excludedAsciiList: []
    }
    if(filter.imports) {
        filter.imports.forEach((imp: string)=> {
            if(ASCII_FILTER[imp].imports) {
                prepareFinalFilter({...ASCII_FILTER[imp]}, finalFilter);
            }
            finalFilter.range.push(...ASCII_FILTER[imp].range) 
        });
    }
    if(filter.allowedAsciiList) finalFilter.allowedAsciiList.push(...filter.allowedAsciiList);
    if(filter.excludedAsciiList) finalFilter.excludedAsciiList.push(...filter.excludedAsciiList);
    finalFilter.range.push(...filter.range);
    return finalFilter;
}

export default { executeFilters };