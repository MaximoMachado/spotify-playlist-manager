import { propNames } from "@chakra-ui/react";
import {Flex} from '@chakra-ui/react';


function PageLayout({ children }) {

    return (
        <Flex
            direction='column'
            justify='center'
            align='center'
            width='100vw' 
            height='100vh'
            background='#EBF8FF'
        >
            {children}
        </Flex>
    );
}

export {PageLayout};