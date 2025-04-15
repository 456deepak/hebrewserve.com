import { useState } from "react"
import Handler from "./requests"
import { Button, Grid, InputLabel, Stack, TextField } from "@mui/material"
import LoadingButton from "components/@extended/LoadingButton"
import { Home3 } from "iconsax-react"
import axiosServices from "utils/axios"
import { openSnackbar } from "api/snackbar"

export default function MediaLink(props) {

    const [link, setLink] = useState()
    const [status, setStatus] = useState(props?.status)
    const [loading, setLoading] = useState(false)

    const submitForVerification = async (link) => {

        try {

            if (!link || !link.includes(props.mediaType))
                throw { message: "Invalid URL!" }

            setLoading(true)

            const response = await axiosServices.post(`/socialMediaVerification`, { link })
            if (response.status !== 200) throw response.data

            setStatus(true)

            let user = { ...props?.user, extra: { ...props?.user.extra, x: true } }
            window.localStorage.setItem('user', JSON.stringify(user))

            openSnackbar({
                open: true,
                message: response.data?.message,
                variant: 'alert',

                alert: {
                    color: 'success'
                },

                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                transition: 'SlideLeft'
            })

        } catch (error) {

            openSnackbar({
                open: true,
                message: JSON.stringify(error?.message),
                variant: 'alert',

                alert: {
                    color: 'error'
                },

                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                transition: 'SlideLeft'
            })

        } finally {
            setLoading(false)
        }
    }

    return <Grid item xs={12} rowSpacing={4.5} columnSpacing={2.75}>
        <Grid container spacing={1}>
            <Grid item xs={props?.isMobileDevice ? 12 : 1.5} marginTop={1.5}>
                <InputLabel htmlFor={props.label} style={{ marginBottom: "2" }}>{props.label}</InputLabel>
            </Grid>
            {
                !status
                    ?
                    <>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                id={props.label}
                                type="text"
                                placeholder={props.placeholder}
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1} marginTop={0.7}>
                            <LoadingButton
                                loading={loading}
                                onClick={() => submitForVerification(link)}
                                variant="contained" loadingPosition="start" startIcon={<Home3 />}>
                                {status ? "Verified" : "Verify"}
                            </LoadingButton>
                        </Grid>
                    </>
                    : <Grid item xs={1} marginTop={0.7}>
                        <Button
                            disabled={true}
                            variant="contained">
                            Verified
                        </Button>
                    </Grid>
            }

        </Grid>
    </Grid>
}