import { Flex, Box } from '@chakra-ui/react';
import {Header} from '../Header/Header';


function PageLayout({ showHeader=false, children, ...style }) {

    return (
        <Box
            height='100%'
            minHeight='100vh'
            maxWidth='100vw'
            background='#EBF8FF'
            paddingTop='20px'
            paddingBottom='20px'
            paddingRight={['0px', '20px', '20px', '20px']}
            paddingLeft={['0px', '20px', '20px', '20px']}
            {...style}
        >
            {showHeader && <Header height='7vh' marginBottom='50px'/>}
            <Flex
                width='100%'
                maxWidth='100vw'
                minHeight={(showHeader) ? '93vh' : '100vh'}
                justifySelf='center'
                direction='column'
                align='center'
            >
                {children}
            </Flex>
        </Box>
    );
}

export {PageLayout};