import { Heading, } from "@chakra-ui/react";
import { PageLayout } from "../../components/PageLayout/PageLayout";
import { StyledVStack } from "../../components/StyledVStack/StyledVStack";
import { Tool } from "../../components/Tool/Tool";

function Tools() {
    return (
        <PageLayout>
            <StyledVStack >
                <Heading color='#1DB954' alignSelf='center'>Spotify Playlist Manager Tools</Heading>
                <Tool 
                    title='Multiple Playlist Searcher (WIP)'
                    description='This tool looks through your saved playlists for a chosen song and tells you which playlists contain the song.'
                    path='/multiple-playlist-searcher'
                />
                <Tool 
                    title='True Random Shuffle (WIP)'
                    description='Creates a copy of the selected playlist but with the song ordering shuffled in a purely random manner.'
                    path='/true-random-shuffle'
                />
                <Tool 
                    title='Playlist Set Operations (WIP)'
                    description='This tool creates a new playlist based on two or more other playlists using set operations, i.e. an intersection would create a playlist containing only songs that are in both playlists.'
                    path='/playlist-set-operations'
                />
                
            </StyledVStack>
        </PageLayout>
    );
}

export {Tools};