// material-ui
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup'

// project-imports
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import axios from 'utils/axios';
import LoadingButton from 'components/@extended/LoadingButton';
import { useEffect, useState } from 'react';
import { Home3 } from 'iconsax-react';
import axiosServices from 'utils/axios';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    heading: yup.string().required('Heading is required')
})

// ==============================|| FORM VALIDATION - LOGIN FORMIK  ||============================== //

export default function UpdateContent() {

    const [loading, setLoading] = useState(false)

    const [content, setContent] = useState()

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch content data
    const fetchContentData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosServices.get("/get-setting-with-name/content", {
                timeout: 10000 // 10 seconds timeout
            });
            if (response.status === 200) {
                setContent(response.data?.result?.extra || {});
            } else {
                setError('Failed to fetch content data');
                console.error('API Error:', response?.data);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching content data');
            console.error('Content data fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Set a flag to track if the component is mounted
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await fetchContentData();
            }
        };

        loadData();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [])

    const formik = useFormik({
        initialValues: {
            heading: content?.heading ?? 'Testing...',
            facebookPage: content?.facebookPage ?? 'https://facebook.com',
            telegramPage: content?.telegramPage ?? 'https://telegram.org',
            instagramPage: content?.instagramPage ?? 'https://instagram.com',
            linkedinPage: content?.linkedinPage ?? 'https://linkedin.com',
            twitterPage: content?.twitterPage ?? 'https://x.com',
            first_youtubeVideo: content?.first_youtubeVideo ?? 'https://youtube.com',
            second_youtubeVideo: content?.second_youtubeVideo ?? 'https://youtube.com',
            third_youtubeVideo: content?.third_youtubeVideo ?? 'https://youtube.com',
            facebook_task: content?.facebook_task ?? 'https://facebook.com',
            twitter_task: content?.twitter_task ?? 'https://X.com',
            instagram_task: content?.instagram_task ?? 'https://instagram.com',
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (data) => {
            console.log('Submitting form data:', data);
            setLoading(true);
            try {
                // Add a timeout to the request to prevent hanging
                const response = await axios.post('/update-content/', data, {
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.8',
                        'accept': 'application/json',
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    },
                    timeout: 15000 // 15 seconds timeout
                });

                if (response.status === 200) {
                    openSnackbar({
                        open: true,
                        message: 'Content Saved Successfully',
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    });

                    // Refresh content data after successful update
                    await fetchContentData();
                } else {
                    throw new Error(response.data?.message || 'Failed to update content');
                }
            } catch (error) {
                console.error('Content update error:', error);
                openSnackbar({
                    open: true,
                    message: error?.response?.data?.message || error?.message || 'Something went wrong!',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                });
            } finally {
                setLoading(false);
            }
        }
    });

    // Show loading state
    if (isLoading) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>Loading content data...</Typography>
                </Box>
            </MainCard>
        );
    }

    // Show error state
    if (error) {
        return (
            <MainCard>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', flexDirection: 'column' }}>
                    <Typography variant="h4" color="error" sx={{ mb: 2 }}>Error Loading Content</Typography>
                    <Typography>{error}</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={fetchContentData}>Retry</Button>
                </Box>
            </MainCard>
        );
    }

    return (
        <MainCard>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="Heading">Heading</InputLabel>
                            <TextField
                                fullWidth
                                id="Heading"
                                name="heading"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.heading}
                                onChange={formik.handleChange}
                                error={formik.touched.heading && Boolean(formik.errors.heading)}
                                helperText={formik.touched.heading && formik.errors.heading}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="facebookPage">Facebook Page</InputLabel>
                            <TextField
                                fullWidth
                                id="facebookPage"
                                name="facebookPage"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.facebookPage}
                                onChange={formik.handleChange}
                                error={formik.touched.facebookPage && Boolean(formik.errors.facebookPage)}
                                helperText={formik.touched.facebookPage && formik.errors.facebookPage}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="telegramPage">Telegram Page</InputLabel>
                            <TextField
                                fullWidth
                                id="telegramPage"
                                name="telegramPage"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.telegramPage}
                                onChange={formik.handleChange}
                                error={formik.touched.telegramPage && Boolean(formik.errors.telegramPage)}
                                helperText={formik.touched.telegramPage && formik.errors.telegramPage}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="instagramPage">Instagram Page</InputLabel>
                            <TextField
                                fullWidth
                                id="instagramPage"
                                name="instagramPage"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.instagramPage}
                                onChange={formik.handleChange}
                                error={formik.touched.instagramPage && Boolean(formik.errors.instagramPage)}
                                helperText={formik.touched.instagramPage && formik.errors.instagramPage}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="linkedinPage">Linkedin Page</InputLabel>
                            <TextField
                                fullWidth
                                id="linkedinPage"
                                name="linkedinPage"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.linkedinPage}
                                onChange={formik.handleChange}
                                error={formik.touched.linkedinPage && Boolean(formik.errors.linkedinPage)}
                                helperText={formik.touched.linkedinPage && formik.errors.linkedinPage}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="twitterPage">Twitter Page</InputLabel>
                            <TextField
                                fullWidth
                                id="twitterPage"
                                name="twitterPage"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.twitterPage}
                                onChange={formik.handleChange}
                                error={formik.touched.twitterPage && Boolean(formik.errors.twitterPage)}
                                helperText={formik.touched.twitterPage && formik.errors.twitterPage}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="first_youtubeVideo">1st Youtube Video</InputLabel>
                            <TextField
                                fullWidth
                                id="first_youtubeVideo"
                                name="first_youtubeVideo"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.first_youtubeVideo}
                                onChange={formik.handleChange}
                                error={formik.touched.first_youtubeVideo && Boolean(formik.errors.first_youtubeVideo)}
                                helperText={formik.touched.first_youtubeVideo && formik.errors.first_youtubeVideo}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="second_youtubeVideo">2nd Youtube Video</InputLabel>
                            <TextField
                                fullWidth
                                id="second_youtubeVideo"
                                name="second_youtubeVideo"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.second_youtubeVideo}
                                onChange={formik.handleChange}
                                error={formik.touched.second_youtubeVideo && Boolean(formik.errors.second_youtubeVideo)}
                                helperText={formik.touched.second_youtubeVideo && formik.errors.second_youtubeVideo}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="third_youtubeVideo">3rd Youtube Video</InputLabel>
                            <TextField
                                fullWidth
                                id="third_youtubeVideo"
                                name="third_youtubeVideo"
                                type="text"
                                placeholder="Enter Page URL"
                                value={formik.values.third_youtubeVideo}
                                onChange={formik.handleChange}
                                error={formik.touched.third_youtubeVideo && Boolean(formik.errors.third_youtubeVideo)}
                                helperText={formik.touched.third_youtubeVideo && formik.errors.third_youtubeVideo}
                            />
                        </Stack>
                    </Grid>
                    {/* DAILY TASK FIELD */}

                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="facebook_task">Daily Facebook Task</InputLabel>
                            <TextField
                                fullWidth
                                id="facebook_task"
                                name="facebook_task"
                                type="text"
                                placeholder="Enter Facebook Task URL"
                                value={formik.values.facebook_task}
                                onChange={formik.handleChange}
                                error={formik.touched.facebook_task && Boolean(formik.errors.facebook_task)}
                                helperText={formik.touched.facebook_task && formik.errors.facebook_task}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="instagram_task">Daily Instagram Task</InputLabel>
                            <TextField
                                fullWidth
                                id="instagram_task"
                                name="instagram_task"
                                type="text"
                                placeholder="Enter Instagram Task URL"
                                value={formik.values.instagram_task}
                                onChange={formik.handleChange}
                                error={formik.touched.instagram_task && Boolean(formik.errors.instagram_task)}
                                helperText={formik.touched.instagram_task && formik.errors.instagram_task}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="twitter_task">Daily Twitter Task</InputLabel>
                            <TextField
                                fullWidth
                                id="twitter_task"
                                name="twitter_task"
                                type="text"
                                placeholder="Enter Twitter Task URL"
                                value={formik.values.twitter_task}
                                onChange={formik.handleChange}
                                error={formik.touched.twitter_task && Boolean(formik.errors.twitter_task)}
                                helperText={formik.touched.twitter_task && formik.errors.twitter_task}
                            />
                        </Stack>
                    </Grid>



                    {/* DAILY TASK FIELD END */}
                    {/* <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="banner">Banner</InputLabel>
                            <Input
                                fullWidth
                                id="banner"
                                name="banner"
                                type="file"
                                placeholder="Upload Image"
                                onChange={(event) => {
                                    formik.setFieldValue('banner', event.currentTarget.files[0]);
                                }}
                            />
                        </Stack>
                    </Grid> */}


                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                            {/* <AnimateButton>
                                <Button variant="contained" type="submit">
                                    Update
                                </Button>
                            </AnimateButton> */}
                            <LoadingButton
                                style={{ margin: "2px" }}
                                type="submit"
                                loading={loading}
                                variant="contained"
                                loadingPosition="start"
                                startIcon={<Home3 />}
                                disabled={loading}
                            >
                                Update
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </MainCard>
    );
}
