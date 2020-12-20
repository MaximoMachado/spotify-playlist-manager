import {Flex} from '@chakra-ui/react';


function PageLayout({ children, ...style }) {

    return (
        <Flex
            direction='column'
            justify='center'
            align='center'
            width='100vw' 
            height='100vh'
            background='#EBF8FF'
            {...style}
        >
            {children}
        </Flex>
    );
}

export {PageLayout};