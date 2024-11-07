import { Avatar, Typography, Box, AvatarGroup, Paper, InputLabel, Stack, Chip, Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CommonButton, CustomDivider, CustomText } from 'components/fields/field';
import config from 'config/config';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { propertyDetailApi } from 'store/Slices/propertySlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import useWindowWidth from 'hooks/windowWidth';
import { BiBed, BiMap, BiMapAlt, BiTab } from "react-icons/bi";
import { FaCity, FaFlagUsa, FaFortAwesome, FaMapMarkerAlt, FaHeart, FaRegHeart, FaPhone } from "react-icons/fa";
import moment from 'moment';
import { MdEmail } from "react-icons/md";
import { HiOfficeBuilding } from "react-icons/hi";
import { TbLicense } from "react-icons/tb";
import { GiPostOffice } from "react-icons/gi";

const PropertyDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [heart, setHeart] = useState(false);
    const isPropertyDetail = useSelector((state) => state.property.isPropertyDetail);
    const isApiStatus = useSelector((state) => state.property.isApiStatus);
    const detailLoading = isApiStatus?.propertyDetailApi === 'loading';
    const darkMode = useSelector((state) => state.ui.darkMode);
    const width = useWindowWidth();
    useEffect(() => {
        if (id) {
            dispatch(propertyDetailApi({ id }));
        }
    }, [id, dispatch]);
    const title = isPropertyDetail?.title;
    const description = isPropertyDetail?.description;
    const availibility = isPropertyDetail?.availibility;
    const status = isPropertyDetail?.status;
    const address = isPropertyDetail?.address;
    const images = isPropertyDetail?.images;
    const price = isPropertyDetail?.price;
    const bedrooms = isPropertyDetail?.bedrooms;
    const bathrooms = isPropertyDetail?.bathrooms;
    const square_footage = isPropertyDetail?.square_footage;
    const type = isPropertyDetail?.type;
    const year_built = isPropertyDetail?.year_built;
    const owner = isPropertyDetail?.owner;
    const created_at = isPropertyDetail?.created_at ? moment(isPropertyDetail?.created_at).format('Do MMMM YYYY') : '';
    const relativeTime = isPropertyDetail?.created_at ? moment(isPropertyDetail?.created_at).fromNow() : '';
    return (
        <div className="pt-20 px-[3%] md:px-[6%]">

            {detailLoading ? (
                <Grid container spacing={1} justifyContent={'start'} alignItems={'flex-start'}>
                    <Grid item xs={12} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', height: 'auto' }}>
                        <Skeleton height={'40px'} width={'100%'} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', height: 'auto' }}>
                        <Skeleton height={'200px'} width={'100%'} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', height: 'auto' }}>
                        <Skeleton height={'200px'} width={'100%'} />
                    </Grid>
                    <Grid item xs={12} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px' }}>
                        <Skeleton height={'200px'} width={'100%'} />
                    </Grid>
                    <Grid item xs={12} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px' }}>
                        <Skeleton height={'200px'} width={'100%'} />
                    </Grid>
                </Grid>
            ) : (
                <Grid container spacing={2} justifyItems={'center'}>
                    <Grid item xs={12} p={3} mb={2} component={Paper} elevation={3} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px' }}>
                        <Box display="flex" flexDirection="row" justifyContent="space-between">
                            <Box>
                                <Box mb={2}>
                                    <CustomText variant="h5" mb={2}>{address?.street}</CustomText>
                                    <Stack direction="row" spacing={1}>
                                        <Chip label={`For ${status}`} sx={{ backgroundColor: 'rgba(255, 100, 0, 0.2)', color: 'rgb(255, 100, 0)', borderRadius: '4px' }} />
                                        <Chip label={availibility} sx={{ backgroundColor: `${availibility === 'available' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 0, 0, 0.2)'}`, color: `${availibility === 'available' ? 'rgb(76, 175, 80)' : 'rgb(255, 0, 0)'}`, borderRadius: '4px' }} />
                                    </Stack>
                                </Box>
                                <Box mb={3}>
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
                                    </div>
                                </Box>
                            </Box>
                            <Box>
                                {heart ? (
                                    <FaRegHeart color='#FF6400' size={25} onClick={()=>setHeart(!heart)} />
                                ) : (
                                    <FaHeart color='#FF6400' size={25} onClick={()=>setHeart(!heart)} />
                                )}
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid item lg={4} xs={12}>
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    autoplay={{ delay: 1500, disableOnInteraction: false }}
                                    loop={true}
                                    pagination={{ clickable: true }}
                                    navigation
                                >
                                    {images && images?.length > 0 && images.map((image, index) => (
                                        <SwiperSlide key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={`${config.IMAGE_URL}/property/${image.image}`}
                                                alt={`Slide ${index}`}
                                                style={{
                                                    width: '100%',
                                                    height: '520px',  // Height based on window width
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <div style={{ position: 'absolute', top: 0, left: 0 }}>
                                                <Chip label={type} sx={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#FFF', borderRadius: 0 }} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </Grid>
                            <Grid item lg={8} xs={12} p={3}>
                                <CustomText variant='h4' stylings={{ mr: 2 }}>{title}</CustomText>
                                <Box mb={2}>
                                    <CustomText
                                        variant="body2"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                        stylings={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: width < 1200 ? 'auto' : 15,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    />
                                    <CustomDivider stylings={{ my: 2, width: '0px' }} />
                                </Box>
                                <Box display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} sx={{ flexWrap: 'wrap', mb: 2 }}>
                                    <Box display={'flex'} flexDirection={'row'} sx={{ mb: 2, mr: { md: 2 } }}>
                                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary mr-2">
                                            <FaFlagUsa />
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CustomText variant='body1' stylings={{ fontWeight: 'bold' }}>
                                                    Country
                                                </CustomText>
                                            </Box>
                                            <CustomText variant='h6' stylings={{ fontWeight: '500' }}>
                                                {address?.country?.name || 'N/A'}
                                            </CustomText>
                                        </Box>
                                    </Box>
                                    <CustomDivider orientation='vertical' stylings={{ height: 'auto', mx: 2 }} />
                                    <Box display={'flex'} flexDirection={'row'} sx={{ mb: 2, mr: { md: 2 } }}>
                                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary mr-2">
                                            <FaFortAwesome />
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CustomText variant='body1' stylings={{ fontWeight: 'bold' }}>
                                                    State
                                                </CustomText>
                                            </Box>
                                            <CustomText variant='h6' stylings={{ fontWeight: '500' }}>
                                                {address?.state?.name || 'N/A'}
                                            </CustomText>
                                        </Box>
                                    </Box>
                                    <CustomDivider orientation='vertical' stylings={{ height: 'auto', mx: 2 }} />
                                    <Box display={'flex'} flexDirection={'row'} sx={{ mb: 2, mr: { md: 2 } }}>
                                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary mr-2">
                                            <FaCity />
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CustomText variant='body1' stylings={{ fontWeight: 'bold' }}>
                                                    City
                                                </CustomText>
                                            </Box>
                                            <CustomText variant='h6' stylings={{ fontWeight: '500' }}>
                                                {address?.city?.name || 'N/A'}
                                            </CustomText>
                                        </Box>
                                    </Box>
                                    <CustomDivider orientation='vertical' stylings={{ height: 'auto', mx: 2 }} />
                                    <Box display={'flex'} flexDirection={'row'} sx={{ mb: 2 }}>
                                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary mr-2">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CustomText variant='body1' stylings={{ fontWeight: 'bold' }}>
                                                    Area
                                                </CustomText>
                                            </Box>
                                            <CustomText variant='h6' stylings={{ fontWeight: '500' }}>
                                                {address?.area?.name || 'N/A'}
                                            </CustomText>
                                        </Box>
                                    </Box>
                                    <CustomDivider orientation='vertical' stylings={{ height: 'auto', mx: 2 }} />
                                    <Box display={'flex'} flexDirection={'row'} sx={{ mb: 2 }}>
                                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary mr-2">
                                            <GiPostOffice />
                                        </div>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CustomText variant='body1' stylings={{ fontWeight: 'bold' }}>
                                                    Zip Code
                                                </CustomText>
                                            </Box>
                                            <CustomText variant='h6' stylings={{ fontWeight: '500' }}>
                                                {address?.zip_code || 'N/A'}
                                            </CustomText>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'}>
                                    <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} sx={{ mr: 2 }}>
                                        <CustomText variant='h6'>Price :</CustomText>
                                        <Typography variant='h6' color='success' sx={{ ml: 1, fontWeight: 'bold' }}>
                                            ${`${status === 'rent' ? `${price}/month` : price}`}
                                        </Typography>
                                    </Box>

                                    {year_built && (
                                        <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'} sx={{ mr: 2 }}>
                                            <CustomText variant='h6'>Built Year :</CustomText>
                                            <Typography color='success' variant='h6' sx={{ ml: 1, fontWeight: 'bold' }}>
                                                {year_built}
                                            </Typography>
                                        </Box>
                                    )}

                                    {created_at && (
                                        <Box display={'flex'} alignItems={'center'} flexWrap={'wrap'}>
                                            <CustomText variant='h6'>Published On :</CustomText>
                                            <Typography color='success' variant='h6' sx={{ ml: 1, fontWeight: 'bold' }}>
                                                {created_at} : {relativeTime}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} p={3} component={Paper} elevation={3} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Stack display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                                    <Box>
                                        <CustomText variant='h5'>Agent Details</CustomText>
                                        <CustomText variant='h6'>{`${owner?.first_name} ${owner?.last_name}`}</CustomText>
                                    </Box>
                                    <Box>
                                        <CommonButton variant='orange'>Contact Agent</CommonButton>
                                    </Box>
                                </Stack>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <Box component={Paper} elevation={2} p={2} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${darkMode ? '#FFF' : '#EEE'}` }}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d305089.4632955925!2d72.41459120238642!3d23.0204737405254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e1!3m2!1sen!2sin!4v1730272398187!5m2!1sen!2sin" width="100%" height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </Box>
                            </Grid>
                            <Grid item lg={6} xs={12}>
                                <Stack display={'flex'} flexDirection={'column'}>
                                    {owner?.phone_number && (
                                        <Box component={Card} p={3} mb={4} elevation={0} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${darkMode ? '#FFF' : '#EEE'}` }}>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box w-40 h-40 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <FaPhone size={25} />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>+91 {owner?.phone_number}</CustomText>
                                            </div>
                                        </Box>
                                    )}
                                    {owner?.email && (
                                        <Box component={Card} p={3} mb={4} elevation={0} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${darkMode ? '#FFF' : '#EEE'}` }}>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box w-40 h-40 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <MdEmail size={25} />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{owner?.email}</CustomText>
                                            </div>
                                        </Box>
                                    )}
                                    {owner?.agency_name && (
                                        <Box component={Card} p={3} mb={4} elevation={0} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${darkMode ? '#FFF' : '#EEE'}` }}>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box w-40 h-40 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <HiOfficeBuilding size={25} />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{owner?.agency_name}</CustomText>
                                            </div>
                                        </Box>
                                    )}
                                    {owner?.license_number && (
                                        <Box component={Card} p={3} mb={4} elevation={0} sx={{ backgroundColor: darkMode ? 'rgb(47 51 67)' : '#FFF', borderRadius: '4px', border: `1px solid ${darkMode ? '#FFF' : '#EEE'}` }}>
                                            <div className="flex-align-center gap-x-2">
                                                <div className="icon-box w-40 h-40 bg-primary/20 hover:!bg-primary/40 text-primary">
                                                    <TbLicense size={25} />
                                                </div>
                                                <CustomText stylings={{ mr: 2 }}>{owner?.license_number}</CustomText>
                                            </div>
                                        </Box>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}

        </div>
    );
};
export default PropertyDetails;