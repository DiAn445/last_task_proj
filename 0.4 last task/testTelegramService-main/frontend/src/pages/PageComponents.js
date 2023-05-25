import {Link} from "react-router-dom";
import {
    useTranslate,
    useLocaleState
} from 'react-admin'
import {
    AppBar,
    Box,
    Button,
    Link as MLink,
    Toolbar,
    Typography,
    Select,
    MenuItem
} from "@mui/material";
import React from "react";


export const HomeButton = () => {
    const translate = useTranslate()
    return (
        <Button color={'success'} variant={'contained'} >
            <Link
                to={'/home'}
                style={{color: 'inherit', textDecoration: "none"}}
            >
                {translate('rest.button.home')}
            </Link>
        </Button>
    )
}

export const RegisterButton = () => {
    const translate = useTranslate()
    return (
            <Button color={'success'} variant={'contained'}>
                <Link
                    to={'/register'}
                    style={{color: 'inherit', textDecoration: "none"}}
                >
                    {translate('rest.button.register')}
                </Link>
            </Button>
    )
}

export const DocButton = () => {
    const translate = useTranslate()
    return (
        <Button color={'success'} variant={'contained'} >
            <MLink
                href={'https://gitlab.com/test_group346/testTelegramService'}
                style={{color: 'inherit', textDecoration: "none"}}
            >
                {translate('rest.button.documentation')}
            </MLink>
        </Button>
    )
}


export const LogInButton = () => {
    const translate = useTranslate()
    return (
        <Button color={'success'} variant={'contained'} >
            <Link
                to={'/account'}
                style={{color: 'inherit', textDecoration: "none"}}
            >
                {translate('rest.button.sign_in')}
            </Link>
        </Button>
    )
}

const LanguageSelect = () => {
    const [locale, setLocale] = useLocaleState()

    const handleChange = (event) => {
        setLocale(event.target.value)
    };

    return (
        <Select
            value={locale}
            label="Age"
            onChange={handleChange}
            defaultValue={locale}
            style={{marginLeft: '10rem', color: 'black'}}
        >
            <MenuItem value={'en'}>English</MenuItem>
            <MenuItem value={'ua'}>Українська</MenuItem>
        </Select>
    )
}

export const MenuBar = ({children}) => (
    <AppBar position={'static'}>
        <Toolbar>
            <Box sx={{ mx: '20%', display: { xs: 'none', sm: 'block' } }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                >
                    TelegramTestService
                </Typography>
            </Box>
            {children}
            <LanguageSelect/>
        </Toolbar>
    </AppBar>
)
