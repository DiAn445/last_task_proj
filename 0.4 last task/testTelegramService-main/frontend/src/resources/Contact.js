import React from "react";
import {
    Datagrid,
    TextField
} from 'react-admin'
import {Grid} from '@mui/material'
import {
    TextGridField,
    BoolInfoExpand, ParsableList
} from "../components";


export const ContactExpand = (
    <Grid container spacing={2}>
        <TextGridField source='last_name'/>
        <TextGridField source='status'/>
        <BoolInfoExpand/>
    </Grid>
)


export const ContactsList = (
    <ParsableList>
        <Datagrid expand={ContactExpand}>
            <TextField source='id' sortable={false} />
            <TextField source='first_name' sortable={false} />
        </Datagrid>
    </ParsableList>
)
