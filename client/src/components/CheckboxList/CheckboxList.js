import {VStack, Checkbox, CheckboxGroup,} from '@chakra-ui/react';


function CheckboxList({ items, values, onValuesChange, showToggleAll=false, toggleAllChecked, onToggleAll, toggleAllText='Select All', ...style }) {
    /**
     * List of checkboxes to be displayed in a container with a scrollbar
     * Props:
     * values {array}: Selected values from checkboxes
     * onValueChange {function}: Callback when a checkbox changes
     * items {array}: Array of objects with three fields
     *              key: Unique identifier of item
     *              value: Checkbox value that gets submitted
     *              name: String to be displayed next to checkbox
     * showToggleAll {boolean}: Whether or not there is a toggle all button
     * toggleAllChecked {boolean}: Whether or not toggle all checkbox is checked
     * onToggleAll {function}: Called whenever toggle all checkbox is changed
     * toggleAllText {str}: String to be displayed next to toggle all checkbox
     */

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
            {showToggleAll && <Checkbox 
                fontWeight='bold'
                isChecked={toggleAllChecked}
                onChange={() => onToggleAll()}
            >
                {toggleAllText}
            </Checkbox>}
            <CheckboxGroup 
                value={values}
                onChange={(values) => onValuesChange(values)}
            >
                {items.map(item => {
                    return <Checkbox key={item.key} value={item.value}>{item.name}</Checkbox>
                })}   
            </CheckboxGroup>
        </VStack>
    );
}

export {CheckboxList};