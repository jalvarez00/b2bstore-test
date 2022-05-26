import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Info } from 'react-feather';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';

import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import defaultClasses from '@magento/venia-ui/lib/components/Gallery/item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import AddToCartbutton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
// eslint-disable-next-line no-unused-vars
import Rating from '@magento/venia-ui/lib/components/Rating';
import ToolTip from '@orienteed/customComponents/components/ToolTip';

import ShareIcon from './Icons/share.svg';
import InStockIcon from './Icons/inStoke.svg';
import OutStockIcon from './Icons/outStoke.svg';
import { useToasts } from '@magento/peregrine';

import QuantityField from '@orienteed/customComponents/components/QuantityField/quantity';
import Select from './SelectField/select';

import { useHistory } from 'react-router-dom';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const { handleLinkClick, item, wishlistButtonProps, isSupportedProductType } = useGalleryItem(props);
    const { storeConfig, filterState } = props;
    const { configurable_options, stock_status } = props.item;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    console.log('PROPSitem', props);
    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { location } = useHistory();
    const isHomePage = location.pathname === '/';
    const [quantity, setQuantity] = useState(1);
    const [selectedVeriant, setSelectedVeriant] = useState();

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }
    // eslint-disable-next-line no-unused-vars
    const { orParentUrlKey, name, price, price_range, small_image, url_key, url_suffix, rating_summary } = item;

    const { url: smallImageURL } = small_image;

    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const simpleProductLink = `/simple-product?sku=${item.sku}`;
    const {
        minimalPrice: {
            amount: { currency: minimalPriceCurrency, value: minimalPriceValue }
        },
        regularPrice: {
            amount: { value: regularPriceValue }
        }
    } = price;
    const discount = Math.round(100 - (price.minimalPrice?.amount.value / price.regularPrice?.amount.value) * 100);
    const priceRender =
        minimalPriceValue === regularPriceValue ? (
            <div className={classes.price}>
                <Price value={price.regularPrice.amount.value} currencyCode={price.regularPrice.amount.currency} />
            </div>
        ) : (
            <div className={classes.priceWrapper}>
                <div className={classes.oldPrice}>
                    <Price value={price.regularPrice.amount.value} currencyCode={price.regularPrice.amount.currency} />
                </div>
                <div className={`${classes.price} ${classes.newPrice}`}>
                    <Price value={minimalPriceValue} currencyCode={minimalPriceCurrency} />
                </div>
            </div>
        );

    const wishlistButton = wishlistButtonProps ? <WishlistGalleryButton {...wishlistButtonProps} /> : null;

    const addButton = isSupportedProductType ? (
        <AddToCartbutton
            item={selectedVeriant ? { ...selectedVeriant.product, parentSku: selectedVeriant.parentSku } : item}
            urlSuffix={productUrlSuffix}
            quantity={quantity}
        />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;
    // const ratingAverage = rating_summary ? (
    //     <Rating rating={rating_summary} />
    // ) : null;

    const configurableOptions = configurable_options?.map((ele, key) => {
        const values = ele.values.map(({ default_label }) => default_label);
        return (
            <div className={classes.configurableWrapper} key={key + 'configurable_options'}>
                <span className={classes.configrableLabel}>{ele.label}: </span>{' '}
                <ToolTip>
                    <ul className={classes.list}>
                        {values.map(val => (
                            <li key={val}>{val}</li>
                        ))}
                    </ul>
                </ToolTip>
            </div>
        );
    });
    const StokeStatus = ({ status }) => {
        return (
            <>
                {status === 'IN_STOCK' ? (
                    <span className={classes.inStock}>
                        <img src={InStockIcon} alt="in stock" />
                        In stock
                    </span>
                ) : (
                    <span className={classes.outStock}>
                        <img src={OutStockIcon} alt="out stock" />
                        Out of stock
                    </span>
                )}
            </>
        );
    };

    const shareClick = () => {
        navigator.clipboard.writeText(window.origin + productLink);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'quickOrder.copiedUrl',
                defaultMessage: 'The product URL was copied to the clipboard'
            })
        });
    };
    const onChangeQty = value => setQuantity(value);

    const getCategoriesValuesNameByVariant = variant => {
        return variant.attributes.map((attribute, i) => {
            return item.configurable_options[i].values.find(value => value.value_index == attribute.value_index).label;
        });
    };

    const onChangeVariant = e => setSelectedVeriant(JSON.parse(e.target.value));

    const getProductsInstance = () => {
        const instanceItem = { ...item };
        var variants = [...instanceItem?.variants];

        const filterKeys = filterState && [...filterState?.keys()];
        const filterValues = filterState && [...filterState?.values()];
        let newVariants = [];
        if (filterKeys && filterValues) {
            variants?.map(element => {
                element?.attributes?.map(att => {
                    if (filterKeys.includes(att.code)) {
                        filterValues.map(filValue => {
                            for (let valueObject of filValue) {
                                valueObject.value == att.value_index && newVariants.push(element);
                            }
                        });
                    }
                });
            });
            variants = newVariants;
        }
        
        return variants.map((variant, key) => ({
            ...variant,
            categoriesValuesName: getCategoriesValuesNameByVariant(variant),
            parentSku: item.sku,
            value:
                '....' +
                variant.product.sku.slice(variants[0].product.sku.length - 6) +
                ' ' +
                getCategoriesValuesNameByVariant(variant).join(' - ')
        }));
    };

    return (
        <div data-cy="GalleryItem-root" className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.images}>
                <Link
                    onClick={handleLinkClick}
                    to={item.__typename === 'ConfigurableProduct' ? productLink : simpleProductLink}
                >
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        resource={smallImageURL}
                        widths={IMAGE_WIDTHS}
                    />
                </Link>
                {discount ? (
                    <div className={classes.discount}>
                        <span>{discount}%</span>
                    </div>
                ) : null}
                <div onClick={shareClick} className={classes.shareIcon}>
                    <img src={ShareIcon} alt="share icon" />
                </div>
                <div className={classes.stockIcon}>
                    <StokeStatus status={stock_status} />
                </div>
                {ratingAverage}
            </div>
            <Link
                onClick={handleLinkClick}
                to={item.__typename === 'ConfigurableProduct' ? productLink : simpleProductLink}
                className={classes.name}
                data-cy="GalleryItem-name"
            >
                <span>{name}</span>
            </Link>
            <div data-cy="GalleryItem-price" className={classes.price}>
                {!isHomePage && configurableOptions}
                <div className={classes.productPrice}>
                    <span>your price &nbsp;</span>
                    {priceRender}
                </div>
                {/* <Price
                    value={price_range.maximum_price.regular_price.value}
                    currencyCode={
                        price_range.maximum_price.regular_price.currency
                    }
                /> */}
            </div>

            {location.search &&item?.variants&& (
                <div className={classes.productsWrapper}>
                    <div className={classes.qtyField}>
                        <QuantityField value={quantity} onChange={e => onChangeQty(e)} />
                    </div>
                    <div className={classes.productsSelect}>
                        <Select
                            initialValue={'Item'}
                            field={`veriants ${item.sku}`}
                            items={[{ value: 'Item' }, ...getProductsInstance()]}
                            onChange={onChangeVariant}
                        />
                    </div>
                </div>
            )}

            <div className={`${classes.actionsContainer} ${isHomePage && classes.homeActionContainer}`}>
                {addButton}
                {!isHomePage && wishlistButton}
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    })
};

export default GalleryItem;
