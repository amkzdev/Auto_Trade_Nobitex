export const concatWords = (items:string[]) => ''.concat(...items)


export const createFormData = (dataObj: { [key: string]: any }) => {
    var form_data = new FormData();

    for (var key in dataObj) {
        if (typeof dataObj[key] != 'undefined') {

            if (dataObj[key] instanceof File)
                form_data.append(key, dataObj[key]);

            else if (typeof dataObj[key] == 'object')
                form_data.append(key, JSON.stringify(dataObj[key]));

            else
                form_data.append(key, dataObj[key]);
        }
    }

    return form_data
}
