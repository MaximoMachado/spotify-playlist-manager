import { Flex, Grid } from '@chakra-ui/react';
import {Header} from '../Header/Header';


function PageLayout({ showHeader=false, children, ...style }) {

    return (
        <Grid
            templateRows={(showHeader) ? '7vh 1fr' : '1fr'}
            rows={(showHeader) ? 2 : 1}
            gap={50}
            height='100%'
            minHeight='100vh'
            width='100%'
            background='#EBF8FF'
            {...style}
        >
            {showHeader && <Header />}
            <Flex
                width='100%'
                maxWidth='100vw'
                justifySelf='center'
                direction='column'
                align='center'
            >
                {children}
            </Flex>
        </Grid>
    );
}

export {PageLayout};