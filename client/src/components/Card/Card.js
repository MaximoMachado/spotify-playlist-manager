import { useState, useEffect } from 'react';
import { Flex, Image, Heading, Text, } from '@chakra-ui/react';
import { ExternalHyperLink } from '../ExternalHyperLink/ExternalHyperLink';

function Card({ headerText, description, asideText, images, externalUrl, topRight, fullInfo=false, ...style}) {
    /**
     * Basic Card Component to display information
     * Props:
     * headerText {str}: Text to be displayed as header of the card
     * externalUrl {str}: Link attached to headerText
     * description {str}: Text that resides below the header text
     * asideText {str}: Text to be displayed in the bottom right corner of the card
     * images {array}: Array of image objects specified by Spotify API
     * topRight {ReactComponent}: Component to render in top right of Card
     * fullInfo {boolean}: Whether card displays description, asideText, and image
     */
    
    const [srcSet, setSrcSet] = useState('');

    useEffect(() => {
        const formattedSrcSet = images.map(image => {
                const imageWidth = (image.width !== null) ? ` ${image.width}w` : '';

                return `${image.url}${imageWidth}`
            }).join(', ');

        setSrcSet(formattedSrcSet);
    }, [images])

    // TODO Add optional children prop to allow for buttons to be available on card
    return (
        <Flex width='100%' {...style}>
            {fullInfo && <Image
                display={['none', 'none', 'inline', 'inline']}
                alignSelf='center'
                marginTop='5px'
                marginBottom='5px'
                width='15%'
                marginRight='10px'
                srcSet={srcSet}
                fallbackSrc={`${process.env.REACT_APP_PUBLIC_URL}/no-image.png`}
            />}
            <Flex 
                width={['100%', '100%', '85%', '85%']} 
                flexDirection='column' 
                justifyContent='space-between'
            >
                <Flex width='100%' justifyContent='space-between'>
                    <ExternalHyperLink 
                        href={externalUrl}
                        whiteSpace='nowrap'
                        overflow='hidden' 
                    >
                        <Heading 
                            whiteSpace='nowrap'
                            overflow='hidden' 
                            textOverflow='ellipsis'
                        >
                            {headerText}
                        </Heading>
                    </ExternalHyperLink>
                    
                    {topRight}
                </Flex>
                {fullInfo && <>
                    <Text overflow='hidden' textOverflow='ellipsis'>
                        {description}
                    </Text>
                    <Text alignSelf='flex-end'>
                        {asideText}
                    </Text>
                </>}
            </Flex>
        </Flex>
    );
}

export {Card};