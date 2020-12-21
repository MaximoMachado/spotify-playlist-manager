import { useState, useEffect } from 'react';
import { Flex, Image, Box, Heading, Text } from '@chakra-ui/react';
import { ExternalHyperLink } from '../ExternalHyperLink/ExternalHyperLink';

function Playlist({ playlistData, fullInfo=true, ...style}) {

    const [playlist, setPlaylist] = useState({});

    useEffect(() => {
        // TODO Figure out way to parse special characters like '&#x27;'
        const data = playlistData;

        const images = data.images.map(image => {
                const imageWidth = (image.width !== null) ? ` ${image.width}w` : '';

                return `${image.url}${imageWidth}`
            }).join(', ');

        setPlaylist({
            ...data,
            images: images,
        });
    }, [playlistData])

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
            <Flex width='100%' flexDirection='column' justifyContent='space-between'>
                <ExternalHyperLink 
                    href={(playlist.external_urls !== undefined) ? playlist.external_urls.spotify : null}
                >
                    <Heading>{playlist.name}</Heading>
                </ExternalHyperLink>
                <Text>
                    {playlist.description}
                </Text>
                <Text alignSelf='flex-end'>
                    Created by {(playlist.owner !== undefined) ? playlist.owner.display_name : null} | {playlist.tracks !== undefined && <>{playlist.tracks.total} Songs</>}
                </Text>
            </Flex>
        </Flex>
    );
}

export {Playlist};