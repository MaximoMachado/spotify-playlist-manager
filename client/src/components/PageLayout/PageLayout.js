import { Flex, Box } from '@chakra-ui/react';
import {Header} from '../Header/Header';


function PageLayout({ showHeader=false, children, contentStyle={}, ...style }) {

    return (
        <Box
            height='100%'
            minHeight='100vh'
            maxWidth='100vw'
            background='#EBF8FF'
            paddingRight={['0px', '20px', '20px', '20px']}
            paddingLeft={['0px', '20px', '20px', '20px']}
            {...style}
        >
            {showHeader && <Header height='7vh' paddingTop='20px' marginBottom='50px'/>}
            <Flex
                width='100%'
                maxWidth='100vw'
                minHeight={(showHeader) ? '0vh' : '100vh'}
                justifySelf='center'
                direction='column'
                align='center'
                {...contentStyle}
            >
                {children}
            </Flex>
        </Box>
    );
}

export {PageLayout};