import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import CustomAttributes from '@magento/venia-ui/lib/components/ProductFullDetail/CustomAttributes';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

import defaultClasses from './ProductFullDetailB2C.module.css';
import noImage from './icons/product-package-cancelled.svg';
import NotifyPrice from '../../ProductsAlert/NotifyPrice';
import PriceAlert from '../../ProductsAlert/PriceAlertModal/priceAlert';

const ProductFullDetailB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const productsAlert = useProductsAlert();
    const { isStockModalOpened, handleOpendStockModal, handleCloseModal } = productsAlert;

    const {
        breadcrumbs,
        errors,
        handleAddToCart,
        productDetails,
        priceRender,
        mediaGalleryEntries,
        availableOptions,
        hasOptionsOfTheSelection,
        wishlistButtonProps,
        handleQuantityChange,
        tempTotalPrice,
        cartActionContent,
        customAttributes,
        selectedVarient
    } = props;

    const customAttributesDetails = useMemo(() => {
        const list = [];
        const pagebuilder = [];
        const skuAttribute = {
            attribute_metadata: {
                uid: 'attribute_sku',
                used_in_components: ['PRODUCT_DETAILS_PAGE'],
                ui_input: {
                    ui_input_type: 'TEXT'
                },
                label: formatMessage({
                    id: 'global.sku',
                    defaultMessage: 'SKU'
                })
            },
            entered_attribute_value: {
                value: productDetails.sku
            }
        };
        if (Array.isArray(customAttributes)) {
            customAttributes.forEach(customAttribute => {
                if (customAttribute.attribute_metadata.ui_input.ui_input_type === 'PAGEBUILDER') {
                    pagebuilder.push(customAttribute);
                } else {
                    list.push(customAttribute);
                }
            });
        }
        list.unshift(skuAttribute);
        return {
            list: list,
            pagebuilder: pagebuilder
        };
    }, [customAttributes, productDetails.sku, formatMessage]);

    const shortDescription = productDetails.shortDescription ? (
        <RichContent html={productDetails.shortDescription.html} />
    ) : null;

    const pageBuilderAttributes = customAttributesDetails.pagebuilder.length ? (
        <section className={classes.detailsPageBuilder}>
            <CustomAttributes
                classes={{ list: classes.detailsPageBuilderList }}
                customAttributes={customAttributesDetails.pagebuilder}
                showLabels={false}
            />
        </section>
    ) : null;

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root} data-cy="ProductFullDetail-root" onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName} data-cy="ProductFullDetail-productName">
                        {productDetails.name}
                    </h1>

                    {shortDescription}
                </section>
                <article className={classes.priceContainer}> {priceRender}</article>
                <div className={classes.imageCarousel}>
                    {hasOptionsOfTheSelection ? (
                        <Carousel images={mediaGalleryEntries} carouselWidth={960} />
                    ) : (
                        <div className={classes.noImageContainer}>
                            <img className={classes.noImage} src={noImage} alt="NoImage" />
                        </div>
                    )}
                </div>
                {!hasOptionsOfTheSelection ? (
                    <div className={classes.errorOptionCombination}>
                        <FormattedMessage
                            id="productFullDetail.errorOptionCombination"
                            defaultMessage="This combination of options doesn't exist."
                        />
                    </div>
                ) : null}
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{availableOptions}</section>
                <section className={classes.quantity}>
                    <span data-cy="ProductFullDetail-quantityTitle" className={classes.quantityTitle}>
                        <FormattedMessage id={'global.quantity'} defaultMessage={'Quantity'} />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityStepper
                            fieldName={'quantity'}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                            message={errors.get('quantity')}
                        />
                        <article className={classes.totalPrice}>{tempTotalPrice}</article>
                    </article>
                    <NotifyPrice handleOpendStockModal={handleOpendStockModal} />
                </section>
                <section className={classes.actions}>
                    {cartActionContent}
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>
                <section className={classes.description}>
                    <span data-cy="ProductFullDetail-descriptionTitle" className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </span>
                    <RichContent html={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <CustomAttributes customAttributes={customAttributesDetails.list} />
                </section>
                {pageBuilderAttributes}
            </Form>
            <PriceAlert isOpen={isStockModalOpened} onCancel={handleCloseModal} selectedVarient={selectedVarient} />
        </Fragment>
    );
};

export default ProductFullDetailB2C;
