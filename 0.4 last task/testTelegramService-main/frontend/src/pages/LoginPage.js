import {Box} from "@mui/material";
import {Login} from "react-admin";
import {
    HomeButton,
    RegisterButton,
    DocButton,
    MenuBar
} from "./PageComponents";
import React from "react";


export const LoginPage = () => (
    <>
        <MenuBar>
            <Box style={{textAlign: 'center'}} display={'flex'}>
                <HomeButton/>
                <RegisterButton/>
                <DocButton/>
            </Box>
        </MenuBar>
        <Login/>
    </>
)