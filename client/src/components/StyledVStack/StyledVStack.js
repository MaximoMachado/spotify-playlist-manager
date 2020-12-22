import { VStack, StackDivider} from '@chakra-ui/react';

function StyledVStack({ children, ...style }) {
    /**
     * Chakra VStack with some additional styling and responsiveness
     * Props:
     * children {ReactComponent}: Components to display in stack
     */

    return (
        <VStack 
            height={['100%', 'auto', 'auto', 'auto']}
            width={['100%', '75%', '50%', '50%']}
            padding={5} 
            spacing={15} 
            shadow='md' 
            align='flex-start'
            background='#F7FAFC' 
            divider={<StackDivider borderColor="#2D3748" />}
            {...style}
        >
            {children}
        </VStack>
    )
} 

export {StyledVStack};