import React from 'react';
import { bool, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSearchBar } from '@magento/peregrine/lib/talons/SearchBar';

import { useStyle } from '../../classify';
import Autocomplete from './autocomplete';
import SearchField from './searchField';
import defaultClasses from './searchBar.module.css';
import { useIntl } from 'react-intl';

const SearchBar = React.forwardRef((props, ref) => {
    const {
        isOpen,
        quickOrder,
        handleSearchClick,
        value,
        setSearchText,
        searchText,
        placeholder
    } = props;
    const talonProps = useSearchBar();
    const {
        containerRef,
        handleChange,
        handleFocus,
        handleSubmit,
        initialValues,
        isAutoCompleteOpen,
        setIsAutoCompleteOpen,
        valid
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const { formatMessage } = useIntl();

    return (
        <div className={rootClassName} data-cy="SearchBar-root" ref={ref}>
            <div ref={containerRef} className={classes.container}>
                <Form
                    autoComplete="off"
                    className={classes.form}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    <div className={classes.autocomplete}>
                        <Autocomplete
                            setVisible={setIsAutoCompleteOpen}
                            value={value || searchText}
                            valid={valid}
                            visible={isAutoCompleteOpen}
                            quickOrder={quickOrder}
                            handleSearchClick={handleSearchClick}
                        />
                    </div>
                    <div className={classes.search}>
                        <SearchField
                            value={value || searchText}
                            isSearchOpen={isOpen}
                            onChange={e => {
                                handleChange(e);
                                setSearchText && setSearchText(e);
                            }}
                            onFocus={handleFocus}
                            quickOrder={quickOrder}
                            placeholder={formatMessage({
                                id: 'quickOrder.SearchProduct',
                                defaultMessage: 'Enter SKU or name of product'
                            })}
                        />
                    </div>
                </Form>
            </div>
        </div>
    );
});

export default SearchBar;

SearchBar.propTypes = {
    classes: shape({
        autocomplete: string,
        container: string,
        form: string,
        root: string,
        root_open: string,
        search: string
    }),
    isOpen: bool
};
