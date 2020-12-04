import Constants from 'expo-constants';
import {Platform} from 'react-native';

const isTestPlatform = Constants.isDevice && __DEV__;
const isAndroidDevice = Platform.OS === 'android';
const isIosDevice = Platform.OS === 'ios';

const AdmobUnitIdObj = {};

if (isAndroidDevice) {
    if (isTestPlatform) {
        AdmobUnitIdObj.interstitialAds = 'ca-app-pub-3940256099942544/8691691433'; // test id
        AdmobUnitIdObj.bannerAds = 'ca-app-pub-3940256099942544/6300978111'; // test id
    } else {
        AdmobUnitIdObj.interstitialAds = 'ca-app-pub-3943461823819564/1141157280'; // prod id
        AdmobUnitIdObj.bannerAds = 'ca-app-pub-3943461823819564/9949585596'; // prod id
    }
} else if (isIosDevice) {
    if (isTestPlatform) {
        AdmobUnitIdObj.interstitialAds = 'ca-app-pub-3940256099942544/5135589807'; // test id
        AdmobUnitIdObj.bannerAds = 'ca-app-pub-3940256099942544/2934735716'; // test id
    } else {
        AdmobUnitIdObj.interstitialAds = 'ca-app-pub-3943461823819564/4508706590'; // prod id
        AdmobUnitIdObj.bannerAds = 'ca-app-pub-3943461823819564/2667003709'; // prod id
    }
} else {
    throw new Error(`not support device platform os: ${Platform.OS}`)
}

export default AdmobUnitIdObj;