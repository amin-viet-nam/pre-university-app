import {CommonActions} from '@react-navigation/core';

let _container; // eslint-disable-line

function setContainer(container) {
    _container = container;
}

function reset(routeName, params) {
    _container.dispatch(
        CommonActions.reset({
            index: 0,
            actions: [
                CommonActions.navigate({
                    name: routeName,
                    params: params,
                }),
            ],
        }),
    );
}

function navigate(routeName, params) {
    _container.dispatch(
        CommonActions.navigate({
            name: routeName,
            params: params,
        })
    );
}

function navigateDeep(actions) {
    _container.dispatch(
        actions.reduceRight(
            (prevAction, action) =>
                CommonActions.navigate({
                    name: routeName,
                    params: params,
                }),
            undefined,
        ),
    );
}

function getCurrentRoute() {
    if (!_container || !_container.state.nav) {
        return null;
    }

    return _container.state.nav.routes[_container.state.nav.index] || null;
}

export default {
    setContainer,
    navigateDeep,
    navigate,
    reset,
    getCurrentRoute,
};