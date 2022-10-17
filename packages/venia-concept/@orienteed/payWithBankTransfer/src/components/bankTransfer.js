import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import PayWithBankTransfer from './PayWithBankTransfer';

const PaymentMethods = props => {
    const { onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit, paymentMethodMutationData } = props;
    return (
        <PayWithBankTransfer
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            resetShouldSubmit={resetShouldSubmit}
            shouldSubmit={shouldSubmit}
            paymentMethodMutationData={paymentMethodMutationData}
        />
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    onPaymentSuccess: func,
    onPaymentError: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool.isRequired,
    onPaymentReady: func,
    resetShouldSubmit: func.isRequired
};
