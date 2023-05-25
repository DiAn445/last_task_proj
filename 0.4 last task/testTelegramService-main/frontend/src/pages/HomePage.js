import {
    Card,
    CardContent,
    Box,
    Typography,
    Container,
    Grid
} from "@mui/material";
import React from "react";
import {
    LogInButton,
    DocButton,
    MenuBar,
    RegisterButton
} from "./PageComponents";
import {I18nContextProvider} from 'react-admin'
import {i18nProvider} from "../providers/i18nProvider";


export const HomePage = () => {

    return (
        <I18nContextProvider value={i18nProvider}>
        <Box>
            <MenuBar>
                <Box style={{textAlign: 'center'}} display={'flex'}>
                    <LogInButton/>
                    <RegisterButton/>
                    <DocButton/>
                </Box>
            </MenuBar>
            <Card>
                <CardContent>
                    <Typography style={{width: '50%', margin:' 20px auto'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec nec enim ut dolor venenatis hendrerit.
                        Nunc id orci non arcu ullamcorper rutrum vel nec nisl.
                        Proin dapibus, ante et venenatis feugiat, dui felis scelerisque urna,
                        ut laoreet urna felis ac ligula. Morbi posuere interdum tincidunt.
                        Ut a libero eleifend, finibus mi non, fermentum risus. Morbi vitae posuere nibh.
                        Mauris imperdiet tristique tortor ac lacinia. Aenean aliquet ac tellus non hendrerit.
                        Fusce non placerat orci, sit amet accumsan sem. Morbi tempus luctus lacinia.
                        In mollis, nibh a dapibus ultricies, velit ex dictum leo, non gravida urna augue vel leo.
                        Aliquam dignissim massa ut sapien congue, eu suscipit nibh placerat.
                        Suspendisse eget sapien mi. Aliquam erat volutpat.
                        Quisque massa lorem, suscipit id mauris eu, dapibus volutpat leo.
                        Donec cursus ante rhoncus urna tempor efficitur.
                    </Typography>
                    <Typography style={{width: '50%', margin:' 35px auto'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Donec nec enim ut dolor venenatis hendrerit.
                        Nunc id orci non arcu ullamcorper rutrum vel nec nisl.
                        Proin dapibus, ante et venenatis feugiat, dui felis scelerisque urna,
                        ut laoreet urna felis ac ligula. Morbi posuere interdum tincidunt.
                        Ut a libero eleifend, finibus mi non, fermentum risus. Morbi vitae posuere nibh.
                        Mauris imperdiet tristique tortor ac lacinia. Aenean aliquet ac tellus non hendrerit.
                        Fusce non placerat orci, sit amet accumsan sem. Morbi tempus luctus lacinia.
                        In mollis, nibh a dapibus ultricies, velit ex dictum leo, non gravida urna augue vel leo.
                        Aliquam dignissim massa ut sapien congue, eu suscipit nibh placerat.
                        Suspendisse eget sapien mi. Aliquam erat volutpat.
                        Quisque massa lorem, suscipit id mauris eu, dapibus volutpat leo.
                        Donec cursus ante rhoncus urna tempor efficitur.
                    </Typography>
                </CardContent>
                <Box
                    sx={{
                        width: "100%",
                        height: "auto",
                        backgroundColor: "primary.main",
                        marginTop: '2rem',
                        padding: '10px 0',
                        color: 'white'
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container direction="column" alignItems="center">
                            <Grid item xs={12}>
                                <Typography variant="h5">
                                    TelegramTestService
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">
                                    {new Date().getFullYear()}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Card>
        </Box>
        </I18nContextProvider>
    )
}
