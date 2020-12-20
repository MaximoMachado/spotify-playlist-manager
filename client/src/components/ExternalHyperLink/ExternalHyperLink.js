import {Link} from '@chakra-ui/react';

function ExternalHyperLink({ component, children, externalUrl, ...style }) {

    return (
        <component {...style}>
            <Link
                color='#4299E1'
                textDecoration='underline'
                _hover={{ color: '#2C5282', textDecoration: 'none'}}
                href={externalUrl}
                isExternal
            >
                {children}
            </Link>
        </component>
    )
}

export {ExternalHyperLink};