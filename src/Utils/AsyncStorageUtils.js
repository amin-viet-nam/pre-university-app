import {AsyncStorage} from "react-native";

function getItemObject(key) {
    return AsyncStorage.getItem(key)
        .then((rawData) => {
            try {
                return JSON.parse(rawData);
            } catch (e) {
                return null;
            }
        });
}

function saveItemObject(key, obj) {
    return AsyncStorage.setItem(key, JSON.stringify(obj));
}

export default {
    getItemObject,
    saveItemObject
}