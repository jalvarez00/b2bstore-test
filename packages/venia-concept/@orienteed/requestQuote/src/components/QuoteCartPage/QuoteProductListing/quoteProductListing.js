import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMemo } from 'react';

import {mergeClasses} from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './quoteProductListing.module.css';
import QuoteProduct from './quoteProduct';

const QuoteProductListing = props => {

    const {items, setActiveEditItem, setIsCartUpdating, handleDeleteQuote}=props
  
    const classes = mergeClasses(defaultClasses, props.classes);

    const productComponents = useMemo(() => {
        if (items) {
            return items.map(item => (
                <QuoteProduct
                    key={item.id}
                    item={item}
                    setActiveEditItem={setActiveEditItem}
                    setIsCartUpdating={setIsCartUpdating}
                />
            ));
        }
    }, [items]);

    const deleteQuoteCart =  (
        <Button
            onClick={handleDeleteQuote}
            priority={'low'}
        >
            <FormattedMessage
                id={'quoteProduct.deleteQuoteCart'}
                defaultMessage={'Delete Quote Cart'}
            />
        </Button>
    );

    return (
        <Fragment>
            <ul className={classes.root}>{productComponents}</ul>
            <div className={classes.quoteProductActions}>
                {deleteQuoteCart}
            </div>
        </Fragment>
    );
    
};

export default QuoteProductListing;
