export const changeCategory = (e, categories, setAttributesFromDB, setCategoryChosen) => {
    const highLevelCategory = e.target.value.split('/')[0];
    const highLevelCategoryAllData = categories.find(category => category.name === highLevelCategory);

    if (highLevelCategoryAllData && highLevelCategoryAllData.attrs) {
        setAttributesFromDB(highLevelCategoryAllData.attrs);
    } else {
        setAttributesFromDB([]);
    }
    setCategoryChosen(e.target.value);
};

export const setValuesForAttrFromDBSelectForm = (e, attrVal, attributesFromDB) => {
    if (e.target.value !== 'Choose attribute') {
        let selectedAttr = attributesFromDB.find(item => item.key === e.target.value);
        let valuesForAttrKeys = attrVal.current;

        if (selectedAttr && selectedAttr.value.length > 0) {
            while (valuesForAttrKeys.options.length) {
                valuesForAttrKeys.remove(0);
            }
            valuesForAttrKeys.options.add(new Option('Choose attribute value'));
            selectedAttr.value.map(item => {
                valuesForAttrKeys.options.add(new Option(item));
                return null;
            });
        }
    }
};

export const setAttributesTableWrapper = (key, val, setAttributesTable) => {
    setAttributesTable(attr => {
        if (attr.length !== 0) {
            let keyExistsInOldTable = false;
            let modifiedTable = attr.map(item => {
                if (item.key === key) {
                    keyExistsInOldTable = true;
                    item.value = val;
                    return item;
                } else {
                    return item;
                }
            });
            if (keyExistsInOldTable) {
                return [...modifiedTable];
            } else {
                return [...modifiedTable, { key: key, value: val }];
            }
        } else {
            return [{ key: key, value: val }];
        }
    });
};