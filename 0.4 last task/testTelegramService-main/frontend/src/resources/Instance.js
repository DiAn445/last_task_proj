import React, {useEffect, useState} from "react";
import {
    Button,
    useNotify,
    useTranslate,
    RecordContextProvider,
    Empty,
    Loading
} from 'react-admin'
import {
    Card,
    Grid,
    CardContent,
    FormLabel
} from "@mui/material";
import {
    BoolGridField,
    TextGridField
} from "../components";
import {host} from "../providers/host";


export const UserInfoField = () => (
    <Grid container spacing={2}>
        <TextGridField source='info.id' width={4}/>
        <TextGridField source='info.first_name' width={4}/>
        <TextGridField source='info.last_name' width={4} emptyText={'Nothing'} />
        <TextGridField source='info.status' width={4}/>
    </Grid>
)


export const Instance = () => {
    const logOutUrl = host + '/instance/log_out'
    const signInUrl = host + '/instance/sign_in'
    const instanceUrl = host + '/instance'

    const [mainData, setMainData] = useState(null);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const translate = useTranslate()
    const notify = useNotify()

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }

    const init = {
        method: 'POST',
        headers: headers
    }

    const handleLogOut = () => {
        setLoading(true)
        fetch(logOutUrl, init)
            .then(res => res.json())
            .then(json => {
                const {ok, info} = json
                notify(ok ?
                    translate('rest.notification.log_out') 
                    : translate('rest.notification.log_out_bad') + " : " + info
                )
            })
            .catch(e => {
                notify(translate('rest.notification.error_occurred'), {type: 'error'})
            }).finally(() => {
                setLoading(false)
                handleMainLoad()
            })
    }

    const handleSignIn = () => {
        setLoading(true)
        fetch(signInUrl, init)
            .then(res => res.json())
            .then(json => {
                const {ok, info} = json
                notify(ok
                    ? translate('rest.notification.code_sent') 
                    : translate('rest.notification.code_sent_bad') + " : " + info
                )
            })
            .catch(e => {
                notify(translate('rest.notification.error_occurred'), {type: 'error'})
            }).finally(() => {
                setLoading(false)
                handleMainLoad()
            })
    }

    const handleCode = () => {
        const url = new URL(signInUrl)
        const code = document.getElementById('code-input').value

        url.searchParams.append('code', code)
        setLoading(true)

        fetch(String(url), {...init, method: 'PATCH'})
            .then(res => res.json())
            .then(json => {
                const {ok, info} = json
                notify(ok
                    ? translate('rest.notification.authorized')
                    : translate('rest.notification.authorized_bad') + " : " + info)
            })
            .catch(e => {
                notify(translate('rest.notification.error_occurred'), {type: 'error'})
            }).finally(() => {
                setLoading(false)
                handleMainLoad()
            })
    }

    const handleMainLoad = () => {
        setLoading(true)
        const url = new URL(instanceUrl)
        fetch(url, {method: "GET", headers: headers})
            .then(res => res.json())
            .then(json => {
                setMainData(json)
                localStorage.setItem('authorized', json.authorized)
            })
            .catch((e) => {
                setError(error)
                notify(translate('rest.notification.instance_bad'))
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(handleMainLoad, [])

    if (!mainData || error) return <Empty resource={'instance'}/>
    if (loading) return <Loading/>

    return (
        <RecordContextProvider value={mainData}>
            <Card>
                <CardContent>
                    <FormLabel
                        component='legend'
                        style={{marginLeft: '20rem'}}
                    >
                        Instance info
                    </FormLabel>
                    <Grid container spacing={2} style={{marginTop: '2rem'}}>
                        <Grid item xs={1}/>
                        <Grid item xs={11}>
                            <Grid container spacing={3}>
                                <TextGridField source="id"  />
                                <TextGridField  source='phone' />
                                <TextGridField  source='authorized' />
                                <BoolGridField  source='code_pending'/>
                            </Grid>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item>
                            <Card style={{padding: "20px"}}>
                                {mainData.authorized

                                    ? <div>
                                        <span>{translate('rest.label.authorized')}</span>
                                        <Button
                                            label={translate('rest.button.log_out')}
                                            color='primary'
                                            onClick={handleLogOut}
                                            disabled={loading}
                                            style={{marginLeft: '30px'}}
                                        />
                                        <UserInfoField />
                                    </div>

                                    : <>
                                        {mainData.code_pending
                                            ? <div>
                                                <span>{translate('rest.label.code_pending')}</span>
                                                <input
                                                    id='code-input'
                                                    style={{margin: '0 20px'}}
                                                />
                                                <Button
                                                    label={translate('rest.button.send_code')}
                                                    color='secondary'
                                                    style={{marginLeft: '30px'}}
                                                    onClick={handleCode}
                                                />
                                            </div>

                                            : <div>
                                                <span>{translate('rest.label.not_authorized')}</span>
                                                <Button
                                                    label={translate('rest.button.sign_in')}
                                                    color="primary"
                                                    style={{marginLeft: '30px'}}
                                                    onClick={handleSignIn}
                                                />
                                            </div>
                                        }
                                    </>
                                }
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </RecordContextProvider>
    )
}
