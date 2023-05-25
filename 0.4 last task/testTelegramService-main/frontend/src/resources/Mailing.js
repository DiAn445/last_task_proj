import React, {useState} from "react";
import {ParsableList} from "../components";
import {
    Datagrid,
    TextField,
    useTranslate
} from 'react-admin'
import {
    Grid,
    Card,
    CardContent,
    Select,
    TextareaAutosize,
    MenuItem,
    FormControl,
    FormLabel,
    Button
} from "@mui/material";
import {TextGridField} from "../components";


const MailingExpand = () => (
    <Grid container spacing={2}>
        <TextGridField source={'text'}/>
        <TextGridField source={'date'}/>
    </Grid>
)


const MailingList = ({loader, body, onParse, onLoad, emptyText}) => {
    const translate = useTranslate()
    return (
        <ParsableList
            loadBody={body}
            loadButtonText={translate('rest.button.last_mailing')}
            loadMethod={'POST'}
            parseButtonText={translate('rest.button.start_mailing')}
            loadParams={{addressee_loader: loader}}
            additionalHeaders={{
                'Content-Type': 'application/json'
            }}
            onParse={onParse}
            onLoad={onLoad}
            emptyText={emptyText}
        >
            <Datagrid expand={<MailingExpand/>}>
                <TextField source='id' sortable={false} />
                <TextField source='chat.id' sortable={false} />
            </Datagrid>
        </ParsableList>
    )
}


const Message = ({id, mailState, setMailState}) => {

    const translate = useTranslate()

    const handleDelete = () => {
        const newMessageData = mailState.message_data.filter((item) => id !== item.id)
        const newMessages = mailState.messages.filter(item => id !== item.id)
        setMailState({...mailState, message_data: newMessageData, messages: newMessages})
    }

    const handleChange = (event) => {
        setMailState({
            ...mailState,
            messages: [
                ...mailState.messages.filter(item => item.id !== id),
                {id: id, text: event.target.value}
            ]
        })
    }

    return (
        <Card key={id}>
            <CardContent>
                <TextareaAutosize
                    id={id}
                    className={'message_text'}
                    placeholder={translate('rest.label.new_message')}
                    onChange={handleChange}
                />
                <Button
                    onClick={handleDelete}
                >
                    {translate('rest.label.delete_message')}
                </Button>
            </CardContent>
        </Card>
    )
}


export const MailingResourceList = () => {

    const translate = useTranslate()

    const [mailState, setMailState] = useState({
        addressee_loader: 'users_loader',
        messages: [],
        message_data: [],
        new_item_id: 1
    })

    const byLoader = {
        users_loader: 'messages or parsed users',
        chats_loader: 'messages or parsed chats',
        contacts_loader: "messages or parsed contacts"
    }

    const handleChange = (event) => {
        setMailState({...mailState, addressee_loader: event.target.value})
    }

    const handleAdd = () => {
        setMailState({
            ...mailState,
            message_data: [
                ...mailState.message_data,
                {id: mailState.new_item_id}
            ],
            new_item_id: mailState.new_item_id + 1
        })
    }

    const onParse = () => {
        setMailState({
            ...mailState,
            message_data: [],
            messages: []
        })
    }

    return (
        <>
        <Card>
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs={4} />
                    <Grid item xs={5} >
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                                style={{marginBottom: '30px'}}
                            >
                                {translate('rest.label.prepare_mailing')}
                            </FormLabel>
                            <Select
                                id={'addressee_loader'}
                                defaultValue={'users_loader'}
                                value={mailState.addressee_loader}
                                onChange={handleChange}
                                style={{marginBottom: '20px'}}
                            >
                                <MenuItem value={"users_loader"}>
                                    {translate('rest.label.parsed_users')}
                                </MenuItem>
                                <MenuItem value={'chats_loader'}>
                                    {translate('rest.label.parsed_chats')}
                                </MenuItem>
                                <MenuItem value={'contacts_loader'}>
                                    {translate('rest.label.parsed_contacts')}
                                </MenuItem>
                                <MenuItem value={'keyword_loader'}>
                                    {translate('rest.label.parsed_keyword')}
                                </MenuItem>
                            </Select>
                            <Button
                                onClick={handleAdd}
                            >
                                {translate('rest.button.add_new_message')}
                            </Button>
                            {mailState.message_data.map(({id}) => (
                                <Message id={id} mailState={mailState} setMailState={setMailState}/>
                            ))}
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
        <MailingList
            loader={mailState.addressee_loader}
            body={{message_list: mailState.messages.map(item => item.text)}}
            onParse={onParse}
            emptyText={byLoader[mailState.addressee_loader]}
        />
        </>
    )
}
