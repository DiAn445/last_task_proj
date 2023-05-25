import React, {useEffect, useState} from "react";
import {
    TextField,
    BooleanField,
    SimpleShowLayout,
    TopToolbar,
    Button,
    List,
    useListController,
    Loading,
    ListContextProvider,
    useResourceContext,
    EmptyClasses,
    useTranslate
} from "react-admin";
import {
    Grid,
    Typography,
} from "@mui/material";
import {
    Download,
    ReadMore
} from "@mui/icons-material";
import {timeout} from "./resources/timeout";
import {host} from "./providers/host";
import Inbox from "@mui/icons-material/Inbox";
import {styled} from "@mui/material/styles";


export const GridWrapper = ({width = 2, children}) => (
    <Grid item xs={width}>
        <SimpleShowLayout>
            {children}
        </SimpleShowLayout>
    </Grid>
)


export const BoolGridField = props => (
    <GridWrapper {...props}>
        <BooleanField source={props.source} emptyText={props.emptyText}/>
    </GridWrapper>
)


export const TextGridField = props => (
    <GridWrapper {...props}>
        <TextField source={props.source} emptyText={props.emptyText}/>
    </GridWrapper>
)


export const BoolInfoExpand = () => (
    <>
        <BoolGridField source='is_verified' emptyText={"Nothing"}/>
        <BoolGridField source='is_fake' />
        <BoolGridField source='is_support'/>
        <BoolGridField source='is_scam'/>
        <BoolGridField source='is_restricted' />
    </>
)


const ProvidedList = ({children, setParsing, queryOptions, setFull, parsing}) => {
    const controller = useListController({queryOptions})

    useEffect(() => {
        fetch(
            host + '/' + controller.resource + '/info',
            {method: "GET", headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }}
        )
            .then(res => res.json())
            .then(json => {
                if (json.finished || !json.in_progress) {
                    setParsing(false)
                    setFull(true)
                }
            })
    }, [controller.isFetching])

    if (parsing && controller?.data?.length === 0) {
        return <Loading/>
    }

    return (
        <ListContextProvider value={controller}>
            {children}
        </ListContextProvider>
    )
}


const Root = styled('span', {
    name: "RaEmpty",
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },

    [`& .${EmptyClasses.toolbar}`]: {
        textAlign: 'center',
        marginTop: '2em',
    },
}));


const Empty = ({message}) => {
    return (
        <Root>
            <div className={EmptyClasses.message}>
                <Inbox className={EmptyClasses.icon} />
                <Typography variant="h4" paragraph>
                    {message}
                </Typography>
            </div>
        </Root>
    )
}



export const ParsableList = (
    {
        children,
        loadButtonText,
        loadParams,
        parseButtonText,
        loadBody,
        loadMethod,
        additionalHeaders,
        onParse,
        onLoad,
        emptyText
    }) => {
    const [parsing, setParsing] = useState(false)
    const [full, setFull] = useState(false)
    const resource = useResourceContext()
    const translate = useTranslate()
    const fetchParams = loadParams ? loadParams : {}
    const loadText = loadButtonText ? loadButtonText : translate('rest.button.load_parsed')
    const parseText = parseButtonText ? parseButtonText : translate('rest.button.parsing_start')
    const body = loadBody ? JSON.stringify(loadBody) : JSON.stringify({})
    const method = loadMethod ? loadMethod : 'GET'
    const headers = additionalHeaders ? additionalHeaders : {}
    const parse = onParse ? onParse : () => {}
    const load = onLoad ? onLoad : () => {}
    const empty = emptyText ? emptyText : resource


    const handleClick = () => {
        setParsing(true)
        setFull(false)

        let url = new URL(host + "/" + resource)
        url.searchParams.append('parsing', 'true')

        Object.entries(fetchParams).forEach(([paramName, paramValue]) => {
            url.searchParams.append(paramName, String(paramValue))
        })

        fetch(url, {
            method: method,
            headers: {
                ...headers,
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: method === 'POST' ? body : undefined
        })
        parse()
    }

    const handleLoad = () => {
        setFull(true)
        load()
    }

    const Actions = () => {
        return (
            <TopToolbar
                style={{marginBottom: '20px'}}
            >
                <Button
                    label={parseText}
                    style={{margin: "0 auto"}}
                    disabled={parsing}
                    onClick={handleClick}
                >
                    <Download/>
                </Button>
                <Button
                    label={loadText}
                    style={{margin: "0 auto"}}
                    disabled={parsing}
                    onClick={handleLoad}
                >
                    <ReadMore/>
                </Button>
            </TopToolbar>
        )
    }

    return (
        <>
            <Actions/>
            {
                parsing
                ? <ProvidedList
                    setParsing={setParsing}
                    parsing={parsing}
                    queryOptions={{
                        refetchIntervalInBackground: true,
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: false,
                        refetchOnMount: false,
                        refetchInterval: timeout * 1000
                    }}
                    setFull={setFull}
                >
                    {children}
                </ProvidedList>
                : null
            }
            {
                full
                ? <List
                    empty={<Empty message={`No ${empty} yet`} />}
                    queryOptions={{
                        refetchOnWindowFocus: false,
                        refetchOnReconnect: false,
                        refetchIntervalInBackground: false,
                    }}
                >
                    {children}
                </List>
                : null
            }
            {
                parsing === full
                ? <Typography
                    style={{margin: "0 auto", marginTop: "20px"}}
                >
                        {translate('rest.label.start_or_load')}
                </Typography>
                : null
            }
        </>
    )
}