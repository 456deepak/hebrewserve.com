import { useEffect, useState } from "react";
import { Button } from '@mui/material';
import { openSnackbar } from "api/snackbar";
import axiosServices from "utils/axios";
import { Home3 } from "iconsax-react";
import LoadingButton from "components/@extended/LoadingButton";

export default function ExportCSV({ type }) {

    const [loading, setLoading] = useState()

    const downloadCSV = async () => {
        try {

            setLoading(true)

            openSnackbar({
                open: true,
                message: "Processing your request...",
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            })

            const response = await axiosServices({
                url: 'get-reports-in-csv/' + type,
                method: 'GET',
                responseType: 'blob' // Important for handling binary data
            })

            openSnackbar({
                open: true,
                message: "Downloading...",
                variant: 'alert',

                alert: {
                    color: 'success'
                }
            })

            if (!response?.data?.message) {
                // Create a URL for the CSV file and set up the download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'collection.csv'); // Specify the filename
                document.body.appendChild(link);
                link.click();
                link.remove(); // Clean up the URL object and link element
            }
        } catch (error) {
            openSnackbar({
                open: true,
                message: "Please try again later!",
                variant: 'alert',

                alert: {
                    color: 'error'
                }
            })
        } finally {
            setLoading(false)
        }
    }


    const [isMobileDevice, setIsMobileDevice] = useState(false);

    const handleResize = () => {
        setIsMobileDevice(window.innerWidth <= 768); // You can adjust the width as needed
    };

    useEffect(() => {
        handleResize(); // Set the initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return (
        // <Button
        //     variant="shadow"
        //     onClick={downloadCSV}
        //     style={{ marginBottom: '20px', width: isMobileDevice ? "100%" : "20%" }}>
        //     Export CSV
        // </Button>
        <LoadingButton style={{ marginBottom: '20px', width: isMobileDevice ? "100%" : "20%" }} loading={loading} variant="contained" loadingPosition="start" startIcon={<Home3 />} onClick={downloadCSV}>
            Export CSV
        </LoadingButton>
    )
}