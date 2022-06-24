import { useCallback, useState, useEffect } from 'react';
import { useMutation, useApolloClient, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { GET_CART_DETAILS } from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';
import { SAVE_CART, CREATE_CART, MP_SAVE_CART_CONFIG } from './savedCarts.gql';
import { useHistory } from 'react-router-dom';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';

export const useSavedCart = props => {
    const [isShow, setIsShow] = useState(false);
    const [buttonTitle, setButtonTitle] = useState();
    const [isSaveCartLoading, setIsSaveCartLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS);
    const apolloClient = useApolloClient();

    const [{ cartId }, { getCartDetails, createCart }] = useCartContext();

    const [fetchCartId] = useMutation(CREATE_CART);

    const history = useHistory();

    const [getOrienteedSaveCart] = useMutation(SAVE_CART);

    // Popup Open
    const handleSaveCart = useCallback(() => {
        setIsDialogOpen(true);
    }, [setIsDialogOpen]);
    const handleCancelDialog = useCallback(() => {
        setIsDialogOpen(false);
    }, []);

    // Getting Config details
    const { data } = useQuery(MP_SAVE_CART_CONFIG, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    useEffect(() => {
        if (data != undefined) {
            const {
                orienteedSaveCartConfigs: { enabled, button_title }
            } = data;
            if (enabled) {
                setButtonTitle(button_title);
                setIsShow(true);
            }
        }
    }, [data]);

    // Create New Save Cart
    const handleSubmitDialog = useCallback(
        async params => {
            try {
                const { orienteedsavecart_description, orienteedsavecart_name } = params;
                setIsSaveCartLoading(true);
                setErrorMessage(null);
                const {
                    data: { o_orienteedSaveCart }
                } = await getOrienteedSaveCart({
                    fetchPolicy: 'no-cache',
                    variables: {
                        cartId: cartId,
                        cartName: orienteedsavecart_name,
                        description: orienteedsavecart_description
                    }
                });

                if (o_orienteedSaveCart) {
                    await clearCartDataFromCache(apolloClient);
                    await createCart({
                        fetchCartId
                    });

                    await getCartDetails({
                        cartId,
                        fetchCartDetails
                    });
                    setIsSaveCartLoading(false);
                    history.push('/orienteedsavecart');
                }
            } catch (e) {
                let error = e.toString();
                setErrorMessage(error.replace('Error:', ''));
                setIsError(true);
                setIsSaveCartLoading(false);
            }
        },
        [getOrienteedSaveCart, getCartDetails, cartId, fetchCartDetails, fetchCartId, createCart]
    );

    return {
        isShow,
        buttonTitle,
        isSaveCartLoading,
        handleSaveCart,
        isError,
        errorMessage,
        isDialogOpen,
        handleCancelDialog,
        handleSubmitDialog
    };
};
