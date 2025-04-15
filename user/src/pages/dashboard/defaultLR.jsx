// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import EcommerceDataCard from 'components/cards/statistics/EcommerceDataCard';
import EcommerceDataChart from 'sections/widget/chart/EcommerceDataChart';

import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate';
import ProjectOverview from 'sections/widget/chart/ProjectOverview';
import ProjectRelease from 'sections/dashboard/default/ProjectRelease';
import AssignUsers from 'sections/widget/statistics/AssignUsers';

import Transactions from 'sections/widget/data/Transactions';
import TotalIncome from 'sections/widget/chart/TotalIncome';

// assets
import { ArrowDown, ArrowUp, Book, Calendar, CloudChange, Copy, Wallet3 } from 'iconsax-react';
import WelcomeBanner from 'sections/dashboard/default/WelcomeBanner';
import { Image } from 'react-bootstrap';
import useAuth from 'hooks/useAuth';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Grid, InputLabel, Tooltip, IconButton} from "@mui/material"
import { openSnackbar } from 'api/snackbar';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

// SOCIAL MEDIA IMPORTS
import { useEffect, useState } from "react"
import MediaLink from "myComponents/MediaLink"
import ModalVideo from "myComponents/ModalVideo"
import axiosServices from "utils/axios"

export default function DashboardDefault() {
  const theme = useTheme();

  const { user } = useAuth()

  const generateRandomPercentage = (inputValue) => {
    const maxPercentage = inputValue ? parseInt(inputValue) : 0;
    const percentage = Math.random() * maxPercentage;
    return percentage.toFixed(2)
  }

  // SOCIAL MEDIA STATES

  const [content, setContent] = useState()
  const [contentImage, setContentImage] = useState()
  const [contentTEXT, setContentText] = useState()
  // const [user, setUser] = useState({})
  const [referralLink, setReferralLink] = useState()

  const [videoPopup, setVideoPopup] = useState(false)

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'))
    // setUser(user)
    setReferralLink({
      left: `${window.location.origin}/register?refID=${user?.id}&position=L`,
      right: `${window.location.origin}/register?refID=${user?.id}&position=R`
    })
  }, [])

  const handleCloseVideoPopup = async ({ duration, elapsedTime }) => {
    try {

      // if (duration - elapsedTime >= 30) throw "Please watch the full video in order to get tokens!"

      const response = await axiosServices.post(`socialMediaVerification`, { link: content?.youtubeVideo })
      if (response.status !== 200) throw response.data

      openSnackbar({
        open: true,
        message: "Verified Successfully!",
        variant: 'alert',

        alert: {
          color: 'success'
        },

        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transition: 'SlideLeft'
      })

      let user = { ...user, extra: { ...user.extra, youtube: true } }
      window.localStorage.setItem('user', JSON.stringify(user))

    } catch (error) {

      console.log(error)

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
      setVideoPopup(false);
    }
  }

  useEffect(() => {

    (async () => {
      let response = await axiosServices.get("/get-setting-with-name/content")
      if (response.status === 200) {
        setContent(response.data?.result?.extra)

        if (response?.data?.result?.extra?.banner?.length > 0) {
          response = await axiosServices.post("/getObject", { banner: response?.data?.result?.extra?.banner })
          if (response.status === 200) {
            setContentImage(response.data?.result?.url)
          }
        }
      }
    })();

  }, [])

  const openThis = (url) => {
    window.open(url)
  }

  const getLinkedInURL = () => {
    const heading = encodeURIComponent(content?.heading || '');
    const leftReferralLink = encodeURIComponent(referralLink?.left || '');
    const rightReferralLink = encodeURIComponent(referralLink?.right || '');
    const facebookPage = encodeURIComponent(content?.facebookPage || '');
    const twitterPage = encodeURIComponent(content?.twitterPage || '');
    const instagramPage = encodeURIComponent(content?.instagramPage || '');
    const linkedinPage = encodeURIComponent(content?.linkedinPage || '');
    const email = encodeURIComponent(user?.email || '');
    const phoneNumber = encodeURIComponent(user?.phone_number || '');

    const linkedInShareURL = `http://www.linkedin.com/share?text=${heading}%0A%0AJoin Us:%0A${leftReferralLink}%0A${rightReferralLink}%0A%0AFollow Us:%0A${facebookPage}%0A${twitterPage}%0A${instagramPage}%0A${linkedinPage}%0A%0ARefID: ${user?.id}%0A%0AEmail: ${email}%0AMobile: ${phoneNumber}`;
    return linkedInShareURL
  }

  const getTwitterURL = () => {
    const heading = encodeURIComponent(content?.heading || '');
    const facebookPage = encodeURIComponent(content?.facebookPage || '');
    const twitterPage = encodeURIComponent(content?.twitterPage || '');
    const instagramPage = encodeURIComponent(content?.instagramPage || '');
    const linkedinPage = encodeURIComponent(content?.linkedinPage || '');
    const leftReferralLink = encodeURIComponent(referralLink?.left || '');
    const rightReferralLink = encodeURIComponent(referralLink?.right || '');
    const email = encodeURIComponent(user?.email || '');
    const phoneNumber = encodeURIComponent(user?.phone_number || '');

    const twitterShareURL = `http://www.twitter.com/share?text=${heading}%0A%0AFollow Us:%0A${facebookPage}%0A${twitterPage}%0A${instagramPage}%0A${linkedinPage}%0A%0AJoin Us:%0A${leftReferralLink}%0A${rightReferralLink}%0A%0ARefID:${user?.id}%0A${email}%0A${phoneNumber}`;
    return twitterShareURL
  }

  useEffect(() => {
    if (content && user && referralLink) {
      setContentText(content?.heading + "\n\n" + "Connect Socially:" +"\n" + content?.instagramPage + "\n" + content?.facebookPage + "\n" + content?.twitterPage + "\n" + content?.linkedinPage + "\n\n" + "Ref Links:" +"\n"+ referralLink?.left + "\n" + referralLink?.right + "\n\n" + "RefID:" + user?.id + "\n" + "Email:" + user?.email + "\n" + "Number:" + (user?.phone_number || '..........'))
    }
  }, [content, user])

  return (
    <>

      <Grid container rowSpacing={4.5} marginBottom={5}>

        <Grid item xs={12}>
          {
            contentTEXT ? (
              <Grid container xs={12}>
                <Grid item xs={12}>
                  <pre id="contentData">
                    {contentTEXT}
                  </pre>

                  {
                    contentImage
                      ?
                      <Image src={contentImage} width={"100%"} height={300} style={{ marginBottom: "10px" }} />
                      : ""
                  }

                </Grid>
                <Grid item xs={1.5}>
                  <CopyToClipboard
                    text={contentTEXT}
                    onCopy={() =>
                      openSnackbar({
                        open: true,
                        message: 'Text Copied',
                        variant: 'alert',

                        alert: {
                          color: 'success'
                        },

                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        transition: 'SlideLeft'
                      })
                    }
                  >
                    <Tooltip title="Copy">
                      <Button variant={"shadow"}>
                        Copy&nbsp;<Copy />
                      </Button>
                    </Tooltip>
                  </CopyToClipboard>
                </Grid>
                {
                  contentImage
                    ?
                    <Grid item xs={10}>
                      <a href={contentImage} download={true} target="_blank">
                        <Button variant={"contained"}>
                          Download Banner
                        </Button>
                      </a>
                    </Grid>
                    : ""
                }
                {/* <ImageDWNBTN imageUrl={imageUrl} /> */}
              </Grid>
            ) : (
              ""
            )
          }
        </Grid>


        {
          contentTEXT
            ?
            <>

              <Grid item xs={1.5}>
                <Button variant="shadow" onClick={() => openThis(`https://www.facebook.com/sharer/sharer.php?u=${content?.facebookPage}`)}>
                  Facebook
                </Button>
              </Grid>

              <Grid item xs={1.5}>
                <Button variant="shadow" onClick={() => openThis(content?.instagramPage)}>
                  Instagram
                </Button>
              </Grid>

              <Grid item xs={1.5}>
                <Button variant="shadow" onClick={() => openThis(getTwitterURL())}>
                  Twitter
                </Button>
              </Grid>

              <Grid item xs={1.5}>
                <Button variant="shadow" onClick={() => openThis(getLinkedInURL())}>
                  Linkedin
                </Button>
              </Grid>

              <Grid item xs={2}>
                <Button variant="shadow" onClick={() => openThis(content?.telegramPage)}>
                  Join Us Telegram
                </Button>
              </Grid>
            </>
            : "Content not available !!!"
        }

        <Grid xs={12} marginTop={5}>
          {
            contentTEXT ? (
              <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <MediaLink
                  user={user}
                  mediaType={"facebook"}
                  status={user?.extra?.facebook}
                  label={"Facebook Link:"}
                  placeholder={
                    "https://www.facebook.com/xyzhsy/posts/pfbid0wu55hu..."
                  }
                />

                <MediaLink
                  user={user}
                  mediaType={"instagram"}
                  status={user?.extra?.instagram}
                  label={"Instagram Link:"}
                  placeholder={"https://www.instagram.com/xyz/p/C4R6BtDBPRh/..."}
                />

                <MediaLink
                  user={user}
                  mediaType={"x"}
                  status={user?.extra?.x}
                  label={"Twitter Link:"}
                  placeholder={
                    "https://x.com/xyz/status/1766376481746202959?s=20..."
                  }
                />

                <MediaLink
                  user={user}
                  mediaType={"linkedin"}
                  status={user?.extra?.linkedin}
                  label={"Linkedin Link:"}
                  placeholder={
                    "https://www.linkedin.com/posts/jseyehunts_deve..."
                  }
                />


                <Grid item xs={12} rowSpacing={4.5} columnSpacing={2.75}>
                  <Grid container spacing={1}>
                    <ModalVideo
                      show={videoPopup}
                      url={content?.youtubeVideo}
                      onHide={(params) => handleCloseVideoPopup(params)}
                    />
                    <Grid item xs={1.5} marginTop={1.5}>
                      <InputLabel htmlFor="Youtube Link:" style={{ marginBottom: "2" }}>Youtube Link:</InputLabel>
                    </Grid>
                    <Grid item xs={10}>
                      <Button disabled={user?.extra?.youtube} variant={"contained"} onClick={() => setVideoPopup(true)}>{user?.extra?.youtube ? "Verified" : "Watch Video"}</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              ""
            )
          }
        </Grid>
      </Grid >

      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Left Referral Link"
            count={
              <CopyToClipboard
                text={`${window.location.origin}/register?refID=${user?.id}&position=L`}
                onCopy={() =>
                  openSnackbar({
                    open: true,
                    message: 'Left Referral Link Copied',
                    variant: 'alert',

                    alert: {
                      color: 'success'
                    },

                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    transition: 'SlideLeft'
                  })
                }
              >
                <Tooltip title="Copy">
                  <IconButton aria-label="Copy from another element" color="secondary" edge="end" size="medium">
                    <Copy />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            }
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Right Referral Link"
            count={
              <CopyToClipboard
                text={`${window.location.origin}/register?refID=${user?.id}&position=R`}
                onCopy={() =>
                  openSnackbar({
                    open: true,
                    message: 'Right Referral Link Copied',
                    variant: 'alert',

                    alert: {
                      color: 'success'
                    },

                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    transition: 'SlideLeft'
                  })
                }
              >
                <Tooltip title="Copy">
                  <IconButton aria-label="Copy from another element" color="secondary" edge="end" size="medium">
                    <Copy />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            }
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
      </Grid>

      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="User ID"
            count={user?.id}
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Username"
            count={user?.email}
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Status"
            count={user?.status ? "ACTIVE" : "INACTIVE"}
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Date Of Joining"
            count={new Date((user?.created_at || '')).toLocaleDateString()}
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid>
      </Grid>

      {/* <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="SIDE A Business"
            count={user?.extra?.sideA}
            color="success"
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.sideA)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.success.darker} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="SIDE B Business"
            count={user?.extra?.sideB}
            color="success"
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.sideB)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.success.darker} />
          </EcommerceDataCard>
        </Grid>
      </Grid> */}

      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Tokens"
            count={user?.wallet?.toFixed(5)}
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.wallet)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.primary.main} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Total Tokens"
            count={user?.extra?.totalIncome?.toFixed(5)}
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.totalIncome)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.primary.main} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Withdrawals"
            count={user?.extra?.withdrawals}
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.withdrawals)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.primary.main} />
          </EcommerceDataCard>
        </Grid>
        {/* <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Total Investments"
            count={user?.topup}
            iconPrimary={<Wallet3 />}
            percentage={
              <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.topup)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.primary.main} />
          </EcommerceDataCard>
        </Grid> */}
      </Grid>

      {/* <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="ROI Bonus"
            count={user?.extra?.dailyIncome}
            color="warning"
            iconPrimary={<Book color={theme.palette.warning.dark} />}
            percentage={
              <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> {generateRandomPercentage(user?.extra?.dailyIncome)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.warning.dark} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Direct Bonus"
            count={user?.extra?.directIncome}
            color="warning"
            iconPrimary={<Book color={theme.palette.warning.dark} />}
            percentage={
              <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> {generateRandomPercentage(user?.extra?.directIncome)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.warning.dark} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Matching Bonus"
            count={user?.extra?.matchingIncome}
            color="warning"
            iconPrimary={<Book color={theme.palette.warning.dark} />}
            percentage={
              <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> {generateRandomPercentage(user?.extra?.matchingIncome)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.warning.dark} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="VIP Bonus"
            count={user?.extra?.vipIncome}
            color="warning"
            iconPrimary={<Book color={theme.palette.warning.dark} />}
            percentage={
              <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> {generateRandomPercentage(user?.extra?.vipIncome)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.warning.dark} />
          </EcommerceDataCard>
        </Grid>
      </Grid>

      <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Deposits"
            count={user?.extra?.deposits}
            color="success"
            iconPrimary={<Calendar color={theme.palette.success.darker} />}
            percentage={
              <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.deposits)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.success.darker} />
          </EcommerceDataCard>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="Withdrawals"
            count={user?.extra?.withdrawals}
            color="error"
            iconPrimary={<CloudChange color={theme.palette.error.dark} />}
            percentage={
              <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> {generateRandomPercentage(user?.extra?.withdrawals)}%
              </Typography>
            }
          >
            <EcommerceDataChart color={theme.palette.error.dark} />
          </EcommerceDataCard>
        </Grid>
      </Grid> */}


    </>
  );
}
