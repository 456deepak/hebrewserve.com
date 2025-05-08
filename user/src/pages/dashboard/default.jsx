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
import { Button, Grid, InputLabel, Tooltip, IconButton } from "@mui/material"
import { openSnackbar } from 'api/snackbar';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

// SOCIAL MEDIA IMPORTS
import { useEffect, useState } from "react"
import MediaLink from "myComponents/MediaLink"
import ModalVideo from "myComponents/ModalVideo"
import axiosServices from "utils/axios"
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import HelpBox from 'myComponents/HelpBox';

export default function DashboardDefault() {

  // MEDIA QUERIES FOR DETECHING MOBILE VIEW

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const handleResize = () => {
    setIsMobileDevice(window.innerWidth <= 768); // You can adjust the width as needed
  };

  useEffect(() => {
    handleResize(); // Set the initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  // MEDIA ENDS


  const theme = useTheme();

  const { user: userData } = useAuth()

  const generateRandomPercentage = (inputValue) => {
    const maxPercentage = inputValue ? parseInt(inputValue) : 0;
    const percentage = Math.random() * maxPercentage;
    return percentage.toFixed(2)
  }

  // SOCIAL MEDIA STATES

  const [content, setContent] = useState()
  const [contentImage, setContentImage] = useState()
  const [contentTEXT, setContentText] = useState()
  const [user, setUser] = useState({})
  const [referralLink, setReferralLink] = useState('')

  const [videoPopup, setVideoPopup] = useState({
    show: false,
    url: null,
    type: ''
  })

  const [downline, setDownline] = useState(0)

  const fetchDownline = async () => {
    try {
      let response = await axiosServices.get("/get-user-downline-length")
      if (response.status !== 200) throw response
      setDownline(response.data?.result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (window !== undefined)
      fetchDownline()
  }, [])

  useEffect(() => {
    setUser(userData)
    setReferralLink(`${window.location.origin}/register?refID=${userData?.id}`)
  }, [])

  const handleCloseVideoPopup = async ({ duration, elapsedTime, setElapsedTime }) => {
    try {

      if (duration - elapsedTime >= 10) throw "Please watch the full video in order to get tokens!"

      const response = await axiosServices.post(`socialMediaVerification`, { link: videoPopup?.type })
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

      setUser(old => {
        return {
          ...old,
          extra: {
            ...old.extra,
            [`${videoPopup.type}`]: true
          }
        }
      })


    } catch (error) {

      console.log(error)

      openSnackbar({
        open: true,
        message: JSON.stringify(error),
        variant: 'alert',

        alert: {
          color: 'error'
        },

        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transition: 'SlideLeft'
      })

    } finally {
      setElapsedTime(0)
      setVideoPopup({
        show: false
      });
    }
  }

  // useEffect(() => {
  //   // let user = { ...user, extra: { ...user.extra, [`extra.${videoPopup.type}`]: true } }
  //   window.localStorage.setItem('user', JSON.stringify(user))
  // }, [user])

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

  const openThis = (url) => window.open(url)

  const openThis_UpdateDB = async (type, url) => {

    try {
      openThis(url)

      const response = await axiosServices.post(`socialMediaVerification`, { link: type })
      if (response.status !== 200) throw response.data

      openSnackbar({
        open: true,
        message: response.data.message,
        variant: 'alert',

        alert: {
          color: 'success'
        },

        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transition: 'SlideLeft'
      })

      setUser(old => {
        return {
          ...old,
          extra: {
            ...old.extra,
            [`${type}`]: true
          }
        }
      })

    } catch (error) {
      openSnackbar({
        open: true,
        message: JSON.stringify(error),
        variant: 'alert',

        alert: {
          color: 'error'
        },

        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transition: 'SlideLeft'
      })
    }
  }

  const getLinkedInURL = () => {
    const heading = encodeURIComponent(content?.heading || '');
    const referralLink_coded = encodeURIComponent(referralLink || '');
    const facebookPage = encodeURIComponent(content?.facebookPage || '');
    const twitterPage = encodeURIComponent(content?.twitterPage || '');
    const instagramPage = encodeURIComponent(content?.instagramPage || '');
    const linkedinPage = encodeURIComponent(content?.linkedinPage || '');
    const email = encodeURIComponent(user?.email || '');
    const phoneNumber = encodeURIComponent(user?.phone_number || '');

    const linkedInShareURL = `http://www.linkedin.com/share?text=${heading}%0A%0AJoin Us:%0A${referralLink_coded}%0A%0AFollow Us:%0A${facebookPage}%0A${twitterPage}%0A${instagramPage}%0A${linkedinPage}%0A%0ARefID: ${user?.id}%0A%0AEmail: ${email}%0AMobile: ${phoneNumber}`;
    return linkedInShareURL
  }

  const getTwitterURL = () => {
    const heading = encodeURIComponent(content?.heading || '');
    const facebookPage = encodeURIComponent(content?.facebookPage || '');
    const twitterPage = encodeURIComponent(content?.twitterPage || '');
    const instagramPage = encodeURIComponent(content?.instagramPage || '');
    const linkedinPage = encodeURIComponent(content?.linkedinPage || '');
    const referralLink_coded = encodeURIComponent(referralLink || '');
    const email = encodeURIComponent(user?.email || '');
    const phoneNumber = encodeURIComponent(user?.phone_number || '');

    const twitterShareURL = `http://www.twitter.com/share?text=${heading}%0A%0AFollow Us:%0A${facebookPage}%0A${twitterPage}%0A${instagramPage}%0A${linkedinPage}%0A%0AJoin Us:%0A${referralLink_coded}%0A%0ARefID:${user?.id}%0A${email}%0A${phoneNumber}`;
    return twitterShareURL
  }

  useEffect(() => {
    if (content && user && referralLink) {
      setContentText(
        content?.heading
        + "\n\n" +
        "Ref Link: " + referralLink + "\n" +
        "Number: " + (user?.phone_number || '..........')
        // + "\n" +
        // "Register Link: " + window.location.origin
        + "\n\n" +
        "Connect Socially:"
        + "\n" + content?.instagramPage
        + "\n" + content?.facebookPage
        + "\n" + content?.twitterPage
        + "\n" + content?.linkedinPage
        // + "\n\n" +
        // "Ref Link: "
        // + "\n" + referralLink
        + "\n\n"
      )
    }
  }, [content, user])

  // useEffect(() => {
  //   console.log(user)
  // }, [user])


  /**
   * Help Box
   */

  const [helpBox, setHelpBox] = useState({
    status: false,
    url: null
  })


  return (
    <>

      <ModalVideo
        show={videoPopup?.show}
        url={videoPopup?.url}
        onHide={(params) => handleCloseVideoPopup(params)}
      />

      <HelpBox
        show={helpBox?.status}
        url={isMobileDevice ? helpBox?.mobile_url : helpBox?.url}
        openThis={openThis}
        setHelpBox={setHelpBox}
        isMobileDevice={isMobileDevice}
      />

      <Grid container rowSpacing={4.5} marginBottom={5}>

        <Grid item xs={12}>
          <h2 style={{ padding: "10px", borderRadius: "10px" }}>Promotional Daily Post</h2>
          {
            contentTEXT ? (
              <Grid container xs={12} style={{ padding: "10px", borderRadius: "10px" }}>
                {/* <pre id="contentData" style={{ whiteSpace: 'pre-wrap' }}>
                    {contentTEXT}
                  </pre> */}
                <Grid item xs={12}>

                  {
                    contentImage
                      ?
                      <Image src={contentImage} width={isMobileDevice ? "100%" : "50%"} height="auto" style={{ marginBottom: "10px" }} />
                      : <Image src='/assets/banners/bannerDefault.jpg' width={isMobileDevice ? "100%" : "100%"} height="auto" style={{ marginBottom: "10px" }} />
                  }


                </Grid>
                {/* <Grid item xs={6}>

                  {

                    <Image src="/assets/banners/CVTOKENBB.jpeg" width={isMobileDevice ? "100%" : "50%"} height="81%" style={{ marginBottom: "10px" ,marginLeft:"77px"}} />

                  }


                </Grid> */}
                <Grid item xs={isMobileDevice ? 12 : 2} marginBottom={isMobileDevice ? 2 : 5}>
                  <CopyToClipboard
                    text={referralLink}
                    onCopy={() =>
                      openSnackbar({
                        open: true,
                        message: 'Referral Link Copied',
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
                      <Button variant={"shadow"} style={{ width: isMobileDevice ? "100%" : "auto" }}>
                        {isMobileDevice ?
                          <>
                            <Copy />&nbsp;Ref Link
                          </>
                          : "Copy Referral Link"}
                      </Button>
                    </Tooltip>
                  </CopyToClipboard>
                </Grid>

                <Grid item xs={isMobileDevice ? 12 : 1.7} marginBottom={isMobileDevice ? 2 : 5}>
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
                      <Button variant={"shadow"} style={{ width: isMobileDevice ? "100%" : "auto" }}>
                        {isMobileDevice ? <>
                          <Copy />&nbsp;Content
                        </> : "Copy Content"}
                      </Button>
                    </Tooltip>
                  </CopyToClipboard>
                </Grid>
                {
                  contentImage
                    ?
                    <Grid item xs={isMobileDevice ? 12 : 2} marginBottom={isMobileDevice ? 2 : 5}>
                      <a href={contentImage} download={true} target="_blank">
                        <Button variant={"shadow"} style={{ width: isMobileDevice ? "100%" : "auto" }}>
                          {isMobileDevice ? <>
                            <Copy />&nbsp;Banner
                          </>
                            : "Download Banner"}
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
        {/* 
        <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Referral Link"
              count={
                <CopyToClipboard
                  text={referralLink}
                  onCopy={() =>
                    openSnackbar({
                      open: true,
                      message: 'Referral Link Copied',
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
        </Grid> */}

        <Grid container rowSpacing={4.5} columnSpacing={2.75} marginBottom={5}>
          {/* <Grid item xs={12} sm={6} lg={3}>
          <EcommerceDataCard
            title="User ID"
            count={user?.id}
            color="success"
            iconPrimary={<Book color={theme.palette.success.darker} />}
          >
          </EcommerceDataCard>
        </Grid> */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Username"
              count={user?.email?.split('@')[0] ?? "Anonymous"}
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
          {
            downline ?
              <Grid item xs={12} sm={6} lg={3}>
                <EcommerceDataCard
                  title="Downline"
                  count={downline}
                  color="success"
                  iconPrimary={<Book color={theme.palette.success.darker} />}
                >
                </EcommerceDataCard>
              </Grid> : ""
          }
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Date Of Joining"
              count={new Date((user?.created_at || '')).toLocaleDateString()}
              color="success"
              iconPrimary={<Book color={theme.palette.success.darker} />}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Wallet"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.wallet?.toFixed(5))}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid> */}
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Tasks Income"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.tasksIncome?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Level Income"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.levelIncome?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Tasks Withdrawals"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.tasksIncome_withdraw?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Level Withdrawals"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.levelIncome_withdraw?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Gas Wallet"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.gas_wallet?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid>
          {/* <Grid item xs={12} sm={6} lg={3}>
            <EcommerceDataCard
              title="Withdrawals"
              count={process.env.VITE_APP_CURRENCY_TYPE + ' ' + (user?.extra?.withdrawals?.toFixed(5) ?? 0)}
              iconPrimary={<Wallet3 />}
            >
              <EcommerceDataChart color={theme.palette.primary.main} />
            </EcommerceDataCard>
          </Grid> */}
        </Grid>

        {
          contentTEXT
            ?
            <>
              <Grid xs={12} marginBottom={0}>
                <h2>How to Use? Watch this:</h2>
              </Grid>
              <Grid item xs={isMobileDevice ? 12 : 1.5} style={{ paddingTop: '10px' }}>
                <Button
                  style={{ width: isMobileDevice ? "100%" : "auto" }}
                  variant="shadow"
                  onClick={() => setHelpBox({ status: true, url: '/assets/vids/fb.mp4', mobile_url: '/assets/vids/fb-mob.mp4' })}>
                  <i className='fab fa-facebook'>&nbsp;</i>Facebook
                </Button>
              </Grid>

              <Grid item xs={isMobileDevice ? 12 : 1.5} style={{ paddingTop: '15px' }}>
                <Button
                  style={{ width: isMobileDevice ? "100%" : "auto" }}
                  variant="shadow"
                  onClick={() => setHelpBox({ status: true, url: '/assets/vids/insta.mp4', mobile_url: '/assets/vids/insta-mob.mp4' })}>
                  <i className='fab fa-instagram'>&nbsp;</i> Instagram
                </Button>
              </Grid>

              <Grid item xs={isMobileDevice ? 12 : 1.3} style={{ paddingTop: '15px' }}>
                <Button
                  style={{ width: isMobileDevice ? "100%" : "auto" }}
                  variant="shadow"
                  onClick={() => setHelpBox({ status: true, url: '/assets/vids/x.mp4', mobile_url: '/assets/vids/x-mob.mp4' })}>
                  <i className='fab fa-twitter'>&nbsp;</i> Twitter
                </Button>
              </Grid>

              {/* <Grid item xs={isMobileDevice ? 12 : 1.4} style={{ paddingTop: '15px' }}>
                <Button
                  style={{ width: isMobileDevice ? "100%" : "auto" }}
                  variant="shadow"
                  onClick={() => setHelpBox({ status: true, url: '/assets/vids/link.mp4', mobile_url: '/assets/vids/link-mob.mp4' })}>
                  <i className='fab fa-linkedin'>&nbsp;</i> Linkedin
                </Button>
              </Grid> */}

              <Grid item xs={isMobileDevice ? 12 : 2} style={{ paddingTop: '15px' }}>
                <Button
                  style={{ width: isMobileDevice ? "100%" : "auto" }}
                  variant="shadow"
                  onClick={() => openThis(content?.telegramPage)}>
                  <i className='fab fa-telegram'>&nbsp;</i> Telegram
                </Button>
              </Grid>


            </>
            : "Content not available !!!"
        }
        {
          contentTEXT
            ?
            <>
              <Grid xs={12} marginBottom={0}>
                <h2>Share these Post on you social media handles</h2>
              </Grid>
              <Grid item xs={isMobileDevice ? 12 : 1.5} style={{ paddingTop: '10px' }}>
                <Button

                  style={{
                    width: isMobileDevice ? "100%" : "auto", background: "#ffffff",
                    color: "#041303"
                  }}
                  variant="shadow"
                  onClick={() => {
                    const facebookUrl = content?.facebook_task || ''; // Ensure it's a valid URL or fallback
                    if (facebookUrl) {
                      window.open(facebookUrl, '_blank');
                    } else {
                      // You could show an alert or log an error if the URL is missing
                      console.error("Facebook URL is missing or invalid.");
                    }
                  }}>
                  <i className='fab fa-facebook'>&nbsp;</i>Facebook
                </Button>
              </Grid>

              <Grid item xs={isMobileDevice ? 12 : 1.5} style={{ paddingTop: '15px' }}>
                <Button
                  style={{
                    width: isMobileDevice ? "100%" : "auto", background: "#ffffff",
                    color: "#041303"
                  }}
                  variant="shadow"
                  onClick={() => {
                    const instagramUrl = content?.instagram_task || ''; // Ensure it's a valid URL or fallback
                    if (instagramUrl) {
                      window.open(instagramUrl, '_blank');
                    } else {
                      // You could show an alert or log an error if the URL is missing
                      console.error("Instagram URL is missing or invalid.");
                    }
                  }}>
                  <i className='fab fa-instagram'>&nbsp;</i> Instagram
                </Button>
              </Grid>

              <Grid item xs={isMobileDevice ? 12 : 1.3} style={{ paddingTop: '15px' }}>
                <Button
                  style={{
                    width: isMobileDevice ? "100%" : "auto", background: "#ffffff",
                    color: "#041303"
                  }}
                  variant="shadow"
                  onClick={() => {
                    const twitterUrl = content?.twitter_task || ''; // Ensure it's a valid URL or fallback
                    if (twitterUrl) {
                      window.open(twitterUrl, '_blank');
                    } else {
                      // You could show an alert or log an error if the URL is missing
                      console.error("Twitter URL is missing or invalid.");
                    }
                  }}>
                  <i className='fab fa-twitter'>&nbsp;</i> Twitter
                </Button>
              </Grid>

              {/* <Grid item xs={isMobileDevice ? 12 : 1.4} style={{ paddingTop: '15px' }}>
                <Button
                  style={{
                    width: isMobileDevice ? "100%" : "auto", background: "#ffffff",
                    color: "#041303"
                  }}
                  variant="shadow"
                  onClick={() => window.open('https://www.facebook.com/share/p/mJbUs6N4Aj37WSrL/?mibextid=qi2Omg', '_blank')}>
                  <i className='fab fa-linkedin'>&nbsp;</i> Linkedin
                </Button>
              </Grid> */}




            </>
            : "Content not available !!!"
        }

        <Grid xs={12} marginTop={5}>
          {
            contentTEXT ? (
              <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <MediaLink
                  user={user}
                  isMobileDevice={isMobileDevice}
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
                  isMobileDevice={isMobileDevice}
                  status={user?.extra?.instagram}
                  label={"Instagram Link:"}
                  placeholder={"https://www.instagram.com/xyz/p/C4R6BtDBPRh/..."}
                />

                <MediaLink
                  user={user}
                  mediaType={"x"}
                  isMobileDevice={isMobileDevice}
                  status={user?.extra?.x}
                  label={"Twitter Link:"}
                  placeholder={
                    "https://x.com/xyz/status/1766376481746202959?s=20..."
                  }
                />

                {/* <MediaLink
                  user={user}
                  mediaType={"linkedin"}
                  isMobileDevice={isMobileDevice}
                  status={user?.extra?.linkedin}
                  label={"Linkedin Link:"}
                  placeholder={
                    "https://www.linkedin.com/posts/jseyehunts_deve..."
                  }
                /> */}
                <Grid xs={12} marginTop={1} marginLeft={2}>
                  <h2>Watch & Share These Videos to Earn Tokens!</h2>
                </Grid>
                <Grid item xs={12} rowSpacing={4.5} columnSpacing={2.75}>
                  <Grid container spacing={1}>
                    <Grid item xs={isMobileDevice ? 12 : 1.5} marginTop={1.5}>
                      <InputLabel htmlFor="Youtube Link:" style={{ marginBottom: "2" }}>1st Youtube Video:</InputLabel>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 1.5}>
                      <Button disabled={user?.extra?.first_youtube} variant={"contained"} onClick={() => setVideoPopup({
                        show: true,
                        url: content?.first_youtubeVideo,
                        type: 'first_youtube'
                      })}>{user?.extra?.first_youtube ? "Watched" : "Watch Video"}</Button>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 4}>
                      <Button disabled={user?.extra?.share_first_youtube} variant={"contained"} onClick={() => openThis_UpdateDB('share_first_youtube', `https://wa.me/?text=Check%20out%20this%3A%20${content?.first_youtubeVideo}`)}>
                        {user?.extra?.share_first_youtube ? "Shared" : "Share on Whatsapp"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} rowSpacing={4.5} columnSpacing={2.75}>
                  <Grid container spacing={1}>
                    <Grid item xs={isMobileDevice ? 12 : 1.5} marginTop={1.5}>
                      <InputLabel htmlFor="Youtube Link:" style={{ marginBottom: "2" }}>2nd Youtube Video:</InputLabel>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 1.5}>
                      <Button disabled={user?.extra?.second_youtube} variant={"contained"} onClick={() => setVideoPopup({
                        show: true,
                        url: content?.second_youtubeVideo,
                        type: 'second_youtube'
                      })}>{user?.extra?.second_youtube ? "Watched" : "Watch Video"}</Button>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 4}>
                      <Button disabled={user?.extra?.share_second_youtube} variant={"contained"} onClick={() => openThis_UpdateDB('share_second_youtube', `https://wa.me/?text=Check%20out%20this%3A%20${content?.second_youtubeVideo}`)}>
                        {user?.extra?.share_second_youtube ? "Shared" : "Share on Whatsapp"}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} rowSpacing={4.5} columnSpacing={2.75}>
                  <Grid container spacing={1}>
                    <Grid item xs={isMobileDevice ? 12 : 1.5} marginTop={1.5}>
                      <InputLabel htmlFor="Youtube Link:" style={{ marginBottom: "2" }}>3rd Youtube Video:</InputLabel>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 1.5}>
                      <Button disabled={user?.extra?.third_youtube} variant={"contained"} onClick={() => setVideoPopup({
                        show: true,
                        url: content?.third_youtubeVideo,
                        type: 'third_youtube'
                      })}>{user?.extra?.third_youtube ? "Watched" : "Watch Video"}</Button>
                    </Grid>
                    <Grid item xs={isMobileDevice ? 12 : 4}>
                      <Button disabled={user?.extra?.share_third_youtube} variant={"contained"} onClick={() => openThis_UpdateDB('share_third_youtube', `https://wa.me/?text=Check%20out%20this%3A%20${content?.third_youtubeVideo}`)}>
                        {user?.extra?.share_third_youtube ? "Shared" : "Share on Whatsapp"}
                      </Button>
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
