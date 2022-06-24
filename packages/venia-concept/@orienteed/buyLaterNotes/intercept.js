module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = { esModules: true, cssModules: true };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'BuyLaterNotes',
                pattern: '/orienteedsavecart',
                path: '@orienteed/buyLaterNotes/components/SavedCarts'
            },
            {
                name: 'BuyLaterNotes',
                pattern: '/orienteedsavecart/cart/share/id/:token',
                path: '@orienteed/buyLaterNotes/components/ShareCart'
            }
        );
        return routes;
    });

    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.AccountMenu.useAccountMenuItems.wrapWith(
            '@orienteed/buyLaterNotes/talons/useAccountMenuItems'
        );
    });
};
