import React, {useState} from "react";
import {
    Datagrid,
    TextField,
    Button,
    useRecordContext,
    useTranslate,
    useNotify,
    FunctionField
} from 'react-admin'
import {host} from "../providers/host";
import {
    TextGridField,
    BoolInfoExpand, ParsableList
} from "../components";
import {
    Grid,
    TextField as MuiTextField,
    FormControl,
    FormLabel
} from "@mui/material";


export const getSendMessage = ({setLoading, id, headers, notify, translate, message}) => {

    const messageUrl = host + '/chats/messages'

    return () => {

        setLoading(true)
        const url = new URL(messageUrl)

        url.searchParams.append('chat_id', id)
        url.searchParams.append('text', message)

        fetch(String(url), {method: 'POST', headers: headers})
            .then(res => res.json())
            .then(json => {
                notify(json.info)
            })
            .catch(() => {
                notify(translate('rest.notification.send_message'))
            })
            .finally(() => {
                setLoading(false)
            })
    }
}


const ChatExpand = () => {
    const record = useRecordContext()
    const [loading, setLoading] = useState(false)
    const [chatState, setChatState] = useState({
        message: '',
        add_member_id: '',
        delete_member_id: '',
    })
    const memberUrl = host + '/chats/members'

    const notify = useNotify()
    const translate = useTranslate()
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }

    const handleAddMember = () => {
        setLoading(true)
        const url = new URL(memberUrl)

        url.searchParams.append('chat_id', String(record.id))
        url.searchParams.append('member_id', chatState.add_member_id)

        fetch(String(url), {method: 'POST', headers: headers})
            .then(res => res.json())
            .then(json => {
                notify(json.info)
            })
            .catch(() => {
                notify(translate("rest.notification.add_member"))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleRemoveMember = () => {
        setLoading(true)
        const url = new URL(memberUrl)

        url.searchParams.append('chat_id', String(record.id))
        url.searchParams.append('member_id', chatState.delete_member_id)

        fetch(String(url), {method: 'DELETE', headers: headers})
            .then(res => res.json())
            .then(json => {
                notify(json.info)
            })
            .catch(() => {
                notify(translate('rest.notification.remove_member'))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleSendMessage = getSendMessage({
        setLoading,
        id: record.id,
        message: chatState.message,
        headers,
        translate,
        notify
    })

    const changeDelete = (event) => {
        setChatState({
            ...chatState,
            delete_member_id: event.target.value
        })
    }

    const changeAdd = (event) => {
        setChatState({
            ...chatState,
            add_member_id: event.target.value
        })
    }

    const changeMessage = (event) => {
        setChatState({
            ...chatState,
            message: event.target.value
        })
    }

    return (
        <Grid container spacing={2}>
            <TextGridField source='type'/>
            <TextGridField source='username'/>
            <TextGridField source='first_name' />
            <TextGridField source='last_name' />
            <TextGridField source='dc_id'/>
            <BoolInfoExpand/>
            <Grid item xs={4}/>
            {
                record.type === 'ChatType.GROUP' &&
                <>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                            >
                                {translate('rest.label.add_member')}
                            </FormLabel>
                            <MuiTextField
                                label='user-id'
                                id={`add-user-id-input${record.id}`}
                                variant='outlined'
                                onChange={changeAdd}
                            />
                            <Button
                                label={translate('rest.button.add_member')}
                                disabled={loading}
                                onClick={handleAddMember}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                            >
                                {translate('rest.label.remove_member')}
                            </FormLabel>
                            <MuiTextField
                                label='user-id'
                                id={`delete-user-id-input${record.id}`}
                                variant='outlined'
                                onChange={changeDelete}
                            />
                            <Button
                                label={translate('rest.button.remove_member')}
                                disabled={loading}
                                onClick={handleRemoveMember}
                            />
                        </FormControl>
                    </Grid>
                </>
            }
            <Grid item xs={4}>
                <FormControl fullWidth>
                    <FormLabel
                        component='legend'
                    >
                        {translate('rest.label.send_message')}
                    </FormLabel>
                    <MuiTextField
                        label={translate('rest.label.message')}
                        id={`message-chat-input${record.id}`}
                        variant={'outlined'}
                        onChange={changeMessage}
                    />
                    <Button
                        label={translate('rest.button.send_message')}
                        disabled={loading}
                        onClick={handleSendMessage}
                    />
                </FormControl>
            </Grid>
        </Grid>
    )
}


export const ChatList = () => (
    <ParsableList>
        <Datagrid expand={ChatExpand}>
            <TextField source='id' sortable={false}/>
            <FunctionField
                label={'Chat Name'}
                render={record => record.title ? record.title : record.first_name}
            />
        </Datagrid>
    </ParsableList>
)
