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
    FormControl,
    FormLabel,
    TextField as MuiTextField
} from "@mui/material";
import {ContactExpand} from "./Contact";


const ByKeyList = ({body, onParse}) => (
    <ParsableList
        loadBody={body}
        loadMethod={'POST'}
        additionalHeaders={{
            'Content-Type': 'application/json'
        }}
        onParse={onParse}
    >
        <Datagrid expand={ContactExpand}>
            <TextField source='id' sortable={false} />
            <TextField source='first_name' sortable={false} />
        </Datagrid>
    </ParsableList>
)


export const ByKeyResourceList = () => {

    const [keyState, setKeyState] = useState('')
    const translate = useTranslate()

    const handleChange = (event) => {
        setKeyState(event.target.value)
    }

    const onParse = () => {
        setKeyState('')
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item xs={4} />
                        <Grid item xs={4} >
                            <FormControl fullWidth>
                                <FormLabel
                                    component='legend'
                                    style={{marginBottom: '30px'}}
                                >
                                    {translate('rest.label.keyword')}
                                </FormLabel>
                                <MuiTextField
                                    id="keyword"
                                    label={translate('rest.label.keyword').toLowerCase()}
                                    variant={'outlined'}
                                    onChange={handleChange}
                                    value={keyState}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <ByKeyList
                body={{keyword: keyState}}
                onParse={onParse}
            />
        </>
    )
}
