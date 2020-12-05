import Constants from 'expo-constants';
import * as Device from 'expo-device';
import {Platform} from 'react-native';
import AsyncStorageUtils from "./AsyncStorageUtils";

const isTestPlatform = !Constants.isDevice || !Device.isDevice ||  __DEV__ ;
const isAndroidDevice = Platform.OS === 'android';
const isIosDevice = Platform.OS === 'ios';


const AdmobUtils = {
    shouldShowBannerAds: () => {
        return new Promise(resolve => {
            resolve(true);
        })
    },
    shouldShowInterstitialAds: (waitingSecondsBeforeLastShown) => {
        return Promise.all([
            AsyncStorageUtils.getItemObject('ads_counter'),
            AsyncStorageUtils.getItemObject('ads_last_show')
        ]).then(([adsCounter, adsLastShow]) => {
            const currentTime = new Date().getTime();

            console.log(`timeLeft: ${currentTime - adsLastShow}, counter: ${adsCounter}`)
            if (currentTime - adsLastShow < waitingSecondsBeforeLastShown * 1000) {
                console.log(`hide ads because of currentTime - adsLastShow 
                < waitingSecondsBeforeLastShown * 1000 : ${waitingSecondsBeforeLastShown * 1000}`)
                return false;
            }

            if (currentTime - adsLastShow < 5 * 60 * 1000) {
                if (adsCounter <= 5) {
                    AsyncStorageUtils.saveItemObject('ads_counter', adsCounter + 1);
                    AsyncStorageUtils.saveItemObject('ads_last_show', currentTime);
                    return true;
                } else {
                    console.log(`hide ads because of frequently show`)
                    return false;
                }
            } else {
                AsyncStorageUtils.saveItemObject('ads_counter', 1);
                AsyncStorageUtils.saveItemObject('ads_last_show', currentTime);
                return true;
            }
        });
    }
};

if (isAndroidDevice) {
    if (isTestPlatform) {
        AdmobUtils.mode = 'test';
        AdmobUtils.interstitialAds = 'ca-app-pub-3940256099942544/8691691433'; // test id
        AdmobUtils.bannerAds = 'ca-app-pub-3940256099942544/6300978111'; // test id
    } else {
        AdmobUtils.mode = 'production';
        AdmobUtils.interstitialAds = 'ca-app-pub-3943461823819564/1141157280'; // prod id
        AdmobUtils.bannerAds = 'ca-app-pub-3943461823819564/9949585596'; // prod id
    }
} else if (isIosDevice) {
    if (isTestPlatform) {
        AdmobUtils.mode = 'test';
        AdmobUtils.interstitialAds = 'ca-app-pub-3940256099942544/5135589807'; // test id
        AdmobUtils.bannerAds = 'ca-app-pub-3940256099942544/2934735716'; // test id
    } else {
        AdmobUtils.mode = 'production';
        AdmobUtils.interstitialAds = 'ca-app-pub-3943461823819564/4508706590'; // prod id
        AdmobUtils.bannerAds = 'ca-app-pub-3943461823819564/2667003709'; // prod id
    }
} else {
    throw new Error(`not support device platform os: ${Platform.OS}`)
}

export default AdmobUtils;