import { useState, useEffect } from 'react';
import {VStack, Checkbox, CheckboxGroup,} from '@chakra-ui/react';


function CheckboxList({ items, onChange, toggleAllText='Select All', ...style }) {
    /**
     * List of checkboxes to be displayed in a container with a scrollbar
     * Props:
     * onChange {function}: Called whenever the checkbox values are changed. Has one argument of values passed in.
     * toggleAllText {str}: String to be displayed next to toggle all checkbox
     * items {array}: Array of objects with three fields
     *              key: Unique identifier of item
     *              value: Checkbox value that gets submitted
     *              name: String to be displayed next to checkbox
     */

    const [values, setValues] = useState([]);
    const [toggleAll, setToggleAll] = useState(false);

    useEffect(() => {
        if (toggleAll) {
            setValues(items.map(item => item.value));
        } else {
            setValues([]);
        }
    }, [toggleAll, items])

    useEffect(() => {
        onChange(values);
    }, [values, onChange])

    return (
        <VStack 
            marginLeft='10px'
            marginRight='10px'
            padding='5px'
            overflowY='scroll'
            overflowX='hidden'
            border='1px'
            borderColor='gray.300'
            alignItems='flex-start'
            {...style}
        >
            <Checkbox 
                fontWeight='bold'
                isChecked={toggleAll}
                onChange={() => setToggleAll(!toggleAll)}
            >
                {toggleAllText}
            </Checkbox>
            <CheckboxGroup 
                value={values}
                onChange={(value) => setValues(value)}
            >
                {items.map(item => {
                    return <Checkbox key={item.key} value={item.value}>{item.name}</Checkbox>
                })}   
            </CheckboxGroup>
        </VStack>
    );
}

export {CheckboxList};