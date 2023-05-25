import React from "react";
import {
    List, Datagrid,
    TextField
} from 'react-admin'
import {Grid} from '@mui/material'
import {
    TextGridField,
    BoolInfoExpand, ParsableList
} from "../components";


const TelegramUsersExpand = (
    <Grid container spacing={2}>
        <TextGridField source='last_name'/>
        <TextGridField source='status'/>
        <BoolInfoExpand/>
    </Grid>
)


export const TelegramUsersList = (
    <ParsableList>
        <Datagrid expand={TelegramUsersExpand}>
            <TextField source='id' sortable={false} />
            <TextField source='first_name' sortable={false} />
        </Datagrid>
    </ParsableList>
)
