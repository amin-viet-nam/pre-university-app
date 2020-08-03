import {ViewPager} from '../../node_modules/@ui-kitten/components/ui/viewPager/viewPager.component.js';
const react_native_1 = require("react-native");
const devsupport_1 = require("../../node_modules/@ui-kitten/components/devsupport");

class MyViewPagerComponent extends ViewPager {
    constructor() {
        super(...arguments);
        
        // override this param to set animation time
        this.createOffsetAnimation = (params) => {
            const animationDuration = params.animated ? 90 : 0;
            return react_native_1.Animated.timing(this.contentOffset, {
                toValue: devsupport_1.RTLService.select(-params.offset, params.offset),
                easing: react_native_1.Easing.linear,
                duration: animationDuration,
                useNativeDriver: react_native_1.Platform.OS !== 'web',
            });
        };
    }
}

exports.MyViewPagerComponent = MyViewPagerComponent;
MyViewPagerComponent.defaultProps = {
    selectedIndex: 0,
    shouldLoadComponent: () => true,
};