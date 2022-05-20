module.exports = targets => {
    const builtins = targets.of('@magento/pwa-buildpack');

    builtins.specialFeatures.tap(features => {
        features[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push(
            {
                name: 'CreateAccountNonCustomer',
                pattern: '/create-account-non-customer',
                path: '@orienteed/customComponents/components/CreateAccountNonCustomer'
            },
            {
                name: 'CreateAccountBeCustomer',
                pattern: '/create-account-be-customer',
                path: '@orienteed/customComponents/components/CreateAccountBeCustomer'
            },
            {
                name: 'OrderIncidences',
                pattern: '/order-incidences',
                path: '@orienteed/customComponents/components/OrderIncidences'
            },
            {
                name: 'SimpleProduct',
                pattern: '/simple-product',
                path: '@orienteed/customComponents/components/SimpleProduct'
            }
        );
        return routes;
    });

    // Override Talons
    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;
    talonsTarget.tap(talonWrapperConfig => {
        talonWrapperConfig.AccountMenu.useAccountMenuItems.wrapWith(
            '@orienteed/customComponents/talons/useAccountMenuItems.js'
        );
    });
};
