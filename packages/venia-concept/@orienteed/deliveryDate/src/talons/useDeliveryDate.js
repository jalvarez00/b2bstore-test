import { useMutation, useQuery } from '@apollo/client';
import { useReducer, useMemo } from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from '../graphql/deliveryDate.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
const deliveryDatesData = {
    mp_delivery_date: '',
    mp_delivery_time: '',
    mp_house_security_code: '',
    mp_delivery_comment: ''
};
function reducer(state, action) {
    switch (action.type) {
        case 'mp_delivery_date':
            return { ...state, mp_delivery_date: action.value };
        case 'mp_delivery_time':
            return { ...state, mp_delivery_time: action.value };
        case 'mp_house_security_code':
            return { ...state, mp_house_security_code: action.value };
        case 'mp_delivery_comment':
            return { ...state, mp_delivery_comment: action.value };
        default:
            throw new Error();
    }
}

export const useDeliveryDate = () => {
    const [state, dispatch] = useReducer(reducer, deliveryDatesData);
    const operations = mergeOperations(DEFAULT_OPERATIONS);

    const handleChange = (name, value) => {
        dispatch({ type: name, value });
    };

    const { GET_DELIVERY_DATES, SET_DELIVERY_TIME, GET_LOCALE } = operations;

    const { data } = useQuery(GET_LOCALE, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const local = useMemo(() => {
        return data && data.storeConfig.locale;
    }, [data]);
    const [{ cartId }] = useCartContext();

    const { data: deliveryDates } = useQuery(GET_DELIVERY_DATES, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const [deliverytime] = useMutation(SET_DELIVERY_TIME);
    const deliveryDatesIsActivated = useMemo(() => {
        if (deliveryDates?.deliveryTime) {
            return Object.keys(deliveryDates?.deliveryTime).every(
                ele => deliveryDates.deliveryTime[ele] || deliveryDates.deliveryTime[ele] === ''
            );
        }
    }, [deliveryDates]);
    const submitDeliveryDate = async () => {
        await deliverytime({
            variables: {
                cart_id: cartId,
                mp_delivery_time: state
            }
        });
    };

    return {
        deliveryDates,
        submitDeliveryDate,
        deliveryDatesData: state,
        handleChange,
        local,
        deliveryDatesIsActivated
    };
};
