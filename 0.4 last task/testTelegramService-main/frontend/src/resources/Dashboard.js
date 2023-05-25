import {
    Card, CardContent,
    Grid, InputLabel, FormLabel,
    Select, MenuItem, FormControl,
    TextField, TextareaAutosize
} from "@mui/material";
import {
    Title, Button,
    useNotify, RecordContextProvider,
    useTranslate
} from "react-admin";
import {TextGridField} from "../components";
import React, {useState} from "react";
import {host} from "../providers/host";
import {getSendMessage} from "./Chat";


const UserInfoField = ({data}) => (
    <RecordContextProvider value={data}>
        <Grid container spacing={2}>
            <TextGridField source={'id'} width={4}/>
            <TextGridField source={'first_name'} width={4} />
            <TextGridField source={'last_name'} width={4} />
        </Grid>
        <Grid container spacing={2}>
            <TextGridField source={'status'} width={6}/>
            <TextGridField source={'last_online_date'} width={6}/>
        </Grid>
    </RecordContextProvider>
)


const GroupInfoField = ({data}) => (
    <RecordContextProvider value={data}>
        <Grid container spacing={2}>
            <TextGridField source={'id'} width={4}/>
            <TextGridField source={'members_count'} width={4} />
            <TextGridField source={'title'} width={4}/>
            <TextGridField source={'type'} width={4} />
        </Grid>
    </RecordContextProvider>
)


export const Dashboard = () => {
    const chatUrl = host + '/chats'
    const searchUrl = host + '/instance/search_user'
    const hostUrl = new URL(host)

    const translate = useTranslate()
    const notify = useNotify()

    const [dashboardState, setDashboardState] = useState({
        type: 'username',
        search: {},
        group: {},
        message: "",
        message_user_id: ''
    })

    const [loading, setLoading] = useState(false)

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }

    const handleSendMessage = getSendMessage({
        setLoading,
        headers,
        notify,
        translate,
        id: dashboardState.message_user_id,
        message: dashboardState.message
    })

    const handleCreatChat = () => {
        setLoading(true)
        const groupTitle = document.getElementById('group-input').value
        const userId = document.getElementById('group-id-input').value
        const url = new URL(chatUrl)

        url.searchParams.append('chat_name', groupTitle)
        url.searchParams.append('user_id', userId)

        fetch(String(url), {method: 'POST', headers: headers})
            .then(res => res.json())
            .then(json => {
                notify(json.info)
                setDashboardState({
                    ...dashboardState,
                    group: json
                })
            })
            .catch(() => {
                notify(translate('rest.notification.create_chat'))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleSearch = () => {
        setLoading(true)
        const inputType = document.getElementById('search-input').value
        const url = new URL(searchUrl)

        url.searchParams.append(dashboardState.type, inputType)

        fetch(String(url), {method: 'POST', headers: headers})
            .then(res => res.json())
            .then(json => {
                notify(json.info)
                setDashboardState({
                    ...dashboardState,
                    search: json
                })
            })
            .catch(() => {
                notify(translate('rest.notification.search_user'))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleChange = (event) => {
        setDashboardState({
            ...dashboardState,
            type: event.target.value
        })
    };

    const messageChange = (event) => {
        setDashboardState({
            ...dashboardState,
            message: event.target.value
        })
    }

    const messageUserIdChange = (event) => {
        setDashboardState({
            ...dashboardState,
            message_user_id: event.target.value
        })
    }

    return (
        <Card>
            <Title title={translate('rest.label.account_panel')}/>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={1}/>
                    <Grid item xs={4} style={{textAlign: "center"}}>
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                                style={{marginBottom: '10px'}}
                            >
                                {translate('rest.label.search_user')}
                            </FormLabel>
                            <InputLabel>{translate('rest.label.type')}</InputLabel>
                            <Select
                                id="select-type"
                                value={dashboardState.type}
                                onChange={handleChange}
                                style={{marginBottom: '20px'}}
                                defaultValue='username'
                            >
                                <MenuItem
                                    value={'phone'}
                                >
                                    {translate('rest.label.phone_number')}
                                </MenuItem>
                                <MenuItem
                                    value={'username'}
                                >
                                    {translate('rest.label.username')}
                                </MenuItem>
                                <MenuItem
                                    value={'user_id'}
                                >
                                    Id
                                </MenuItem>
                            </Select>
                            <TextField
                                id='search-input'
                                variant='outlined'
                                label={dashboardState.type}
                            />
                            <Button
                                label={translate('rest.label.search')}
                                disabled={loading}
                                onClick={handleSearch}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid
                        item
                        xs={4}
                        style={{textAlign: "center"}}
                    >
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                                style={{marginBottom: '30px'}}
                            >
                                {translate('rest.label.create_chat')}
                            </FormLabel>
                            <TextField
                                id='group-input'
                                label={translate('rest.label.title')}
                                variant='outlined'
                            />
                            <TextField
                                id='group-id-input'
                                label='user-id'
                                variant='outlined'
                            />
                            <Button
                                label={translate('rest.label.create')}
                                disabled={loading}
                                onClick={handleCreatChat}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={1}/>
                    <Grid item xs={4}>
                        {
                            dashboardState.search
                            && Object.keys(dashboardState.search).length > 2
                            && <UserInfoField data={dashboardState.search}/>
                        }
                    </Grid>
                    <Grid item xs={1}/>
                    <Grid item xs={4}>
                        {
                            dashboardState.group
                            && Object.keys(dashboardState.group).length > 2
                            && <GroupInfoField data={dashboardState.group}/>
                        }
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                                style={{marginBottom: '30px'}}
                            >
                                {translate('rest.label.token')}
                            </FormLabel>
                            <TextField
                                value={hostUrl.origin}
                                label={translate('rest.label.host')}
                                disabled={true}
                            />
                            <TextareaAutosize
                                maxRows={5}
                                value={localStorage.getItem('token') || ""}
                                disabled={true}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}/>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <FormLabel
                                component='legend'
                                style={{marginBottom: '30px'}}
                            >
                                {translate('rest.label.send_message')}
                            </FormLabel>
                            <TextField
                                id='message-input-id'
                                variant='outlined'
                                label={"user-id"}
                                onChange={messageUserIdChange}
                            />
                            <TextField
                                id='message-input'
                                variant='outlined'
                                label={"Message"}
                                onChange={messageChange}
                            />
                            <Button
                                label={translate('rest.button.send_message')}
                                disabled={loading}
                                onClick={handleSendMessage}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
