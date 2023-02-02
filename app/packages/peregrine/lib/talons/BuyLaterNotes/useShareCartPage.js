import { useCallback, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import { SHARE_CART } from './buyLaterNotes.gql';
import CART_OPERATIONS from '../CartPage/cartPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useShareCartPage = async () => {
    const operations = mergeOperations(CART_OPERATIONS);
    const { getCartDetailsQuery } = operations;

    const [isLoading, setIsLoading] = useState(true);
    const [shareCartUpadte, setShareCartUpadte] = useState(1);
    const { pathname } = useLocation();
    const url = pathname.split('/');
    const history = useHistory();

    const [{ cartId }, { getCartDetails }] = useCartContext();

    // Share Cart
    const [getShareCart] = useMutation(SHARE_CART);

    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleShareCart = useCallback(async () => {
        const token = url[5];
        if (shareCartUpadte == 1) {
            const {
                data: { mpSaveCartShareCart }
            } = await getShareCart({
                fetchPolicy: 'no-cache',
                variables: {
                    token: token,
                    cartId: cartId
                }
            });

            if (mpSaveCartShareCart) {
                await getCartDetails({
                    cartId,
                    fetchCartDetails
                });
                setIsLoading(false);
                history.push('/cart');
            }
        }
    }, [getCartDetails, cartId, fetchCartDetails, shareCartUpadte, url, getShareCart, history]);

    useEffect(() => {
        if (!url[5]) {
            setIsLoading(false);
            history.push('/cart');
        } else {
            handleShareCart();
            setShareCartUpadte(2);
        }
    }, [url, handleShareCart, history]);

    return {
        isLoading
    };
};
