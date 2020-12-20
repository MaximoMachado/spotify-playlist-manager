import {Link} from '@chakra-ui/react';

function ExternalHyperLink({ component, children, href, ...style }) {

    return (
        <component {...style}>
            <Link
                color='#4299E1'
                textDecoration='underline'
                _hover={{ color: '#2C5282', textDecoration: 'none'}}
                href={href}
                isExternal
            >
                {children}
            </Link>
        </component>
    )
}

export {ExternalHyperLink};