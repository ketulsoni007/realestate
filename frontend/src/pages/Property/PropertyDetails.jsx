import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { propertyContactApi, propertyDetailApi, PropertyWishListToggle } from 'store/Slices/propertySlice';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { Avatar, Typography, Box, Paper, Grid, Skeleton, Card, Button, CardContent, CardActions, Alert, List, ListItem, ListItemAvatar, ListItemText, Stack, Chip } from '@mui/material';
import config from 'config/config';
import useWindowWidth from 'hooks/windowWidth';
import { BiBed, BiMap, BiMapAlt, BiTab } from "react-icons/bi";
import { FaCity, FaFlagUsa, FaFortAwesome, FaMapMarkerAlt, FaHeart, FaRegHeart, FaPhone, FaBolt, FaRupeeSign, FaHouseUser, FaCalendarAlt } from "react-icons/fa";
import { IoIosPin, IoIosInformationCircle, IoLogoWhatsapp } from "react-icons/io";
import moment from 'moment';
import { MdEmail, MdOutlineSquareFoot } from "react-icons/md";
import { HiOfficeBuilding } from "react-icons/hi";
import { TbLicense } from "react-icons/tb";
import { GiPostOffice } from "react-icons/gi";
import * as Yup from "yup";
import { authLoginApi } from 'store/Slices/authSlice';
import { Formik, Form, Field } from 'formik';
import { CommonButton, CustomCheckBox, CustomDivider, CustomText, IconInput, TextInput } from 'components/fields/field';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { toastNotification } from 'components/CustomToast/CustomToast';
import { wishListStoreApi } from 'store/Slices/profileSlice';
import TickAnime from 'assets/images/anime.gif';
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email().nullable()
});

const PropertyDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const width = useWindowWidth();
    const [heart, setHeart] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const isPropertyDetail = useSelector((state) => state.property.isPropertyDetail);
    const isApiStatus = useSelector((state) => state.property.isApiStatus);
    const theme = useSelector((state) => state.ui.darkMode);
    const detailLoading = isApiStatus?.propertyDetailApi === 'loading';
    const title = isPropertyDetail?.title;
    const description = isPropertyDetail?.description;
    const availibility = isPropertyDetail?.availibility;
    const status = isPropertyDetail?.status;
    const address = isPropertyDetail?.address;
    const price = isPropertyDetail?.price;
    const bedrooms = isPropertyDetail?.bedrooms;
    const bathrooms = isPropertyDetail?.bathrooms;
    const square_footage = isPropertyDetail?.square_footage;
    const lot_size = isPropertyDetail?.lot_size;
    const type = isPropertyDetail?.type;
    const year_built = isPropertyDetail?.year_built;
    const owner = isPropertyDetail?.owner;
    const relativeTime = isPropertyDetail?.created_at ? moment(isPropertyDetail?.created_at).fromNow() : '';
    const created_at = isPropertyDetail?.created_at ? moment(isPropertyDetail?.created_at).format('Do MMMM YYYY') : '';
    const updated_at = isPropertyDetail?.updated_at ? moment(isPropertyDetail?.updated_at).format('Do MMMM YYYY') : '';
    const primaryImageLink = isPropertyDetail?.images?.find(image => image?.is_primary)?.image ? `${config.IMAGE_URL}/property/${isPropertyDetail.images.find(image => image.is_primary).image}` : '';

    useEffect(() => {
        if (id) {
            dispatch(propertyDetailApi({ id, user: user?._id ? user?._id : '' }));
        }
    }, [id, dispatch]);

    const initialValues = useMemo(() => {
        return {
            user: user?._id || '',
            seller: isPropertyDetail?.owner?._id || '',
            property: isPropertyDetail?._id || "",
            inquiry: 'contact',
            name: user ? user?.first_name + " " + user?.last_name : "",
            phone: user?.phone_number || "",
            email: user?.email || "",
            agree: true,
        };
    }, [user, isPropertyDetail]);

    const handleSubmit = (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
        try {
            dispatch(propertyContactApi(values))
                .then((action) => {
                    if (action?.meta?.requestStatus === "fulfilled") {
                        if (theme) {
                            toastNotification.successDark('contact submitted successfull');
                        } else {
                            toastNotification.successLight('contact submitted successfull');
                        }
                    } else if (action?.meta?.requestStatus === "rejected") {
                        const message = action?.payload?.message ?? 'Something went wrong';
                        const status = action?.payload?.status ?? 410;
                        const errors = action?.payload?.errors ?? [];
                        if (status === 422) {
                            const formattedErrors = errors.reduce((acc, error) => {
                                acc[error.path] = error.msg;
                                return acc;
                            }, {});
                            setErrors(formattedErrors);
                        } else {
                            if (theme) {
                                toastNotification.errorDark(message);
                            } else {
                                toastNotification.errorLight(message);
                            }
                            setStatus({ error: message });
                        }
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        } catch (error) {
            console.error("An error occurred:", error);
            setStatus({ error: "An unexpected error occurred." });
            setSubmitting(false);
        }
    };

    const images = isPropertyDetail?.images?.map(image => ({
        original: `${config.IMAGE_URL}/property/${image.image}`,
        thumbnail: `${config.IMAGE_URL}/property/${image.image}`
    })) || [];

    const renderImage = (image) => (
        <img
            src={image.original}
            alt=""
            style={{
                width: '100%',
                height: isFullscreen ? 'calc(100vh - 120px)' : width < 900 ? '300px' : '500px',
                objectFit: 'cover'
            }}
        />
    );

    const renderThumbInner = (thumbnail) => (
        <img
            src={thumbnail.thumbnail}
            alt=""
            style={{
                width: '100%',
                height: '80px',
                objectFit: 'cover',
            }}
        />
    );

    const handleScreenChange = (isFull) => {
        setIsFullscreen(isFull);
    };

    return (
        <div className="pt-20 px-[3%] md:px-[6%]">
            <div>
                {detailLoading ? (
                    <Grid container spacing={1}>
                        <Skeleton variant="rectangular" width="100%" height={300} />
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container component={Paper} elevation={2} p={2} sx={{ background: theme ? "rgb(37 40 54 / 0.6)" : "transparent" }}>
                                <Grid item xs={12} md={6} pr={{ xs: 0, md: 2 }} pb={{ xs: 2, md: 0 }}>
                                    <ImageGallery
                                        items={images}
                                        showThumbnails={isFullscreen}
                                        showFullscreenButton={true}
                                        showPlayButton={false}
                                        useBrowserFullscreen={true}
                                        renderItem={renderImage}
                                        renderThumbInner={renderThumbInner}
                                        onScreenChange={handleScreenChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <video controls poster={primaryImageLink} style={{ width: '100%', height: '242px', objectFit: 'cover' }}>
                                                <source src="movie.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box
                                                position="relative"
                                                width={'100%'}
                                                height={'242px'}
                                                overflow="hidden"
                                            >
                                                <img
                                                    src={primaryImageLink}
                                                    alt="Primary Property"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                                    }}
                                                />
                                                <Box
                                                    position="absolute"
                                                    top={0}
                                                    left={0}
                                                    right={0}
                                                    bottom={0}
                                                    display="flex"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    backgroundColor="rgba(0, 0, 0, 0.5)"
                                                >
                                                    <Typography variant="h6" color="white">
                                                        +{isPropertyDetail?.images?.length ?? 1} more
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box component={Paper} elevation={2} p={2} sx={{ background: theme ? "rgb(37 40 54 / 0.6)" : "#FFF" }}>
                                        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
                                            <CustomText variant='h5'>{title}</CustomText>
                                            <Box display={'flex'} alignItems={'center'}>
                                                <IoIosInformationCircle color={theme ? '#FFF' : '#131313'} className='mr-2' />
                                                <CustomText variant='body2'>Last updated at {updated_at}</CustomText>
                                            </Box>
                                        </Box>
                                        <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'} mb={2}>
                                            <IoIosPin color={theme ? '#FFF' : '#131313'} className='mr-2' />
                                            <CustomText variant='body2'>{address?.street}</CustomText>
                                        </Box>
                                        <Stack direction="row" spacing={1}>
                                            <Chip label={`For ${status}`} sx={{ backgroundColor: 'rgba(255, 100, 0, 0.2)', color: 'rgb(255, 100, 0)', borderRadius: '4px' }} />
                                            <Chip label={availibility} sx={{ backgroundColor: `${availibility === 'available' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 0, 0, 0.2)'}`, color: `${availibility === 'available' ? 'rgb(76, 175, 80)' : 'rgb(255, 0, 0)'}`, borderRadius: '4px' }} />
                                        </Stack>
                                        <div className="flex justify-start mt-3">
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <BiBed />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{bedrooms ?? 'N/A'} Beds</CustomText>
                                            </div>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <BiTab />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{bathrooms ?? 'N/A'} Bathrooms</CustomText>
                                            </div>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <BiMapAlt />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{square_footage ?? 'N/A'}</CustomText>
                                            </div>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <FaCalendarAlt />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{year_built ?? 'N/A'}</CustomText>
                                            </div>
                                        </div>
                                        <div className="flex justify-start mt-3 mb-6">
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <FaRupeeSign />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}> {`${status === 'rent' ? `${price}/month` : price}`}</CustomText>
                                            </div>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <FaHouseUser />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>Available for {status}</CustomText>
                                            </div>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <MdOutlineSquareFoot />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{lot_size ?? 'N/A'}</CustomText>
                                            </div>
                                        </div>
                                        <Box component={Paper} elevation={2} p={2} sx={{ backgroundColor: theme ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${theme ? '#FFF' : '#EEE'}` }}>
                                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d305089.4632955925!2d72.41459120238642!3d23.0204737405254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e1!3m2!1sen!2sin!4v1730272398187!5m2!1sen!2sin" width="100%" height="500" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box component={Paper} elevation={2} p={2} sx={{ background: theme ? "rgb(37 40 54 / 0.6)" : "#FFF" }}>
                                        <CustomText variant='body1' mb={1} dangerouslySetInnerHTML={{ __html: description }} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Box sx={{ position: 'sticky', top: 66 }}>
                                <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={handleSubmit}>
                                    {({ errors, touched, isSubmitting, values }) => {
                                        console.log('values: ', values);
                                        return (
                                            <Form>
                                                <Box sx={{ backgroundColor: theme ? "rgb(37 40 54 / 0.6)" : "#EEE", padding: 2, borderRadius: 2 }}>
                                                    <Alert
                                                        severity='warning'
                                                        iconMapping={{
                                                            warning: <FaBolt fontSize="inherit" />,
                                                        }}
                                                        sx={{ mb: 2, backgroundColor: theme ? "rgb(37 40 54 / 0.6)" : 'rgb(255, 244, 229)' }}
                                                    >
                                                        <CustomText stylings={{ fontSize: '13px' }}>Awesome! Most liked project in this area.</CustomText>
                                                    </Alert>
                                                    <List sx={{ background: theme ? "rgb(37 40 54 / 0.6)" : "#FFF", mb: 2, borderRadius: 1 }}>
                                                        <CustomText stylings={{ padding: '8px 0px 0px 16px' }}>Contact seller</CustomText>
                                                        <ListItem>
                                                            <ListItemAvatar>
                                                                <Avatar src={`${config?.IMAGE_URL}/user/${owner?.profile_picture}`} sx={{ borderRadius: 1 }} />
                                                            </ListItemAvatar>
                                                            <ListItemText primary={owner?.first_name + " " + owner?.last_name} secondary={`+91 ${owner?.phone_number}`} secondaryTypographyProps={{ color: theme ? '#FFF' : '#131313' }} />
                                                        </ListItem>
                                                    </List>
                                                    <Card sx={{ background: theme ? "#1C252E" : "#FFF", mb: 2 }}>
                                                        <CardContent>
                                                            {isPropertyDetail?.alreadyContact ? (
                                                                <Grid container spacing={0}>
                                                                    <Grid item xs={12}>
                                                                    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                                                                      <Box><Avatar src={TickAnime} sx={{width:'120px',height:'120px'}} /></Box>
                                                                      <CustomText mt={theme ? 2 : 0}>Your request has been submitted successfully. An agent will contact you soon.</CustomText>
                                                                    </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            ) : (
                                                                <Grid container spacing={0}>
                                                                    <Grid item xs={12}>
                                                                        <Field name="name">{({ field }) => <TextInput variant='standard' disabled={user?.first_name && user?.last_name ? true : false} {...field} label="name" type="text" error={touched.name && !!errors.name} helperText={touched.name && errors.name} />}</Field>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Field name="phone">{({ field }) => <IconInput variant='standard' {...field} label="phone" type="number" error={touched.phone && !!errors.phone} helperText={touched.phone && errors.phone} disabled={user?.phone_number ? true : false} icon={
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="15" viewBox="0 0 25 15">
                                                                                <rect width="25" height="5" fill="#FF9933" />
                                                                                <rect width="25" height="5" y="5" fill="#ffffff" />
                                                                                <rect width="25" height="5" y="10" fill="#138808" />
                                                                                <circle cx="12.5" cy="7.5" r="2" fill="#000080" />
                                                                            </svg>
                                                                        } />}</Field>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Field name="email">{({ field }) => <TextInput variant='standard' {...field} disabled={user?.email ? true : false} label="email" type="email" error={touched.email && !!errors.email} helperText={touched.email && errors.email} />}</Field>
                                                                    </Grid>
                                                                    <Grid item xs={12} mb={2}>
                                                                        <Field name="agree">
                                                                            {({ field }) => (
                                                                                <CustomCheckBox
                                                                                    {...field}
                                                                                    label={
                                                                                        <>
                                                                                            I agree to be contacted by the agents via <span><IoLogoWhatsapp color='#25D366' style={{ display: 'inline' }} /> WhatsApp</span>, SMS, phone, email, etc.
                                                                                        </>
                                                                                    }
                                                                                    error={touched.agree && !!errors.agree}
                                                                                    helperText={touched.agree && errors.agree}
                                                                                />
                                                                            )}
                                                                        </Field>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <CommonButton size="small" variant='orange' sx={{ width: '100%' }} type='submit'>Contact Agent</CommonButton>
                                                                    </Grid>
                                                                </Grid>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                    <Card sx={{ background: theme ? "#1C252E" : "#FFF" }} elevation={0}>
                                                        <CardContent>
                                                            <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                                                                <Box>
                                                                    <CustomText stylings={{ fontWeight: 'bold' }} variant='body1'>Still deciding?</CustomText>
                                                                    <CustomText variant='body2'>Shortlist this property for now & easily come back to it later.</CustomText>
                                                                </Box>
                                                                <Box sx={{ background: theme ? "#FFF" : "#F9F6F4", p: 2, borderRadius: '50%' }}>{isPropertyDetail?.isWishlisted ? (<FaHeart color='#FF6400' style={{ cursor: 'pointer' }} onClick={() => {
                                                                    dispatch(wishListStoreApi({ user: user?._id, property: isPropertyDetail?._id })).then(() => {
                                                                        dispatch(PropertyWishListToggle({ ...isPropertyDetail, isWishlisted: isPropertyDetail?.isWishlisted ? false : true }))
                                                                    })
                                                                }} />) : (<FaRegHeart color='#FF6400' onClick={() => {
                                                                    dispatch(wishListStoreApi({ user: user?._id, property: isPropertyDetail?._id })).then(() => {
                                                                        dispatch(PropertyWishListToggle({ ...isPropertyDetail, isWishlisted: isPropertyDetail?.isWishlisted ? false : true }))
                                                                    })
                                                                }} style={{ cursor: 'pointer' }} />)}</Box>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            </Form>
                                        )
                                    }}
                                </Formik>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </div>
        </div>
    );
};

export default PropertyDetails;
