import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import operations from '@magento/peregrine/lib/talons/Gallery/addToCart.gql';
import {
    ADD_CONFIGURABLE_MUTATION,
    GET_PARENT_SKU
} from '@orienteed/customComponents/query/addProductByCsv.gql';
/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.__typename - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = [
    'VirtualProduct',
    'BundleProduct',
    'GroupedProduct',
    'DownloadableProduct'
];

export const useAddToCartButton = props => {
    const { item, urlSuffix, quantity } = props;

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';
    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(
        productType
    );
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;
    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [addToCart] = useMutation(operations.ADD_ITEM);

    const [addConfigurableProductToCart] = useMutation(
        ADD_CONFIGURABLE_MUTATION
    );

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
                setIsLoading(true);

                await addConfigurableProductToCart({
                    variables: {
                        cartId,
                        quantity: quantity || 1,
                        sku: item.sku,
                        parentSku: item.parentSku
                    }
                });

                // await addToCart({  NOTE : USE addConfigurableProductToCart method
                //     variables: {
                //         cartId,
                //         cartItem: {
                //             quantity: quantity || 1,
                //             entered_options: [
                //                 {
                //                     uid: item.uid,
                //                     value: item.name
                //                 }
                //             ],
                //             sku: item.sku
                //         }
                //     }
                // });

                setIsLoading(false);
            } else if (productType === 'ConfigurableProduct') {
                history.push(`${item.url_key}${urlSuffix || ''}`);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        addToCart,
        cartId,
        history,
        item.sku,
        item.url_key,
        productType,
        item.uid,
        item.name,
        urlSuffix
    ]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
