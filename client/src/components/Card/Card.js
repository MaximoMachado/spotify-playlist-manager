import { useState, useEffect } from 'react';
import { Flex, Image, Heading, Text } from '@chakra-ui/react';
import { ExternalHyperLink } from '../ExternalHyperLink/ExternalHyperLink';

function Card({ headerText, description, asideText, images, externalUrl, fullInfo=false, ...style}) {
    /**
     * Basic Card Component to display information
     * Props:
     * headerText {str}: Text to be displayed as header of the card
     * externalUrl {str}: Link attached to headerText
     * description {str}: Text that resides below the header text
     * asideText {str}: Text to be displayed in the bottom right corner of the card
     * images {array}: Array of image objects specified by Spotify API
     * fullInfo {boolean}: Whether card displays description, asideText, and image
     */
    
    const [srcSet, setSrcSet] = useState('');

    useEffect(() => {
        // TODO Figure out way to parse special characters like '&#x27;'
        const formattedSrcSet = images.map(image => {
                const imageWidth = (image.width !== null) ? ` ${image.width}w` : '';

                return `${image.url}${imageWidth}`
            }).join(', ');

        setSrcSet(formattedSrcSet);
    }, [images])

    return (
        <Flex {...style}>
            {fullInfo && <Image
                alignSelf='center'
                height='90%'
                width='15%'
                marginRight='10px'
                srcSet={srcSet}
                fallbackSrc={`${process.env.REACT_APP_PUBLIC_URL}/no-image.png`}
            />}
            <Flex width='100%' flexDirection='column' justifyContent='space-between'>
                <ExternalHyperLink 
                    href={externalUrl}
                >
                    <Heading>{headerText}</Heading>
                </ExternalHyperLink>
                {fullInfo && <>
                    <Text>
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