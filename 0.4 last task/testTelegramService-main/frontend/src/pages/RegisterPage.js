import React, {useState} from "react";
import {
    Button,
    Card,
    CardContent,
    TextField,
    FormControl,
    Alert,
    Snackbar,
    Stack,
} from '@mui/material'
import {host} from '../providers/host'
import {
    LogInButton,
    DocButton,
    MenuBar,
    HomeButton
} from "./PageComponents";
import {
    I18nContextProvider,
} from 'react-admin'
import {i18nProvider} from "../providers/i18nProvider";


export const RegisterPage = () => {

    const [open, setOpen] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [alertType, setAlertType] = useState('success')
    const [alertText, setAlertText] = useState('')
    const [userError, setUserError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)

    const handleClick = () => {
        const url = host + '/users'

        const password_confirm_element = document.getElementById('password_confirm')
        const username_element = document.getElementById('username')
        const password_element = document.getElementById('password')
        const phone_element = document.getElementById('phone')

        const phone = phone_element.value
        const username = username_element.value
        const password = password_element.value
        const password_confirm = password_confirm_element.value

        setOpen(true);
        if (!password || !username || !password_confirm || !phone){
            setPasswordError(true)
            setPhoneError(true)
            setUserError(true)
            setAlertType('error')
            setAlertText("Required fields can't be empty")
            return
        }

        if (password !== password_confirm) {
            setPasswordError(true)
            setAlertText("Passwords are not same")
            setAlertType('error')
            return
        }

        const init = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                phone: phone
            })
        }

        fetch(url, init)
            .then(res => res.json())
            .then(json => {
                if (json.response.startsWith('User')) {
                    setUserError(true)
                }

                if (json.response.startsWith('Phone')) {
                    setPhoneError(true)
                }

                setAlertText(json.response)
                setAlertType(json.status ? 'success' : 'error')

                if (json.status) {
                    username_element.value = ""
                    password_confirm_element.value = ""
                    password_element.value = ""
                    phone_element.value = ''
                }
            })
            .catch(() => {
                setAlertType('error')
                setAlertText('Error occurred')
            })
    }

    const handleClose = () => {
        setOpen(false);
        setPasswordError(false)
        setUserError(false)
        setPhoneError(false)
    }

    return (
        <I18nContextProvider value={i18nProvider}>
            <Card style={{textAlign: "center"}}>
                <MenuBar>
                   <HomeButton/>
                   <LogInButton/>
                   <DocButton/>
                </MenuBar>
                <CardContent>
                    <FormControl
                        component={'fieldset'}
                        variant={'standard'}
                        style={{width: "20rem"}}
                    >
                        <TextField
                            id={'username'}
                            variant={'outlined'}
                            label={'Username'}
                            required
                            style={{margin: '15px 0'}}
                            error={userError}
                        />
                        <TextField
                            id={'phone'}
                            label={'Phone'}
                            variant={'outlined'}
                            required
                            style={{margin: '15px 0'}}
                            error={phoneError}
                        />
                        <TextField
                            id={'password'}
                            label={"Password"}
                            variant={'outlined'}
                            style={{margin: '15px 0'}}
                            required
                            error={passwordError}
                        />
                        <TextField
                            id={'password_confirm'}
                            label={"Repeat password"}
                            variant={'outlined'}
                            style={{margin: '15px 0'}}
                            required
                            error={passwordError}
                        />
                        <Stack>
                            <Button
                                type={'submit'}
                                variant={'contained'}
                                color={'primary'}
                                style={{margin: '10px 0'}}
                                onClick={handleClick}
                            >
                                Submit
                            </Button>
                            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert
                                    elevation={6}
                                    variant={'filled'}
                                    onClose={handleClose}
                                    severity={alertType}
                                    sx={{ width: '100%' }}
                                >
                                    {alertText}
                                </Alert>
                            </Snackbar>
                        </Stack>
                    </FormControl>
                </CardContent>
            </Card>
        </I18nContextProvider>
    );
}
