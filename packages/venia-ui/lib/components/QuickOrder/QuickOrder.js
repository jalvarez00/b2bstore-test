import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './QuickOrder.module.css';
import { Download } from 'react-feather';
import { ArrowDown } from 'react-feather';
import { PlusCircle } from 'react-feather';
import Dialog from '../Dialog';
// import { useAddProductsByCSV } from '../../talons/useAddProductsByCSV';
// import { useAddProductBySku } from '../../talons/QuotePage/useAddProductBySku';
import { useAddProductsByCSV } from '@magento/peregrine/lib/talons/useAddProductsByCSV';
import SearchBar from '../SearchBar';
import TextInput from '../TextInput';
import Quantity from '../CartPage/ProductListing/quantity';
import Icon from '../Icon';
import { CSVLink } from 'react-csv';
let iniArray = [{}, {}, {}];

const AddQuickOrder = props => {
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState(iniArray);
    const [searchText, setSearchText] = useState('');
    const [errorProductsMsg, setErrorProductsMsg] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [uploadData, setUploadData] = useState([]);
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const { handleAddProductsToCart, handleCSVFile } = useAddProductsByCSV({
        setCsvErrorType: setErrorProductsMsg,
        setCsvSkuErrorList: setErrorProductsMsg,
        setIsCsvDialogOpen: () => {},
        setProducts
    });

    useEffect(() => {
        downloadCsv();
    }, [products]);
    const onOrderClick = () => setIsOpen(!isOpen);
    const handleSearchClick = (product, index) => {
        let newProducts = [...products];
        newProducts[index] = product;
        newProducts[index] = {
            ...newProducts[index],
            quantity: 1
        };
        setProducts(newProducts);
    };
    const onChangeQty = (value, index) => {
        let newProducts = [...products];
        newProducts[index] = {
            ...newProducts[index],
            quantity: value
        };
        setProducts(newProducts);
    };

    const formatData = data => {
        let dataValidated = [];
        let productArr = [...data];
        for (let i = 0; i < productArr.length; i++) {
            if (Object.keys(productArr[i]).length > 0) {
                dataValidated.push([productArr[i].sku, productArr[i].quantity]);
            }
        }
        return dataValidated;
    };
    const addToCartClick = () => {
        let dataValidated = formatData(products);
        handleAddProductsToCart(dataValidated);
    };
    const addQuoteClick = () => {
        // let dataValidated = formatData(products);
        // dataValidated.forEach(item => handleAddItemBySku(item[0], item[1]));
    };
    const downloadCsv = () => {
        let newArr = [...products];
        let newData = [];
        newArr.map(item => {
            if (item.name) {
                const { sku, quantity } = item;
                newData.push({
                    sku,
                    quantity
                });
            }
        });
        setCsvData(newData);
    };
    return (
        <>
            <div className={classes.btnContainer}>
                <Button
                    className={classes.orderbtn}
                    onClick={() => onOrderClick()}
                >
                    Quick order Form
                </Button>
            </div>
            <div className={classes.quickOrderDialog}>
                <Dialog
                    title="Quick Order Form"
                    shouldHideCancelButton={true}
                    isOpen={isOpen}
                    shouldShowButtons={false}
                    onCancel={() => setIsOpen(false)}
                    dialogName="DialogContainer"
                >
                    <div>
                        <div className={classes.gridWrapper}>
                            <div>
                                <div className={classes.labalWrapper}>
                                    <div>
                                        <span>Item #</span>
                                    </div>
                                    <div>
                                        <span>Qty</span>
                                    </div>
                                    <div>
                                        <span>Unit</span>
                                    </div>
                                    <div>
                                        <span>Price</span>
                                    </div>
                                </div>
                                <div className={classes.m_1}>
                                    {products.map((item, key) => (
                                        <div
                                            key={key}
                                            className={classes.labalWrapper}
                                        >
                                            <div>
                                                <SearchBar
                                                    isOpen={true}
                                                    handleSearchClick={product =>
                                                        handleSearchClick(
                                                            product,
                                                            key
                                                        )
                                                    }
                                                    setSearchText={
                                                        setSearchText
                                                    }
                                                    searchText={searchText}
                                                    quickOrder={true}
                                                    value={item.name}
                                                />
                                            </div>
                                            <div>
                                                <Quantity
                                                    value={item.quantity}
                                                    fieldName="test"
                                                    min={1}
                                                    quickOrder={true}
                                                    itemId={key}
                                                    onChange={e =>
                                                        onChangeQty(e, key)
                                                    }
                                                    hideButtons={true}
                                                />
                                            </div>
                                            <div>
                                                <TextInput
                                                    field="Unit"
                                                    quickOrder={true}
                                                    disabled
                                                    data-cy="Unit"
                                                />
                                            </div>
                                            <div
                                                className={classes.priceWrapper}
                                            >
                                                {item.price ? (
                                                    <span
                                                        className={
                                                            classes.priceText
                                                        }
                                                    >
                                                        {' '}
                                                        {item.price.regularPrice
                                                            .amount.currency ===
                                                            'USD' && '$'}
                                                        {item.price.regularPrice
                                                            .amount.value *
                                                            item.quantity}{' '}
                                                        net
                                                    </span>
                                                ) : (
                                                    <span
                                                        className={
                                                            classes.spanUnAailable
                                                        }
                                                    >
                                                        Unavailable
                                                    </span>
                                                )}
                                            </div>
                                            {key === products.length - 1 && (
                                                <div>
                                                    <Button
                                                        className={
                                                            classes.downloadBtn
                                                        }
                                                    >
                                                        <Icon
                                                            src={PlusCircle}
                                                            alt="download-icon"
                                                        />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className={classes.uploadContainer}>
                                    <h5 className={classes.uploadHeader}>
                                        Upload your order
                                    </h5>
                                    <p>
                                        Here you can upload own file XLS, XLSX
                                        or CSV and products to cart.
                                    </p>
                                    <Button
                                        onClick={handleCSVFile}
                                        className={classes.orderbtn}
                                    >
                                        Upload your file
                                    </Button>
                                    <CSVLink data={csvData}>
                                        <Button className={classes.downloadBtn}>
                                            <Icon
                                                src={Download}
                                                alt="download-icon"
                                            />
                                            Download your sample file
                                        </Button>
                                    </CSVLink>
                                </div>
                            </div>
                        </div>
                        <div className={classes.btnContainer}>
                            <Button
                                onClick={addToCartClick}
                                className={classes.orderbtn}
                            >
                                Add to cart
                                <Icon src={ArrowDown} alt="arrowDown-icon" />
                            </Button>
                            <Button
                                onClick={addQuoteClick}
                                className={classes.quoteBtn}
                            >
                                Get Quote
                            </Button>
                            <Button className={classes.createOrderBtn}>
                                Create Order
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </>
    );
};

export default AddQuickOrder;
