import { useState, useEffect } from 'react';
import { Flex, Image, Box, Heading, Text } from '@chakra-ui/react';

function Playlist({ playlistData, ...style}) {

    const [playlist, setPlaylist] = useState({});

    useEffect( () => {
        const data = playlistData.data.body;

        const image = (data.images.length > 0) ? data.images[0] : '';

        setPlaylist({
            ...data,
            image: image,
        });

    }, [playlistData])

    return (
        <Flex {...style}>
            <Image src={playlist.image}/>
            <Box>
                <Heading as='a' href={playlist.external_urls.spotify}>
                    {playlist.name}
                </Heading>
                <Text>
                    {playlist.description}
                </Text>
            </Box>
        </Flex>
    )
}

export {Playlist};