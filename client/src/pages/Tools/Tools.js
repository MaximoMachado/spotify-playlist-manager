import { Heading, VStack, StackDivider } from "@chakra-ui/react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { Tool } from "../../components/Tool/Tool";

function Tools() {
    return (
        <PageLayout>
            <VStack 
                height={['100%', 'auto', 'auto', 'auto']}
                width={['100%', '75%', '50%', '50%']}
                padding={5} 
                spacing={15} 
                shadow='md' 
                align='flex-start'
                background='#F7FAFC' 
                divider={<StackDivider borderColor="#2D3748" />}
            >
                <Heading color='#1DB954' alignSelf='center'>Spotify Playlist Manager Tools</Heading>
                <Tool 
                    title='Multiple Playlist Searcher (WIP)'
                    desc='This tool looks through your saved playlists for a chosen song and tells you which playlists contain the song.'
                    path='/multiple-playlist-searcher'
                />
                <Tool 
                    title='True Random Shuffle (WIP)'
                    desc='Creates a copy of the selected playlist but with the song ordering shuffled in a purely random manner.'
                    path='/true-random-shuffle'
                />
                <Tool 
                    title='Playlist Set Operations (WIP)'
                    desc='This tool creates a new playlist based on two or more other playlists using set operations, i.e. an intersection would create a playlist containing only songs that are in both playlists.'
                    path='/playlist-set-operations'
                />
                
            </VStack>
        </PageLayout>
    );
}

export {Tools};