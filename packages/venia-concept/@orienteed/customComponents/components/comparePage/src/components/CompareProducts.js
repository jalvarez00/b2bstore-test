import React, { useMemo } from 'react';
import useCompareProduct from '@orienteed/customComponents/components/comparePage/src/talons/useCompareProduct';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './compareProducts.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import ProductsTable from './ProductsTable';
const CompareProducts = () => {
    const talonProps = useCompareProduct();
    const { productsItems, deleteProduct, isLoading } = talonProps;
    const classes = useStyle(defaultClasses);

    const productsElements = useMemo(() => {
        if (isLoading) {
            return <LoadingIndicator />;
        } else {
            if (productsItems.length === 0) {
                return;
            }
            return <ProductsTable deleteProduct={deleteProduct} productsItems={productsItems} />;
        }
    }, [productsItems]);
    return (
        <div className={classes.root} data-cy="CompareProducts-root">
            <h1 className={classes.heading} data-cy="CompareProductsPage-heading">
                <FormattedMessage id={'compareProductsPage.headingText'} defaultMessage="Compare Products" />
            </h1>
            <div className={classes.productsWrapper} data-cy="compare-products-root">
                <div className={classes.header}>
                    <h2 className={classes.name} data-cy="compare-products-name">
                        <FormattedMessage id={'compareProductsPage.headingText'} defaultMessage="Compare Products" />
                    </h2>
                    <div className={classes.name}>{productsItems.length} items in this list</div>
                </div>
                <div> {productsElements} </div>
            </div>
        </div>
    );
};

export default CompareProducts;
