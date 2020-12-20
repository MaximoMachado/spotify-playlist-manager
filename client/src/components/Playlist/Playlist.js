import { useState, useEffect } from 'react';
import { Flex, Image, Box, Heading, Text } from '@chakra-ui/react';
import { ExternalHyperLink } from '../ExternalHyperLink/ExternalHyperLink';

function Playlist({ playlistData, ...style}) {

    const [playlist, setPlaylist] = useState({});

    useEffect(() => {
        const data = playlistData;

        const images = data.images.map(image => `${image.url} ${image.width}w`).join(', ');

        setPlaylist({
            ...data,
            images: images,
        });

    }, [])

    return (
        <Flex {...style}>
            <Image
                alignSelf='center'
                height='90%'
                width='15%'
                marginRight='10px'
                srcSet={playlist.images}
                fallbackSrc={`${process.env.REACT_APP_PUBLIC_URL}/no-image.png`}
            />
            <Box>
                <ExternalHyperLink 
                    component={Heading}
                    externalUrl={(playlist.external_urls !== undefined) ? playlist.external_urls.spotify : null}
                >
                    {playlist.name}
                </ExternalHyperLink>
                <Text>
                    {playlist.description}
                </Text>
            </Box>
        </Flex>
    )
}

export {Playlist};